"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import AppShell from "@/components/layout/AppShell";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        color: "var(--color-text-secondary)",
        fontSize: "var(--font-size-m)",
      }}>
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return <AppShell>{children}</AppShell>;
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SidebarProvider>
          <NotificationProvider>
            <AuthGuard>{children}</AuthGuard>
          </NotificationProvider>
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
