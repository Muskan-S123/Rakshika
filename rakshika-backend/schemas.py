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

class ContactCreate(BaseModel):
    name: str=Field(min_length=1,max_length=100)
    email:EmailStr | None=None
    phone:str=Field(pattern=r"^\+?[0-9]{10,15}$")
    relation:str | None=Field(default=None,max_length=50)
class ContactOut(BaseModel):
    id:int
    name:str
    email:EmailStr |None=None
    phone:str
    relation:str| None=None

    model_config=ConfigDict(from_attributes=True)
