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
    arr:List

@router.post("/api/llama")
def try_llama(data: Data, db:Session = Depends(get_db)):
    res = replicate.run(
        "meta/llama-2-13b-chat",
        input={
            "debug": False,
            "top_p": 1,
            "prompt": f"{data}",
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

    return score

@router.post("/api/chatgpt")
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
