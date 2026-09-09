'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ViwanMark } from '@/components/ui/Icons';
import { AuthService } from '@/lib/auth';
import { AdminUser } from '@/lib/types';
import { AdminLanguageProvider, useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import { ViwanModalProvider, useViwanModal } from '@/components/ui/ViwanModalProvider';
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Layers,
  FileText,
  Building,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Globe,
  Users,
  Images,
  MessageSquare,
  UserCheck
} from 'lucide-react';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasOpenModal, setHasOpenModal] = useState(false);

  const { locale, toggleLocale, t, isRtl } = useAdminLang();

  // If on login/forgot-password/reset-password pages, render children directly without admin chrome
  const isPublicAuthPage =
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/admin/forgot-password') ||
    pathname.startsWith('/admin/reset-password');

  useEffect(() => {
    if (!isPublicAuthPage) {
      if (!AuthService.isAuthenticated()) {
        router.push('/portal-vault-vw792');
      } else {
        setIsCheckingAuth(false);
      }
    } else {
      setIsCheckingAuth(false);
    }
  }, [pathname, isPublicAuthPage, router]);

  // Reactive listener to auto-hide Navbar when ANY modal/dialog is open
  useEffect(() => {
    const checkModal = () => {
      const dialog = document.querySelector('[role="dialog"]');
      setHasOpenModal(Boolean(dialog));
    };

    checkModal();
    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  if (isPublicAuthPage) {
    return <>{children}</>;
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center text-gold font-cinzel text-sm tracking-widest uppercase">
        {isRtl ? 'جاري التحقق من صلاحيات الجلسة...' : 'VERIFYING SESSION CREDENTIALS...'}
      </div>
    );
  }

  const navItems = [
    { label: t.sidebar.dashboard, href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: t.sidebar.projects, href: '/admin/projects', icon: <FolderKanban className="w-4 h-4" /> },
    { label: t.sidebar.services, href: '/admin/services', icon: <Briefcase className="w-4 h-4" /> },
    { label: (t.sidebar as any).media || (isRtl ? 'إدارة صور وهيدرز الموقع' : 'SITE IMAGES & HEROES'), href: '/admin/media', icon: <Images className="w-4 h-4" /> },
    { label: isRtl ? 'إدارة الوظائف والكفاءات' : 'CAREERS & JOBS', href: '/admin/jobs', icon: <UserCheck className="w-4 h-4" /> },
    { label: t.sidebar.companyInfo, href: '/admin/settings', icon: <Building className="w-4 h-4" /> },
    { label: t.sidebar.users, href: '/admin/users', icon: <Users className="w-4 h-4" /> },
  ];

  const handleLogout = () => {
    AuthService.logout();
    router.push('/portal-vault-vw792');
  };

  const getPageTitle = () => {
    if (pathname === '/admin') return t.sidebar.dashboard || (isRtl ? 'لوحة التحكم' : 'Dashboard');
    if (pathname.startsWith('/admin/projects')) return t.sidebar.projects || (isRtl ? 'المشاريع المعمارية' : 'Projects');
    if (pathname.startsWith('/admin/services')) return t.sidebar.services || (isRtl ? 'الخدمات والتخصصات' : 'Services');
    if (pathname.startsWith('/admin/media')) return isRtl ? 'إدارة صور وهيدرز الموقع' : 'Site Media';
    if (pathname.startsWith('/admin/jobs')) return isRtl ? 'إدارة الوظائف والكفاءات' : 'Careers & Jobs';
    if (pathname.startsWith('/admin/settings')) return t.sidebar.companyInfo || (isRtl ? 'الاستوديو والتواصل' : 'Studio Settings');
    if (pathname.startsWith('/admin/users')) return t.sidebar.users || (isRtl ? 'فريق العمل والمستخدمين' : 'Admin Team');
    return t.header.title || (isRtl ? 'لوحة التحكم' : 'Control Panel');
  };

  return (
    <div className="min-h-screen bg-transparent flex relative">
      {/* ========================================================================= */}
      {/* 0. RESPONSIVE NATURE & TREES BACKGROUND WITH ELEGANT BLUR */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none -z-30 overflow-hidden select-none">
        <img
          src="/images/service-landscape-design.jpg"
          alt="Viwan Architectural Garden Background"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Frosted translucent wash for high contrast & readability on desktop and mobile */}
        <div className="absolute inset-0 backdrop-blur-[6px] bg-[#FAF6EE]/85 dark:bg-[#121110]/90" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TRANSLUCENT WHITE / GLASS SIDEBAR */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 z-50 w-64 bg-white/85 dark:bg-[#181716]/85 backdrop-blur-2xl text-charcoal dark:text-white flex flex-col justify-between border-stone-200/70 dark:border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-transform duration-300 ${
          isRtl ? 'right-0 border-l' : 'left-0 border-r'
        } ${
          sidebarOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-stone-200/60 dark:border-white/10 flex items-center justify-between">
          <Link href="/admin" dir="ltr" className="flex items-center space-x-3.5 group">
            <ViwanMark className="w-8 h-8 text-gold group-hover:scale-105 transition-transform" isDark={false} />
            <div className="text-left">
              <div className="font-cinzel text-lg font-bold tracking-widest text-charcoal dark:text-white">
                {t.sidebar.brand}
              </div>
              <div className="text-[9px] tracking-[0.2em] text-gold uppercase font-montserrat -mt-0.5">
                {t.sidebar.subtitle}
              </div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-stone-400 hover:text-charcoal dark:hover:text-white p-1 rounded-full hover:bg-black/5"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Nav Items */}
        <nav className="p-4 space-y-1.5 flex-grow overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-xs font-montserrat tracking-widest uppercase rounded-2xl transition-all ${
                  active
                    ? 'bg-charcoal text-white font-semibold shadow-md border border-charcoal/80'
                    : 'text-stone-600 dark:text-stone-300 hover:text-charcoal dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                <span className={active ? 'text-gold' : 'text-stone-400 dark:text-stone-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Nav: Settings & Logout */}
        <div className="p-4 border-t border-stone-200/60 dark:border-white/10 space-y-1">
          <Link
            href="/admin/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-2.5 text-xs text-stone-600 dark:text-stone-300 hover:bg-black/[0.04] rounded-2xl transition-colors"
          >
            <Settings className="w-4 h-4 text-stone-400" />
            <span>{isRtl ? 'الإعدادات' : 'SETTINGS'}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-2.5 text-xs text-stone-600 dark:text-stone-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl transition-colors text-left rtl:text-right cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-stone-400" />
            <span>{t.sidebar.logout}</span>
          </button>

          <div className="pt-3 border-t border-stone-200/50 dark:border-white/10 px-4">
            <Link
              href="/"
              target="_blank"
              className="text-[10px] text-gold hover:underline flex items-center space-x-1.5 rtl:space-x-reverse font-semibold"
            >
              <span>{t.sidebar.viewLiveSite}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT WRAPPER */}
      {/* ========================================================================= */}
      <div className={`flex-1 flex flex-col min-w-0 ${isRtl ? 'lg:pr-64' : 'lg:pl-64'}`}>
        {/* Luxury Top Bar Curtain (Matches platform's dark gradient & hides during modals) */}
        <header
          className={`admin-navbar h-20 bg-gradient-to-b from-[#141312]/95 via-[#181716]/85 to-[#1c1a17]/75 backdrop-blur-xl border-b border-white/10 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 ${
            hasOpenModal ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
          }`}
        >
          {/* Start: Hamburger & Current Page Title */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full text-white/80 hover:text-gold hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <h1 className="font-cinzel text-sm sm:text-base font-semibold text-white tracking-wide uppercase">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Absolute Center: Company Logo (VIWAN) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2.5 rtl:space-x-reverse select-none">
            <Link href="/admin" className="flex items-center space-x-2.5 rtl:space-x-reverse group">
              <ViwanMark className="w-7 h-7 text-gold transition-transform group-hover:scale-105" isDark={true} />
              <span className="font-cinzel text-base sm:text-lg font-bold tracking-[0.2em] text-white uppercase group-hover:text-gold transition-colors">
                VIWAN
              </span>
            </Link>
          </div>

          {/* End: Language Switcher Only */}
          <div className="flex items-center">
            <button
              onClick={toggleLocale}
              className="border border-white/20 bg-white/10 hover:bg-white/20 hover:border-gold px-4 py-1.5 text-xs text-white rounded-full flex items-center space-x-2 rtl:space-x-reverse shadow-sm backdrop-blur-md transition-all cursor-pointer group"
            >
              <Globe className="w-3.5 h-3.5 text-gold group-hover:rotate-45 transition-transform" />
              <span className="font-medium">{t.header.switchLang}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Canvas */}
        <div className="relative flex-1 min-h-[calc(100vh-5rem)]">
          {/* Subtle Architectural V Watermark */}
          <div className="fixed inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden -z-10">
            <ViwanMark className="w-[520px] h-[520px] sm:w-[680px] sm:h-[680px] text-charcoal opacity-[0.02] transform translate-y-12" />
          </div>

          <main className="relative flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLanguageProvider>
      <ViwanModalProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </ViwanModalProvider>
    </AdminLanguageProvider>
  );
}
