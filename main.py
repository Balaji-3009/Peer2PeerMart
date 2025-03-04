from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import database.models
from database.session import db_dependency, get_db
from database.session import engine
from sqlalchemy.orm import Session
from api.user import usersRouter
from api.products import productsRouter
from api.transactions import transactionsRouter
from api.chat import chatRouter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usersRouter, prefix="/users", tags=["users"])
app.include_router(productsRouter, prefix="/products", tags=["products"])
app.include_router(transactionsRouter, prefix="/transactions", tags=["transactions"])
app.include_router(chatRouter, prefix="/chats", tags=["chats"])

@app.get("/")
async def root():
    return {"message": "Hello World"} 