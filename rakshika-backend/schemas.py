from pydantic import BaseModel
class UserCreate(BaseModel):
    name: str
    email: str
    phone: str | None=None

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None=None

    class Config:
        from_attributes=True
