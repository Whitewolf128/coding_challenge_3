import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as productController from "../src/api/v1/controllers/productController";
import * as productService from "../src/api/v1/services/productService";
import { Product } from "../src/api/v1/models/productModel";
import { mock } from "node:test";
import { beforeEach ,afterEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("../src/api/v1/services/productService");

describe("Item Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    // reusable mocks for any controller tests
    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn((): Response => mockRes as Response),
            json: jest.fn((): Response => mockRes as Response),
        };
        mockNext = jest.fn();
    });

    describe("getAllProducts", () => {
        it("should handle successful operation", async () => {
            const mockProducts: Product[] = [
                {
                    id: "1",
                    name: "Test Item",
                    sku: "TEST-001",
                    quantity: 10,
                    price: 9.99,
                    category: "Test",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            (productService.getAllProducts as jest.Mock).mockReturnValue(mockProducts);

            await productController.getAllProducts(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Items successfully retireved",
                status: "success",
                data: mockProducts,
            });
        });
    });

    describe("createProduct", () => {
        it("should handle successful creation", async () => {
            const mockBody = {
                name: "Test Item",
                sku: "TEST-001",
                quantity: 10,
                price: 9.99,
                category: "Test",
            };

            const mockProduct: Product = {
                id: "test_id",
                createdAt: new Date(),
                updatedAt: new Date(),
                ...mockBody,
            };

            mockReq.body = mockBody;
            (productService.createProduct as jest.Mock).mockReturnValue(mockProduct);

            await productController.createProduct(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Item created successfully",
                data: mockProduct,
                status: "success",
            });
        });
    });
});
