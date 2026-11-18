import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

// Design font for the whole app
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FixMate — Home Repair Services",
  description:
    "Book trusted technicians for smartphone, laptop, AC, appliance and electrical repair.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Light/dark mode from next-themes, the "dark" class goes on <html> */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          {/* Toasts for every success and error message */}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
