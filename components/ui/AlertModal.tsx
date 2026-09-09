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
    <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#161513]/95 border border-[#B08A5A]/50 max-w-md w-full p-7 sm:p-8 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(176,138,90,0.15)] text-white relative animate-in zoom-in-95 duration-200 backdrop-blur-2xl rounded-[28px] overflow-hidden">
        {/* Top Gold Subtle Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B08A5A] to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-gold transition-colors p-2 rounded-full hover:bg-white/5 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with ViwanMark */}
        <div className="flex items-start space-x-4 rtl:space-x-reverse pt-2">
          <div className="w-12 h-12 border border-[#B08A5A]/40 bg-[#1e1e1e] flex items-center justify-center shrink-0 shadow-inner rounded-xl">
            <ViwanMark className="w-7 h-7" isDark={true} />
          </div>

          <div className="space-y-1.5 pr-6 rtl:pr-0 rtl:pl-6">
            <h3 className="font-cinzel text-base tracking-widest uppercase text-white font-semibold">
              {title}
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Button - Centered */}
        <div className="flex items-center justify-center pt-5 border-t border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#B08A5A] hover:bg-[#C59F6C] active:scale-[0.98] text-white text-xs font-montserrat font-semibold tracking-widest uppercase px-10 py-3 transition-all shadow-md rounded-xl cursor-pointer"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
