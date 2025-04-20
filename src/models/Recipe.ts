import { GroceryItem } from './GroceryItem';

export interface RecipeInstruction {
  instruction: string;
}

export interface Recipe {
  ingredients: GroceryItem[];
  instructions: RecipeInstruction[];
  servingCount: number;
  recipeUrl?: string;
  title?: string;
  description?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
} 