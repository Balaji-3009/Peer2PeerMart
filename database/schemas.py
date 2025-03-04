from pydantic import BaseModel
from datetime import date

class UserBase(BaseModel):
    
    name : str
    regNo : str
    email : str
    pno : str

class ProductBase(BaseModel):
    
    name : str
    user_id : int
    price : str
    desc : str
    
class TransactionBase(BaseModel):
    
    user_id : int
    product_id : int
    price : str
    
class ChatBase(BaseModel):
    
    buyer_id : int
    seller_id : int
    product_id : int