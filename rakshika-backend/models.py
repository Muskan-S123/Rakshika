from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
class User(Base):
    __tablename__="users"
    id=Column(Integer, primary_key=True, index=True)
    name=Column(String, nullable=False)
    email=Column(String, unique=True, index=True, nullable=False)
    phone=Column(String,nullable=True)
    alerts=relationship("Alert",back_populates="owner")




class Alert(Base):
    __tablename__="alerts"
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, nullable=False)
    time = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="alerts")
