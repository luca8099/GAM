from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from app.services.auth_service import verify_user

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(request: LoginRequest):
    if verify_user(request.username, request.password):
        token= ""
        return {"message":"login successufly"}
    raise HTTPException(status_code=401, detail="Invalid credentials")
