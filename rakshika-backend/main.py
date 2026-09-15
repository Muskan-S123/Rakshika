from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from sqlalchemy.orm import Session
from fastapi import Depends
from database import get_db
from models import User
from schemas import UserCreate, UserOut

Base.metadata.create_all(bind=engine)
app=FastAPI(title="Rakshika.API")
origins=[
    "http://localhost:3000",
    "https://rakshika-frontend.vercel.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=['*'],
    allow_headers=['*'],
    allow_credentials=True,
)
@app.get("/health")
def health():
    return {"status":"ok"}
@app.get("/db_test")
def db_test():
    try:
        conn=engine.connect()#variable connection to connect
        conn.close()
        return {"database":"connected"}
    except Exception as e:  #does not crask
        return{"database":"failed","error":str(e)}
@app.post("/users", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(name=user.name, email=user.email, phone=user.phone)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users", response_model=list[UserOut])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all() 