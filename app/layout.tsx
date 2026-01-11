import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/lib/context/user-provider";
import { TasksProvider } from "@/lib/context/tasks-provider";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App",
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
        className={`${inter.variable} antialiased`}
      >
        <UserProvider>
          <TasksProvider>
            <Header />
            <main className="container mx-auto p-2">
              {children}
            </main>
          </TasksProvider>
        </UserProvider>
      </body>
    </html>
  );
}
