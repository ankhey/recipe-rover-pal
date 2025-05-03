
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

interface ApiKeyProviderProps {
  children: ReactNode;
}

export const ApiKeyProvider = ({ children }: ApiKeyProviderProps) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('spoonacular-api-key');
    if (storedKey) {
      setApiKeyState(storedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    localStorage.setItem('spoonacular-api-key', key);
    setApiKeyState(key);
    toast.success("API key saved successfully");
  };

  const clearApiKey = () => {
    localStorage.removeItem('spoonacular-api-key');
    setApiKeyState(null);
    toast.info("API key removed");
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
