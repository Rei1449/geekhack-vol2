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
        register_pass_hash.update(user_password.encode())
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
        return {"error":"すでにそのユーザー名は登録されています。別のユーザー名を入力してください。"}

def get_user(session, user_name:str, user_password: str):
    user_info = session.query(User).filter(User.name == f"{user_name}").all()
    if not user_info:
        return {"error":"入力されたユーザー名は見つかりませんでした。"}
    
    login_pass_hash = hashlib.sha256()
    login_pass_hash.update(user_password.encode())
    print("a")
    if user_info[0].password == login_pass_hash.hexdigest():
        return user_name
    else:
        return {"error":"パスワードが間違っています"}

def register_score(session, user_name:str, score:int, hand_arr:str, ai:str):
    hand = hand_arr[0]
    for i in hand_arr[1:]:
        hand += "," + i
    score_obj = Score(
        user_name =  user_name,
        score = score,
        hand = hand,
        ai = ai,
    )
    try:
        session.add(score_obj)
    except:
        raise HTTPException(status_code=500, detail='error')
    session.commit()
    session.refresh(score_obj)
    return {"success":"結果が保存されました"}

def get_score_ranking(session):
    low_scores = session.query(Score).order_by(Score.score).limit(5).all()
    high_scores = session.query(Score).order_by(Score.score.desc()).limit(5).all()
    score_ranking = {"high":high_scores, "low":low_scores}
    return score_ranking

def get_score_ranking_ai(session, ai:str):
    low_scores = session.query(Score).filter(Score.ai == f"{ai}").order_by(Score.score).limit(3).all()
    high_scores = session.query(Score).filter(Score.ai == f"{ai}").order_by(Score.score.desc()).limit(3).all()
    score_ranking = {"high":high_scores, "low":low_scores}
    return score_ranking

def get_score_user(session, user_name:str):
    user_info = session.query(User).filter(User.name == f"{user_name}").all()
    if not user_info:
        return {"error":"ユーザーの情報が見つかりませんでした。"}
    results = session.query(Score).filter(Score.user_name == f"{user_name}").order_by(Score.created_at).all()
    return results
