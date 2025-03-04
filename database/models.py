from sqlalchemy import Column, ForeignKey, Integer, String, JSON, Enum, Boolean, Date, TIME, DateTime, func
from database.session import Base
from sqlalchemy.orm import relationship

class Users(Base):

    __tablename__ = 'users'
    id = Column(Integer, primary_key= True, index= True)
    name = Column(String, index= True)
    regNo = Column(String)
    email = Column(String)
    pno = Column(String)
    createdAt = Column(DateTime, default=func.now())
    updatedAt = Column(DateTime, default=func.now(), onupdate=func.now())
    
    product = relationship("Products", back_populates="user")
    transaction = relationship("Transactions", back_populates="user")
    
class Products(Base):
    
    __tablename__ = 'products'
    id = Column(Integer, primary_key= True, index= True)
    name = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    price = Column(String)
    desc = Column(String)
    createdAt = Column(DateTime, default=func.now())
    updatedAt = Column(DateTime, default=func.now(), onupdate=func.now())
    
    user = relationship("Users", back_populates="product")
    transaction = relationship("Transactions", back_populates="product")
    
class Transactions(Base):
    
    __tablename__ = 'transactions'
    id = Column(Integer, primary_key= True, index= True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    price = Column(String)
    confirmation = Column(Integer, default=0)
    createdAt = Column(DateTime, default=func.now())
    updatedAt = Column(DateTime, default=func.now(), onupdate=func.now())
    
    user = relationship("Users", back_populates="transaction")
    product = relationship("Products", back_populates="transaction")
    
class Chat(Base):
    
    __tablename__ = 'chats'
    chat_id = Column(Integer, primary_key=True)
    buyer_id = Column(Integer, ForeignKey('users.id'))
    seller_id = Column(Integer, ForeignKey('users.id'))
    product_id = Column(Integer, ForeignKey('products.id'))

class Message(Base):
    
    __tablename__ = 'messages'
    message_id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey('chats.chat_id'))
    sender_id = Column(Integer, ForeignKey('users.id'))
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())