import firebase_admin
from firebase_admin import credentials, auth
from database.session import db_dependency
from database.models import Entry
from fastapi import HTTPException

from datetime import datetime

current_datetime = datetime.now()
current_year = current_datetime.year


cred = credentials.Certificate("p2pmart-11931-firebase-adminsdk-fbsvc-71918906cb.json")
firebase_admin.initialize_app(cred)

def verify_firebase_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        email = decoded_token.get("email")
        # if not email.endswith("@vitstudent.ac.in"):
        #     raise HTTPException(status_code=403, detail="Use VIT email to login")
        # loc = email.index('@')
        # current_year = current_datetime.year
        # if int(email[loc-4:loc])<current_year - 5:
        #     raise HTTPException(status_code=403, detail="Only current batch can login")
        return decoded_token
    except Exception as e:
        raise ValueError(f"Invalid Firebase token: {e}")


def get_user_by_email(db: db_dependency, email: str):
    return db.query(Entry).filter(Entry.email == email).first()

def create_user(db: db_dependency, user_data: dict):
    user = Entry(uuid=user_data["uid"], email=user_data["email"])
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_or_create_user(db: db_dependency, user_data: dict):
    user = get_user_by_email(db, user_data["email"])
    if not user:
        return create_user(db, user_data), True
    return user, False


