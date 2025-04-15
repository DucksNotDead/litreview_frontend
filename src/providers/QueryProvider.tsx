import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

interface IQueryProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export const QueryProvider: React.FC<IQueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
