import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import React from "react";
import { I18nProvider } from "@react-aria/i18n";
import { ToastProvider } from "@heroui/react";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function UIKitProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <I18nProvider locale={"ru"}>
        <ToastProvider />
        {children}
      </I18nProvider>
    </HeroUIProvider>
  );
}
