from sqlalchemy import Column, ForeignKey, Integer, String, JSON, Enum, Boolean, Date, TIME, DateTime, func
from database.session import Base
from sqlalchemy.orm import relationship

class Entry(Base):
    
    __tablename__ = "entry"

    uuid = Column(String, primary_key=True, index=True) 
    email = Column(String, unique=True, index=True, nullable=False)
    is_new_user = Column(Boolean, default=True)

    user = relationship("Users", back_populates="entry")
    product = relationship("Products", back_populates="entry")
    transaction = relationship("Transactions", back_populates="entry")
    buyer_chats = relationship("Chat", back_populates="buyer", foreign_keys="[Chat.buyer_id]")
    seller_chats = relationship("Chat", back_populates="seller", foreign_keys="[Chat.seller_id]")
    message = relationship("Message", back_populates="entry")
    report = relationship("Reports", back_populates="entry")


class Users(Base):

    __tablename__ = 'users'
    id = Column(Integer, primary_key= True, index= True)
    uuid = Column(String, ForeignKey("entry.uuid"))
    name = Column(String, index= True)
    regNo = Column(String)
    email = Column(String)
    pno = Column(String)
    banned = Column(Integer, default=0)
    createdAt = Column(DateTime, default=func.now())
    updatedAt = Column(DateTime, default=func.now(), onupdate=func.now())
    
    entry = relationship("Entry", back_populates="user")
    
class Products(Base):
    
    __tablename__ = 'products'
    id = Column(Integer, primary_key= True, index= True)
    name = Column(String)
    user_id = Column(String, ForeignKey("entry.uuid"))
    price = Column(String)
    desc = Column(String)
    image = Column(String)
    negotiable = Column(Integer)
    createdAt = Column(DateTime, default=func.now())
    updatedAt = Column(DateTime, default=func.now(), onupdate=func.now())
    
    entry = relationship("Entry", back_populates="product")
    transaction = relationship("Transactions", back_populates="product")
    report = relationship("Reports", back_populates="product")
    
class Transactions(Base):
    
    __tablename__ = 'transactions'
    id = Column(Integer, primary_key= True, index= True)
    user_id = Column(String, ForeignKey("entry.uuid"))
    product_id = Column(Integer, ForeignKey("products.id"))
    price = Column(String)
    confirmation = Column(Integer, default=0)
    createdAt = Column(DateTime, default=func.now())
    updatedAt = Column(DateTime, default=func.now(), onupdate=func.now())
    
    entry = relationship("Entry", back_populates="transaction")
    product = relationship("Products", back_populates="transaction")
    
class Chat(Base):
    
    __tablename__ = 'chats'
    chat_id = Column(Integer, primary_key=True)
    buyer_id = Column(String, ForeignKey('entry.uuid'))
    seller_id = Column(String, ForeignKey('entry.uuid'))
    product_id = Column(Integer, ForeignKey('products.id'))
    
    buyer = relationship("Entry", back_populates="buyer_chats", foreign_keys=[buyer_id])
    seller = relationship("Entry", back_populates="seller_chats", foreign_keys=[seller_id])
    message = relationship("Message", back_populates="chat")

class Message(Base):
    
    __tablename__ = 'messages'
    message_id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey('chats.chat_id'))
    sender_id = Column(String, ForeignKey('entry.uuid'))
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    entry = relationship("Entry", back_populates="message")
    chat = relationship("Chat", back_populates="message")
    
class Reports(Base):
    
    __tablename__ = 'reports'
    report_id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey("entry.uuid"))
    product_id = Column(Integer, ForeignKey('products.id'))
    reason = Column(String)
    createdAt = Column(DateTime, default=func.now())
    updatedAt = Column(DateTime, default=func.now(), onupdate=func.now())
    
    entry = relationship("Entry", back_populates="report")
    product = relationship("Products", back_populates="report")