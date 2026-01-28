import React, { createContext, useContext, useState } from "react";

export interface ThemeColors {
  primary: string;
  secondary: string;
  gradient: [string, string];
}

export const THEME_OPTIONS = {
  green: {
    id: "green",
    name: "Green",
    colors: {
      primary: "#42E695",
      secondary: "#3BB2B8",
      gradient: ["#42E695", "#3BB2B8"] as [string, string],
    },
  },
  blue: {
    id: "blue",
    name: "Blue",
    colors: {
      primary: "#3B82F6",
      secondary: "#60A5FA",
      gradient: ["#3B82F6", "#60A5FA"] as [string, string],
    },
  },
  purple: {
    id: "purple",
    name: "Purple",
    colors: {
      primary: "#A78BFA",
      secondary: "#C084FC",
      gradient: ["#A78BFA", "#C084FC"] as [string, string],
    },
  },
  orange: {
    id: "orange",
    name: "Orange",
    colors: {
      primary: "#F97316",
      secondary: "#FB923C",
      gradient: ["#F97316", "#FB923C"] as [string, string],
    },
  },
};

interface ThemeContextType {
  currentTheme: "green" | "blue" | "purple" | "orange";
  setCurrentTheme: (theme: "green" | "blue" | "purple" | "orange") => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<"green" | "blue" | "purple" | "orange">(
    "green"
  );

  const colors = THEME_OPTIONS[currentTheme].colors;

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
}
