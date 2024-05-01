from fastapi import FastAPI
from src.routers import test, db, api, websocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(test.router)
app.include_router(db.router)
app.include_router(api.router)
app.include_router(websocket.router)

app.add_middleware(
  CORSMiddleware,
  allow_origins = ["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
