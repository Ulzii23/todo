import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/lib/context/user-provider";
import { TasksProvider } from "@/lib/context/tasks-provider";
import { ThemeProvider } from "@/lib/context/theme-provider";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner"

const font = Manrope({ subsets: ['cyrillic-ext'], preload: true, display: 'swap' });

export const metadata: Metadata = {
  title: "MaDesire",
  description: "For MaDesires",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} antialiased min-h-screen bg-background text-foreground transition-colors duration-300`}
      >
        <UserProvider>
          <TasksProvider>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
              <Header />
              <main className="container mx-auto p-2">
                {children}
              </main>
            </ThemeProvider>
          </TasksProvider>
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
