/**
 * Represents a product in the system
 */
export interface Product {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    price: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}