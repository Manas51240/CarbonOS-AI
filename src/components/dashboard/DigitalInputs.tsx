'use client';

import { Smartphone, Mail, Tv, Video, Database } from 'lucide-react';
import RangeInputField from './RangeInputField';

interface DigitalInputsProps {
  emails: string;
  setEmails: (val: string) => void;
  streaming: string;
  setStreaming: (val: string) => void;
  calls: string;
  setCalls: (val: string) => void;
  storage: string;
  setStorage: (val: string) => void;
  emissions: number;
  isLogged: boolean;
  loading: boolean;
  onLogDigital: () => void;
  onResetLogged: () => void;
}

export default function DigitalInputs({
  emails,
  setEmails,
  streaming,
  setStreaming,
  calls,
  setCalls,
  storage,
  setStorage,
  emissions,
  isLogged,
  loading,
  onLogDigital,
  onResetLogged
}: DigitalInputsProps) {
  return (
    <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-muted/80 flex flex-col justify-between bg-background">
      <div>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">Daily Usage Estimates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RangeInputField
            id="emails-input"
            label="Emails Exchanged"
            value={emails}
            onChange={(val) => { setEmails(val); onResetLogged(); }}
            min={0}
            max={150}
            unit="emails"
            icon={<Mail className="w-4 h-4 text-primary" />}
          />

          <RangeInputField
            id="streaming-input"
            label="Video Streaming (HD)"
            value={streaming}
            onChange={(val) => { setStreaming(val); onResetLogged(); }}
            min={0}
            max={12}
            step={0.5}
            unit="hours"
            icon={<Tv className="w-4 h-4 text-purple-500" />}
          />

          <RangeInputField
            id="calls-input"
            label="Video Conferences"
            value={calls}
            onChange={(val) => { setCalls(val); onResetLogged(); }}
            min={0}
            max={8}
            step={0.5}
            unit="hours"
            icon={<Video className="w-4 h-4 text-blue-500" />}
          />

          <RangeInputField
            id="storage-input"
            label="Cloud Backups size"
            value={storage}
            onChange={(val) => { setStorage(val); onResetLogged(); }}
            min={0}
            max={200}
            unit="GB"
            icon={<Database className="w-4 h-4 text-orange-500" />}
          />
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-muted/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
          <Smartphone className="w-4 h-4 text-primary" />
          <span>Network transmission calculations applied.</span>
        </span>

        <button
          onClick={onLogDigital}
          disabled={emissions <= 0 || loading || isLogged}
          className={`px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${
            isLogged
              ? 'bg-accent text-accent-foreground shadow-accent/20'
              : 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20'
          }`}
        >
          {isLogged ? 'Log Saved!' : 'Log Digital Output'}
        </button>
      </div>
    </div>
  );
}
