import re


def validate_ipv4(value: str) -> bool:
    parts = value.split(".")
    if len(parts) != 4:
        return False
    for part in parts:
        try:
            num = int(part)
            if num < 0 or num > 255:
                return False
        except ValueError:
            return False
    return True


def validate_ipv6(value: str) -> bool:
    try:
        import ipaddress
        ipaddress.IPv6Address(value)
        return True
    except ValueError:
        return False


def validate_domain(value: str) -> bool:
    if not value.endswith("."):
        return False
    # Strip trailing dot for validation
    hostname = value[:-1]
    if len(hostname) > 253:
        return False
    pattern = re.compile(r"^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
    return bool(pattern.match(hostname))


def validate_mx(value: str) -> bool:
    # Format: "priority domain"
    parts = value.split(" ", 1)
    if len(parts) != 2:
        return False
    try:
        priority = int(parts[0])
        if priority < 0 or priority > 65535:
            return False
    except ValueError:
        return False
    return validate_domain(parts[1])


def validate_srv(value: str) -> bool:
    # Format: "priority weight port target"
    parts = value.split(" ")
    if len(parts) != 4:
        return False
    try:
        for num_str in parts[:3]:
            num = int(num_str)
            if num < 0 or num > 65535:
                return False
    except ValueError:
        return False
    return validate_domain(parts[3])


def validate_caa(value: str) -> bool:
    # Format: 'flags tag "value"'
    parts = value.split(" ", 2)
    if len(parts) != 3:
        return False
    try:
        flags = int(parts[0])
        if flags < 0 or flags > 255:
            return False
    except ValueError:
        return False
    if parts[1] not in ("issue", "issuewild", "iodef"):
        return False
    return True


RECORD_VALIDATORS = {
    "A": validate_ipv4,
    "AAAA": validate_ipv6,
    "CNAME": validate_domain,
    "NS": validate_domain,
    "PTR": validate_domain,
    "MX": validate_mx,
    "SRV": validate_srv,
    "CAA": validate_caa,
    # TXT and SOA accept any string
}


def validate_record_values(record_type: str, values: list[str]) -> list[str]:
    """Returns a list of error messages. Empty list means valid."""
    errors = []
    validator = RECORD_VALIDATORS.get(record_type)
    if not validator:
        return errors

    for i, val in enumerate(values):
        if not validator(val):
            errors.append(f"Value at index {i} is not a valid {record_type} record: {val}")

    return errors
