from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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