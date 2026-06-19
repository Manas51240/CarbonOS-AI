'use client';

/**
 * CarbonOS AI - Login & Registration Page
 * Premium user onboarding featuring animated background gradients,
 * card views, tab switches, and input validations.
 */

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginSchema } from '@/validators';
import { Leaf, Mail, User, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Zod schema validation
    const result = LoginSchema.safeParse({
      email,
      displayName: isSignUp ? name : undefined
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoadingState(true);
    try {
      if (isSignUp) {
        await signup(email, name);
      } else {
        await login(email);
      }
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setLoadingState(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-background text-foreground relative overflow-hidden p-4">
      {/* Premium ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-muted/80 shadow-2xl relative z-10 fade-in-view">
        {/* Brand Logo */}
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 animate-float">
            <Leaf className="w-7 h-7 text-background" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-primary via-accent to-emerald-600 bg-clip-text text-transparent">
              CarbonOS <span className="font-light">AI</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Eco-sustainability intelligence console
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div role="tablist" aria-label="Authentication Options" className="flex bg-secondary/60 rounded-xl p-1 mb-6 border border-muted/50">
          <button
            role="tab"
            aria-selected={!isSignUp}
            onClick={() => { setIsSignUp(false); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              !isSignUp ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Log In
          </button>
          <button
            role="tab"
            aria-selected={isSignUp}
            onClick={() => { setIsSignUp(true); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              isSignUp ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name-input" className="text-xs font-bold text-muted-foreground">Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="name-input"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/40 border border-muted focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold outline-none transition-all duration-300"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email-input" className="text-xs font-bold text-muted-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="email-input"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/40 border border-muted focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Error Message */}
          <div aria-live="assertive" id="error-message-container" className="mt-1">
            {error && (
              <div className="text-xs font-semibold text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20">
                {error}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loadingState}
            className="w-full py-3.5 mt-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            {loadingState ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isSignUp ? 'Generate Carbon Profile' : 'Access Console'}</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Notice */}
        <div className="mt-6 text-[10px] text-center text-muted-foreground bg-secondary/30 p-2.5 rounded-lg border border-muted/40 font-semibold">
          💡 <span className="font-bold">Sandbox Mode Active</span>: Enter any email to instantly bootstrap an interactive sustainability account powered by LocalStorage!
        </div>
      </div>
    </div>
  );
}
