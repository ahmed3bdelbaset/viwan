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
        className="relative w-full max-w-md bg-[#161616]/95 backdrop-blur-2xl text-[#FAF6EE] border border-gold/40 rounded-[28px] shadow-2xl shadow-black/80 overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luxury Gold Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-gold/30 via-gold to-gold/30" />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-stone-800/80">
          <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-[#0D0D0D] border border-gold/30 flex items-center justify-center shrink-0">
              {getIcon()}
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold tracking-wider text-white uppercase leading-snug">
                {getDefaultTitle()}
              </h3>
              <p className="text-[10px] tracking-[0.2em] text-gold uppercase font-montserrat mt-0.5">
                VIWAN ARCHITECTURE
              </p>
            </div>
          </div>

          <button
            onClick={handleCancel}
            className="text-stone-500 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Content */}
        <div className="px-6 py-6 text-sm text-stone-300 font-light leading-relaxed whitespace-pre-line text-center sm:text-start">
          {message}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0F0F0F]/80 border-t border-stone-800/80 flex items-center justify-center space-x-3 rtl:space-x-reverse">
          {type === 'confirm' && (
            <button
              onClick={handleCancel}
              className="border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white text-xs font-semibold tracking-wider uppercase px-6 py-2.5 rounded-full transition-all"
            >
              {cancelText || (isRtl ? 'إلغاء' : 'Cancel')}
            </button>
          )}

          <button
            onClick={handleConfirm}
            autoFocus
            className="bg-gold hover:bg-[#967448] text-white text-xs font-semibold tracking-wider uppercase px-8 py-2.5 rounded-full transition-all shadow-md active:scale-95 flex items-center justify-center min-w-[100px]"
          >
            {confirmText || (type === 'confirm' ? (isRtl ? 'تأكيد' : 'Confirm') : (isRtl ? 'حسناً' : 'OK'))}
          </button>
        </div>
      </div>
    </div>
  );
};
