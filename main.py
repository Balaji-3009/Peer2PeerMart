from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import database.models
from database.session import db_dependency, get_db
from database.session import engine
from sqlalchemy.orm import Session

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"} 