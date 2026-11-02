import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
    Timestamp,
} from "firebase-admin/firestore";
import { Product } from "../models/productModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

// reference to the firestore collection name
const COLLECTION: string = "products";

const toDate = (value: unknown, fieldName: string, productId: string): Date => {
    if (value instanceof Timestamp) {
        return value.toDate();
    }

    const date =
        value instanceof Date
            ? new Date(value.getTime())
            : typeof value === "string" || typeof value === "number"
              ? new Date(value)
              : null;

    if (!date || Number.isNaN(date.getTime())) {
        throw new Error(
            `Product ${productId} has an invalid ${fieldName}; expected a Firestore timestamp or valid date value`
        );
    }

    return date;
};

/**
 * Retrieves all products from storage
 * @returns Array of all products
 */
export const getAllProducts = async (): Promise<Product[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const products: Product[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: toDate(data.createdAt, "createdAt", doc.id),
                updatedAt: toDate(data.updatedAt, "updatedAt", doc.id),
            } as Product;
        });

        return products;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new product
 * @param productData - The required fields for the new product
 * @returns The created product with generated ID
 */
export const createProduct = async (
    productData: Pick<Product, "name" | "sku" | "quantity" | "price" | "category">
): Promise<Product> => {
    const dateNow = new Date();
    const newProduct: Partial<Product> = {
        ...productData,
        createdAt: dateNow,
        updatedAt: dateNow,
    };

    const productId: string = await createDocument<Product>(COLLECTION, newProduct);

    return structuredClone({ id: productId, ...newProduct } as Product);
};

/**
 * Retrieves a single product by ID from the database
 * @param id - This ID of the product to retrieve
 * @returns The product if found
 */
export const getProductById = async (id: string): Promise<Product> => {
    const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id);

    if (!doc) {
        throw new Error(`Product with ID ${id} not found`);
    }

    const data: DocumentData | undefined = doc.data();
    if (!data) {
        throw new Error(`Product with ID ${id} has no document data`);
    }

    const product: Product = {
        id: doc.id,
        ...data,
        createdAt: toDate(data.createdAt, "createdAt", doc.id),
        updatedAt: toDate(data.updatedAt, "updatedAt", doc.id),
    } as Product;

    return structuredClone(product);
};

/**
 * Updates (replaces) an existing product
 * @param id - The ID of the product to update
 * @param productData - The fields to updates (name and/or description)
 * @returns The updated product
 * @throws Error if product with given ID is not found
 */
export const updateProduct = async (
    id: string,
    productData: Partial<
        Pick<Product, "name" | "sku" | "quantity" | "price" | "category">
    >
): Promise<Product> => {
    // check if the product exists before updating
    const product: Product = await getProductById(id);
    if (!product) {
        throw new Error(`product with ID ${id} not found`);
    }

    const updateProduct: Product = {
        ...product,
        updatedAt: new Date(),
    };

    if (productData.name !== undefined) updateProduct.name = productData.name;
    if (productData.sku !== undefined) updateProduct.sku = productData.sku;
    if (productData.quantity !== undefined)
        updateProduct.quantity = productData.quantity;
    if (productData.category !== undefined)
        updateProduct.category = productData.category;
    if (productData.price !== undefined) updateProduct.price = productData.price;

    await updateDocument<Product>(COLLECTION, id, updateProduct);

    return structuredClone(updateProduct);
};

/**
 * Deletes an product from storage
 * @param id - The ID of the product to delete
 * @throws Error if product with given ID is not found
 */
export const deleteProduct = async (id: string): Promise<void> => {
    // check if the product exists before deleting
    const product: Product = await getProductById(id);
    if (!product) {
        throw new Error(`Product with ID ${id} not found`);
    }

    await deleteDocument(COLLECTION, id);
};

export const getProductsById = async (id: string): Promise<Product[]> => {
    const product = (await getAllProducts()).find((p) => p.id === id);
  if (!product) {
    return [];
  }

  return [{
    ...product
  }];
};
