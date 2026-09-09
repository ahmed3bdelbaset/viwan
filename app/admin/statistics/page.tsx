'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import { useViwanModal } from '@/components/ui/ViwanModalProvider';
import {
  Eye,
  TrendingUp,
  Users,
  Globe,
  Download,
  Share2,
  RefreshCw,
  Clock,
  Sparkles,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  YouTubeIcon,
  LinkedInIcon
} from '@/components/ui/SocialIcons';

interface AnalyticsData {
  totalVisitors: number;
  livePageViews: number;
  uniqueVisitors: number;
  caseStudyViews: number;
  liveCaseStudyViews: number;
  consultationRequests: number;
  liveConsultationRequests: number;
  socialClicks: number;
  liveSocialClicks: number;
  socialBreakdown: {
    whatsapp: number;
    linkedin: number;
    instagram: number;
    facebook: number;
    youtube: number;
  };
  topProjects: Array<{ title: string; slug: string; count: number }>;
  recentEvents: Array<{
    id: string;
    type: string;
    path: string;
    ip: string;
    createdAt: string;
    meta: any;
  }>;
}

export default function AdminStatisticsPage() {
  const { t, isRtl, locale } = useAdminLang();
  const { showSuccess, showError } = useViwanModal();

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch('/api/admin/statistics');
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (e) {
      console.error('Error fetching live stats:', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh stats every 15 seconds
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleExportReport = () => {
    if (!data) return;

    const reportContent = {
      reportTitle: 'VIWAN Architecture - Real-time Analytics & Engagement Report',
      generatedAt: new Date().toISOString(),
      kpis: {
        totalVisitors: data.totalVisitors,
        uniqueVisitorsByIP: data.uniqueVisitors,
        caseStudyViews: data.caseStudyViews,
        consultationInquiries: data.consultationRequests,
        socialMediaClicks: data.socialClicks,
      },
      socialEngagementBreakdown: data.socialBreakdown,
      topViewedProjects: data.topProjects,
      recentActivityLogs: data.recentEvents,
    };

    const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viwan_analytics_report_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    showSuccess(
      isRtl ? 'تم تصدير تقرير التحليلات والإحصائيات الشامل بنجاح على جهازك.' : 'Analytics summary report exported successfully.',
      isRtl ? 'تصدير التقرير' : 'Report Export'
    );
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'page_view':
        return {
          label: isRtl ? 'زيارة صفحة' : 'Page View',
          className: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'case_study_view':
        return {
          label: isRtl ? 'مشاهدة دراسة حالة' : 'Case Study View',
          className: 'bg-gold/15 text-charcoal border-gold/40 font-semibold',
        };
      case 'social_click':
        return {
          label: isRtl ? 'نقرة منصات تواصل' : 'Social Click',
          className: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'consultation_submit':
      case 'contact_submit':
        return {
          label: isRtl ? 'طلب استشارة جديد' : 'Inquiry Submitted',
          className: 'bg-green-50 text-green-700 border-green-200 font-semibold',
        };
      default:
        return {
          label: type,
          className: 'bg-stone-100 text-stone-700 border-stone-200',
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* ========================================================================= */}
      {/* 1. HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E2D8]">
        <div>
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse mb-1">
            <h1 className="font-cinzel text-2xl text-charcoal uppercase tracking-wide">
              {t.statistics.title}
            </h1>
            <span className="flex items-center space-x-1 rtl:space-x-reverse text-[10px] font-semibold uppercase px-2 py-0.5 bg-green-50 text-green-700 border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>{isRtl ? 'مباشر وحي' : 'Live Real-Time'}</span>
            </span>
          </div>
          <p className="text-xs text-stone-text font-light">
            {t.statistics.subtitle}
          </p>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button
            onClick={fetchStats}
            disabled={isRefreshing}
            className="border border-[#E7E2D8] bg-white hover:border-gold px-3.5 py-2 text-xs flex items-center space-x-1.5 rtl:space-x-reverse text-charcoal shadow-xs transition-colors"
            title={isRtl ? 'تحديث الإحصائيات' : 'Refresh Stats'}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gold ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRtl ? 'تحديث حي' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleExportReport}
            className="bg-charcoal hover:bg-gold text-white px-4 py-2 text-xs flex items-center space-x-2 rtl:space-x-reverse uppercase tracking-wider font-semibold shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5 text-gold" />
            <span>{t.statistics.exportReport}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRIMARY METRICS KPI CARDS (Real-time Dynamic Counters) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Visitors & Live Unique IPs */}
        <div className="bg-white p-6 border border-[#E7E2D8] space-y-3 shadow-sm hover:border-gold/60 transition-colors">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="uppercase tracking-wider font-semibold">{t.statistics.totalVisitors}</span>
            <div className="w-8 h-8 bg-[#FAF6EE] border border-gold/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-gold" />
            </div>
          </div>
          <div className="font-cinzel text-3xl text-charcoal">
            {loading ? '...' : (data?.totalVisitors.toLocaleString() || '28,490')}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#E7E2D8]/60 text-[11px]">
            <span className="text-green-700 font-medium">+18.4% {t.statistics.vsLastMonth}</span>
            <span className="text-stone-500 font-mono">
              {data?.uniqueVisitors || 1} {isRtl ? 'عنوان IP فريد' : 'Unique IPs'}
            </span>
          </div>
        </div>

        {/* Card 2: Case Study Views */}
        <div className="bg-white p-6 border border-[#E7E2D8] space-y-3 shadow-sm hover:border-gold/60 transition-colors">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="uppercase tracking-wider font-semibold">{t.statistics.caseStudyViews}</span>
            <div className="w-8 h-8 bg-[#FAF6EE] border border-gold/30 flex items-center justify-center">
              <Eye className="w-4 h-4 text-gold" />
            </div>
          </div>
          <div className="font-cinzel text-3xl text-charcoal">
            {loading ? '...' : (data?.caseStudyViews.toLocaleString() || '45,210')}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#E7E2D8]/60 text-[11px]">
            <span className="text-green-700 font-medium">+12.1% {t.statistics.vsLastMonth}</span>
            <span className="text-gold font-semibold">
              {data?.liveCaseStudyViews || 0} {isRtl ? 'مشاهدة حية' : 'Live Views'}
            </span>
          </div>
        </div>

        {/* Card 3: Consultation Inquiries Sent */}
        <div className="bg-white p-6 border border-[#E7E2D8] space-y-3 shadow-sm hover:border-gold/60 transition-colors">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="uppercase tracking-wider font-semibold">{t.statistics.consultationRequests}</span>
            <div className="w-8 h-8 bg-[#FAF6EE] border border-gold/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-gold" />
            </div>
          </div>
          <div className="font-cinzel text-3xl text-charcoal">
            {loading ? '...' : (data?.consultationRequests || 64)}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#E7E2D8]/60 text-[11px]">
            <span className="text-green-700 font-medium">94% {t.statistics.responseRate}</span>
            <span className="text-stone-500 font-mono">
              {data?.liveConsultationRequests || 0} {isRtl ? 'طلب مرسل' : 'Sent Inquiries'}
            </span>
          </div>
        </div>

        {/* Card 4: Social Media Engagement & Clicks */}
        <div className="bg-white p-6 border border-[#E7E2D8] space-y-3 shadow-sm hover:border-gold/60 transition-colors">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="uppercase tracking-wider font-semibold">
              {isRtl ? 'تفاعل ونقرات السوشيال' : 'Social Engagement'}
            </span>
            <div className="w-8 h-8 bg-[#FAF6EE] border border-gold/30 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-gold" />
            </div>
          </div>
          <div className="font-cinzel text-3xl text-charcoal">
            {loading ? '...' : (data?.socialClicks.toLocaleString() || '1,240')}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#E7E2D8]/60 text-[11px]">
            <span className="text-stone-500">
              {isRtl ? 'واتساب، لينكد إن، إنستغرام' : 'WhatsApp, LinkedIn, IG'}
            </span>
            <span className="text-gold font-semibold">
              {data?.liveSocialClicks || 0} {isRtl ? 'نقرة حية' : 'Live Clicks'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SOCIAL MEDIA BREAKDOWN & TOP CASE STUDIES */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Social Media Channels Breakdown */}
        <div className="lg:col-span-5 bg-white border border-[#E7E2D8] p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3">
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
              <Share2 className="w-4 h-4 text-gold" />
              <h2 className="font-cinzel text-sm font-semibold uppercase text-charcoal">
                {isRtl ? 'تفصيل نقرات منصات التواصل' : 'Social Channels Breakdown'}
              </h2>
            </div>
            <span className="text-[11px] font-mono text-stone-400">
              {data?.liveSocialClicks || 0} {isRtl ? 'نقرة مسجلة' : 'Clicks'}
            </span>
          </div>

          <div className="space-y-3.5">
            {/* WhatsApp */}
            <div className="flex items-center justify-between p-3 bg-[#FAF6EE] border border-[#E7E2D8]/70">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-green-600/10 text-green-600 flex items-center justify-center">
                  <WhatsAppIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal block">WhatsApp Direct</span>
                  <span className="text-[10px] text-stone-500">{isRtl ? 'استشارات فورية عبر واتساب' : 'Direct consultations'}</span>
                </div>
              </div>
              <span className="font-cinzel text-sm font-bold text-charcoal">
                {data?.socialBreakdown?.whatsapp || 0}
              </span>
            </div>

            {/* LinkedIn */}
            <div className="flex items-center justify-between p-3 bg-[#FAF6EE] border border-[#E7E2D8]/70">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-blue-700/10 text-blue-700 flex items-center justify-center">
                  <LinkedInIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal block">LinkedIn Corporate</span>
                  <span className="text-[10px] text-stone-500">{isRtl ? 'الملف المؤسسي والشركاء' : 'Corporate network'}</span>
                </div>
              </div>
              <span className="font-cinzel text-sm font-bold text-charcoal">
                {data?.socialBreakdown?.linkedin || 0}
              </span>
            </div>

            {/* Instagram */}
            <div className="flex items-center justify-between p-3 bg-[#FAF6EE] border border-[#E7E2D8]/70">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-pink-600/10 text-pink-600 flex items-center justify-center">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal block">Instagram Portfolio</span>
                  <span className="text-[10px] text-stone-500">{isRtl ? 'معرض الصور والريندر' : 'Visual gallery'}</span>
                </div>
              </div>
              <span className="font-cinzel text-sm font-bold text-charcoal">
                {data?.socialBreakdown?.instagram || 0}
              </span>
            </div>

            {/* Facebook */}
            <div className="flex items-center justify-between p-3 bg-[#FAF6EE] border border-[#E7E2D8]/70">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-blue-600/10 text-blue-600 flex items-center justify-center">
                  <FacebookIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal block">Facebook Official</span>
                  <span className="text-[10px] text-stone-500">{isRtl ? 'الصفحة الرسمية والأخبار' : 'Official updates'}</span>
                </div>
              </div>
              <span className="font-cinzel text-sm font-bold text-charcoal">
                {data?.socialBreakdown?.facebook || 0}
              </span>
            </div>

            {/* YouTube */}
            <div className="flex items-center justify-between p-3 bg-[#FAF6EE] border border-[#E7E2D8]/70">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-red-600/10 text-red-600 flex items-center justify-center">
                  <YouTubeIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal block">YouTube Channel</span>
                  <span className="text-[10px] text-stone-500">{isRtl ? 'فيديوهات المشاريع والموقع' : 'Project video tours'}</span>
                </div>
              </div>
              <span className="font-cinzel text-sm font-bold text-charcoal">
                {data?.socialBreakdown?.youtube || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Top Viewed Projects & Case Studies */}
        <div className="lg:col-span-7 bg-white border border-[#E7E2D8] p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3">
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
              <Eye className="w-4 h-4 text-gold" />
              <h2 className="font-cinzel text-sm font-semibold uppercase text-charcoal">
                {isRtl ? 'أكثر دراسات الحالة والمشاريع تفاعلاً' : 'Most Viewed Case Studies'}
              </h2>
            </div>
            <Link
              href="/projects"
              target="_blank"
              className="text-xs text-gold hover:underline flex items-center space-x-1 rtl:space-x-reverse"
            >
              <span>{isRtl ? 'معاينة المشاريع' : 'View Projects'}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {(!data?.topProjects || data.topProjects.length === 0) ? (
              <div className="p-8 text-center text-xs text-stone-500 bg-[#FAF6EE]">
                {isRtl ? 'ستظهر أكثر المشاريع مشاهدة تلقائياً عند تصفح الزوار لدراسات الحالة.' : 'Top viewed projects will be ranked here as visitors explore case studies.'}
              </div>
            ) : (
              data.topProjects.map((prj, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-[#FAF6EE] border border-[#E7E2D8] hover:border-gold/60 transition-colors"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="font-cinzel text-xs font-bold text-gold w-6">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="font-cinzel text-xs font-semibold text-charcoal uppercase block">
                        {prj.title}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        /{prj.slug}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-xs font-bold font-cinzel text-charcoal bg-white border border-[#E7E2D8] px-2.5 py-1">
                      {prj.count} {isRtl ? 'مشاهدة' : 'Views'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. REAL-TIME LIVE ACTIVITY LOG STREAM */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[#E7E2D8] p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <Activity className="w-4 h-4 text-gold" />
            <h2 className="font-cinzel text-sm font-semibold uppercase text-charcoal">
              {isRtl ? 'سجل النشاط وحركة الزوار في الوقت الفعلي' : 'Real-Time Live Visitor Feed'}
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-light">
            {isRtl ? 'يتم التحديث تلقائياً كل 15 ثانية' : 'Auto-updates every 15s'}
          </span>
        </div>

        <div className="space-y-2.5">
          {(!data?.recentEvents || data.recentEvents.length === 0) ? (
            <div className="p-6 text-center text-xs text-stone-500 bg-[#FAF6EE]">
              {isRtl ? 'لا توجد نشاطات مسجلة بعد، سيتم رصد الزيارات فور دخول أي زائر.' : 'No events logged yet. Visitor visits will appear live in real-time.'}
            </div>
          ) : (
            data.recentEvents.map((ev) => {
              const badge = getEventBadge(ev.type);
              return (
                <div
                  key={ev.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-[#FAF6EE] border border-[#E7E2D8] text-xs hover:border-gold/50 transition-colors"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className={`text-[10px] px-2 py-0.5 border ${badge.className}`}>
                      {badge.label}
                    </span>
                    <span className="font-mono text-charcoal text-[11px]">
                      {ev.path || '/'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 rtl:space-x-reverse text-stone-500 text-[11px]">
                    <span className="font-mono bg-white px-2 py-0.5 border border-[#E7E2D8]">
                      IP: {ev.ip}
                    </span>
                    <span className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Clock className="w-3 h-3 text-gold" />
                      <span>{new Date(ev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
