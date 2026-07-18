import os
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import bcrypt
from database import get_db
from models import User, Session
from schemas.auth import LoginRequest, UserResponse
from dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

SESSION_DURATION_HOURS = 24
IS_PRODUCTION = os.getenv("ENV", "production") == "production"

@router.post("/login")
async def login(
    body: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User).where(User.email == body.email)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.checkpw(body.password.encode(), user.password_hash.encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    session = Session(
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=SESSION_DURATION_HOURS),
    )
    db.add(session)
    await db.flush()

    response.set_cookie(
        key="session_id",
        value=session.id,
        httponly=True,
        samesite="none" if IS_PRODUCTION else "lax",
        secure=IS_PRODUCTION,
        max_age=SESSION_DURATION_HOURS * 3600,
    )

    return UserResponse.model_validate(user)


@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    session_id = request.cookies.get("session_id")
    if session_id:
        result = await db.execute(
            select(Session).where(Session.id == session_id)
        )
        session = result.scalar_one_or_none()
        if session:
            await db.delete(session)

    response.delete_cookie(key="session_id")
    return {"message": "Logged out"}


@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(get_current_user)):
    return UserResponse.model_validate(user)
