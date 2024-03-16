from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from pydantic import BaseModel

from typing import Union
from typing import List

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

import os

from src.crud import crud


router = APIRouter()

class User(BaseModel):
  id: int
  name: str
  password: str

DATABASE_URL = "postgresql://postgres:password@postgres-db:5432/postgres"

engine = create_engine(DATABASE_URL)

# セッションファクトリを作成
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデルを定義するための基本となるBaseクラスを作成
Base = declarative_base()

# セッションを依存性として定義
def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()

@router.post("/user/register")
def register_user(user: User, db:Session = Depends(get_db)):
  return  crud.register_user(db, user.id, user.name, user.password)
  # return {"res": "ok", "名前": user.name, "パスワード": user.password }


@router.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    json_compatible_item_data = jsonable_encoder({"item_id": item_id, "q": q})
    return JSONResponse(content=json_compatible_item_data, media_type="charset=utf-8")
