'use client';

/**
 * CarbonOS AI - Layout Shell
 * Wraps page contexts with providers and injects the glassmorphic Sidebar
 * dynamically depending on the active authentication state.
 */

import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { CarbonStoreProvider } from '@/hooks/useCarbonStore';
import Sidebar from '@/components/layout/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Leaf } from 'lucide-react';

function ShellContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname.startsWith('/auth');

  // Automatic client side redirection for guest users
  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.replace('/auth/login');
    } else if (!loading && user && isAuthPage) {
      router.replace('/');
    }
  }, [user, loading, isAuthPage, router]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Leaf className="w-8 h-8 text-background animate-spin-slow" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold tracking-tight text-primary">CarbonOS AI</h1>
            <p className="text-xs text-muted-foreground">Syncing environmental intelligence...</p>
          </div>
        </div>
      </div>
    );
  }

  // Auth pages (no Sidebar, full width)
  if (isAuthPage || !user) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Drawer */}
      <Sidebar />
      
      {/* Main Panel */}
      <main className="pl-80 flex-1 min-h-screen bg-background overflow-x-hidden relative transition-all duration-300">
        {/* Decorative ambient background glows */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 left-[20%] w-[350px] h-[350px] bg-accent/5 rounded-full filter blur-[80px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

        <div className="p-8 max-w-6xl mx-auto w-full min-h-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CarbonStoreProvider>
        <ShellContent>{children}</ShellContent>
      </CarbonStoreProvider>
    </AuthProvider>
  );
}
