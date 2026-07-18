import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models import User, HostedZone, DnsRecord, DnsRecordValue
from schemas.records import (
    CreateRecordRequest,
    UpdateRecordRequest,
    RecordResponse,
    RecordListResponse,
)
from dependencies import get_current_user

router = APIRouter(
    prefix="/api/hosted-zones/{zone_id}/records",
    tags=["records"],
)


async def _get_zone(zone_id: str, user_id: str, db: AsyncSession) -> HostedZone:
    result = await db.execute(
        select(HostedZone).where(
            HostedZone.zone_id == zone_id,
            HostedZone.user_id == user_id,
        )
    )
    zone = result.scalar_one_or_none()
    if not zone:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    return zone


def _record_to_response(record: DnsRecord) -> RecordResponse:
    return RecordResponse(
        id=record.id,
        name=record.name,
        type=record.type,
        ttl=record.ttl,
        value=[v.value for v in record.values],
        routing_policy=record.routing_policy,
        set_identifier=record.set_identifier,
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


async def _update_record_count(zone: HostedZone, db: AsyncSession):
    count_result = await db.execute(
        select(func.count()).where(DnsRecord.hosted_zone_id == zone.id)
    )
    zone.record_count = count_result.scalar()


@router.get("", response_model=RecordListResponse)
async def list_records(
    zone_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = Query(""),
    record_type: str = Query("", alias="type"),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    zone = await _get_zone(zone_id, user.id, db)

    query = select(DnsRecord).where(DnsRecord.hosted_zone_id == zone.id)

    if search:
        query = query.where(DnsRecord.name.ilike(f"%{search}%"))
    if record_type:
        query = query.where(DnsRecord.type == record_type)

    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    query = query.order_by(DnsRecord.name, DnsRecord.type)
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    records = result.scalars().all()

    return RecordListResponse(
        items=[_record_to_response(r) for r in records],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=RecordResponse, status_code=201)
async def create_record(
    zone_id: str,
    body: CreateRecordRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    zone = await _get_zone(zone_id, user.id, db)

    record = DnsRecord(
        hosted_zone_id=zone.id,
        name=body.name,
        type=body.type,
        ttl=body.ttl,
        routing_policy=body.routing_policy,
        set_identifier=body.set_identifier,
    )
    record.values = [DnsRecordValue(value=v) for v in body.value]
    db.add(record)
    await db.flush()

    await _update_record_count(zone, db)

    return _record_to_response(record)


@router.get("/{record_id}", response_model=RecordResponse)
async def get_record(
    zone_id: str,
    record_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    zone = await _get_zone(zone_id, user.id, db)

    result = await db.execute(
        select(DnsRecord).where(
            DnsRecord.id == record_id,
            DnsRecord.hosted_zone_id == zone.id,
        )
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    return _record_to_response(record)


@router.put("/{record_id}", response_model=RecordResponse)
async def update_record(
    zone_id: str,
    record_id: str,
    body: UpdateRecordRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    zone = await _get_zone(zone_id, user.id, db)

    result = await db.execute(
        select(DnsRecord).where(
            DnsRecord.id == record_id,
            DnsRecord.hosted_zone_id == zone.id,
        )
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    if body.ttl is not None:
        record.ttl = body.ttl
    if body.value is not None:
        record.values = [DnsRecordValue(value=v) for v in body.value]
    if body.routing_policy is not None:
        record.routing_policy = body.routing_policy
    if body.set_identifier is not None:
        record.set_identifier = body.set_identifier

    return _record_to_response(record)


@router.delete("/{record_id}", status_code=204)
async def delete_record(
    zone_id: str,
    record_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    zone = await _get_zone(zone_id, user.id, db)

    result = await db.execute(
        select(DnsRecord).where(
            DnsRecord.id == record_id,
            DnsRecord.hosted_zone_id == zone.id,
        )
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    # Prevent deleting NS/SOA at zone apex
    if record.type in ("NS", "SOA") and record.name == zone.name:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete {record.type} record at zone apex",
        )

    await db.delete(record)
    await db.flush()

    await _update_record_count(zone, db)
