'use client';

import React from 'react';
import { ViwanMark } from './Icons';
import { X, CheckCircle2, Sparkles } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  buttonLabel?: string;
  onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  title = 'VIWAN ARCHITECTURE',
  message,
  buttonLabel = 'CONFIRM',
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#1a1917]/90 backdrop-blur-2xl border border-white/20 rounded-[32px] p-7 sm:p-9 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-white overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Viwan Watermark behind content matching Image 1 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.07]">
          <ViwanMark className="w-56 h-56 text-white" isDark={true} />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 end-5 text-stone-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Centered Icon */}
        <div className="flex justify-center pt-1 relative z-10">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gold/10 border border-gold/30">
            <ViwanMark className="w-8 h-8 text-gold" isDark={true} />
          </div>
        </div>

        {/* Title & Message Centered */}
        <div className="space-y-2 text-center relative z-10">
          <h3 className="font-cinzel text-lg sm:text-xl font-bold tracking-wide text-white uppercase">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-sm mx-auto">
            {message}
          </p>
        </div>

        {/* Action Button - Centered (Pill rounded-full) */}
        <div className="flex items-center justify-center pt-3 relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-10 py-3 bg-gradient-to-r from-[#967448] to-[#b38e5d] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold tracking-wider transition-all shadow-lg shadow-gold/25 rounded-full cursor-pointer min-w-[140px]"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
