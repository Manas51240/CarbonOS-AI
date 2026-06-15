'use client';

import { Bot } from 'lucide-react';
import { ChatMessage } from '@/types';

interface ChatBubbleProps {
  msg: ChatMessage;
  displayName: string;
}

/**
 * Presentational component for displaying individual chat messages in the coach pane.
 */
export default function ChatBubble({ msg, displayName }: ChatBubbleProps) {
  const isAi = msg.role === 'model';
  
  return (
    <div className={`flex gap-3 max-w-[85%] ${isAi ? 'self-start' : 'self-end flex-row-reverse'}`}>
      {/* Icon Avatar */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
        isAi 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-gradient-to-tr from-accent to-emerald-500 text-background font-bold'
      }`}>
        {isAi ? <Bot className="w-5 h-5" /> : displayName.charAt(0)}
      </div>

      {/* Bubble content */}
      <div className="flex flex-col gap-1">
        <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed font-medium ${
          isAi
            ? 'bg-secondary/60 text-foreground border border-muted/40 rounded-tl-none whitespace-pre-line'
            : 'bg-primary text-primary-foreground rounded-tr-none'
        }`}>
          {msg.content}
        </div>
        <span className={`text-[9px] text-muted-foreground font-semibold px-1 ${
          isAi ? 'self-start' : 'self-end'
        }`}>
          {msg.timestamp}
        </span>
      </div>
    </div>
  );
}
