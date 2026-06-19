"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme | undefined;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark" | undefined;
  themes: Theme[];
  systemTheme: "light" | "dark" | undefined;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {}
  return undefined;
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a Provider");
  return ctx;
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const [stored, setStored] = useState<Theme | undefined>(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() =>
    getSystemTheme(),
  );

  const theme = stored ?? "system";
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  const setTheme = useCallback((t: Theme) => {
    setStored(t);
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      themes: ["light", "dark", "system"] as Theme[],
      systemTheme: systemTheme,
    }),
    [theme, setTheme, resolvedTheme, systemTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
