import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { Item } from "../models/itemModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

// reference to the firestore collection name
const COLLECTION: string = "items";

/**
 * Retrieves all items from storage
 * @returns Array of all items
 */
export const getAllItems = async (): Promise<Item[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const items: Item[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
            } as Item;
        });

        return items;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new item
 * @param itemData - The data for the new item (name and description)
 * @returns The created item with generated ID
 */
export const createItem = async (itemData: {
    name: string;
    description: string;
    price?: number;
}): Promise<Item> => {
    const dateNow = new Date();
    const newItem: Partial<Item> = {
        ...itemData,
        createdAt: dateNow,
        updatedAt: dateNow,
    };

    const itemId: string = await createDocument<Item>(COLLECTION, newItem);

    return structuredClone({ id: itemId, ...newItem } as Item);
};

/**
 * Retrieves a single item by ID from the database
 * @param id - This ID of the item to retrieve
 * @returns The item if found
 */
export const getItemById = async (id: string): Promise<Item> => {
    const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id);

    if (!doc) {
        throw new Error(`Item with ID ${id} not found`);
    }

    const data: DocumentData | undefined = doc.data();
    const item: Item = {
        id: doc.id,
        ...data,
    } as Item;

    return structuredClone(item);
};

/**
 * Updates (replaces) an existing item
 * @param id - The ID of the item to update
 * @param itemData - The fields to updates (name and/or description)
 * @returns The updated item
 * @throws Error if item with given ID is not found
 */
export const updateItem = async (
    id: string,
    itemData: Pick<Item, "name" | "description" | "price">
): Promise<Item> => {
    // check if the item exists before updating
    const item: Item = await getItemById(id);
    if (!item) {
        throw new Error(`Item with ID ${id} not found`);
    }

    const updateItem: Item = {
        ...item,
        updatedAt: new Date(),
    };

    // I went for the simple option to only update defined values, you could also use an Object method like Object.entries() to be less verbose
    if (itemData.name !== undefined) updateItem.name = itemData.name;
    if (itemData.description !== undefined)
        updateItem.description = itemData.description;
    if (itemData.price !== undefined) updateItem.price = itemData.price;

    await updateDocument<Item>(COLLECTION, id, updateItem);

    return structuredClone(updateItem);
};

/**
 * Deletes an item from storage
 * @param id - The ID of the item to delete
 * @throws Error if item with given ID is not found
 */
export const deleteItem = async (id: string): Promise<void> => {
    // check if the item exists before deleting
    const item: Item = await getItemById(id);
    if (!item) {
        throw new Error(`Item with ID ${id} not found`);
    }

    await deleteDocument(COLLECTION, id);
};
