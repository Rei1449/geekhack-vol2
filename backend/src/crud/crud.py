from sqlalchemy.orm import Session
from src.models import user
from sqlalchemy.exc import DBAPIError
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi import HTTPException

def register_user(session, user_id:int, user_name:str, user_password: str):
  user_obj = user.User(
      id = user_id,
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
