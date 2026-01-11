import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/lib/context/user-provider";
import { TasksProvider } from "@/lib/context/tasks-provider";
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
        className={`${font.className} antialiased bg-slate-50 min-h-screen`}
      >
        <UserProvider>
          <TasksProvider>
            <Header />
            <main className="container mx-auto p-2">
              {children}
            </main>
          </TasksProvider>
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
