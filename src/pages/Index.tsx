
import { useState } from "react";
import Header from "@/components/Header";
import SearchFilters from "@/components/SearchFilters";
import RecipeCard from "@/components/RecipeCard";
import EmptyState from "@/components/EmptyState";
import { searchRecipes } from "@/services/recipeService";
import { Recipe } from "@/contexts/FavoritesContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Utensils } from "lucide-react";

const Index = () => {
  const [searchParams, setSearchParams] = useState<any>(null);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['recipes', searchParams],
    queryFn: () => searchRecipes(searchParams),
    enabled: !!searchParams,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSearch = (params: any) => {
    setSearchParams(params);
  };

  const recipes = data?.results || [];
  const hasSearched = searchParams !== null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Find your next favorite dish</h1>
            <p className="text-muted-foreground">
              Search through thousands of recipes by ingredients, cuisine, diet, and more
            </p>
          </div>
        </div>

        <SearchFilters onSearch={handleSearch} />

        <div className="mt-10">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-[320px] bg-muted animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : isError ? (
            <EmptyState
              title="Error loading recipes"
              description={error?.message || "Something went wrong. Please try again."}
              icon={<Utensils className="h-12 w-12 text-destructive" />}
              action={{
                label: "Try Again",
                onClick: () => handleSearch(searchParams),
              }}
            />
          ) : hasSearched && recipes.length === 0 ? (
            <EmptyState
              title="No recipes found"
              description="Try adjusting your search criteria or try different ingredients"
              action={{
                label: "Reset Filters",
                onClick: () => handleSearch({ query: "", number: 12 }),
              }}
            />
          ) : hasSearched ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recipes.map((recipe: Recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="py-20">
              <EmptyState
                title="Search for recipes"
                description="Enter ingredients, cuisine, or dietary preferences to find recipes"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
