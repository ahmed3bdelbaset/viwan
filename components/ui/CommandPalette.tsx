'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  FileText,
  FolderKanban,
  Building,
  Users,
  Settings,
  Globe,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Command,
  X,
  Compass,
  Layers,
  BarChart3,
  Check,
  Images,
  MessageSquare,
  Mail
} from 'lucide-react';
import { DataStore } from '@/lib/store';
import { Project, InsightArticle } from '@/lib/types';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';

interface PaletteItem {
  id: string;
  category: 'ACTIONS' | 'PROJECTS' | 'INSIGHTS' | 'NAVIGATION';
  categoryAr: 'إجراءات سريعة' | 'المشاريع المعمارية' | 'الرؤى والمقالات' | 'التنقل';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { t, isRtl, toggleLocale, locale } = useAdminLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('viwan_open_command_palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('viwan_open_command_palette', handleCustomOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build items list
  const projects = DataStore.getProjects();
  const insights = DataStore.getInsights();

  const allItems: PaletteItem[] = [
    // Actions
    {
      id: 'act-new-project',
      category: 'ACTIONS',
      categoryAr: 'إجراءات سريعة',
      title: isRtl ? 'إضافة مشروع معماري جديد' : 'Add New Architectural Project',
      subtitle: isRtl ? 'فتح محطة عمل إدخال الموقع والمخططات' : 'Open project workstation form',
      icon: <Plus className="w-4 h-4 text-gold" />,
      badge: isRtl ? 'مشروع جديد' : 'NEW',
      action: () => {
        setIsOpen(false);
        router.push('/admin/projects?create=true');
      },
    },
    {
      id: 'act-draft-insight',
      category: 'ACTIONS',
      categoryAr: 'إجراءات سريعة',
      title: isRtl ? 'كتابة مقال معماري / رؤية جديدة' : 'Draft New Insight Article',
      subtitle: isRtl ? 'نشر فكر ودراسات الاستوديو' : 'Publish architectural think-piece',
      icon: <FileText className="w-4 h-4 text-gold" />,
      badge: isRtl ? 'مقال' : 'INSIGHT',
      action: () => {
        setIsOpen(false);
        router.push('/admin/insights?create=true');
      },
    },
    {
      id: 'act-toggle-lang',
      category: 'ACTIONS',
      categoryAr: 'إجراءات سريعة',
      title: isRtl ? 'تبديل اللغة إلى الإنجليزية (Switch to English)' : 'تبديل اللغة إلى العربية (Switch to Arabic)',
      subtitle: isRtl ? 'English Language Mode' : 'الوضع العربي الكامل',
      icon: <Globe className="w-4 h-4 text-gold" />,
      badge: isRtl ? 'لغة' : 'LANG',
      action: () => {
        toggleLocale();
        setIsOpen(false);
      },
    },
    {
      id: 'act-view-site',
      category: 'ACTIONS',
      categoryAr: 'إجراءات سريعة',
      title: isRtl ? 'معاينة الموقع الحي' : 'View Live Studio Website',
      subtitle: isRtl ? 'فتح الواجهة العامة في علامة تبويب جديدة' : 'Open public portfolio in new tab',
      icon: <ExternalLink className="w-4 h-4 text-stone-400" />,
      badge: isRtl ? 'معاينة' : 'LIVE',
      action: () => {
        setIsOpen(false);
        window.open('/', '_blank');
      },
    },

    // Navigation
    {
      id: 'nav-dashboard',
      category: 'NAVIGATION',
      categoryAr: 'التنقل',
      title: isRtl ? 'لوحة التحكم الرئيسية' : 'Dashboard Overview',
      subtitle: isRtl ? 'المؤشرات، النشاطات الأخيرة، وحالة النظام' : 'KPIs, activity feed & system telemetry',
      icon: <Compass className="w-4 h-4 text-stone-400" />,
      action: () => {
        setIsOpen(false);
        router.push('/admin');
      },
    },
    {
      id: 'nav-projects',
      category: 'NAVIGATION',
      categoryAr: 'التنقل',
      title: isRtl ? 'إدارة المشاريع المعمارية' : 'Manage Projects Portfolio',
      subtitle: isRtl ? 'عرض السجل المعماري، الرندرات، والفلاتر' : 'Registry, renders, sectors & filters',
      icon: <FolderKanban className="w-4 h-4 text-stone-400" />,
      action: () => {
        setIsOpen(false);
        router.push('/admin/projects');
      },
    },
    {
      id: 'nav-services',
      category: 'NAVIGATION',
      categoryAr: 'التنقل',
      title: isRtl ? 'الخدمات الاستشارية والتصميم' : 'Services & Architecture Consultancy',
      subtitle: isRtl ? 'باقات الاستشارات الهندسية والإشراف' : 'Design lifecycle & engineering disciplines',
      icon: <Layers className="w-4 h-4 text-stone-400" />,
      action: () => {
        setIsOpen(false);
        router.push('/admin/services');
      },
    },
    {
      id: 'nav-media',
      category: 'NAVIGATION',
      categoryAr: 'التنقل',
      title: isRtl ? 'إدارة صور وهيدرز الموقع' : 'Site Images & Hero Banners',
      subtitle: isRtl ? 'تعديل ورفع صور الصفحات السبع والتخصصات' : 'Manage hero visual assets across all 7 pages',
      icon: <Images className="w-4 h-4 text-stone-400" />,
      action: () => {
        setIsOpen(false);
        router.push('/admin/media');
      },
    },
    {
      id: 'nav-email-routing',
      category: 'NAVIGATION',
      categoryAr: 'التنقل',
      title: isRtl ? 'توجيه البريد الرسمي (GoDaddy)' : 'Official Email Forwarding',
      subtitle: isRtl ? 'إدارة توجيه إشعارات الاستشارات والرسائل والتوظيف' : 'Manage instant forwarding to info@viwan.net',
      icon: <Mail className="w-4 h-4 text-stone-400" />,
      action: () => {
        setIsOpen(false);
        router.push('/admin/settings');
      },
    },
    {
      id: 'nav-settings',
      category: 'NAVIGATION',
      categoryAr: 'التنقل',
      title: isRtl ? 'إعدادات الاستوديو والمكاتب' : 'Studio Info & Office Branches',
      subtitle: isRtl ? 'فرع القاهرة، فرع الرياض، أرقام التواصل' : 'Cairo Studio, Riyadh Studio & coordinates',
      icon: <Settings className="w-4 h-4 text-stone-400" />,
      action: () => {
        setIsOpen(false);
        router.push('/admin/settings');
      },
    },
    {
      id: 'nav-stats',
      category: 'NAVIGATION',
      categoryAr: 'التنقل',
      title: isRtl ? 'الإحصائيات والتحليلات المعمارية' : 'Architectural Analytics & GFA',
      subtitle: isRtl ? 'توزيع المساحات والمشاريع إقليمياً' : 'Regional distribution & floor area telemetry',
      icon: <BarChart3 className="w-4 h-4 text-stone-400" />,
      action: () => {
        setIsOpen(false);
        router.push('/admin/statistics');
      },
    },
    {
      id: 'nav-users',
      category: 'NAVIGATION',
      categoryAr: 'التنقل',
      title: isRtl ? 'فريق العمل والمعماريين المشرفين' : 'Admin Team & Architects',
      subtitle: isRtl ? 'إدارة الصلاحيات وحسابات كبار المعماريين' : 'Chief architects, roles & permissions',
      icon: <Users className="w-4 h-4 text-stone-400" />,
      action: () => {
        setIsOpen(false);
        router.push('/admin/users');
      },
    },

    // Projects list entries
    ...projects.slice(0, 15).map((p): PaletteItem => ({
      id: `prj-${p.id}`,
      category: 'PROJECTS',
      categoryAr: 'المشاريع المعمارية',
      title: isRtl ? (p.title_ar || p.title_en) : (p.title_en || p.title_ar),
      subtitle: `${p.code} • ${isRtl ? (p.location_ar || p.location_en) : p.location_en} • ${isRtl ? (p.sector_ar || p.sector_en) : p.sector_en}`,
      icon: <FolderKanban className="w-4 h-4 text-gold" />,
      badge: p.publish_status,
      action: () => {
        setIsOpen(false);
        router.push('/admin/projects');
      },
    })),

    // Insights list entries
    ...insights.slice(0, 10).map((i): PaletteItem => ({
      id: `ins-${i.id}`,
      category: 'INSIGHTS',
      categoryAr: 'الرؤى والمقالات',
      title: isRtl ? (i.title_ar || i.title_en) : (i.title_en || i.title_ar),
      subtitle: `${isRtl ? (i.category_ar || i.category_en) : i.category_en} • ${isRtl ? (i.author_ar || i.author_en) : i.author_en}`,
      icon: <FileText className="w-4 h-4 text-stone-300" />,
      badge: isRtl ? 'دراسة' : 'ARTICLE',
      action: () => {
        setIsOpen(false);
        router.push('/admin/insights');
      },
    })),
  ];

  // Filter items by query
  const filteredItems = query.trim() === ''
    ? allItems
    : allItems.filter((item) => {
        const q = query.toLowerCase().trim();
        return (
          item.title.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
        );
      });

  // Handle keyboard navigation within list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  // Keep selected item visible in scroll
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div
        className="w-full max-w-2xl bg-[#141414] border border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-stone-800 flex items-center space-x-3 rtl:space-x-reverse bg-[#181818]">
          <Search className="w-5 h-5 text-gold shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              isRtl
                ? 'ابحث في المشاريع، المقالات، الإجراءات، أو اكتب أمراً...'
                : 'Search projects, insights, actions, or jump to section...'
            }
            className="w-full bg-transparent text-sm text-white placeholder-stone-500 outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-500 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex text-[10px] text-stone-500 font-mono uppercase bg-stone-900 border border-stone-800 px-1.5 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 divide-y divide-stone-900/50">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Compass className="w-8 h-8 text-stone-600 mx-auto stroke-1" />
              <p className="text-xs text-stone-400 font-medium">
                {isRtl ? 'لا توجد نتائج مطابقة لبحثك' : 'No matching items found'}
              </p>
              <p className="text-[11px] text-stone-600 font-light">
                {isRtl ? 'جرب البحث باسم المشروع، المدينة، أو الكود' : 'Try searching by project title, city, or code'}
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  data-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={item.action}
                  className={`flex items-center justify-between p-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#222222] border-r-2 rtl:border-r-0 rtl:border-l-2 border-gold text-white'
                      : 'hover:bg-[#1a1a1a] text-stone-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0 pr-2 rtl:pr-0 rtl:pl-2">
                    <div
                      className={`w-8 h-8 flex items-center justify-center border shrink-0 transition-colors ${
                        isSelected
                          ? 'border-gold/60 bg-stone-900 text-gold'
                          : 'border-stone-800 bg-[#141414] text-stone-400'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate flex items-center space-x-2 rtl:space-x-reverse">
                        <span className={isSelected ? 'text-white' : 'text-stone-200'}>
                          {item.title}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[10px] text-stone-500 truncate font-light mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse shrink-0">
                    {item.badge && (
                      <span className="text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 border border-stone-800 bg-stone-900 text-stone-400">
                        {item.badge}
                      </span>
                    )}
                    <span className="text-[9px] text-stone-600 uppercase font-mono tracking-widest hidden sm:inline-block">
                      {isRtl ? item.categoryAr : item.category}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-gold translate-x-0.5 rtl:-translate-x-0.5' : 'text-stone-700'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Keyboard Hints */}
        <div className="p-3 border-t border-stone-800 bg-[#121212] flex items-center justify-between text-[10px] text-stone-500 font-mono">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <span className="flex items-center space-x-1 rtl:space-x-reverse">
              <kbd className="px-1.5 py-0.5 bg-stone-900 border border-stone-800 text-stone-300">↑↓</kbd>
              <span>{isRtl ? 'للتنقل' : 'Navigate'}</span>
            </span>
            <span className="flex items-center space-x-1 rtl:space-x-reverse">
              <kbd className="px-1.5 py-0.5 bg-stone-900 border border-stone-800 text-stone-300">↵</kbd>
              <span>{isRtl ? 'للتنفيذ' : 'Select'}</span>
            </span>
            <span className="flex items-center space-x-1 rtl:space-x-reverse">
              <kbd className="px-1.5 py-0.5 bg-stone-900 border border-stone-800 text-stone-300">ESC</kbd>
              <span>{isRtl ? 'للإغلاق' : 'Close'}</span>
            </span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse text-gold font-medium">
            <Sparkles className="w-3 h-3" />
            <span>VIWAN CONSOLE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
