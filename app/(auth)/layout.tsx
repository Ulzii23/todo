"use client";

import { useEffect } from "react";
import { useUser } from "@/lib/context/user-provider";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/"); // replace is better for auth redirects
    }
  }, [user, router]);

  if (user) return null;

  return <>{children}</>;
}
