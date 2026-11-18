import React from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#24150F] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#974729]/30 animate-fade-in max-w-md">
      <div className="w-8 h-8 rounded-full bg-[#974729] text-white flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4" />
      </div>
      <p className="text-xs sm:text-sm font-medium leading-tight flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-white/60 hover:text-white transition-colors p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
