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
        // Extract only the fields we want (destructuring)
        // const name: string = req.body.name;
        // const description: string = req.body.description;
        const { name, description, price } = req.body;

        const newProduct: Product = await ProductService.createProduct({
            name,
            description,
            price,
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
        const { name, category, price } = req.body;

        // create the update Product object with the fields to be updated
        const updatedProduct: Product = await ProductService.updateProduct(id, {
            name,
            category,
            price,
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
