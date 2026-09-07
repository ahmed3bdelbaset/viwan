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
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#141414]/95 border border-stone-700 max-w-md w-full p-8 sm:p-9 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(176,138,90,0.1)] text-white relative animate-in zoom-in-95 duration-200 backdrop-blur-2xl">
        {/* Top Accent Line */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] ${
            isDestructive
              ? 'bg-gradient-to-r from-transparent via-red-600 to-transparent'
              : 'bg-gradient-to-r from-transparent via-[#B08A5A] to-transparent'
          }`}
        />

        {/* Close Icon */}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 text-stone-400 hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start space-x-4 rtl:space-x-reverse pt-2">
          <div className="w-12 h-12 border border-stone-700 bg-[#1e1e1e] flex items-center justify-center shrink-0 shadow-inner">
            {isDestructive ? (
              <AlertTriangle className="w-6 h-6 text-red-500" />
            ) : (
              <ViwanMark className="w-7 h-7" isDark={true} />
            )}
          </div>

          <div className="space-y-1.5 pr-6 rtl:pr-0 rtl:pl-6">
            <h3 className="font-cinzel text-base tracking-wider uppercase text-white font-semibold">
              {title}
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-5 border-t border-stone-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-stone-700 hover:border-stone-500 text-xs font-montserrat tracking-widest uppercase text-stone-300 hover:text-white transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-7 py-2.5 text-xs font-montserrat font-semibold tracking-widest uppercase transition-all shadow-md active:scale-[0.98] ${
              isDestructive
                ? 'bg-red-700 hover:bg-red-600 text-white'
                : 'bg-gold hover:bg-gold-light text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
