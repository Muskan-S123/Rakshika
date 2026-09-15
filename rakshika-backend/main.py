from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
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