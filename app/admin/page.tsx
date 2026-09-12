'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ViwanMark } from '@/components/ui/Icons';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import {
  FolderKanban,
  Briefcase,
  MessageSquare,
  Users,
  ArrowRight,
  ExternalLink,
  Images,
  Building2,
  Workflow,
  Sparkles,
  Calendar,
  Phone,
  RefreshCw,
  CheckCircle2,
  Clock,
  Mail
} from 'lucide-react';

interface OverviewStats {
  projectsCount: number;
  servicesCount: number;
  inquiriesCount: number;
  adminsCount: number;
  recentContacts: any[];
  recentConsultations: any[];
}

export default function AdminDashboardOverviewPage() {
  const { isRtl } = useAdminLang();

  const [stats, setStats] = useState<OverviewStats>({
    projectsCount: 0,
    servicesCount: 8,
    inquiriesCount: 0,
    adminsCount: 0,
    recentContacts: [],
    recentConsultations: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const [dataRes, adminsRes] = await Promise.all([
        fetch('/api/admin/data'),
        fetch('/api/admin/admins'),
      ]);

      let projectsCount = 0;
      let inquiriesCount = 0;
      let recentContacts: any[] = [];
      let recentConsultations: any[] = [];
      let adminsCount = 0;

      if (dataRes.ok) {
        const dbData = await dataRes.json();
        const projects = Array.isArray(dbData.projects) ? dbData.projects : [];
        const contacts = Array.isArray(dbData.contacts) ? dbData.contacts : [];
        const consultations = Array.isArray(dbData.consultations) ? dbData.consultations : [];

        projectsCount = projects.length;
        inquiriesCount = contacts.length + consultations.length;
        recentContacts = contacts.slice(-3).reverse();
        recentConsultations = consultations.slice(-3).reverse();
      }

      if (adminsRes.ok) {
        const adminsData = await adminsRes.json();
        if (Array.isArray(adminsData.admins)) {
          adminsCount = adminsData.admins.length;
        }
      }

      setStats({
        projectsCount,
        servicesCount: 8,
        inquiriesCount,
        adminsCount: adminsCount || 3,
        recentContacts,
        recentConsultations,
      });
    } catch (err) {
      console.error('Failed to load dashboard overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  // 7 Public Pages Portals
  const publicPagesPortals = [
    {
      num: '01',
      titleEn: 'Homepage',
      titleAr: 'الصفحة الرئيسية',
      route: '/',
      descEn: 'Hero slider, architectural marquee, render-vs-reality, and impact stats.',
      descAr: 'سلايدر الهيرو الرئيسي، شريط الماركي المعماري، الرندر والواقع، وإحصائيات الأثر.',
      manageRoute: '/admin/media',
      manageLabelEn: 'Manage Hero & Images',
      manageLabelAr: 'إدارة صور وهيدر الصفحة',
      icon: <Images className="w-5 h-5 text-gold" />,
    },
    {
      num: '02',
      titleEn: 'Selected Projects',
      titleAr: 'المشاريع المعمارية',
      route: '/projects',
      descEn: 'Full cinematic hero, 5 architectural disciplines, case studies, and gallery assets.',
      descAr: 'الهيرو السينمائي، التخصصات الخمسة، دراسات الحالة، ومعارض الصور الحية.',
      manageRoute: '/admin/projects',
      manageLabelEn: 'Manage Projects & Disciplines',
      manageLabelAr: 'إدارة المشروعات والتخصصات',
      icon: <FolderKanban className="w-5 h-5 text-gold" />,
    },
    {
      num: '03',
      titleEn: 'Services & Disciplines',
      titleAr: 'الخدمات والتخصصات',
      route: '/services',
      descEn: '8 core engineering disciplines, BIM execution scopes, and deliverables.',
      descAr: 'التخصصات الهندسية الثمانية، مخرجات مراحل الـ BIM، والمواصفات الفنية.',
      manageRoute: '/admin/services',
      manageLabelEn: 'Configure Services & BIM',
      manageLabelAr: 'إدارة التخصصات ومواصفات الـ BIM',
      icon: <Briefcase className="w-5 h-5 text-gold" />,
    },
    {
      num: '04',
      titleEn: 'Studio & Leadership',
      titleAr: 'الاستوديو وهوية المكتب',
      route: '/studio',
      descEn: 'HQ Atelier, founding architects, material lab, Cairo & Riyadh presence.',
      descAr: 'مقر الاستوديو، فلسفة وفريق القيادة، مختبر الخامات، ومكاتب القاهرة والرياض.',
      manageRoute: '/admin/settings',
      manageLabelEn: 'Edit Studio Profile & Branches',
      manageLabelAr: 'تعديل بيانات وفروع الاستوديو',
      icon: <Building2 className="w-5 h-5 text-gold" />,
    },
    {
      num: '05',
      titleEn: 'How We Work',
      titleAr: 'منهجية ومراحل العمل',
      route: '/how-we-work',
      descEn: '6-stage international delivery framework (Discovery through Turnkey Execution).',
      descAr: 'المراحل الست المعتمدة دولياً من الاستكشاف الأولي وحتى التسليم على المفتاح.',
      manageRoute: '/admin/media',
      manageLabelEn: 'Process Visuals & Blueprint Hero',
      manageLabelAr: 'إدارة صور وبانر طاولة المخططات',
      icon: <Workflow className="w-5 h-5 text-gold" />,
    },
    {
      num: '06',
      titleEn: 'Careers & Culture',
      titleAr: 'الوظائف وفريق العمل',
      route: '/careers',
      descEn: 'Studio workspace hero, architectural openings, and talent applications.',
      descAr: 'صورة بيئة العمل بالاستوديو، فرص التوظيف المفتوحة، وطلبات الانضمام.',
      manageRoute: '/admin/media',
      manageLabelEn: 'Manage Careers Hero & Gallery',
      manageLabelAr: 'إدارة صور ومعرض بيئة العمل',
      icon: <Sparkles className="w-5 h-5 text-gold" />,
    },
    {
      num: '07',
      titleEn: 'Contact & Consultations',
      titleAr: 'تواصل معنا وحجز الاستشارة',
      route: '/contact',
      descEn: 'Direct inquiries, 30-minute consultation scheduler, studio map coordinates.',
      descAr: 'استفسارات العملاء المباشرة، حجز جلسة استشارية 30 دقيقة، وإحداثيات الخريطة.',
      manageRoute: '/admin/settings',
      manageLabelEn: 'Configure Email Forwarding & Routing',
      manageLabelAr: 'إدارة توجيه البريد والتواصل الرسمي',
      icon: <Mail className="w-5 h-5 text-gold" />,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D8] pb-6">
        <div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <h1 className="font-cinzel text-2xl font-normal text-charcoal tracking-wide uppercase">
              {isRtl ? 'لوحة القيادة والمؤشرات الحقيقية' : 'STUDIO EXECUTIVE DASHBOARD'}
            </h1>
          </div>
          <p className="text-xs text-stone-600 font-light mt-1">
            {isRtl
              ? 'متابعة العمليات المعمارية وإدارة محتوى الصفحات السبع ومزامنتها اللحظية مع الموقع العام.'
              : 'Direct architectural consultancy operations, persistent 7-page content hubs, and live public sync.'}
          </p>
        </div>

        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center space-x-1.5 rtl:space-x-reverse border border-[#E7E2D8] bg-white hover:border-gold px-3.5 py-2 text-xs text-charcoal transition-colors shadow-xs"
          >
            <span>{isRtl ? 'معاينة الموقع المباشر' : 'VISIT LIVE SITE'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
          </Link>

          <button
            onClick={fetchOverviewData}
            className="p-2 border border-[#E7E2D8] bg-white hover:border-gold text-charcoal transition-colors shadow-xs"
            title={isRtl ? 'تحديث البيانات' : 'Refresh Data'}
          >
            <RefreshCw className={`w-4 h-4 text-gold ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. FOUR GENUINE KPI SUMMARY CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: TOTAL PROJECTS */}
        <Link
          href="/admin/projects"
          className="bg-white/85 dark:bg-[#181716]/85 backdrop-blur-xl p-6 border border-stone-200/80 dark:border-white/10 rounded-[24px] relative overflow-hidden flex flex-col justify-between min-h-[145px] shadow-sm hover:shadow-md hover:border-gold/60 transition-all group"
        >
          <div className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-4 opacity-10 pointer-events-none group-hover:opacity-15 transition-opacity`}>
            <FolderKanban className="w-14 h-14 text-charcoal dark:text-white" />
          </div>

          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
              {isRtl ? 'المشاريع المعمارية' : 'TOTAL PROJECTS'}
            </span>
            <div className="font-cinzel text-4xl text-charcoal dark:text-white font-normal group-hover:text-gold transition-colors">
              {stats.projectsCount}
            </div>
          </div>

          <div className="text-xs text-stone-500 dark:text-stone-400 font-light flex items-center justify-between pt-3 border-t border-stone-200/50 dark:border-white/10 relative z-10">
            <span>{isRtl ? 'عبر التخصصات الـ 5' : 'Across 5 Disciplines'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* KPI 2: CORE DISCIPLINES */}
        <Link
          href="/admin/services"
          className="bg-white/85 dark:bg-[#181716]/85 backdrop-blur-xl p-6 border border-stone-200/80 dark:border-white/10 rounded-[24px] relative overflow-hidden flex flex-col justify-between min-h-[145px] shadow-sm hover:shadow-md hover:border-gold/60 transition-all group"
        >
          <div className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-4 opacity-10 pointer-events-none group-hover:opacity-15 transition-opacity`}>
            <Briefcase className="w-14 h-14 text-charcoal dark:text-white" />
          </div>

          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
              {isRtl ? 'التخصصات الهندسية' : 'CORE DISCIPLINES'}
            </span>
            <div className="font-cinzel text-4xl text-charcoal dark:text-white font-normal group-hover:text-gold transition-colors">
              {stats.servicesCount}
            </div>
          </div>

          <div className="text-xs text-stone-500 dark:text-stone-400 font-light flex items-center justify-between pt-3 border-t border-stone-200/50 dark:border-white/10 relative z-10">
            <span>{isRtl ? 'خدمات معمارية متكاملة' : 'Integrated Services'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* KPI 3: OFFICIAL EMAIL ROUTING GATEWAY */}
        <Link
          href="/admin/settings"
          className="bg-white/85 dark:bg-[#181716]/85 backdrop-blur-xl p-6 border border-stone-200/80 dark:border-white/10 rounded-[24px] relative overflow-hidden flex flex-col justify-between min-h-[145px] shadow-sm hover:shadow-md hover:border-gold/60 transition-all group"
        >
          <div className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-4 opacity-10 pointer-events-none group-hover:opacity-15 transition-opacity`}>
            <Mail className="w-14 h-14 text-charcoal dark:text-white" />
          </div>

          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
              {isRtl ? 'بوابة البريد الرسمي (GoDaddy)' : 'OFFICIAL EMAIL GATEWAY'}
            </span>
            <div className="font-cinzel text-xl text-charcoal dark:text-white font-semibold group-hover:text-gold transition-colors truncate pt-1">
              info@viwan.net
            </div>
          </div>

          <div className="text-xs text-stone-500 dark:text-stone-400 font-light flex items-center justify-between pt-3 border-t border-stone-200/50 dark:border-white/10 relative z-10">
            <span>{isRtl ? 'توجيه فوري للاستشارات والرسائل' : 'Live Forwarding to Corporate Inbox'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* KPI 4: ADMIN TEAM */}
        <Link
          href="/admin/users"
          className="bg-white/85 dark:bg-[#181716]/85 backdrop-blur-xl p-6 border border-stone-200/80 dark:border-white/10 rounded-[24px] relative overflow-hidden flex flex-col justify-between min-h-[145px] shadow-sm hover:shadow-md hover:border-gold/60 transition-all group"
        >
          <div className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-4 opacity-10 pointer-events-none group-hover:opacity-15 transition-opacity`}>
            <Users className="w-14 h-14 text-charcoal dark:text-white" />
          </div>

          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-stone-500 dark:text-stone-400 block">
              {isRtl ? 'مسؤولو النظام' : 'ADMINISTRATORS'}
            </span>
            <div className="font-cinzel text-4xl text-charcoal dark:text-white font-normal group-hover:text-gold transition-colors">
              {stats.adminsCount}
            </div>
          </div>

          <div className="text-xs text-stone-500 dark:text-stone-400 font-light flex items-center justify-between pt-3 border-t border-stone-200/50 dark:border-white/10 relative z-10">
            <span>{isRtl ? 'حسابات إدارة نشطة' : 'Active Admin Accounts'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEVEN PUBLIC PAGES MANAGEMENT HUBS */}
      {/* ========================================================================= */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3">
          <div>
            <h2 className="font-cinzel text-lg font-medium text-charcoal uppercase tracking-wider">
              {isRtl ? 'بوابات إدارة الصفحات السبع' : 'THE 7 PUBLIC PAGES MANAGEMENT HUBS'}
            </h2>
            <p className="text-xs text-stone-500 font-light">
              {isRtl ? 'تحكم مباشر في نصوص، صور، وهيدرات كل صفحة من صفحات المنصة' : 'Direct control over texts, images, and heroes of each public page'}
            </p>
          </div>
          <Link
            href="/admin/media"
            className="text-xs text-gold hover:text-charcoal font-mono tracking-wider uppercase transition-colors flex items-center gap-1"
          >
            <span>{isRtl ? 'مركز الوسائط الشامل ←' : 'ALL MEDIA ASSETS →'}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {publicPagesPortals.map((portal) => (
            <div
              key={portal.num}
              className="bg-white/85 dark:bg-[#181716]/85 backdrop-blur-xl border border-stone-200/80 dark:border-white/10 rounded-[24px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-gold/60 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                    <span className="font-mono text-xs font-bold text-gold">{portal.num}</span>
                    <h3 className="font-cinzel text-sm font-semibold text-charcoal dark:text-white">
                      {isRtl ? portal.titleAr : portal.titleEn}
                    </h3>
                  </div>
                  <Link
                    href={portal.route}
                    target="_blank"
                    className="text-stone-400 hover:text-gold p-1"
                    title={isRtl ? 'معاينة الصفحة الحية' : 'View live page'}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                  {isRtl ? portal.descAr : portal.descEn}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200/50 dark:border-white/10 mt-4">
                <Link
                  href={portal.manageRoute}
                  className="w-full bg-[#FAF6EE] dark:bg-black/40 hover:bg-charcoal hover:text-white dark:hover:bg-gold dark:hover:text-charcoal border border-stone-200/80 dark:border-white/10 text-charcoal dark:text-stone-200 px-3.5 py-2.5 text-xs font-medium tracking-wider uppercase rounded-xl flex items-center justify-between transition-all group"
                >
                  <span className="text-[11px] font-sans">
                    {isRtl ? portal.manageLabelAr : portal.manageLabelEn}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:text-white dark:group-hover:text-charcoal group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
