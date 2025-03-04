from fastapi import APIRouter, HTTPException, Depends, Request
from database.session import db_dependency
from database.models import Users
from database.schemas import UserBase
from .auth import verify_firebase_token


usersRouter = APIRouter()

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

@usersRouter.post('/createUsers')
async def createUsers(users: UserBase, db: db_dependency, request: Request, user_data = Depends(verify_token)):
    try:
        newUser = Users(
            uuid = users.uuid,
            name = users.name,
            regNo = users.regNo,
            email = users.email,
            pno = users.pno
        )
        db.add(newUser)
        db.commit()
        db.refresh(newUser)
        return {
            "status": "success",
            "message": "User created successfully",
            "data": newUser
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@usersRouter.get("/getUser/{userId}")
async def getUser(userId: int, db: db_dependency, user_data = Depends(verify_token)):
    try:
        fetchedUser = db.query(Users).filter(Users.uuid == userId).first()
        if not fetchedUser:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "status": "success",
            "message": "User fetched successfully",
            "data": fetchedUser
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
