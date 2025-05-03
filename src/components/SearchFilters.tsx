
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { 
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getDiets } from "@/services/recipeService";

interface SearchFiltersProps {
  onSearch: (params: any) => void;
}

const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    diet: "",
    cuisine: "",
    includeIngredients: "",
    maxReadyTime: "",
    type: "",
  });

  const diets = getDiets();
  
  const cuisines = [
    { value: "african", label: "African" },
    { value: "american", label: "American" },
    { value: "british", label: "British" },
    { value: "chinese", label: "Chinese" },
    { value: "indian", label: "Indian" },
    { value: "italian", label: "Italian" },
    { value: "japanese", label: "Japanese" },
    { value: "korean", label: "Korean" },
    { value: "mexican", label: "Mexican" },
    { value: "middle eastern", label: "Middle Eastern" },
    { value: "thai", label: "Thai" },
  ];
  
  const dishTypes = [
    { value: "main course", label: "Main Course" },
    { value: "side dish", label: "Side Dish" },
    { value: "dessert", label: "Dessert" },
    { value: "appetizer", label: "Appetizer" },
    { value: "salad", label: "Salad" },
    { value: "bread", label: "Bread" },
    { value: "breakfast", label: "Breakfast" },
    { value: "soup", label: "Soup" },
    { value: "beverage", label: "Beverage" },
    { value: "sauce", label: "Sauce" },
    { value: "drink", label: "Drink" },
  ];

  const handleSearch = () => {
    const searchParams = {
      query: query || undefined,
      diet: filters.diet || undefined,
      cuisine: filters.cuisine || undefined,
      includeIngredients: filters.includeIngredients || undefined,
      maxReadyTime: filters.maxReadyTime ? parseInt(filters.maxReadyTime) : undefined,
      type: filters.type || undefined,
      number: 12, // Number of results to return
    };
    
    onSearch(searchParams);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      diet: "",
      cuisine: "",
      includeIngredients: "",
      maxReadyTime: "",
      type: "",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Recipes</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="diet">Diet</Label>
                <Select 
                  value={filters.diet} 
                  onValueChange={(value) => handleFilterChange("diet", value)}
                >
                  <SelectTrigger id="diet">
                    <SelectValue placeholder="Select diet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    {diets.map(diet => (
                      <SelectItem key={diet.value} value={diet.value}>{diet.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cuisine">Cuisine</Label>
                <Select 
                  value={filters.cuisine} 
                  onValueChange={(value) => handleFilterChange("cuisine", value)}
                >
                  <SelectTrigger id="cuisine">
                    <SelectValue placeholder="Select cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    {cuisines.map(cuisine => (
                      <SelectItem key={cuisine.value} value={cuisine.value}>{cuisine.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Dish Type</Label>
                <Select 
                  value={filters.type} 
                  onValueChange={(value) => handleFilterChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select dish type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    {dishTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ingredients">Include Ingredients</Label>
                <Input
                  id="ingredients"
                  placeholder="tomato, cheese, pasta"
                  value={filters.includeIngredients}
                  onChange={(e) => handleFilterChange("includeIngredients", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxTime">Max Ready Time (minutes)</Label>
                <Input
                  id="maxTime"
                  type="number"
                  placeholder="30"
                  value={filters.maxReadyTime}
                  onChange={(e) => handleFilterChange("maxReadyTime", e.target.value)}
                />
              </div>
            </div>
            <Separator />
            <SheetFooter className="mt-4 flex justify-between sm:justify-between">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
              <SheetClose asChild>
                <Button onClick={handleSearch}>Apply Filters</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  );
};

export default SearchFilters;
