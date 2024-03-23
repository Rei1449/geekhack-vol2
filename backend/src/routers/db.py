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

import re

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

router = APIRouter()

class User(BaseModel):
  name: str
  password: str

class Store(BaseModel):
  user_name: str
  score: int
  arr:List

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
  return crud.register_user(db, user.name, user.password)

@router.post("/user/login")
def login_user(user: User, db:Session = Depends(get_db)):
  return crud.get_user(db, user.name, user.password)

@router.get("/ranking")
def get_score(db:Session = Depends(get_db)):
  return crud.get_score_ranking(db)

@router.get("/user/{user_name}")
def get_score_user(user_name:str, db:Session = Depends(get_db)):
  return crud.get_score_user(db, user_name)

@router.post("/store")
def store_score(store:Store, db:Session = Depends(get_db)):
  return crud.register_score(db, store.user_name, store.score, store,arr)
