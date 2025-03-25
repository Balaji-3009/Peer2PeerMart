from pydantic import BaseModel
from datetime import date

class UserBase(BaseModel):
    
    uuid : str
    name : str
    regNo : str
    email : str
    pno : str

class ProductBase(BaseModel):
    
    name : str
    user_id : str
    price : str
    desc : str
    image: str
    negotiable : int
    
class TransactionBase(BaseModel):
    
    user_id : str
    product_id : int
    price : str
    
class ChatBase(BaseModel):
    
    buyer_id : str
    seller_id : str
    product_id : int
    
class ReportBase(BaseModel):
    
    user_id : str
    product_id : int
    reason : str