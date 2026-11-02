import * as itemService from "../src/api/v1/services/productService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Product } from "../src/api/v1/models/productModel";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

// Mock the repository module
// jest.mock replaces the entire module with an auto-mocked version
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Item Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create an item successfully", async () => {
        // Arrange
        const mockItemData: {
            name: string;
            description: string;
        } = {
            name: "Test Item",
            description: "Test Description",
        };
        const mockDocumentId: string = "test-item-id";

        (
            firestoreRepository.createDocument as jest.MockedFunction<
                typeof firestoreRepository.createDocument
            >
        ).mockResolvedValue(mockDocumentId);

        // Act
        const result: Product = await itemService.createProduct(mockItemData);

        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "items",
            expect.objectContaining({
                name: mockItemData.name,
                description: mockItemData.description,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );
        expect(result.id).toBe(mockDocumentId);
        expect(result.name).toBe(mockItemData.name);
    });

    it("should delete an item successfully", async () => {
        // Arrange
        const mockDocumentId: string = "test-item-id";
        const mockProduct: Product = {
            id: mockDocumentId,
            name: "Test Item",
            sku: "test-item-sku",
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
            "items",
            mockDocumentId
        );
    });
});
