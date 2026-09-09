'use client';

import React, { useEffect } from 'react';
import { ViwanMark } from '@/components/ui/Icons';
import { CheckCircle, AlertTriangle, Info, Bell, X, AlertCircle } from 'lucide-react';

export type ViwanModalType = 'info' | 'success' | 'warning' | 'error' | 'confirm' | 'notification';

export interface ViwanModalOptions {
  title?: string;
  message: string;
  type?: ViwanModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ViwanModalProps {
  isOpen: boolean;
  options: ViwanModalOptions | null;
  onClose: () => void;
}

export const ViwanModal: React.FC<ViwanModalProps> = ({ isOpen, options, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (options?.onCancel) {
          options.onCancel();
        }
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, options, onClose]);

  if (!isOpen || !options) return null;

  const {
    title,
    message,
    type = 'info',
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
  } = options;

  const isRtl = /[\u0600-\u06FF]/.test(message || title || '');

  const getDefaultTitle = () => {
    if (title) return title;
    switch (type) {
      case 'notification':
        return isRtl ? 'تنبيه النظام' : 'System Notification';
      case 'success':
        return isRtl ? 'تم بنجاح' : 'Success';
      case 'warning':
        return isRtl ? 'تحذير' : 'Warning';
      case 'error':
        return isRtl ? 'تنبيه خطأ' : 'Error';
      case 'confirm':
        return isRtl ? 'تأكيد الإجراء' : 'Confirmation';
      case 'info':
      default:
        return isRtl ? 'إشعار VIWAN' : 'VIWAN Notice';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'notification':
        return <Bell className="w-6 h-6 text-gold animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-400" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-rose-400" />;
      case 'confirm':
        return <ViwanMark className="w-6 h-6" isDark={true} />;
      case 'info':
      default:
        return <Info className="w-6 h-6 text-gold" />;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      dir={isRtl ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      onClick={handleCancel}
    >
      <div
        className="relative w-full max-w-lg bg-[#1a1917]/90 backdrop-blur-2xl text-[#FAF6EE] border border-white/20 rounded-[32px] p-7 sm:p-9 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Viwan Watermark behind content matching Image 1 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.07]">
          <ViwanMark className="w-56 h-56 text-white" isDark={true} />
        </div>

        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-5 end-5 text-stone-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Centered Icon */}
        <div className="flex justify-center pt-1 relative z-10">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gold/10 border border-gold/30">
            {getIcon()}
          </div>
        </div>

        {/* Header Title & Subtitle Centered */}
        <div className="space-y-1.5 text-center relative z-10">
          <h3 className="font-cinzel text-lg sm:text-xl font-bold tracking-wide text-white uppercase">
            {getDefaultTitle()}
          </h3>
          <p className="text-[10px] tracking-[0.25em] text-gold uppercase font-montserrat">
            VIWAN ARCHITECTURE
          </p>
        </div>

        {/* Message Content */}
        <div className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed whitespace-pre-line text-center max-w-sm mx-auto relative z-10">
          {message}
        </div>

        {/* Footer Actions Centered (Pill Buttons) */}
        <div className="flex items-center justify-center gap-3 pt-3 relative z-10">
          {type === 'confirm' && (
            <button
              onClick={handleCancel}
              className="border border-white/20 bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white text-xs sm:text-sm font-medium tracking-wider uppercase px-7 sm:px-9 py-3 rounded-full transition-all cursor-pointer min-w-[110px]"
            >
              {cancelText || (isRtl ? 'إلغاء' : 'Cancel')}
            </button>
          )}

          <button
            onClick={handleConfirm}
            autoFocus
            className="bg-gradient-to-r from-[#967448] to-[#b38e5d] hover:brightness-110 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase px-8 sm:px-10 py-3 rounded-full transition-all shadow-lg shadow-gold/25 active:scale-95 flex items-center justify-center min-w-[130px] cursor-pointer"
          >
            {confirmText || (type === 'confirm' ? (isRtl ? 'تأكيد' : 'Confirm') : (isRtl ? 'حسناً' : 'OK'))}
          </button>
        </div>
      </div>
    </div>
  );
};
