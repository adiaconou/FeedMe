import { useState } from 'react';
import { ShoppingListService } from '../services/shoppingListService';
import { ShoppingList } from '../models/ShoppingList';
import { GroceryItem } from '../models/GroceryItem';

export const useShoppingListViewModel = () => {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shoppingItems, setShoppingItems] = useState<GroceryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleCreateList = async () => {
    if (!inputText.trim()) {
      setError('Please provide the items you want to buy');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await ShoppingListService.createShoppingList(inputText);
      setShoppingItems(result.items);
      console.log(result.items);
      handleClose();
      setInputText('');
    } catch (err) {
      setError('Failed to create shopping list. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    open,
    inputText,
    isLoading,
    shoppingItems,
    error,
    handleOpen,
    handleClose,
    setInputText,
    handleCreateList,
  };
}; 