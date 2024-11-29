from app.utils.database import *
from passlib.context import CryptContext

#era for fun, in pratica uso una libreria per cryptare la password

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:

    return pwd_context.verify(plain_password, hashed_password)

def verify_user(username: str, password: str) -> bool:
    user = db.users.find_one({"username": username,"password":password})
    if not user:
        return False
    return user 
