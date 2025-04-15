import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@/globals/styles.css";
import { App } from "@/App.tsx";
import { QueryProvider } from "@/providers/QueryProvider.tsx";
import { UIKitProvider } from "@/providers/UIKitProvider.tsx";
import { AccountProvider } from "@/providers/AccountProvider.tsx";
import { ModalsProvider } from "@/providers/ModalsProvider.tsx";
import { FiltersProvider } from "@/providers/FiltersProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UIKitProvider>
        <QueryProvider>
          <AccountProvider>
            <FiltersProvider>
              <ModalsProvider>
                <App />
              </ModalsProvider>
            </FiltersProvider>
          </AccountProvider>
        </QueryProvider>
      </UIKitProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
