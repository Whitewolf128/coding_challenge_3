import * as itemService from "../src/api/v1/services/productService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Product } from "../src/api/v1/models/productModel";
import {
    DocumentSnapshot,
    QuerySnapshot,
    Timestamp,
} from "firebase-admin/firestore";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

// Mock the repository module
// jest.mock replaces the entire module with an auto-mocked version
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Product Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a product successfully", async () => {
        // Arrange
        const mockProductData: {
            name: string;
            sku: string;
            quantity: number;
            price: number;
            category: string;
        } = {
            name: "Test Product",
            sku: "TES0001",
            quantity: 3,
            price: 19.99,
            category: "electronics",
        };
        const mockDocumentId: string = "test-product-id";

        (
            firestoreRepository.createDocument as jest.MockedFunction<
                typeof firestoreRepository.createDocument
            >
        ).mockResolvedValue(mockDocumentId);

        // Act
        const result: Product = await itemService.createProduct(mockProductData);

        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "products",
            expect.objectContaining({
                ...mockProductData,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );
        expect(result.id).toBe(mockDocumentId);
        expect(result.name).toBe(mockProductData.name);
    });

    it("should read product dates stored as Firestore timestamps, Dates, or strings", async () => {
        const createdAt = new Date("2026-01-02T03:04:05.000Z");
        const updatedAt = new Date("2026-02-03T04:05:06.000Z");
        const data = {
            name: "Test Product",
            sku: "TES0001",
            quantity: 3,
            price: 19.99,
            category: "electronics",
            createdAt: Timestamp.fromDate(createdAt),
            updatedAt: updatedAt.toISOString(),
        };
        (
            firestoreRepository.getDocuments as jest.MockedFunction<
                typeof firestoreRepository.getDocuments
            >
        ).mockResolvedValue({
            docs: [{ id: "test-product-id", data: () => data }],
        } as unknown as QuerySnapshot);

        const products = await itemService.getAllProducts();

        expect(products[0].createdAt).toEqual(createdAt);
        expect(products[0].updatedAt).toEqual(updatedAt);
    });

    it("should normalize dates when reading a product by ID", async () => {
        const createdAt = new Date("2026-01-02T03:04:05.000Z");
        const updatedAt = new Date("2026-02-03T04:05:06.000Z");
        (
            firestoreRepository.getDocumentById as jest.MockedFunction<
                typeof firestoreRepository.getDocumentById
            >
        ).mockResolvedValue({
            id: "test-product-id",
            data: () => ({
                name: "Test Product",
                sku: "TES0001",
                quantity: 3,
                price: 19.99,
                category: "electronics",
                createdAt,
                updatedAt: updatedAt.getTime(),
            }),
        } as unknown as DocumentSnapshot);

        const product = await itemService.getProductById("test-product-id");

        expect(product.createdAt).toEqual(createdAt);
        expect(product.updatedAt).toEqual(updatedAt);
    });

    it("should persist every supplied product field when updating", async () => {
        const existingProduct: Product = {
            id: "test-product-id",
            name: "Test Product",
            sku: "TES0001",
            quantity: 3,
            price: 19.99,
            category: "electronics",
            createdAt: new Date("2026-01-02T03:04:05.000Z"),
            updatedAt: new Date("2026-01-02T03:04:05.000Z"),
        };
        const updatedFields = {
            name: "Updated Product",
            sku: "UPD0001",
            quantity: 8,
            price: 24.99,
            category: "tools" as const,
        };
        jest.spyOn(itemService, "getProductById").mockResolvedValue(existingProduct);
        (
            firestoreRepository.updateDocument as jest.MockedFunction<
                typeof firestoreRepository.updateDocument
            >
        ).mockResolvedValue(undefined);

        await itemService.updateProduct("test-product-id", updatedFields);

        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
            "products",
            "test-product-id",
            expect.objectContaining({
                ...updatedFields,
                createdAt: existingProduct.createdAt,
                updatedAt: expect.any(Date),
            })
        );
    });

    it("should delete an item successfully", async () => {
        // Arrange
        const mockDocumentId: string = "test-item-id";
        const mockProduct: Product = {
            id: mockDocumentId,
            name: "Test Product",
            sku: "test-product-sku",
            price: 100,
            quantity: 1,
            category: "Test Category",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // jest.spyOn creates a mock for a specific method/function on an object, in our example the itemService
        jest.spyOn(itemService, "getProductById").mockResolvedValue(mockProduct);

        // jest.Mock replaces the auto-mocked version with our specific mocked implementation
        (
            firestoreRepository.deleteDocument as jest.MockedFunction<
                typeof firestoreRepository.deleteDocument
            >
        ).mockResolvedValue(undefined);

        // Act
        await itemService.deleteProduct(mockDocumentId);

        // Assert
        expect(itemService.getProductById).toHaveBeenCalledWith(mockDocumentId);
        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
            "products",
            mockDocumentId
        );
    });
});
