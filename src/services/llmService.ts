import { LLMRequest, LLMResponse, ModelInfo, Message } from '../models/LLM';
import { GroceryItem } from '../models/GroceryItem';
import { Recipe } from '../models/Recipe';

export class LLMService {
  private static readonly BASE_URL = 'https://openrouter.ai/api/v1';
  private static readonly API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

  private static async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Shopping List App',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to complete LLM request');
    }

    return response;
  }

  static async getAvailableModels(): Promise<ModelInfo[]> {
    const response = await this.fetchWithAuth('/models');
    return response.json();
  }

  static async chat(request: LLMRequest): Promise<LLMResponse> {
    const response = await this.fetchWithAuth('/chat/completions', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.json();
  }

  static async generateShoppingList(description: string, model: string = 'anthropic/claude-3-haiku'): Promise<GroceryItem[]> {
    const messages: Message[] = [
      {
        role: 'system',
        content: `You are a helpful assistant that creates detailed shopping lists from recipe descriptions. 
        Return a JSON array of ingredients with name, quantity, and unit (if applicable).
        Example format: [{"name": "olive oil", "quantity": 1, "unit": "tablespoon"}, {"name": "onion", "quantity": 1, "unit": "medium"}]`
      },
      {
        role: 'user',
        content: description
      }
    ];

    const response = await this.chat({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    try {
      const ingredients = JSON.parse(response.choices[0].message.content);
      return ingredients;
    } catch (error) {
      console.error('Error parsing ingredients:', error);
      throw new Error('Failed to parse shopping list');
    }
  }

  static async generateRecipe(description: string, model: string = 'anthropic/claude-3-haiku'): Promise<Recipe> {
    const messages: Message[] = [
      {
        role: 'system',
        content: `You are a helpful assistant that creates detailed recipes from descriptions. 
        Return a JSON object with ingredients, instructions, and metadata.
        Include ingredient quantities and units, step-by-step instructions, and serving count.`
      },
      {
        role: 'user',
        content: description
      }
    ];

    const response = await this.chat({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    try {
      const recipe = JSON.parse(response.choices[0].message.content);
      return recipe;
    } catch (error) {
      console.error('Error parsing recipe:', error);
      throw new Error('Failed to parse recipe');
    }
  }
} 