from pydantic import BaseModel, EmailStr
#hey user 
class User(BaseModel):
    username: str
    password: str
    role: str  # admin o user
