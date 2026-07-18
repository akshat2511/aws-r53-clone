from pydantic import BaseModel, field_validator
from datetime import datetime

VALID_RECORD_TYPES = ["A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA", "SOA"]


class CreateRecordRequest(BaseModel):
    name: str
    type: str
    ttl: int = 300
    value: list[str]
    routing_policy: str = "Simple"
    set_identifier: str | None = None

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in VALID_RECORD_TYPES:
            raise ValueError(f"Invalid record type: {v}. Must be one of {VALID_RECORD_TYPES}")
        return v

    @field_validator("name")
    @classmethod
    def normalize_name(cls, v: str) -> str:
        v = v.strip().lower()
        if not v.endswith("."):
            v += "."
        return v

    @field_validator("ttl")
    @classmethod
    def validate_ttl(cls, v: int) -> int:
        if v < 0 or v > 2147483647:
            raise ValueError("TTL must be between 0 and 2147483647")
        return v


class UpdateRecordRequest(BaseModel):
    ttl: int | None = None
    value: list[str] | None = None
    routing_policy: str | None = None
    set_identifier: str | None = None

    @field_validator("ttl")
    @classmethod
    def validate_ttl(cls, v: int | None) -> int | None:
        if v is not None and (v < 0 or v > 2147483647):
            raise ValueError("TTL must be between 0 and 2147483647")
        return v


class RecordResponse(BaseModel):
    id: str
    name: str
    type: str
    ttl: int
    value: list[str]
    routing_policy: str
    set_identifier: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class RecordListResponse(BaseModel):
    items: list[RecordResponse]
    total: int
    page: int
    page_size: int
