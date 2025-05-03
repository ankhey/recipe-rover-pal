
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  summary?: string;
  instructions?: string;
  extendedIngredients?: any[];
  diets?: string[];
  dishTypes?: string[];
  cuisines?: string[];
}

interface FavoritesContextType {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorite-recipes');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites from localStorage', e);
        localStorage.removeItem('favorite-recipes');
      }
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorite-recipes', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (recipe: Recipe) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === recipe.id)) {
        return prev;
      }
      toast.success(`Added "${recipe.title}" to favorites`);
      return [...prev, recipe];
    });
  };

  const removeFavorite = (id: number) => {
    setFavorites(prev => {
      const recipe = prev.find(fav => fav.id === id);
      if (recipe) {
        toast.info(`Removed "${recipe.title}" from favorites`);
      }
      return prev.filter(recipe => recipe.id !== id);
    });
  };

  const isFavorite = (id: number) => {
    return favorites.some(recipe => recipe.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
