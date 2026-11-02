import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
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
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
            } as Product;
        });

        return products;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new product
 * @param productData - The data for the new product (name and description)
 * @returns The created product with generated ID
 */
export const createProduct = async (productData: {
    name: string;
    description: string;
    price?: number;
}): Promise<Product> => {
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
    const product: Product = {
        id: doc.id,
        ...data,
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
    productData: Pick<Product, "name" | "category" | "price">
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

    // I went for the simple option to only update defined values, you could also use an Object method like Object.entries() to be less verbose
    if (productData.name !== undefined) updateProduct.name = productData.name;
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
