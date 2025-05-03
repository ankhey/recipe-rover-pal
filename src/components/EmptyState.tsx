
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

const EmptyState = ({ 
  title, 
  description, 
  action, 
  icon = <Utensils className="h-12 w-12 text-recipe-orange" /> 
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-recipe-orange/10 p-6 mb-6">
        {icon}
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
