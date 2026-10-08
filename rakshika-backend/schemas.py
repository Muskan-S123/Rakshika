from pydantic import BaseModel, ConfigDict, EmailStr, Field
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None=None
    password: str=Field(min_length=8,max_length=72)

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None=None

    model_config=ConfigDict(from_attributes=True)
            
class Userlogin(BaseModel):
    email:str
    password:str
class UserUpdate(BaseModel):
    name:str | None=None
    phone:str | None=None