import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as ProductService from "../services/productService";
import { Product } from "../models/productModel";
import { successResponse } from "../models/responseModel";

/**
 * Manages requests and reponses to retrieve all Products
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const products: Product[] = await ProductService.getAllProducts();
        res.status(HTTP_STATUS.OK).json(
            successResponse(products, "Products successfully retrieved")
        );
    } catch (error: unknown) {
        next(error);
    }
};

export const getProductByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const products = await ProductService.getProductsById(id);
        if (products.length === 0) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Product not found"
            });
            return;
        }
        res.status(HTTP_STATUS.OK).json({
            message: "Product retrieved",
            data: products[0]
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests, reponses, and validation to create an Product
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, sku, quantity, price, category } = req.body;

        const newProduct: Product = await ProductService.createProduct({
            name,
            sku,
            quantity,
            price,
            category,
        });
        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newProduct, "Product created successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to update an Product
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // const id: string = req.params.id;
        const { id } = req.params;

        // Extract update fields
        const { name, sku, quantity, category, price } = req.body;

        // create the update Product object with the fields to be updated
        const updatedProduct: Product = await ProductService.updateProduct(id, {
            name,
            sku,
            quantity,
            price,
            category
        });

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedProduct, "Product updated successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to delete an Product
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        await ProductService.deleteProduct(id);
        res.status(HTTP_STATUS.OK).json(
            successResponse("Product successfully deleted")
        );
    } catch (error: unknown) {
        next(error);
    }
};
