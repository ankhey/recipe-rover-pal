
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Recipe, useFavorites } from "@/contexts/FavoritesContext";
import { Badge } from "@/components/ui/badge";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isFav = isFavorite(recipe.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFav) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  // Ensure we have an image, or use a placeholder
  const imageUrl = recipe.image || 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <Link to={`/recipe/${recipe.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={recipe.title} 
            className="recipe-card-image w-full" 
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white ${
              isFav ? 'text-recipe-red' : 'text-gray-500'
            }`}
            onClick={handleFavoriteToggle}
          >
            <Heart className={`h-5 w-5 ${isFav ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2">{recipe.title}</h3>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            {recipe.readyInMinutes && (
              <span>{recipe.readyInMinutes} mins</span>
            )}
            {recipe.servings && (
              <>
                <span>•</span>
                <span>{recipe.servings} servings</span>
              </>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
          {recipe.diets && recipe.diets.slice(0, 3).map((diet) => (
            <Badge key={diet} variant="outline" className="bg-recipe-green/10 text-recipe-green">
              {diet}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RecipeCard;
