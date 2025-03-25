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
from api.admin import adminRouter
from fastapi.middleware.cors import CORSMiddleware
from api.auth import verify_firebase_token, get_or_create_user, get_user_by_email

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
app.include_router(adminRouter, prefix="/admin", tags=["admin"])

@app.get("/")
async def root():
    return {"message": "Hello World"} 

@app.post("/login/google")
async def google_sign_in(request: Request, db: db_dependency):
    try:
        body = await request.json()
        id_token = body.get("idToken")
        
        if not id_token:
            raise HTTPException(status_code=400, detail="ID token is required.")

        # Verify Firebase token
        user_data = verify_firebase_token(id_token)

        # Get or create user
        user, is_new_user = get_or_create_user(db, user_data)

        return {
            "message": "Sign-in successful",
            "email": user.email,
            "uuid": user.uuid,
            "is_new_user": is_new_user,
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/verify")
async def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing")

    token = auth_header.split(" ")[1]
    try:
        decoded_token = verify_firebase_token(token)
        return {"status": "Token is valid", "user": decoded_token}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))