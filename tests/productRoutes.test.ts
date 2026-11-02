import request from "supertest";
import app from "../src/app";
import * as productController from "../src/api/v1/controllers/productController";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { beforeEach ,afterEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

jest.mock("../src/api/v1/controllers/productController", () => ({
    getAllProducts: jest.fn((_req: Request, res: Response) => res.status(HTTP_STATUS.OK).send()),
    getProductByIdController: jest.fn((_req: Request, res: Response) => res.status(HTTP_STATUS.OK).send()),
    createProduct: jest.fn((_req: Request, res: Response) => res.status(HTTP_STATUS.CREATED).send()),
    updateProduct: jest.fn((_req: Request, res: Response) => res.status(HTTP_STATUS.OK).send()),
    deleteProduct: jest.fn((_req: Request, res: Response) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Product Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/products/", () => {
        it("should call getAllProducts controller", async () => {
            await request(app).get("/api/v1/products/");
            expect(productController.getAllProducts).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/products/", () => {
        it("should call createProduct controller with valid data", async () => {
            const mockProduct = {
                name: "Test Product",
                sku: "TES0001",
                quantity: 3,
                price: 19.99,
                category: "electronics",
            }; 

            await request(app).post("/api/v1/products/").send(mockProduct);
            expect(productController.createProduct).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/products/:id", () => {
        it("should call updateProduct controller with valid data", async () => {
            const mockProduct = {
                name: "Updated Product",
                sku: "UPD0001",
                quantity: 4,
                price: 24.99,
                category: "electronics",
            }; 

            await request(app).put("/api/v1/products/testId").send(mockProduct);
            expect(productController.updateProduct).toHaveBeenCalled();
        });

        it("should reject an empty update", async () => {
            const response = await request(app)
                .put("/api/v1/products/testId")
                .send({});

            expect(response.status).toBe(400);
            expect(productController.updateProduct).not.toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/products/:id", () => {
        it("should call deleteProduct controller with valid data", async () => {
            await request(app).delete("/api/v1/products/testId");
            expect(productController.deleteProduct).toHaveBeenCalled();
        });
    });
})