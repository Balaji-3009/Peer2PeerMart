from fastapi import APIRouter, HTTPException, Depends, Request
from database.session import db_dependency
from database.models import Products, Users, Reports
from database.schemas import ProductBase, ReportBase
from .auth import verify_firebase_token
from .user import verify_token

adminRouter = APIRouter()


@adminRouter.get("/getAllUsers")
async def getAllUsers(db: db_dependency, user_data = Depends(verify_token)):
    try:
        fetchedUsers = db.query(Users).all()
        if not fetchedUsers:
            raise HTTPException(status_code=404, detail="Users not found")
        return {
            "status": "success",
            "message": "Products fetched successfully",
            "data": fetchedUsers
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@adminRouter.get("/getAllProducts")
async def getAllProducts(db: db_dependency, user_data = Depends(verify_token)):
    try:
        all_products = []
        fetchedProducts = db.query(Products).all()
        for prod in fetchedProducts:
            single_product = {}
            fetchedUserName = db.query(Users.name).filter(Users.uuid == prod.user_id).first()[0]
            single_product["id"] = prod.id
            single_product["name"] = prod.name
            single_product["user_id"] = prod.user_id
            single_product["user_name"] = fetchedUserName
            single_product["price"] = prod.price
            single_product["desc"] = prod.desc
            single_product["image"] = prod.image
            single_product["negotiable"] = prod.negotiable
            single_product["created_at"] = prod.createdAt
            single_product["updated_at"] = prod.updatedAt
            all_products.append(single_product)
        if not fetchedProducts:
            raise HTTPException(status_code=404, detail="Products not found")
        return {
            "status": "success",
            "message": "Products fetched successfully",
            "data": all_products
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@adminRouter.get("/getReports")
async def getReports(db: db_dependency, user_data = Depends(verify_token)):
    try:
        all_reports = []
        fetchedReports = db.query(Reports).all()
        for report in fetchedReports:
            single_report = {}
            fetchedUserName = db.query(Users.name).filter(Users.uuid == report.user_id).first()[0]
            fetchedProduct = db.query(Products).filter(Products.id == report.product_id).first()
            sellerName = db.query(Users.name).filter(Users.uuid == fetchedProduct.user_id).first()[0]
            single_report["id"] = report.product_id
            single_report["productId"] = report.product_id
            single_report["productName"] = fetchedProduct.name
            single_report["sellerName"] = sellerName
            single_report["reporter_id"] = report.user_id
            single_report["reporter_name"] = fetchedUserName
            single_report["price"] = fetchedProduct.price
            single_report["desc"] = fetchedProduct.desc
            single_report["image"] = fetchedProduct.image
            single_report["reason"] = report.reason
            single_report["created_at"] = report.createdAt
            single_report["updated_at"] = report.updatedAt
            all_reports.append(single_report)
        if not fetchedReports:
            raise HTTPException(status_code=404, detail="Reports not found")
        return {
            "status": "success",
            "message": "Reports fetched successfully",
            "data": all_reports
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@adminRouter.put('/banUser')
async def banUser(userId: str, db: db_dependency, request: Request, user_data = Depends(verify_token)):
    try:
        fetchedUser = db.query(Users).filter(Users.uuid == userId).first()
        if not fetchedUser:
            raise HTTPException(status_code=404, detail="User not found")
        fetchedUser.banned = 1
        
        db.commit()
        
        fetchedUser = db.query(Users).filter(Users.uuid == userId).first()
        
        return {
            "status": "success",
            "message": "User banned successfully",
            "data": fetchedUser
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@adminRouter.put('/unBanUser')
async def unBanUser(userId: str, db: db_dependency, request: Request, user_data = Depends(verify_token)):
    try:
        fetchedUser = db.query(Users).filter(Users.uuid == userId).first()
        if not fetchedUser:
            raise HTTPException(status_code=404, detail="User not found")
        fetchedUser.banned = 0
        
        db.commit()
        
        fetchedUser = db.query(Users).filter(Users.uuid == userId).first()
        
        return {
            "status": "success",
            "message": "User unbanned successfully",
            "data": fetchedUser
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))