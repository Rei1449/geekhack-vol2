from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from pydantic import BaseModel

from typing import Union
from typing import List

from sqlalchemy.orm import sessionmaker

import os

from src.crud import crud
from src.db.model import Engine

import requests
import replicate

import re

router = APIRouter()

Session = sessionmaker(autocommit=False, autoflush=False, bind=Engine)

# セッションを依存性として定義
def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()

class Data(BaseModel):
    user_name: str
    arr:List

@router.post("/api/llama")
def try_llama(data: Data, db:Session = Depends(get_db)):
    res = replicate.run(
        "meta/llama-2-13b-chat",
        input={
            "debug": False,
            "top_p": 1,
            "prompt": f"{data.arr}",
            "temperature": 0.75,
            "system_prompt": "You are the one who calculates the numbers from the information on a given tile. Please return the numerical value of the result of the calculation.",
            "max_new_tokens": 200,
            "min_new_tokens": -1
        },
    )
    res_text = ""
    for text in res:
        res_text += text
    
    result = re.findall(r"\d+", res_text)

    scores = 0
    tmp = ""
    for index in range(len(result)):
        if index == 0:
            tmp += result[index]

        elif result[index][0] == "0":
            tmp += result[index]

        else:
            scores += int(tmp)
            tmp = ""
            tmp += result[index]
        
        if index + 1 == len(result):
            scores += int(tmp)

    # 牌をDBに保存するためにリストから文字列にする処理
    hand = data.arr[0]
    for i in data.arr[1:]:
        hand += "," + i
    return crud.register_score(db, data.user_name, scores, hand)
