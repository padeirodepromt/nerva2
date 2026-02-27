import React from "react";
import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/hooks/useTheme";

// Toaster integrado com o ThemeProvider do PRANA (sem next-themes)
const Toaster = (props) => {
  const { theme } = useTheme();
  const mappedTheme = theme && theme.includes("light") ? "light" : "dark";

  return (
    <Sonner
      theme={mappedTheme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
