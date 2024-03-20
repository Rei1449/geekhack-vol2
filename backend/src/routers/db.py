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

import requests
import openai


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


class Data(BaseModel):
    arr:List

@router.post("/tumo")
async def try_api(data:Data):
    openai.api_key = ""
    prompt = [
      {
        "role": "system",
        "content": "あなたは麻雀の点数を計算する人です。絶対数値を返します"
      },
      {
        "role": "user",
        "content": f"{data}の点数を数値のみ教えてください"
      }
    ]
    model = "gpt-3.5-turbo"
    response = openai.ChatCompletion.create(
        model=model,
        messages=prompt,
        max_tokens=100
    )
    return response.choices[0]
    # try:
    #     print(data)
    #     response = requests.get('https://jsonplaceholder.typicode.com/todos')
    #     response.raise_for_status()
    #     tasks = response.json()
    #     return tasks
    # except requests.exceptions.RequestException as e:
    #     raise HTTPException(status_code=500, detail=f"Error calling JSONPlaceholder API: {e}")