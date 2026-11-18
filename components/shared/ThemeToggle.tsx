"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

// Light/dark switch for the navbar and the dashboard topbar.
// The two icons swap with CSS (dark: variants), so server and client
// render the same markup and there is no hydration mismatch.
export default function ThemeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();

  // Flip whatever theme is currently on <html>
  function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${className || ""}`}
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="hidden h-4 w-4 dark:block" />
    </button>
  );
}
