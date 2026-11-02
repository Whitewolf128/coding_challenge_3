import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { productSchemas } from "../validations/productValidation";
import * as productController from "../controllers/productController";

const productRouter: Router = express.Router();

// "/api/v1/items" prefixes all below routes
productRouter.get("/", productController.getAllProducts);
productRouter.post(
    "/",
    validateRequest(productSchemas.create),
    productController.createProduct
);
productRouter.put(
    "/:id",
    validateRequest(productSchemas.update),
    productController.updateProduct
);
productRouter.delete("/:id", productController.deleteProduct);

export default productRouter;
