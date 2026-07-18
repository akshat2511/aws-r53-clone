import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from database import Base


def generate_uuid():
    return str(uuid.uuid4())


def utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    account_id = Column(String, nullable=False)  # mocked 12-digit AWS account ID
    display_name = Column(String)
    created_at = Column(DateTime, default=utc_now)

    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    hosted_zones = relationship("HostedZone", back_populates="user", cascade="all, delete-orphan")


class Session(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="sessions")


class HostedZone(Base):
    __tablename__ = "hosted_zones"

    id = Column(String, primary_key=True, default=generate_uuid)
    zone_id = Column(String, unique=True, nullable=False, index=True)  # Z + 20 alphanumeric
    name = Column(String, nullable=False)  # domain name, trailing dot
    type = Column(String, nullable=False, default="Public")
    record_count = Column(Integer, default=0)
    comment = Column(Text, default="")
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="hosted_zones")
    records = relationship("DnsRecord", back_populates="hosted_zone", cascade="all, delete-orphan", lazy="selectin")


class DnsRecord(Base):
    __tablename__ = "dns_records"
    __table_args__ = (
        Index("idx_dns_records_name_type", "name", "type"),
    )

    id = Column(String, primary_key=True, default=generate_uuid)
    hosted_zone_id = Column(String, ForeignKey("hosted_zones.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)  # FQDN with trailing dot
    type = Column(String, nullable=False)  # A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, CAA, SOA
    ttl = Column(Integer, default=300)
    routing_policy = Column(String, default="Simple")
    set_identifier = Column(String, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    hosted_zone = relationship("HostedZone", back_populates="records")
    values = relationship("DnsRecordValue", back_populates="dns_record", cascade="all, delete-orphan", lazy="selectin")


class DnsRecordValue(Base):
    __tablename__ = "dns_record_values"

    id = Column(Integer, primary_key=True, autoincrement=True)
    dns_record_id = Column(String, ForeignKey("dns_records.id", ondelete="CASCADE"), nullable=False, index=True)
    value = Column(String, nullable=False)

    dns_record = relationship("DnsRecord", back_populates="values")
