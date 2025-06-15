
import { Recipe } from "@/contexts/FavoritesContext";

// Replace this with your actual Spoonacular API key
const API_KEY = 'YOUR_SPOONACULAR_API_KEY_HERE';

const BASE_URL = 'https://api.spoonacular.com';

interface SearchParams {
  query?: string;
  cuisine?: string;
  diet?: string;
  intolerances?: string;
  includeIngredients?: string;
  excludeIngredients?: string;
  type?: string;
  maxReadyTime?: number;
  offset?: number;
  number?: number;
}

export const searchRecipes = async (params: SearchParams) => {
  if (!API_KEY || API_KEY === 'YOUR_SPOONACULAR_API_KEY_HERE') {
    throw new Error('Please add your Spoonacular API key to src/services/recipeService.ts');
  }

  const searchParams = new URLSearchParams();
  searchParams.append('apiKey', API_KEY);
  
  // Add all non-empty parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.append(key, value.toString());
    }
  });

  try {
    const response = await fetch(`${BASE_URL}/recipes/complexSearch?${searchParams.toString()}&addRecipeInformation=true`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch recipes');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

export const getRecipeById = async (id: number): Promise<Recipe> => {
  if (!API_KEY || API_KEY === 'YOUR_SPOONACULAR_API_KEY_HERE') {
    throw new Error('Please add your Spoonacular API key to src/services/recipeService.ts');
  }

  try {
    const response = await fetch(
      `${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch recipe with id ${id}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error getting recipe ${id}:`, error);
    throw error;
  }
};

export const getDiets = () => [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten Free" },
  { value: "dairy-free", label: "Dairy Free" },
  { value: "keto", label: "Ketogenic" },
  { value: "paleo", label: "Paleo" },
  { value: "pescetarian", label: "Pescetarian" },
  { value: "whole30", label: "Whole30" },
];
