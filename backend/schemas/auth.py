from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    account_id: str
    display_name: str | None

    model_config = {"from_attributes": True}
