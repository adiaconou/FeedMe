import { ShoppingList } from '../models/ShoppingList';
import { GroceryItem } from '../models/GroceryItem';
import { LLMService } from './llmService';

export class ShoppingListService {
  static async createShoppingList(description: string): Promise<ShoppingList> {
    try {
      const ingredients = await LLMService.generateShoppingList(description);
      return { items: ingredients };
    } catch (error) {
      console.error('Error generating shopping list:', error);
      throw new Error('Failed to generate shopping list. Please try again.');
    }
  }
} 