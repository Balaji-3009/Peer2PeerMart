from fastapi import APIRouter, HTTPException, Depends, Request
from database.session import db_dependency
from database.models import Products, Users
from database.schemas import ProductBase
from .auth import verify_firebase_token
from .user import verify_token

productsRouter = APIRouter()


@productsRouter.post('/createProducts')
async def createProduct(products: ProductBase, db: db_dependency, request: Request, user_data = Depends(verify_token)):
    try:
        newProduct = Products(
            name = products.name,
            user_id = products.user_id,
            price = products.price,
            desc = products.desc
        )
        db.add(newProduct)
        db.commit()
        db.refresh(newProduct)
        return {
            "status": "success",
            "message": "Product created successfully",
            "data": newProduct
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@productsRouter.get("/getProduct/{productId}")
async def getProduct(productId: int, db: db_dependency, user_data = Depends(verify_token)):
    try:
        prod = db.query(Products).filter(Products.id == productId).first()
        if not prod:
            raise HTTPException(status_code=404, detail="Product not found")
        fetchedUserName = db.query(Users.name).filter(Users.id == prod.user_id).first()[0]
        single_product = {}
        single_product["id"] = prod.id
        single_product["name"] = prod.name
        single_product["user_id"] = prod.user_id
        single_product["user_name"] = fetchedUserName
        single_product["price"] = prod.price
        single_product["desc"] = prod.desc
        single_product["created_at"] = prod.createdAt
        single_product["updated_at"] = prod.updatedAt
        return {
            "status": "success",
            "message": "Product fetched successfully",
            "data": single_product
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@productsRouter.get("/getProducts")
async def getProducts(db: db_dependency, user_data = Depends(verify_token)):
    try:
        all_products = []
        fetchedProducts = db.query(Products).all()
        for prod in fetchedProducts:
            single_product = {}
            fetchedUserName = db.query(Users.name).filter(Users.id == prod.user_id).first()[0]
            single_product["id"] = prod.id
            single_product["name"] = prod.name
            single_product["user_id"] = prod.user_id
            single_product["user_name"] = fetchedUserName
            single_product["price"] = prod.price
            single_product["desc"] = prod.desc
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
    
@productsRouter.put('/updateProduct')
async def updateProduct(products: ProductBase, productId: int, db: db_dependency, request: Request, user_data = Depends(verify_token)):
    try:
        fetchedProduct = db.query(Products).filter(Products.id == productId).first()
        if not fetchedProduct:
            raise HTTPException(status_code=404, detail="Product not found")
        fetchedProduct.name = products.name
        fetchedProduct.user_id = products.user_id
        fetchedProduct.price = products.price
        fetchedProduct.desc = products.desc
        
        db.commit()
        
        fetchedProduct = db.query(Products).filter(Products.id == productId).first()
        
        return {
            "status": "success",
            "message": "Product updated successfully",
            "data": fetchedProduct
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
@productsRouter.delete('/deleteProduct')
async def deleteProduct(productId: int, db: db_dependency, request: Request, user_data = Depends(verify_token)):
    try:
        fetchedProduct = db.query(Products).filter(Products.id == productId).first()
        if not fetchedProduct:
            raise HTTPException(status_code=404, detail="Product not found")
        
        db.delete(fetchedProduct)
        
        db.commit()
        
        return {
            "status": "success",
            "message": "Product deleted successfully",
            "data": fetchedProduct
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

