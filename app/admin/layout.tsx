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
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  const { locale, toggleLocale, t, isRtl } = useAdminLang();
  const { showNotification } = useViwanModal();

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
        const user = AuthService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
        setIsCheckingAuth(false);
      }
    } else {
      setIsCheckingAuth(false);
    }
  }, [pathname, isPublicAuthPage, router]);

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

  return (
    <div className="min-h-screen bg-[#FAF6EE] flex">
      {/* ========================================================================= */}
      {/* 1. DARK SIDEBAR */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 z-50 w-64 bg-charcoal text-white flex flex-col justify-between border-stone-800 transition-transform duration-300 ${
          isRtl ? 'right-0 border-l' : 'left-0 border-r'
        } ${
          sidebarOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header (Always keeps V mark on the left) */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <Link href="/admin" dir="ltr" className="flex items-center space-x-3.5 group">
            <ViwanMark className="w-8 h-8" isDark={true} />
            <div className="text-left">
              <div className="font-cinzel text-lg font-bold tracking-widest text-white">
                {t.sidebar.brand}
              </div>
              <div className="text-[9px] tracking-[0.2em] text-stone-400 font-montserrat uppercase -mt-0.5">
                {t.sidebar.subtitle}
              </div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-stone-400 hover:text-white"
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
                className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-xs font-montserrat tracking-widest uppercase transition-all ${
                  active
                    ? `bg-[#1e1e1e] text-white ${isRtl ? 'border-r-2' : 'border-l-2'} border-gold font-medium`
                    : 'text-stone-400 hover:text-white hover:bg-stone-900/50'
                }`}
              >
                <span className={active ? 'text-gold' : 'text-stone-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Nav: Settings & Logout */}
        <div className="p-4 border-t border-stone-800 space-y-1">
          <Link
            href="/admin/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-2.5 text-xs text-stone-400 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4 text-stone-500" />
            <span>{isRtl ? 'الإعدادات' : 'SETTINGS'}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-2.5 text-xs text-stone-400 hover:text-red-400 transition-colors text-left rtl:text-right"
          >
            <LogOut className="w-4 h-4 text-stone-500" />
            <span>{t.sidebar.logout}</span>
          </button>

          <div className="pt-3 border-t border-stone-800/60 px-4">
            <Link
              href="/"
              target="_blank"
              className="text-[10px] text-gold hover:underline flex items-center space-x-1 rtl:space-x-reverse"
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
        {/* Top Bar Header */}
        <header className="h-20 bg-[#FAF6EE] border-b border-[#E7E2D8] px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-charcoal hover:text-gold"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-cinzel text-lg font-medium text-charcoal tracking-wide uppercase">
                {t.header.title}
              </h1>
              <p className="text-xs text-stone-text font-light -mt-0.5">
                {isRtl
                  ? `مرحباً بك مجدداً، ${currentUser?.name_ar || currentUser?.name || 'كبير المعماريين'}`
                  : `Welcome back, ${currentUser?.name || 'Chief Architect'}.`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse">
            {/* Language Switcher */}
            <button
              onClick={toggleLocale}
              className="border border-[#E7E2D8] bg-white hover:border-gold px-3.5 py-1.5 text-xs text-charcoal flex items-center space-x-2 rtl:space-x-reverse shadow-sm transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-gold" />
              <span className="font-semibold">{t.header.switchLang}</span>
            </button>

            {/* Profile Avatar & Name (Matches user request) */}
            <Link
              href="/admin/users"
              className="flex items-center space-x-3 rtl:space-x-reverse pl-3 rtl:pl-0 rtl:pr-3 border-l rtl:border-l-0 rtl:border-r border-[#E7E2D8] hover:opacity-90 transition-opacity group cursor-pointer"
              title={isRtl ? 'إدارة الحسابات وفريق العمل' : 'Manage Profile & Admin Team'}
            >
              {currentUser?.avatar ? (
                <div className="w-10 h-10 border border-gold/70 bg-stone-200 overflow-hidden shadow-sm shrink-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-charcoal text-gold font-cinzel text-xs font-bold flex items-center justify-center border border-gold shrink-0">
                  {currentUser?.name
                    ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                    : 'CA'}
                </div>
              )}

              <div className="hidden sm:block text-left rtl:text-right">
                <div className="text-xs font-medium text-charcoal group-hover:text-gold transition-colors leading-tight">
                  {isRtl
                    ? currentUser?.name_ar || currentUser?.name || 'طارق منصور'
                    : currentUser?.name || 'Tarek Mansour'}
                </div>
                <div className="text-[10px] text-stone-500 uppercase tracking-wider font-montserrat mt-0.5">
                  {isRtl
                    ? currentUser?.role_ar || currentUser?.role || 'كبير المعماريين'
                    : currentUser?.role || 'Chief Architect'}
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Canvas with Luxury V Watermark */}
        <div className="relative flex-1 min-h-[calc(100vh-5rem)]">
          {/* Subtle Architectural V Watermark */}
          <div className="fixed inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden -z-10">
            <ViwanMark className="w-[520px] h-[520px] sm:w-[680px] sm:h-[680px] text-charcoal opacity-[0.025] transform translate-y-12" />
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
