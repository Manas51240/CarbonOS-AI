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

  // Auth pages (no Sidebar, full width) - render immediately to avoid loading flash
  if (isAuthPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Skeleton Sidebar Drawer */}
        <aside className="w-80 h-screen fixed left-0 top-0 glass-panel border-r flex flex-col p-6 z-40">
          <div className="flex-1 flex flex-col gap-4 animate-pulse">
            <div className="h-8 bg-muted rounded-xl w-2/3" />
            <div className="h-20 bg-muted rounded-2xl w-full" />
            <div className="h-8 bg-muted rounded-xl w-5/6 mt-6" />
            <div className="h-8 bg-muted rounded-xl w-3/4" />
            <div className="h-8 bg-muted rounded-xl w-2/3" />
            <div className="h-8 bg-muted rounded-xl w-4/5" />
          </div>
        </aside>
        
        {/* Main Panel Skeleton */}
        <main className="pl-80 flex-1 min-h-screen bg-background overflow-x-hidden relative p-8">
          <div className="max-w-6xl mx-auto w-full min-h-full flex flex-col items-center justify-center py-20">
            <Leaf className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground mt-4">Syncing environmental intelligence...</p>
          </div>
        </main>
      </div>
    );
  }

  // Not logged in guest redirection fallback
  if (!user) {
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
