// services/localStorageService.ts
import type { UserDefinedKnowledgeItem } from '../types';

const USER_DEFINED_KB_KEY = 'userDefinedKnowledgeBank';

export const getUserDefinedItems = (): UserDefinedKnowledgeItem[] => {
  try {
    const itemsJSON = localStorage.getItem(USER_DEFINED_KB_KEY);
    return itemsJSON ? JSON.parse(itemsJSON) : [];
  } catch (error) {
    console.error("Error retrieving user-defined items from localStorage:", error);
    return [];
  }
};

export const addUserDefinedItem = (newItem: UserDefinedKnowledgeItem): void => {
  try {
    const existingItems = getUserDefinedItems();
    const itemIndex = existingItems.findIndex(
      (item) => item.name.toLowerCase() === newItem.name.toLowerCase() && item.type === newItem.type
    );

    if (itemIndex > -1) {
      // Item exists, optionally update its count or other properties
      existingItems[itemIndex].count = (existingItems[itemIndex].count || 1) + 1;
    } else {
      // New item
      existingItems.push({ ...newItem, count: 1 });
    }
    localStorage.setItem(USER_DEFINED_KB_KEY, JSON.stringify(existingItems));
  } catch (error) {
    console.error("Error saving user-defined item to localStorage:", error);
  }
};
