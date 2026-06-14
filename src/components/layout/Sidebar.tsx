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
import {
  LayoutDashboard,
  Bot,
  ScanLine,
  PlaneTakeoff,
  Smartphone,
  Trophy,
  ShoppingBag,
  Bell,
  LogOut,
  Sun,
  Moon,
  Leaf,
  Layers,
  Sparkles
} from 'lucide-react';

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

  if (!user) return null;

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
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 animate-float">
          <Leaf className="w-6 h-6 text-background" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-emerald-600 bg-clip-text text-transparent">
            CarbonOS <span className="font-light">AI</span>
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
            Sustainable Intelligence
          </p>
        </div>
      </div>

      {/* User Stats Card */}
      <div className="glass-card rounded-2xl p-4 mb-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full filter blur-xl -mr-6 -mt-6 group-hover:bg-primary/20 transition-all duration-500" />
        
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-background shadow-md">
            {user.displayName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold truncate">{user.displayName}</h2>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs text-muted-foreground font-medium">
                {user.greenPoints} Green Points
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-muted/50 text-center">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Eco Score</p>
            <p className="text-lg font-bold text-primary">{user.sustainabilityScore}/100</p>
          </div>
          <div className="border-l border-muted/50">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">CO₂ Offset</p>
            <p className="text-lg font-bold text-accent">{Math.round(user.co2SavedKg)} kg</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto px-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
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
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all duration-300 w-full text-left"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-5 h-5 text-amber-500" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 text-indigo-500" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300 w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
