
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Utensils, Heart } from "lucide-react";
import ApiKeyModal from "./ApiKeyModal";

export const Header = () => {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex items-center justify-between h-16 mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <Utensils className="w-6 h-6 text-recipe-orange" />
          <span className="text-xl font-bold">Recipe Rover</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link to="/">
            <Button variant={location.pathname === "/" ? "default" : "ghost"}>
              Recipes
            </Button>
          </Link>
          <Link to="/favorites">
            <Button variant={location.pathname === "/favorites" ? "default" : "ghost"}>
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </Button>
          </Link>
          <ApiKeyModal />
        </nav>
      </div>
    </header>
  );
};

export default Header;
