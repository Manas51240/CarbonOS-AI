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
import { UserProfileService } from '@/services/UserProfileService';
import { decrypt, encrypt } from '@/utils/crypto';

interface ShellContentProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

function ShellContent({ children, isAuthenticated }: ShellContentProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname.startsWith('/auth');

  // Handle Storage prototype interception client-side only during hydration/mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as unknown as { __carbonosStorageOverridden?: boolean }).__carbonosStorageOverridden) {
      (window as unknown as { __carbonosStorageOverridden: boolean }).__carbonosStorageOverridden = true;

      const originalGetItem = Storage.prototype.getItem;
      const originalSetItem = Storage.prototype.setItem;

      Storage.prototype.getItem = function (key: string) {
        const value = originalGetItem.call(this, key);
        if (!value) return null;

        if (key.startsWith('carbonos_')) {
          const trimmed = value.trim();
          if (
            (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
            (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
            (trimmed.startsWith('"') && trimmed.endsWith('"'))
          ) {
            return value;
          }
          try {
            return decrypt(value) || value;
          } catch {
            return value;
          }
        }
        return value;
      };

      Storage.prototype.setItem = function (key: string, value: string) {
        if (key.startsWith('carbonos_')) {
          const trimmed = value.trim();
          const isPlaintext = (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
                              (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
                              (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
                              (!trimmed.includes('"') && trimmed.length < 20);
          if (isPlaintext) {
            originalSetItem.call(this, key, encrypt(value));
            return;
          }
        }
        originalSetItem.call(this, key, value);
      };
    }
  }, []);

  // Handle orphaned sessions (cookie exists but profile is missing/deleted, or storage cleared)
  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      UserProfileService.clearSessionCookie();
      router.replace('/auth/login');
    }
  }, [user, loading, isAuthPage, router]);

  // Auth pages (no Sidebar, full width) - render immediately to avoid loading flash
  if (isAuthPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  // Render full-page centered loader ONLY if we are loading AND don't have an active session cookie.
  // This avoids displaying skeleton sidebar elements prior to authorization checks and redirects.
  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Leaf className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground mt-4">Syncing environmental intelligence...</p>
        </div>
      </div>
    );
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

interface ClientLayoutShellProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export default function ClientLayoutShell({ children, isAuthenticated }: ClientLayoutShellProps) {
  return (
    <AuthProvider>
      <CarbonStoreProvider>
        <ShellContent isAuthenticated={isAuthenticated}>{children}</ShellContent>
      </CarbonStoreProvider>
    </AuthProvider>
  );
}
