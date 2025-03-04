from fastapi import APIRouter, HTTPException, Depends, Request
from database.session import db_dependency
from database.models import Users
from database.schemas import UserBase

usersRouter = APIRouter()

@usersRouter.post('/createUsers')
async def createUsers(users: UserBase, db: db_dependency, request: Request):
    try:
        newUser = Users(
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
async def getUser(userId: int, db: db_dependency):
    try:
        fetchedUser = db.query(Users).filter(Users.id == userId).first()
        if not fetchedUser:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "status": "success",
            "message": "User fetched successfully",
            "data": fetchedUser
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
