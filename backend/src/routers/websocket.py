from fastapi import APIRouter, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import redis

import random, string

import os
from os.path import join, dirname

from dotenv import load_dotenv

router = APIRouter()

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

rds = redis.Redis(host=os.environ["REDIS_URL"], port=os.environ["REDIS_PORT"], password=os.environ["REDIS_PASSWORD"] decode_responses=True)

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_name: str) -> None:
        await websocket.accept()
        self.active_connections[client_name] = websocket

    def disconnect(self, client_name: str) -> None:
        self.active_connections.pop(client_name)
    
    async def create_room(self, room_id: str, client_name: str) -> None:
      rds.rpush(room_id, client_name)

    async def close_room(self, room_id: str, client_name: str, disconn: bool) -> None:
      if disconn == True:
        rds.lpop(room_id)
      while True:
        user_num = rds.llen(room_id)
        if user_num == 0:
          break
        user_name = rds.lrange(room_id, -1, -1)
        await self.active_connections[user_name[0]].send_json({"close_room":"部屋が閉じられました"})
        rds.rpop(room_id)
      self.disconnect(client_name)
    
    async def entry_room(self, room_id: str, client_name: str) -> None:
      room_list = rds.lrange(room_id, 0, -1)
      for name in room_list:
        await self.active_connections[name].send_json({"entry":client_name})
      rds.rpush(room_id, client_name)

    async def leave_room(self, room_id:str, client_name: str) -> None:
      self.disconnect(client_name)
      rds.lrem(room_id, 1, client_name)
      room_list = rds.lrange(room_id, 0, -1)
      for name in room_list:
        await self.active_connections[name].send_json({"leave_user":client_name})
      
    async def game_start(self, room_id: str) -> None:
      room_list = rds.lrange(room_id, 0, -1)
      for name in room_list:
        await self.active_connections[name].send_json({"game_start":"ゲームを開始します"})

    async def distribute_hand(self, room_id: str, haipai: List):
      for i, val in enumerate(haipai):
        name = list(val.keys())
        tehai = list(val.values())
        await self.active_connections[name[0]].send_json({"tehai":tehai[0]})
    
    async def draw_tile(self, room_id: str, client_name: str, hai: str):
      await self.active_connections[client_name].send_json({"tumo":hai})
    
    async def discard(self, room_id: str, client_name: str, hai: str):
      room_list = rds.lrange(room_id, 0, -1)
      for name in room_list:
        await self.active_connections[name].send_json({"sutehai":{"user_name":client_name, "hai":hai}})
    
    async def done(self, room_id: str, client_name: str):
      room_list = rds.lrange(room_id, 0, -1)
      for name in room_list:
        await self.active_connections[name].send_json({"done_user":client_name})
      done_users = room_id + "done"
      rds.rpush(done_users, client_name)
      confilm_room = rds.llen(done_users)
      if confilm_room == 4:
        for name in room_list:
          await self.active_connections[name].send_json({"done_game":"ゲーム終了"})
          rds.lpop(done_users)

    async def game_store(self, room_id: str, client_name: str, tehai: str, point: str):
      result = tehai + ";" + point
      rds.set(client_name, result)
      game_result = room_id + "finish"
      rds.rpush(game_result, client_name)
      confilm_result = rds.llen(game_result)
      if confilm_result == 4:
        room_list = rds.lrange(room_id, 0, -1)
        finish_users = rds.lrange(game_result, 0, -1)
        for name in room_list:
          result_list = []

          for finish_user in finish_users:
            tehai_point = rds.get(finish_user)
            result_list.append({"user_name":finish_user,"result":tehai_point})

          await self.active_connections[name].send_json({"return_result":result_list})

        for val in room_list:
          rds.lpop(game_result)
          rds.delete(val)

manager = ConnectionManager()

@router.websocket("/ws/{client_name}/room/{room_id}")
async def websocket_endpoint(websocket: WebSocket, client_name: str, room_id: str):
    await manager.connect(websocket, client_name)
    try:
        while True:
            data = await websocket.receive_text()
    except:
        confilm_host = rds.lrange(room_id, 0, 0)
        if confilm_host[0] == client_name:
          await manager.close_room(room_id, client_name, True)
        else:
          await manager.leave_room(room_id, client_name)

class User(BaseModel):
  user_name: str

class RoomUser(BaseModel):
  user_name: str
  room_id: str

class Distribute(BaseModel):
  room_id: str
  haipai: List

class Hai(BaseModel):
  user_name: str
  room_id: str
  hai: str

class GameStore(BaseModel):
  user_name: str
  room_id: str
  tehai: str
  point: str

@router.post("/create_room")
async def create_room(create:User):
  randlst = [random.choice(string.ascii_letters + string.digits) for i in range(6)]
  room_id = ''.join(randlst)
  try:
    await manager.create_room(room_id, create.user_name)
    return {"room_id":room_id}
  except:
    return {"error":"ルーム作成に失敗しました"}
  
@router.post("/close_room")
async def create_room(close:RoomUser):
  await manager.close_room(close.room_id, close.user_name, False)
  return {"close_room":部屋を閉じました}

@router.post("/entry_room")
async def entry_room(entry:RoomUser):
  confilm_room = rds.llen(entry.room_id)
  if confilm_room < 4:
    await manager.entry_room(entry.room_id, entry.user_name)
    entry_users = rds.lrange(entry.room_id, 0, -1)
    return {"success":entry_users}
  else:
    return {"fail":"参加しようとした部屋の人数が上限に達しています"}

@router.post("/leave_room")
async def leave_room(leave:RoomUser):
  await manager.leave_room(leave.room_id, leave.user_name)
  return {"leave_room":"部屋を抜けました"}

@router.post("/game_start")
async def leave_room(game:RoomUser):
  confilm_host = rds.lrange(game.room_id, 0, 0)
  confilm_room = rds.llen(game.room_id)
  if game.user_name == confilm_host[0] and confilm_room == 4:
    await manager.game_start(game.room_id)
    return "game_start"
  else:
    return {"error":"ゲームが開始できませんでした"}

@router.post("/distribute_hand")
async def distribute_hand(distribute:Distribute):
  await manager.distribute_hand(distribute.room_id, distribute.haipai)
  return {"finish":"手牌を配り終えました"}

@router.post("/draw_tile")
async def draw_tile(draw:Hai):
  await manager.draw_tile(draw.room_id, draw.user_name, draw.hai)
  return {"draw":"手牌をユーザーに配りました"}

@router.post("/discard")
async def discard(discard:Hai):
  await manager.discard(discard.room_id, discard.user_name, discard.hai)
  return {"success_discard":"牌を捨てるのに成功"}

@router.post("/done")
async def done(done:RoomUser):
  await manager.done(done.room_id, done.user_name)
  return {"done":"点数を確定します"}

@router.post("/game_store")
async def game_store(game:GameStore):
  await manager.game_store(game.room_id, game.user_name, game.tehai, game.point)
  return {"result_store":"結果が保存されました"}
