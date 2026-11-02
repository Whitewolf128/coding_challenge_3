import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validate";
import { productSchemas } from "../src/api/v1/validations/productValidation";
import { MiddlewareFunction } from "../src/api/v1/types/express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

describe("Validation Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn<Response["status"]>().mockReturnThis(),
            json: jest.fn<Response["json"]>(),
        };
        mockNext = jest.fn();
    });

    it("should pass validation for valid item data", () => {
        // Arrange
        mockReq.body = {
            name: "Valid Item",
            description: "Valid description",
        };
        const middleware: MiddlewareFunction = validateRequest(
            productSchemas.create
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail validation when name is empty string", () => {
        // Arrange
        mockReq.body = {
            name: "",
            description: "Valid description",
        };
        const middleware: MiddlewareFunction = validateRequest(
            productSchemas.create
        );

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Validation error: Body: Name cannot be empty",
        });
    });
});
