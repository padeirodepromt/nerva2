/* src/components/ThemeProvider.jsx */
import React, { createContext, useContext, useEffect, useState } from "react";
import { AVAILABLE_THEMES, DEFAULT_THEME } from '@/config/themeOptions';
import { toast } from "sonner";

const initialState = {
  theme: DEFAULT_THEME,
  texture: true,
  animationsEnabled: true,
  setTheme: () => null,
  setTexture: () => null,
  setAnimationsEnabled: () => null,
};

export const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = "prana-ui-theme",
  animationKey = "prana-ui-animations",
  ...props
}) {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );
  
  const [animationsEnabled, setAnimationsEnabledState] = useState(() => {
    const stored = localStorage.getItem(animationKey);
    return stored !== null ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Limpa classes antigas
    root.classList.remove("light", "dark");
    
    // Define atributo data-theme para o CSS Global
    root.setAttribute('data-theme', theme);
    
    // Define a classe Tailwind dark/light
    const themeType = AVAILABLE_THEMES[theme]?.type || 'dark';
    root.classList.add(themeType);

    // Define configurações de animação
    root.setAttribute('data-animate', animationsEnabled.toString());

  }, [theme, animationsEnabled]);

  const setTheme = (newTheme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
    const themeName = AVAILABLE_THEMES[newTheme]?.name || newTheme;
    toast.success(`Atmosfera alterada para ${themeName}`);
  };

  const setAnimationsEnabled = (val) => {
      localStorage.setItem(animationKey, JSON.stringify(val));
      setAnimationsEnabledState(val);
  };

  const value = {
    theme,
    animationsEnabled,
    setTheme,
    setAnimationsEnabled,
    availableThemes: AVAILABLE_THEMES
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme deve ser usado dentro de um <ThemeProvider>");
  }
  return context;
};