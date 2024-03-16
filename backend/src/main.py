from fastapi import FastAPI
from src.routers import test, db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(test.router)
app.include_router(db.router)

origins = [
  'https://hack-fast-api-65ce6a3d3ac6.herokuapp.com',
  'https://hack-mahjong.vercel.app/test',
]

app.add_middleware(
  CORSMiddleware,
  allow_origins = ["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
