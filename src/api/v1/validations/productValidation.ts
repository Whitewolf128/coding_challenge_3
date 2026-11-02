import Joi from "joi";
import { RequestSchema } from "../middleware/validate";

/**
 * Item schema organised by request type
 */
export const productSchemas: Record<string, RequestSchema> = {
    // POST /api/v1/items - Create new Item
    create: {
        body: Joi.object({
            name: Joi.string().required().min(2).max(80).messages({
                "string.empty": "Name cannot be empty",
                "string.min": "Length must greater than 1",
            }),
            sku: Joi.string().pattern(/^[A-Z]{3}[0-9]{4}$/).messages({
                "string.pattern": "Pattern must be 3 letters and 4 digits",
            }),
            quantity: Joi.number().integer().positive().required().messages({
                "any.required": "Description is required",
                "string.empty": "Description cannot be empty",
            }),
            price: Joi.number().required().positive().min(0).messages({
                "number.min": "Price must greater than 0",
            }),
            category: Joi.string().required().valid("electronics", "clothing", "food", "tools", "other").messages({
                "string.valid": "Categort must be a valid category from electronics, clothing, food, tools or other",
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
            name: Joi.string().required().min(2).max(80).messages({
                "string.empty": "Name cannot be empty",
                "string.min": "Length must greater than 1",
            }),
            sku: Joi.string().pattern(/^[A-Z]{3}[0-9]{4}$/).messages({
                "string.pattern": "Pattern must be 3 letters and 4 digits",
            }),
            quantity: Joi.number().integer().positive().required().messages({
                "any.required": "Description is required",
                "string.empty": "Description cannot be empty",
            }),
            price: Joi.number().required().positive().min(0).messages({
                "number.min": "Price must greater than 0",
            }),
            category: Joi.string().required().valid("electronics", "clothing", "food", "tools", "other").messages({
                "string.valid": "Categort must be a valid category from electronics, clothing, food, tools or other",
            }),
        }),
    },
};
