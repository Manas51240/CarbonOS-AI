'use client';

/**
 * CarbonOS AI - AI Sustainability Coach
 * Chat panel connecting to Gemini 2.5 Pro to provide context-aware
 * recommendations and custom reduction plans.
 */

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { askAiCoach, ChatMessage } from '@/services/gemini';
import { Bot, Send, Loader2, BookOpen, Trash2, ArrowRight } from 'lucide-react';

export default function CoachPage() {
  const { user } = useAuth();
  
  // Initial starting chat history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: `Hello ${user?.displayName || 'there'}! I am your CarbonOS AI Sustainability Coach, powered by Gemini 2.5 Pro. I have analyzed your carbon twin parameters. 

How can I help you today? You can ask me to outline a personalized reduction plan, break down carbon calculations, or explain the ecological impact of specific activities.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Handle message send
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      role: 'user',
      content: textToSend,
      timestamp: userTime
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsSending(true);

    // Context from user's current carbon twin
    const userTwinContext = user 
      ? `User's current profile: Diet is ${user.carbonTwin.diet}, vehicle type is ${user.carbonTwin.transportMode}, daily commute is ${user.carbonTwin.commuteDistance} miles, home energy is ${user.carbonTwin.homeEnergy}.` 
      : '';

    try {
      const reply = await askAiCoach(messages, textToSend, userTwinContext);
      const coachTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setMessages(prev => [...prev, {
        role: 'model',
        content: reply,
        timestamp: coachTime
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'model',
        content: 'I apologize, I encountered a communication error with the Vertex AI service. Please verify your connection or try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    { label: 'Create 3-Step Reduction Plan', value: 'Create a personalized 3-Step carbon reduction plan for me.' },
    { label: 'Explain dietary carbon impact', value: 'Why does diet have such a large carbon footprint? Compare meat vs vegan.' },
    { label: 'EV vs public transit comparison', value: 'Which saves more carbon: switching to a hybrid/EV or using train/bus commutes?' },
    { label: 'Uncover hidden digital footprint', value: 'Explain digital carbon footprints. How do emails and video streaming emit carbon?' }
  ];

  return (
    <div className="flex flex-col gap-8 flex-1 h-[calc(100vh-6rem)] fade-in-view">
      <header className="border-b border-muted/50 pb-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Sustainability Coach</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your context-aware ecological assistant powered by Gemini 2.5 Pro.
          </p>
        </div>
        
        <button
          onClick={() => {
            setMessages([
              {
                role: 'model',
                content: `Chat history cleared. How else can I assist you with your carbon footprint optimization today, ${user?.displayName}?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive px-3.5 py-2 rounded-xl bg-secondary/50 border border-muted hover:bg-destructive/10 hover:border-destructive/20 transition-all duration-300"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </header>

      {/* Main Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
        
        {/* Left Suggestions Pane */}
        <div className="flex flex-col gap-4 lg:col-span-1 shrink-0">
          <div className="glass-card rounded-3xl p-5 border border-muted/80 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Suggested Queries</span>
            </h3>
            
            <div className="flex flex-col gap-2.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.value)}
                  className="p-3 text-left rounded-xl bg-secondary/40 hover:bg-primary/10 border border-muted/40 hover:border-primary/20 hover:text-foreground text-xs font-medium text-muted-foreground transition-all duration-300 flex items-start gap-2 group cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 mt-0.5 shrink-0" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="glass-card rounded-3xl p-5 border border-muted/80 text-xs text-muted-foreground leading-relaxed">
            💡 <span className="font-bold text-foreground">AI Context Integration</span>: The coach dynamically accesses your current simulated Carbon Twin metrics to customize its carbon reduction strategies and savings calculations.
          </div>
        </div>

        {/* Right Chat Dialog Box */}
        <div className="lg:col-span-3 glass-card rounded-3xl border border-muted/80 flex flex-col min-h-0 overflow-hidden shadow-sm">
          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {messages.map((msg, idx) => {
              const isAi = msg.role === 'model';
              return (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-[85%] ${isAi ? 'self-start' : 'self-end flex-row-reverse'}`}
                >
                  {/* Icon Avatar */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isAi 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gradient-to-tr from-accent to-emerald-500 text-background font-bold'
                  }`}>
                    {isAi ? <Bot className="w-5 h-5" /> : user?.displayName.charAt(0)}
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
            })}
            
            {/* AI typing bubble */}
            {isSending && (
              <div className="flex gap-3 self-start max-w-[85%]">
                <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-secondary/60 text-muted-foreground border border-muted/40 rounded-tl-none flex items-center gap-1 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span>Coach is analyzing carbon statistics...</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Form input footer */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
            className="p-4 border-t border-muted/50 bg-secondary/20 flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Ask about carbon reduction, diet changes, transport tips..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isSending}
              aria-label="Ask sustainability coach a question"
              className="flex-1 px-4 py-3 text-xs rounded-xl bg-background border border-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 font-semibold"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              className="w-11 h-11 rounded-xl bg-primary text-primary-foreground hover:shadow-md hover:shadow-primary/20 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
