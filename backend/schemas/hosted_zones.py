from pydantic import BaseModel, field_validator
from datetime import datetime


class CreateHostedZoneRequest(BaseModel):
    name: str
    type: str = "Public"
    comment: str = ""

    @field_validator("name")
    @classmethod
    def normalize_domain(cls, v: str) -> str:
        v = v.strip().lower()
        if not v.endswith("."):
            v += "."
        return v

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in ("Public", "Private"):
            raise ValueError("type must be Public or Private")
        return v


class UpdateHostedZoneRequest(BaseModel):
    comment: str | None = None


class HostedZoneResponse(BaseModel):
    id: str
    zone_id: str
    name: str
    type: str
    record_count: int
    comment: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class HostedZoneListResponse(BaseModel):
    items: list[HostedZoneResponse]
    total: int
    page: int
    page_size: int
