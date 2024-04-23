from fastapi import APIRouter, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel

import random, string

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

        # 部屋に誰が入っているのかを管理するようのもの
        # {room_id:[plyaer_name, plyaer_name]}のような形で管理
        self.active_room: dict[str, List] = {}

    async def connect(self, websocket: WebSocket, client_name: str) -> None:
        await websocket.accept()
        self.active_connections[client_name] = websocket

    def disconnect(self, client_name: str) -> None:
        print("接続を切るものを確認", self.active_connections)
        self.active_connections.pop(client_name)

    async def send_personal_message(self, message: str, client_name: str) -> None:
        await self.active_connections[client_name].send_text(message)

    # async def broadcast(self, room_id: str) -> None:
    #     for connection in self.active_connections:
    #         await connection.send_text(message)
    
    async def multicast(self, room_id: str, client_name: str, message: str) -> None:
      for name in self.active_room[room_id]:
        await self.active_connections[name].send_json({"user_name":client_name, "message":message})
    
    async def create_room(self, room_id: str, host_name) -> None:
      self.active_room[room_id] = [host_name]

    async def delete_room(self, room_id):
      self.active_room.pop(room_id)
    
    async def entry(self, room_id: str, client_name: str) -> None:
      self.active_room[room_id].append(client_name)

    async def exit(self, room_id:str, client_name: str):
      self.disconnect(client_name)
      self.active_room[room_id].remove(client_name)
      await self.multicast(room_id, "Game Master", f"{client_name}が退出しました")

manager = ConnectionManager()

@router.websocket("/ws/{client_name}/room/{room_id}")
async def websocket_endpoint(websocket: WebSocket, client_name: str, room_id: str):
    await manager.connect(websocket, client_name)
    print("通信成功")
    print("どのユーザーが接続しているかの確認",manager.active_connections)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"You wrote: {data}", websocket)
            await manager.broadcast(f"Client #{client_name} says: {data}")
    except:
        await manager.exit(room_id, client_name)

class User(BaseModel):
  user_name: str

@router.post("/create_room")
async def create_room(user:User):
  randlst = [random.choice(string.ascii_letters + string.digits) for i in range(6)]
  room_id = ''.join(randlst)
  try:
    await manager.create_room(room_id, user.user_name)
    return {"room_id":room_id}
  except:
    return {"error":"ルーム作成に失敗しました"}

class Entry(BaseModel):
  user_name: str
  room_id: str

@router.post("/entry")
async def entry(entry:Entry):
  await manager.entry(entry.room_id, entry.user_name)
  return {"success":"部屋に入ります"}

class Msg(BaseModel):
  user_name: str
  room_id: str
  message: str

@router.post("/msg")
async def send_message(msg:Msg):
  await manager.multicast(msg.room_id, msg.user_name, msg.message)
  return 0
