from sqlalchemy.orm import Session
from src.db.model import User, Score
from sqlalchemy.exc import DBAPIError
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi import HTTPException
import hashlib

def register_user(session, user_name:str, user_password: str):
    # ユーザーの名前がすでに存在しているかを確認
    user_info = session.query(User).filter(User.name == f"{user_name}").all()
    if not user_info:
        register_pass_hash = hashlib.sha256()
        register_pass_hash.updata(user_password.encode())
        user_obj = User(
            name =  user_name,
            password = register_pass_hash.hexdigest()
        )
        try:
            session.add(user_obj)
        except:
            raise HTTPException(status_code=500, detail='error')
        session.commit()
        session.refresh(user_obj)
        return user_obj.name

    else:
        return "すでにそのユーザー名は登録されています。別のユーザー名を入力してください。"

def get_user(session, user_name:str, user_password: str):
    user_info = session.query(User).filter(User.name == f"{user_name}").all()
    if not user_info:
        return "入力されたユーザー名は見つかりませんでした。"
    
    login_pass_hash = hashlib.sha256()
    login_pass_hash.updata(user_password.encode())
    if user_info[0].password == :
        return user_info[0]
    else:
        return "パスワードが間違っています"

def register_score(session, user_name:str, score:int, hand:str):
  score_obj = Score(
      user_name =  user_name,
      score = score,
      hand = hand,
  )
  try:
      session.add(score_obj)
  except:
      raise HTTPException(status_code=500, detail='error')
  session.commit()
  session.refresh(score_obj)
  return score_obj
