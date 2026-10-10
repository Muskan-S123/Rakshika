from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base, User,TrustedContact
from sqlalchemy.orm import Session
from database import get_db
from schemas import UserCreate, UserOut, Userlogin, UserUpdate, ContactCreate, ContactOut
from auth import hash_password, verify_password, create_jwt_token, get_current_user
from fastapi.security import OAuth2PasswordRequestForm


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
#deleted app.get("db_test") as it was a debug tools its only job was to make sure the connection between neon and databse is correct and all the endpoints are connected
@app.post("/users", response_model=UserOut,status_code=201)  #create
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(name=user.name, email=user.email, phone=user.phone,hashed_password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login")
def login(form:OAuth2PasswordRequestForm=Depends(), db: Session=Depends(get_db)):
    user=db.query(User).filter(User.email==form.username).first()  #find user by email
    if not user or not verify_password(form.password,user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        #first it was 2 functions ,ii.e, not user / verify_password then we made it into one because if someone login and if he got different messages as incorrect password or user not valid it menas he will get the basic idea of which user is registered or not
          # check and verify password using two arguments
     #here we take arguments as (plain_password,hashed_password) from auth.py
    
    token=create_jwt_token({"sub":user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/users/me",response_model=UserOut)
def read_me(current_user:User=Depends(get_current_user)):
    return current_user
         

@app.get("/users/{user_id}",response_model=UserOut)
def get_user(user_id:int, db:Session=Depends(get_db), current_user:str = Depends(get_current_user)):
  
   
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not your account") # if id with 7 logins in id 5 it should not authenticate the person with id 7
    return current_user

@app.put("/users/{user_id}",response_model=UserOut)  #update
def update_user(
    user_id:int, 
    data:UserUpdate, 
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user),
):
   if current_user.id!=user_id:
    raise HTTPException(status_code=403, detail="Not your account")
   if data.name is not None:
    current_user.name=data.name
   if data.phone is not None:
    current_user.phone=data.phone
   db.commit()
   db.refresh(current_user)
   return current_user

@app.delete("/users/{user_id}") #delete
def delete_user(
    user_id:int, 
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user),
):
    if current_user.id!=user_id:
        raise HTTPException(status_code=403, detail="Not your account")
    db.delete(current_user)
    db.commit()
    return{"detail":"user deleted"}
@app.post("/contacts",response_model=ContactOut, status_code=201)
def add_contact(
    data:ContactCreate,
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user),
):
    count=db.query(TrustedContact).filter(TrustedContact.user_id==current_user.id).count()
    if count>=5:
        raise HTTPException(status_code=400,detail="Maximum 5 contacts allowed")
    contact = TrustedContact(**data.model_dump(), user_id=current_user.id)
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@app.get("/contacts", response_model=list[ContactOut])
def list_contacts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(TrustedContact).filter(TrustedContact.user_id == current_user.id).all()


@app.delete("/contacts/{contact_id}", status_code=204)
def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contact = (
        db.query(TrustedContact)
        .filter(TrustedContact.id == contact_id, TrustedContact.user_id == current_user.id)
        .first()
    )
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()



