from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
class User(Base):
    __tablename__="users"
    id=Column(Integer, primary_key=True, index=True)  #nullable means column is required it cannot accept null values
    name=Column(String, nullable=False)
    email=Column(String, unique=True, index=True, nullable=False)
    phone=Column(String,nullable=True)
    hashed_password=Column(String,nullable=False)
    alerts=relationship("Alert",back_populates="owner")
    contacts=relationship("TrustedContact",back_populates="owner", cascade="all,delete-orphan") #it means if the user deleted then it's contact should also deleted




class Alert(Base):
    __tablename__="alerts"
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, nullable=False)
    time = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="alerts")

class TrustedContact(Base):
    __tablename__="trusted_contacts"
    id=Column(Integer, primary_key= True, index=True)
    user_id=Column(Integer,ForeignKey("users.id", ondelete="CASCADE"), nullable=False,index=True)
    name=Column(String,nullable=False)
    phone=Column(String,nullable=False)
    email=Column(String,nullable=True)
    relation=Column(String,nullable=True)
    created_at=Column(DateTime,server_default=func.now())
    owner=relationship("User",back_populates="contacts")

