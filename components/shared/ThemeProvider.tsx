"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Wraps next-themes so every page and component can use useTheme()
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
