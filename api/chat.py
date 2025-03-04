from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, Request
from database.models import Chat,Message
from database.session import db_dependency
from database.schemas import ChatBase
import json

chatRouter = APIRouter()

active_connections = {}

@chatRouter.post("/create_chat/")
def create_chat(chats:ChatBase, db: db_dependency, request: Request):
    chat = db.query(Chat).filter_by(buyer_id=chats.buyer_id, seller_id=chats.seller_id, product_id=chats.product_id).first()
    if not chat:
        chat = Chat(buyer_id=chats.buyer_id, 
                    seller_id=chats.seller_id, 
                    product_id=chats.product_id)
        db.add(chat)
        db.commit()
        db.refresh(chat)
    return {"chat_id": chat.chat_id}

@chatRouter.get("/messages/{chat_id}")
def get_messages(chat_id: int, db: db_dependency):
    messages = db.query(Message).filter_by(chat_id=chat_id).order_by(Message.created_at).all()
    return [{"sender_id": m.sender_id, "content": m.content, "created_at": m.created_at} for m in messages]

@chatRouter.websocket("/ws/{chat_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: int, user_id: int, db: db_dependency):
    await websocket.accept()

    if chat_id not in active_connections:
        active_connections[chat_id] = []

    active_connections[chat_id].append(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            message = Message(chat_id=chat_id, sender_id=user_id, content=message_data["content"])
            db.add(message)
            db.commit()

            for connection in active_connections[chat_id]:
                await connection.send_json({"sender_id": user_id, "content": message_data["content"]})
    except WebSocketDisconnect:
        active_connections[chat_id].remove(websocket)
