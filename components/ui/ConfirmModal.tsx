'use client';

import React from 'react';
import { ViwanMark } from './Icons';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onCancel}
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
          onClick={onCancel}
          className="absolute top-5 end-5 text-stone-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Centered Icon */}
        <div className="flex justify-center pt-1 relative z-10">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gold/10 border border-gold/30">
            {isDestructive ? (
              <AlertTriangle className="w-8 h-8 text-gold" />
            ) : (
              <ViwanMark className="w-8 h-8 text-gold" isDark={true} />
            )}
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

        {/* Action Buttons Centered (Pill rounded-full) */}
        <div className="flex items-center justify-center gap-3 pt-3 relative z-10">
          <button
            type="button"
            onClick={onCancel}
            className="px-7 sm:px-9 py-3 border border-white/20 bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-medium tracking-wider text-stone-200 hover:text-white transition-all rounded-full cursor-pointer min-w-[110px]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-8 sm:px-10 py-3 text-xs sm:text-sm font-semibold tracking-wider transition-all shadow-lg active:scale-95 rounded-full cursor-pointer min-w-[130px] ${
              isDestructive
                ? 'bg-gradient-to-r from-[#967448] to-[#b38e5d] hover:brightness-110 text-white shadow-gold/25'
                : 'bg-gradient-to-r from-[#967448] to-[#b38e5d] hover:brightness-110 text-white shadow-gold/25'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
