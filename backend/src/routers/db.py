from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from pydantic import BaseModel

from typing import Union
from typing import List

from sqlalchemy.orm import sessionmaker

import os
from os.path import join, dirname

from src.crud import crud
from src.db.model import Engine

import requests
import openai

from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

router = APIRouter()

class User(BaseModel):
  name: str
  password: str

# セッションファクトリを作成
Session = sessionmaker(autocommit=False, autoflush=False, bind=Engine)

# セッションを依存性として定義
def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()

@router.post("/user/register")
def register_user(user: User, db:Session = Depends(get_db)):
  return  crud.register_user(db, user.name, user.password)
  # return {"res": "ok", "名前": user.name, "パスワード": user.password }


@router.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    json_compatible_item_data = jsonable_encoder({"item_id": item_id, "q": q})
    return JSONResponse(content=json_compatible_item_data, media_type="charset=utf-8")


class Data(BaseModel):
    arr:List

@router.post("/tumo")
async def try_api(data:Data):
    openai.api_key = os.environ["CHATGPT_API_KEY"]
    prompt = [
      {
        "role": "system",
        "content": "あなたは麻雀の点数を計算する人です。絶対数値を返します。日本語は返しません"
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
    text_response = response.choices[0]['message']['content']
    number = extract_numbers(text_response)
    return number

def extract_numbers(input_string: str) -> float:
    numbers = re.sub(r'\D','', input_string) 
    return float(numbers) if numbers else None
class Mahjong(BaseModel):
  user_name: str
  hand: str

@router.post("/test/db")
def register_user(mahjong: Mahjong, db:Session = Depends(get_db)):
  score = 1000
  return  crud.register_score(db, mahjong.user_name, score, mahjong.hand)
