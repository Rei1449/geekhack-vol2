from sqlalchemy.orm import Session
from src.db.model import User, Score
from sqlalchemy.exc import DBAPIError
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi import HTTPException

def register_user(session, user_name:str, user_password: str):
  user_obj = User(
      name =  user_name,
      password = user_password
  )
  try:
      session.add(user_obj)
  except:
      raise HTTPException(status_code=500, detail='error')
  session.commit()
  session.refresh(user_obj)
  return user_obj

def register_score(session, user_name:str, sco:int, hand:str):
  score_obj = Score(
      user_name =  user_name,
      score = sco,
      hand = hand,
  )
  try:
      session.add(score_obj)
  except:
      raise HTTPException(status_code=500, detail='error')
  session.commit()
  session.refresh(score_obj)
  return score_obj
