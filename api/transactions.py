from fastapi import APIRouter, HTTPException, Depends, Request
from database.session import db_dependency
from database.models import Transactions, Products, Users
from database.schemas import TransactionBase
from .auth import verify_firebase_token
from .user import verify_token


transactionsRouter = APIRouter()

@transactionsRouter.post('/createTransactions')
async def createTransaction(transactions: TransactionBase, db: db_dependency, request: Request, user_data = Depends(verify_token)):
    try:
        newTransaction = Transactions(
            user_id = transactions.user_id,
            product_id = transactions.product_id,
            price = transactions.price
        )
        db.add(newTransaction)
        db.commit()
        db.refresh(newTransaction)
        return {
            "status": "success",
            "message": "Transaction created successfully",
            "data": newTransaction
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

    
@transactionsRouter.get("/getTransactions")
async def getTransactions(db: db_dependency, user_data = Depends(verify_token)):
    try:
        all_transactions = []
        fetchedTransactions = db.query(Transactions).all()
        if not fetchedTransactions:
            raise HTTPException(status_code=404, detail="Transactions not found")
        for tran in fetchedTransactions:
            single_transaction = {}
            fetchedProduct = db.query(Products).filter(Products.id == tran.product_id).first()
            fetchedBuyer = db.query(Users).filter(Users.uuid == tran.user_id).first()
            fetchedSeller = db.query(Users).filter(Users.uuid == fetchedProduct.user_id).first()
            single_transaction["id"] = tran.id
            single_transaction["buyer_id"] = tran.user_id
            single_transaction["buyer_name"] = fetchedBuyer.name
            single_transaction["product_id"] = fetchedProduct.id
            single_transaction["product_name"] = fetchedProduct.name
            single_transaction["seller_id"] = fetchedProduct.user_id
            single_transaction["seller_name"] = fetchedSeller.name
            single_transaction["price"] = tran.price
            single_transaction["confirmation"] = tran.confirmation
            single_transaction["created_at"] = tran.createdAt
            single_transaction["updated_at"] = tran.updatedAt
            all_transactions.append(single_transaction)
        return {
            "status": "success",
            "message": "Products fetched successfully",
            "data": all_transactions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@transactionsRouter.get("/getWishList")
async def getWishList(db: db_dependency, user_id:str, user_data = Depends(verify_token)):
    try:
        all_transactions = []
        fetchedTransactions = db.query(Transactions).filter(Transactions.user_id == user_id).all()
        if not fetchedTransactions:
            raise HTTPException(status_code=404, detail="Transactions not found")
        for tran in fetchedTransactions:
            single_transaction = {}
            fetchedProduct = db.query(Products).filter(Products.id == tran.product_id).first()
            fetchedBuyer = db.query(Users).filter(Users.uuid == tran.user_id).first()
            fetchedSeller = db.query(Users).filter(Users.uuid == fetchedProduct.user_id).first()
            single_transaction["id"] = tran.id
            single_transaction["buyer_id"] = tran.user_id
            single_transaction["buyer_name"] = fetchedBuyer.name
            single_transaction["product_id"] = fetchedProduct.id
            single_transaction["product_name"] = fetchedProduct.name
            single_transaction["seller_id"] = fetchedProduct.user_id
            single_transaction["seller_name"] = fetchedSeller.name
            single_transaction["price"] = tran.price
            single_transaction["confirmation"] = tran.confirmation
            single_transaction["created_at"] = tran.createdAt
            single_transaction["updated_at"] = tran.updatedAt
            all_transactions.append(single_transaction)
        return {
            "status": "success",
            "message": "Products fetched successfully",
            "data": all_transactions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@transactionsRouter.get("/getMyOrders")
async def getMyOrders(db: db_dependency, user_id:str, user_data = Depends(verify_token)):
    try:
        all_transactions = []
        fetchedTransactions = db.query(Transactions).filter(Transactions.user_id != user_id).all()
        if not fetchedTransactions:
            raise HTTPException(status_code=404, detail="Transactions not found")
        for tran in fetchedTransactions:
            single_transaction = {}
            fetchedProduct = db.query(Products).filter(Products.id == tran.product_id).first()
            if (fetchedProduct.user_id == user_id):
                fetchedBuyer = db.query(Users).filter(Users.uuid == tran.user_id).first()
                fetchedSeller = db.query(Users).filter(Users.uuid == fetchedProduct.user_id).first()
                single_transaction["id"] = tran.id
                single_transaction["buyer_id"] = tran.user_id
                single_transaction["buyer_name"] = fetchedBuyer.name
                single_transaction["product_id"] = fetchedProduct.id
                single_transaction["product_name"] = fetchedProduct.name
                single_transaction["seller_id"] = fetchedProduct.user_id
                single_transaction["seller_name"] = fetchedSeller.name
                single_transaction["price"] = tran.price
                single_transaction["confirmation"] = tran.confirmation
                single_transaction["created_at"] = tran.createdAt
                single_transaction["updated_at"] = tran.updatedAt
                all_transactions.append(single_transaction)
        return {
            "status": "success",
            "message": "Products fetched successfully",
            "data": all_transactions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@transactionsRouter.put('/updateTransaction')
async def updateTransaction(tranStatus: int, tranId: int, db: db_dependency, request: Request):
    try:
        fetchedTransaction = db.query(Transactions).filter(Transactions.id == tranId).first()
        if not fetchedTransaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        fetchedTransaction.confirmation = tranStatus
        
        db.commit()
        
        fetchedTransaction = db.query(Transactions).filter(Transactions.id == tranId).first()
        
        return {
            "status": "success",
            "message": "Transaction updated successfully",
            "data": fetchedTransaction
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@transactionsRouter.delete('/deleteTransaction')
async def deleteTransaction(tranId: int, db: db_dependency, request: Request):
    try:
        fetchedTransaction = db.query(Transactions).filter(Transactions.id == tranId).first()
        if not fetchedTransaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        db.delete(fetchedTransaction)
        
        db.commit()
        
        return {
            "status": "success",
            "message": "Product deleted successfully",
            "data": fetchedTransaction
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))