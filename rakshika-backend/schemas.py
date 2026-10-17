from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
class UserCreate(BaseModel):
    name: str=Field(min_length=1, max_length=100)
    email: EmailStr
    phone: str | None=Field(default=None, pattern=r"^\+?[0-9]{10,15}$")
    password: str=Field(min_length=8,max_length=72)
    @field_validator("email", mode="after")
    @classmethod
    def normalize_email(cls, v):
        return str(v).strip().lower()

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
    name:str | None=Field(default=None, min_length=1, max_length=100)
    phone:str | None=Field(default=None, pattern=r"^\+?[0-9]{10,15}$")

class ContactCreate(BaseModel):
    name: str=Field(min_length=1,max_length=100)
    email:EmailStr
    phone:str=Field(pattern=r"^\+?[0-9]{10,15}$")
    relation:str | None=Field(default=None,max_length=50)
    @field_validator("email", mode="after")
    @classmethod
    def normalize_email(cls, v):
        return str(v).strip().lower()
class ContactOut(BaseModel):
    id:int
    name:str
    email:EmailStr |None=None
    phone:str
    relation:str| None=None

    model_config=ConfigDict(from_attributes=True)
