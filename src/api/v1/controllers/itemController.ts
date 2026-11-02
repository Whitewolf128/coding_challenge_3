import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as itemService from "../services/itemService";
import { Item } from "../models/itemModel";
import { successResponse } from "../models/responseModel";

/**
 * Manages requests and reponses to retrieve all Items
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllItems = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const items: Item[] = await itemService.getAllItems();
        res.status(HTTP_STATUS.OK).json(
            successResponse(items, "Items successfully retireved")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests, reponses, and validation to create an Item
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const createItem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract only the fields we want (destructuring)
        // const name: string = req.body.name;
        // const description: string = req.body.description;
        const { name, description, price } = req.body;

        const newItem: Item = await itemService.createItem({
            name,
            description,
            price,
        });
        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newItem, "Item created successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to update an Item
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const updateItem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // const id: string = req.params.id;
        const { id } = req.params;

        // Extract update fields
        const { name, description, price } = req.body;

        // create the update item object with the fields to be updated
        const updatedItem: Item = await itemService.updateItem(id, {
            name,
            description,
            price,
        });

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedItem, "Item updated successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to delete an Item
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteItem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        await itemService.deleteItem(id);
        res.status(HTTP_STATUS.OK).json(
            successResponse("Item successfully deleted")
        );
    } catch (error: unknown) {
        next(error);
    }
};
