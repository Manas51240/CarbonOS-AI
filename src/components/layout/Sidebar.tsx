'use client';

/**
 * CarbonOS AI - Navigation Sidebar Layout
 * Premium glassmorphic drawer containing navigation links, active badges,
 * real-time score display, and dark/light theme triggers.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCarbonStore } from '@/hooks/useCarbonStore';
import UserProfileCard from './UserProfileCard';
import BrandHeader from './BrandHeader';
import { LayoutDashboard, Bot, ScanLine, PlaneTakeoff, Smartphone, Trophy, ShoppingBag, Bell, LogOut, Sun, Moon, Layers } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { alerts } = useCarbonStore();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Read theme on load
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || 
                  localStorage.getItem('carbonos_theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('carbonos_theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('carbonos_theme', 'dark');
      setTheme('dark');
    }
  };

  // Removed null-check to allow static shell to render during client-side hydration

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/twin', label: 'AI Carbon Twin', icon: Layers, highlight: true },
    { href: '/coach', label: 'Sustainability Coach', icon: Bot },
    { href: '/receipts', label: 'Receipt Scanner', icon: ScanLine },
    { href: '/travel', label: 'Travel Analyzer', icon: PlaneTakeoff },
    { href: '/digital', label: 'Digital Footprint', icon: Smartphone },
    { href: '/community', label: 'Leaderboard & Goals', icon: Trophy },
    { href: '/marketplace', label: 'Rewards Shop', icon: ShoppingBag },
    { href: '/alerts', label: 'Eco Alerts', icon: Bell, badgeCount: alerts.length },
  ];

  return (
    <aside className="w-80 h-screen fixed left-0 top-0 glass-panel border-r flex flex-col p-6 z-40">
      {/* Brand Header */}
      <BrandHeader />

      {/* User Stats Card */}
      <UserProfileCard user={user} />

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto px-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              <Icon aria-hidden="true" className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                isActive ? 'text-primary-foreground' : link.highlight ? 'text-accent' : 'text-muted-foreground'
              }`} />
              
              <span className="flex-1 truncate">{link.label}</span>

              {link.badgeCount && link.badgeCount > 0 ? (
                <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {link.badgeCount}
                </span>
              ) : null}

              {link.highlight && !isActive ? (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent animate-ping" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Footer Settings & Logout */}
      <div className="mt-auto pt-4 border-t border-muted flex flex-col gap-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all duration-300 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {theme === 'dark' ? (
            <>
              <Sun aria-hidden="true" className="w-5 h-5 text-amber-500" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon aria-hidden="true" className="w-5 h-5 text-indigo-500" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {user && (
          <button
            onClick={logout}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
          >
            <LogOut aria-hidden="true" className="w-5 h-5" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}
