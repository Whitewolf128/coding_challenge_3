import request from "supertest";
import app from "../src/app";
import * as productController from "../src/api/v1/controllers/productController";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { beforeEach ,afterEach, describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

jest.mock("../src/api/v1/controllers/productController", () => ({
    getAllItems: jest.fn((_req: Request, res: Response) => res.status(HTTP_STATUS.OK).send()),
    createItem: jest.fn((_req: Request, res: Response) => res.status(HTTP_STATUS.CREATED).send()),
    updateItem: jest.fn((_req: Request, res: Response) => res.status(HTTP_STATUS.OK).send()),
    deleteItem: jest.fn((_req: Request, res: Response) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Item Routes", () => {
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
            const mockItem = {
                name: "Test Product",
                description: "Test description",
            }; 

            await request(app).post("/api/v1/products/").send(mockItem);
            expect(productController.createProduct).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/products/:id", () => {
        it("should call updateProduct controller with valid data", async () => {
            const mockProduct = {
                name: "Updated Product",
                description: "Updated description",
            }; 

            await request(app).put("/api/v1/products/testId").send(mockProduct);
            expect(productController.updateProduct).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/products/:id", () => {
        it("should call deleteProduct controller with valid data", async () => {
            await request(app).delete("/api/v1/products/testId");
            expect(productController.deleteProduct).toHaveBeenCalled();
        });
    });
})