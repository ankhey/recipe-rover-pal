
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { toast } from "sonner";

const ApiKeyModal = () => {
  const { apiKey, setApiKey, clearApiKey } = useApiKey();
  const [inputKey, setInputKey] = useState(apiKey || "");
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (!inputKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    setApiKey(inputKey.trim());
    setOpen(false);
  };

  const handleClear = () => {
    clearApiKey();
    setInputKey("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">API Key</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Spoonacular API Key</DialogTitle>
          <DialogDescription>
            Enter your Spoonacular API key to use this app. You can get a free API key by signing up at{" "}
            <a 
              href="https://spoonacular.com/food-api/console#Dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Spoonacular API Console
            </a>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
              type="text" 
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="col-span-3"
              placeholder="Enter your Spoonacular API key"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClear}>
            {apiKey ? "Clear Key" : "Cancel"}
          </Button>
          <Button onClick={handleSave}>Save Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
