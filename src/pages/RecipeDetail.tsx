
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { useFavorites, Recipe } from "@/contexts/FavoritesContext";
import Header from "@/components/Header";
import { getRecipeById } from "@/services/recipeService";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Users, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apiKey } = useApiKey();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // Parse HTML strings
  const createMarkup = (html: string) => ({ __html: html });

  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(apiKey!, parseInt(id!)),
    enabled: !!apiKey && !!id,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load recipe details");
      console.error(error);
    }
  }, [error]);

  if (!apiKey) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">API Key Required</h2>
            <p className="mb-4">Please set your Spoonacular API key to view recipe details.</p>
          </div>
        </main>
      </div>
    );
  }

  const handleFavoriteToggle = () => {
    if (!recipe) return;
    
    if (isFavorite(recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe as Recipe);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={handleGoBack}
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-64 bg-muted animate-pulse rounded-md"></div>
            <div className="h-10 w-3/4 bg-muted animate-pulse rounded-md"></div>
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded-md"></div>
            <div className="h-32 bg-muted animate-pulse rounded-md"></div>
          </div>
        ) : recipe ? (
          <div>
            {recipe.image && (
              <div className="rounded-lg overflow-hidden mb-6">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="recipe-detail-image"
                />
              </div>
            )}
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h1 className="text-3xl font-bold">{recipe.title}</h1>
              
              <Button
                onClick={handleFavoriteToggle}
                variant={isFavorite(recipe.id) ? "default" : "outline"}
                className={`${isFavorite(recipe.id) ? "bg-recipe-red hover:bg-recipe-red/90" : ""}`}
              >
                <Heart className={`mr-2 h-4 w-4 ${isFavorite(recipe.id) ? "fill-white" : ""}`} />
                {isFavorite(recipe.id) ? "Saved" : "Save Recipe"}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              {recipe.readyInMinutes && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-recipe-orange" />
                  <span>{recipe.readyInMinutes} minutes</span>
                </div>
              )}
              
              {recipe.servings && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-recipe-orange" />
                  <span>{recipe.servings} servings</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {recipe.diets && recipe.diets.map((diet) => (
                <Badge key={diet} variant="outline" className="bg-recipe-green/10 text-recipe-green">
                  {diet}
                </Badge>
              ))}
              {recipe.dishTypes && recipe.dishTypes.map((type) => (
                <Badge key={type} variant="outline">
                  {type}
                </Badge>
              ))}
            </div>
            
            {recipe.summary && (
              <div className="mb-8 prose max-w-full">
                <h2 className="text-xl font-semibold mb-2">Summary</h2>
                <div dangerouslySetInnerHTML={createMarkup(recipe.summary)} />
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                {recipe.extendedIngredients ? (
                  <ul className="list-disc list-inside space-y-2">
                    {recipe.extendedIngredients.map((ingredient, index) => (
                      <li key={index} className="text-muted-foreground">
                        {ingredient.original}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No ingredients available</p>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                {recipe.instructions ? (
                  <div 
                    className="prose max-w-full" 
                    dangerouslySetInnerHTML={createMarkup(recipe.instructions)} 
                  />
                ) : (
                  <p>No instructions available</p>
                )}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Recipe</h2>
            <p className="text-muted-foreground">Unable to load recipe details. Please try again later.</p>
            <Button className="mt-4" onClick={handleGoBack}>
              Go Back
            </Button>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default RecipeDetail;
