'use client';

/**
 * CarbonOS AI - Carbon Rewards Marketplace
 * Redeem earned Green Points for tree donations, sustainable products,
 * or eco-friendly public transit passes.
 */

import { useState } from 'react';
import { useCarbonStore } from '@/hooks/useCarbonStore';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingBag, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import ParadigmBanner from '@/components/shared/ParadigmBanner';

export default function MarketplacePage() {
  const { user } = useAuth();
  const { rewards, purchasedRewards, redeemStoreReward } = useCarbonStore();
  const [activeCategory, setActiveCategory] = useState<'all' | 'donation' | 'product' | 'service'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const handleRedeem = async (rewardId: string) => {
    setRedeemingId(rewardId);
    setMessage(null);
    
    try {
      const res = await redeemStoreReward(rewardId);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred during redemption' });
    } finally {
      setRedeemingId(null);
      // Clear message after 4 seconds
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const filteredRewards = rewards.filter(r => activeCategory === 'all' || r.category === activeCategory);

  return (
    <div className="flex flex-col gap-8 fade-in-view">
      <ParadigmBanner />
      <header className="border-b border-muted/50 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Rewards Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Spend your Green Points to plant trees, sponsor carbon removal, or buy zero-waste gear.
          </p>
        </div>
        
        {/* Points display card */}
        <div className="flex items-center gap-3 bg-primary/10 border border-primary/25 rounded-2xl px-5 py-3 shadow-sm select-none">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-background font-black">
            🪙
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Available Balance</span>
            <span className="text-sm font-extrabold text-foreground">{user?.greenPoints} Green Points</span>
          </div>
        </div>
      </header>

      {/* Message feedback container */}
      <div aria-live="polite" id="marketplace-message-container" className="w-full">
        {message && (
          <div className={`p-4 rounded-xl border text-xs font-semibold shadow-sm flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}>
            {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* Categories Menu */}
      <div className="flex flex-wrap gap-2.5">
        {(['all', 'donation', 'product', 'service'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
              activeCategory === cat
                ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                : 'bg-secondary/40 border-muted hover:bg-secondary text-muted-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => {
          const isRedeemed = purchasedRewards.includes(reward.id);
          const canAfford = (user?.greenPoints || 0) >= reward.costPoints;

          return (
            <div
              key={reward.id}
              className={`glass-card rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 relative ${
                isRedeemed ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-muted/80'
              }`}
            >
              {/* Image / Icon Holder */}
              <div>
                <div className="w-14 h-14 rounded-2xl bg-secondary/80 flex items-center justify-center text-3xl mb-4 border shadow-sm">
                  {reward.image}
                </div>
                
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">{reward.provider}</span>
                  <span className="text-muted-foreground text-[8px]">•</span>
                  <span className="text-[9px] font-bold text-primary uppercase">{reward.category}</span>
                </div>
                
                <h3 className="font-extrabold text-sm mb-1">{reward.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">{reward.description}</p>
              </div>

              {/* Price & Action Button */}
              <div className="border-t border-muted/50 pt-4 mt-auto flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Cost</span>
                  <span className="text-sm font-black text-foreground">{reward.costPoints} pts</span>
                </div>

                {isRedeemed ? (
                  <span className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-xs flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Redeemed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleRedeem(reward.id)}
                    disabled={!canAfford || redeemingId === reward.id}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${
                      canAfford
                        ? 'bg-primary text-primary-foreground hover:shadow-md hover:shadow-primary/20'
                        : 'bg-secondary text-muted-foreground border border-muted'
                    }`}
                  >
                    {redeemingId === reward.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ShoppingBag className="w-3.5 h-3.5" />
                    )}
                    <span>{canAfford ? 'Redeem Item' : 'Need Points'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
