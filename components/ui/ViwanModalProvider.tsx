'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ViwanModal, ViwanModalOptions } from './ViwanModal';

interface ViwanModalContextType {
  showModal: (options: ViwanModalOptions) => void;
  showAlert: (message: string, title?: string) => Promise<void>;
  showNotification: (message: string, title?: string) => Promise<void>;
  showSuccess: (message: string, title?: string) => Promise<void>;
  showWarning: (message: string, title?: string) => Promise<void>;
  showError: (message: string, title?: string) => Promise<void>;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
  closeModal: () => void;
}

const ViwanModalContext = createContext<ViwanModalContextType | undefined>(undefined);

let globalShowModal: ((options: ViwanModalOptions) => void) | null = null;

export const ViwanModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalOptions, setModalOptions] = useState<ViwanModalOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showModal = (options: ViwanModalOptions) => {
    setModalOptions(options);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalOptions(null);
  };

  const showAlert = (message: string, title?: string): Promise<void> => {
    return new Promise((resolve) => {
      showModal({
        title,
        message,
        type: 'info',
        onConfirm: () => resolve(),
        onCancel: () => resolve(),
      });
    });
  };

  const showNotification = (message: string, title?: string): Promise<void> => {
    return new Promise((resolve) => {
      showModal({
        title,
        message,
        type: 'notification',
        onConfirm: () => resolve(),
        onCancel: () => resolve(),
      });
    });
  };

  const showSuccess = (message: string, title?: string): Promise<void> => {
    return new Promise((resolve) => {
      showModal({
        title,
        message,
        type: 'success',
        onConfirm: () => resolve(),
        onCancel: () => resolve(),
      });
    });
  };

  const showWarning = (message: string, title?: string): Promise<void> => {
    return new Promise((resolve) => {
      showModal({
        title,
        message,
        type: 'warning',
        onConfirm: () => resolve(),
        onCancel: () => resolve(),
      });
    });
  };

  const showError = (message: string, title?: string): Promise<void> => {
    return new Promise((resolve) => {
      showModal({
        title,
        message,
        type: 'error',
        onConfirm: () => resolve(),
        onCancel: () => resolve(),
      });
    });
  };

  const showConfirm = (message: string, title?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      showModal({
        title,
        message,
        type: 'confirm',
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  useEffect(() => {
    globalShowModal = showModal;

    // Gracefully override window.alert to render our architectural modal
    if (typeof window !== 'undefined') {
      const originalAlert = window.alert;
      window.alert = (msg?: any) => {
        const text = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2);
        const isNotification = text.includes('تنبيه') || text.includes('operational') || text.includes('إشعار');
        showModal({
          message: text,
          type: isNotification ? 'notification' : 'info',
        });
      };

      return () => {
        window.alert = originalAlert;
        globalShowModal = null;
      };
    }
  }, []);

  return (
    <ViwanModalContext.Provider
      value={{
        showModal,
        showAlert,
        showNotification,
        showSuccess,
        showWarning,
        showError,
        showConfirm,
        closeModal,
      }}
    >
      {children}
      <ViwanModal isOpen={isOpen} options={modalOptions} onClose={closeModal} />
    </ViwanModalContext.Provider>
  );
};

export const useViwanModal = () => {
  const context = useContext(ViwanModalContext);
  if (!context) {
    // Fallback if used outside provider
    return {
      showModal: (opts: ViwanModalOptions) => {
        if (globalShowModal) globalShowModal(opts);
      },
      showAlert: async (msg: string) => {
        if (globalShowModal) globalShowModal({ message: msg, type: 'info' });
      },
      showNotification: async (msg: string) => {
        if (globalShowModal) globalShowModal({ message: msg, type: 'notification' });
      },
      showSuccess: async (msg: string) => {
        if (globalShowModal) globalShowModal({ message: msg, type: 'success' });
      },
      showWarning: async (msg: string) => {
        if (globalShowModal) globalShowModal({ message: msg, type: 'warning' });
      },
      showError: async (msg: string) => {
        if (globalShowModal) globalShowModal({ message: msg, type: 'error' });
      },
      showConfirm: async (msg: string) => true,
      closeModal: () => {},
    };
  }
  return context;
};
