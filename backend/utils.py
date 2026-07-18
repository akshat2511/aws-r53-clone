import random
import string


def generate_zone_id() -> str:
    chars = string.ascii_uppercase + string.digits
    suffix = "".join(random.choices(chars, k=20))
    return f"Z{suffix}"


def generate_account_id() -> str:
    return "".join(random.choices(string.digits, k=12))
