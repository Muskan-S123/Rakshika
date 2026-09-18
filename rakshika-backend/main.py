from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from sqlalchemy.orm import Session
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
@app.post("/users", response_model=UserOut)  #create
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(name=user.name, email=user.email, phone=user.phone)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users", response_model=list[UserOut])  #read
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.get("/users/{user_id}",response_model=UserOut)
def get_user(user_id:int, db:Session=Depends(get_db)):
    user=db.query(User).filter(User.id==user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
@app.put("/users/{user_id}",response_model=UserOut)  #update
def update_user(user_id:int, user:UserCreate, db:Session=Depends(get_db)):
    existing_user=db.query(User).filter(User.id==user_id).first() #fetch existing user
    if not existing_user:
        raise HTTPException(status_code=404, detail="existing user not found")
    existing_user.name=user.name
    existing_user.email=user.email
    existing_user.phone=user.phone
    db.commit()
    db.refresh(existing_user)
    return existing_user

@app.delete("/users/{user_id}") #delete
def delete_user(user_id:int, db:Session=Depends(get_db)):
    existing_user=db.query(User).filter(User.id==user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(existing_user)
    db.commit()
    return{"detail":"user deleted"}


