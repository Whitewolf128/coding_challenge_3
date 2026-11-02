import Joi from "joi";
import { RequestSchema } from "../middleware/validate";

/**
 * Item schema organised by request type
 */
export const itemSchemas: Record<string, RequestSchema> = {
    // POST /api/v1/items - Create new Item
    create: {
        body: Joi.object({
            name: Joi.string().required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
            }),
            description: Joi.string().required().messages({
                "any.required": "Description is required",
                "string.empty": "Description cannot be empty",
            }),
            price: Joi.number().optional().min(0).messages({
                "number.min": "Price must greater than 0",
            }),
        }),
    },

    // PUT /api/v1/items/:id - Update Item
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Item ID is required",
                "string.empty": "Item ID cannot be empty",
            }),
        }),
        body: Joi.object({
            name: Joi.string().optional().messages({
                "string.empty": "Name cannot be empty",
            }),
            description: Joi.string().optional().messages({
                "string.empty": "Description cannot be empty",
            }),
            price: Joi.number().optional().min(0).messages({
                "number.min": "Price must greater than 0",
            }),
        }),
    },
};
