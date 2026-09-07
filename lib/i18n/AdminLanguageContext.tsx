'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminLocale, adminTranslations } from './adminTranslations';

interface AdminLanguageContextType {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  toggleLocale: () => void;
  t: typeof adminTranslations['en'];
  isRtl: boolean;
}

const AdminLanguageContext = createContext<AdminLanguageContextType>({
  locale: 'ar',
  setLocale: () => {},
  toggleLocale: () => {},
  t: adminTranslations['ar'],
  isRtl: true,
});

export const AdminLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<AdminLocale>('ar');

  useEffect(() => {
    const saved = localStorage.getItem('viwan_admin_locale') as AdminLocale;
    if (saved === 'en' || saved === 'ar') {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: AdminLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('viwan_admin_locale', newLocale);
  };

  const toggleLocale = () => {
    const next = locale === 'ar' ? 'en' : 'ar';
    setLocale(next);
  };

  const isRtl = locale === 'ar';
  const t = adminTranslations[locale];

  return (
    <AdminLanguageContext.Provider value={{ locale, setLocale, toggleLocale, t, isRtl }}>
      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-cairo' : 'font-montserrat'}>
        {children}
      </div>
    </AdminLanguageContext.Provider>
  );
};

export const useAdminLang = () => useContext(AdminLanguageContext);
