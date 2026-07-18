import asyncio
import bcrypt
from database import engine, async_session, Base
from models import User, HostedZone, DnsRecord, DnsRecordValue
from utils import generate_zone_id, generate_account_id


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        pw_hash = bcrypt.hashpw(b"admin", bcrypt.gensalt()).decode()

        user = User(
            email="admin@example.com",
            password_hash=pw_hash,
            account_id=generate_account_id(),
            display_name="Akshat",
        )
        session.add(user)
        await session.flush()

        # Zone 1: google.com
        zone1 = HostedZone(
            zone_id=generate_zone_id(),
            name="google.com.",
            type="Public",
            comment="Google domain search",
            user_id=user.id,
            record_count=5,
        )
        session.add(zone1)
        await session.flush()

        records_1 = [
            DnsRecord(
                hosted_zone_id=zone1.id,
                name="google.com.",
                type="NS",
                ttl=172800,
                values=[
                    DnsRecordValue(value="ns1.google.com."),
                    DnsRecordValue(value="ns2.google.com."),
                    DnsRecordValue(value="ns3.google.com."),
                    DnsRecordValue(value="ns4.google.com."),
                ],
            ),
            DnsRecord(
                hosted_zone_id=zone1.id,
                name="google.com.",
                type="SOA",
                ttl=900,
                values=[DnsRecordValue(value="ns1.google.com. dns-admin.google.com. 1 7200 900 1209600 86400")],
            ),
            DnsRecord(
                hosted_zone_id=zone1.id,
                name="google.com.",
                type="A",
                ttl=300,
                values=[DnsRecordValue(value="142.250.190.46")],
            ),
            DnsRecord(
                hosted_zone_id=zone1.id,
                name="www.google.com.",
                type="CNAME",
                ttl=300,
                values=[DnsRecordValue(value="google.com.")],
            ),
            DnsRecord(
                hosted_zone_id=zone1.id,
                name="google.com.",
                type="TXT",
                ttl=3600,
                values=[DnsRecordValue(value='"v=spf1 include:_spf.google.com ~all"')],
            ),
        ]
        session.add_all(records_1)

        # Zone 2: scaler.ai
        zone2 = HostedZone(
            zone_id=generate_zone_id(),
            name="scaler.ai.",
            type="Public",
            comment="Scaler education domain",
            user_id=user.id,
            record_count=5,
        )
        session.add(zone2)
        await session.flush()

        records_2 = [
            DnsRecord(
                hosted_zone_id=zone2.id,
                name="scaler.ai.",
                type="NS",
                ttl=172800,
                values=[
                    DnsRecordValue(value="ns-101.awsdns-11.com."),
                    DnsRecordValue(value="ns-102.awsdns-12.net."),
                ],
            ),
            DnsRecord(
                hosted_zone_id=zone2.id,
                name="scaler.ai.",
                type="SOA",
                ttl=900,
                values=[DnsRecordValue(value="ns-101.awsdns-11.com. hostmaster.scaler.ai. 1 7200 900 1209600 86400")],
            ),
            DnsRecord(
                hosted_zone_id=zone2.id,
                name="scaler.ai.",
                type="A",
                ttl=60,
                values=[DnsRecordValue(value="104.21.31.200")],
            ),
            DnsRecord(
                hosted_zone_id=zone2.id,
                name="www.scaler.ai.",
                type="CNAME",
                ttl=300,
                values=[DnsRecordValue(value="scaler.ai.")],
            ),
            DnsRecord(
                hosted_zone_id=zone2.id,
                name="scaler.ai.",
                type="MX",
                ttl=300,
                values=[DnsRecordValue(value="10 mail.scaler.ai.")],
            ),
        ]
        session.add_all(records_2)

        await session.commit()

    print("Seed complete.")
    print("Login: admin@example.com / admin")


if __name__ == "__main__":
    asyncio.run(seed())
