from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from datetime import datetime,timedelta
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from database import get_db
from models import User
from sqlalchemy.orm import Session
load_dotenv()
SECRET_KEY=os.getenv("SECRET_KEY") 
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set")
pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")   #it is used as hashing tool bcrypt is the algorithm while deprecated means if we add any new algo it still running fine
def hash_password(password: str) -> str:
    return pwd_context.hash(password)
def verify_password(plain_password:str,hashed_password:str) -> bool:
    return pwd_context.verify(plain_password,hashed_password)


ALGORITHM= "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES= 30

def create_jwt_token(data:dict):  # data:dict is the statement/claim used in jwt  eg[stadiumticket-our name-seatnum-]
    to_encode=data.copy()
    expire=datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp":expire})
    encoded_jwt=jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return encoded_jwt

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="/login")
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db:Session=Depends(get_db),
) -> User:
    creds_error=HTTPException(
        status_code=401,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate":"Bearer"},
   )

    try:
        payload=jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email=payload.get("sub")
        if email is None:
           raise creds_error
        
    except JWTError:
        raise creds_error
    user=db.query(User).filter(User.email==email).first()
    if user is None:
            raise creds_error
    return user
