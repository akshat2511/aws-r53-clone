import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models import User, HostedZone, DnsRecord, DnsRecordValue
from schemas.hosted_zones import (
    CreateHostedZoneRequest,
    UpdateHostedZoneRequest,
    HostedZoneResponse,
    HostedZoneListResponse,
)
from dependencies import get_current_user
from utils import generate_zone_id

router = APIRouter(prefix="/api/hosted-zones", tags=["hosted-zones"])


@router.get("", response_model=HostedZoneListResponse)
async def list_hosted_zones(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = Query("", description="Filter by domain name"),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(HostedZone).where(HostedZone.user_id == user.id)

    if search:
        query = query.where(HostedZone.name.ilike(f"%{search}%"))

    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    query = query.order_by(HostedZone.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    zones = result.scalars().all()

    return HostedZoneListResponse(
        items=[HostedZoneResponse.model_validate(z) for z in zones],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=HostedZoneResponse, status_code=201)
async def create_hosted_zone(
    body: CreateHostedZoneRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    zone = HostedZone(
        zone_id=generate_zone_id(),
        name=body.name,
        type=body.type,
        comment=body.comment,
        user_id=user.id,
        record_count=2,  # NS + SOA
    )
    db.add(zone)
    await db.flush()

    # Default NS record
    ns_record = DnsRecord(
        hosted_zone_id=zone.id,
        name=zone.name,
        type="NS",
        ttl=172800,
    )
    ns_record.values = [
        DnsRecordValue(value="ns-001.awsdns-01.com."),
        DnsRecordValue(value="ns-002.awsdns-02.net."),
        DnsRecordValue(value="ns-003.awsdns-03.org."),
        DnsRecordValue(value="ns-004.awsdns-04.co.uk."),
    ]

    # Default SOA record
    soa_record = DnsRecord(
        hosted_zone_id=zone.id,
        name=zone.name,
        type="SOA",
        ttl=900,
    )
    soa_record.values = [
        DnsRecordValue(value="ns-001.awsdns-01.com. hostmaster.example.com. 1 7200 900 1209600 86400")
    ]

    db.add(ns_record)
    db.add(soa_record)

    return HostedZoneResponse.model_validate(zone)


@router.get("/{zone_id}", response_model=HostedZoneResponse)
async def get_hosted_zone(
    zone_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(HostedZone).where(
            HostedZone.zone_id == zone_id,
            HostedZone.user_id == user.id,
        )
    )
    zone = result.scalar_one_or_none()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    return HostedZoneResponse.model_validate(zone)


@router.put("/{zone_id}", response_model=HostedZoneResponse)
async def update_hosted_zone(
    zone_id: str,
    body: UpdateHostedZoneRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(HostedZone).where(
            HostedZone.zone_id == zone_id,
            HostedZone.user_id == user.id,
        )
    )
    zone = result.scalar_one_or_none()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")

    if body.comment is not None:
        zone.comment = body.comment

    return HostedZoneResponse.model_validate(zone)


@router.delete("/{zone_id}", status_code=204)
async def delete_hosted_zone(
    zone_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(HostedZone).where(
            HostedZone.zone_id == zone_id,
            HostedZone.user_id == user.id,
        )
    )
    zone = result.scalar_one_or_none()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")

    await db.delete(zone)
