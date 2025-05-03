
import { useState } from "react";
import { useFavorites } from "@/contexts/FavoritesContext";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import EmptyState from "@/components/EmptyState";
import { Heart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const Favorites = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredFavorites = favorites.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Favorite Recipes</h1>
        
        {favorites.length > 0 && (
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        )}
        
        {favorites.length === 0 ? (
          <EmptyState
            title="No favorites yet"
            description="Save your favorite recipes to access them quickly later"
            icon={<Heart className="h-12 w-12 text-recipe-red" />}
            action={{
              label: "Find Recipes",
              onClick: () => navigate('/'),
            }}
          />
        ) : filteredFavorites.length === 0 ? (
          <EmptyState
            title="No matches found"
            description={`No favorites match "${searchQuery}"`}
            icon={<Search className="h-12 w-12 text-muted-foreground" />}
            action={{
              label: "Clear Search",
              onClick: () => setSearchQuery(''),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFavorites.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
