'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataStore } from '@/lib/store';
import { ViwanMark } from '@/components/ui/Icons';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import {
  TrendingUp,
  FileText,
  Eye,
  ArrowRight,
  PenTool,
  Upload,
  Plus,
  Layers,
  Compass
} from 'lucide-react';
import { SpatialMapWidget } from '@/components/ui/SpatialMapWidget';

export default function AdminDashboardOverviewPage() {
  const [projectsCount, setProjectsCount] = useState(124);
  const [insightsCount, setInsightsCount] = useState(38);
  const { t, isRtl } = useAdminLang();

  useEffect(() => {
    const list = DataStore.getProjects();
    const insights = DataStore.getInsights();
    if (list.length > 0) setProjectsCount(list.length);
    if (insights.length > 0) setInsightsCount(insights.length);
  }, []);

  return (
    <div className="space-y-10">
      {/* ========================================================================= */}
      {/* 1. THREE WHITE KPI CARDS (Matches admin_dashboard_overview.png) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: TOTAL PROJECTS */}
        <div className="bg-white p-7 border border-[#E7E2D8] relative overflow-hidden flex flex-col justify-between min-h-[160px] shadow-sm">
          {/* Decorative Watermark Icon */}
          <div className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-4 opacity-10 pointer-events-none`}>
            <ViwanMark className="w-16 h-16" />
          </div>

          <div className="space-y-1 relative z-10">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-stone-dark">
              {t.overview.totalProjects}
            </span>
            <div className="font-cinzel text-4xl sm:text-5xl text-charcoal font-normal">
              {projectsCount}
            </div>
          </div>

          <div className="text-xs text-stone-600 font-light flex items-center space-x-1.5 rtl:space-x-reverse pt-4 border-t border-[#F3EDE3] relative z-10">
            <span className="text-stone-800 font-medium">{t.overview.totalProjectsSub}</span>
          </div>
        </div>

        {/* KPI 2: PORTFOLIO VIEWS */}
        <div className="bg-white p-7 border border-[#E7E2D8] relative overflow-hidden flex flex-col justify-between min-h-[160px] shadow-sm">
          {/* Decorative Watermark Eye */}
          <div className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-4 text-[#E7E2D8] pointer-events-none`}>
            <Eye className="w-16 h-16" strokeWidth={1} />
          </div>

          <div className="space-y-1 relative z-10">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-stone-dark">
              {t.overview.caseStudyViews}
            </span>
            <div className="font-cinzel text-4xl sm:text-5xl text-charcoal font-normal">
              45.2K
            </div>
          </div>

          <div className="text-xs text-stone-600 font-light flex items-center space-x-1.5 rtl:space-x-reverse pt-4 border-t border-[#F3EDE3] relative z-10">
            <TrendingUp className="w-3.5 h-3.5 text-stone-800" />
            <span className="text-stone-800 font-medium">+12%</span>
            <span>{t.overview.caseStudyViewsSub}</span>
          </div>
        </div>

        {/* KPI 3: PUBLISHED INSIGHTS */}
        <div className="bg-white p-7 border border-[#E7E2D8] relative overflow-hidden flex flex-col justify-between min-h-[160px] shadow-sm">
          {/* Decorative Watermark Document */}
          <div className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-4 text-[#E7E2D8] pointer-events-none`}>
            <FileText className="w-16 h-16" strokeWidth={1} />
          </div>

          <div className="space-y-1 relative z-10">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-stone-dark">
              {t.overview.publishedInsights}
            </span>
            <div className="font-cinzel text-4xl sm:text-5xl text-charcoal font-normal">
              {insightsCount}
            </div>
          </div>

          <div className="text-xs text-stone-600 font-light flex items-center space-x-1.5 rtl:space-x-reverse pt-4 border-t border-[#F3EDE3] relative z-10">
            <FileText className="w-3.5 h-3.5 text-stone-500" />
            <span>{t.overview.publishedInsightsSub}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RECENT ACTIVITY & QUICK ACTIONS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Activity Stream */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D8]">
            <h2 className="font-cinzel text-lg tracking-wider uppercase text-charcoal font-medium">
              {t.overview.recentActivity}
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs text-stone-dark hover:text-gold tracking-widest uppercase font-medium"
            >
              {isRtl ? 'عرض الكل' : 'VIEW ALL'}
            </Link>
          </div>

          <div className="space-y-4">
            {/* Activity 1 */}
            <div className="bg-white p-5 border border-[#E7E2D8] flex items-start space-x-4 rtl:space-x-reverse shadow-sm">
              <div className="w-9 h-9 border border-[#E7E2D8] bg-[#FAF6EE] flex items-center justify-center shrink-0">
                <PenTool className="w-4 h-4 text-charcoal" />
              </div>
              <div className="space-y-1 flex-grow">
                <p className="text-xs text-charcoal leading-snug">
                  <strong className="font-semibold">{isRtl ? 'تحديث مشروع:' : 'Project Updated:'}</strong> {isRtl ? 'رفع مخططات ورندرات المرحلة الثانية لمستشفى التخصصي بالرياض.' : 'Specialized Hospital Riyadh Phase 2 renders updated.'}
                </p>
                <div className="text-[10px] text-stone-500 font-mono tracking-wider uppercase">
                  {isRtl ? 'اليوم، 09:45 ص • بواسطة المهندس طارق' : 'TODAY, 09:45 AM • BY TAREK M.'}
                </div>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="bg-white p-5 border border-[#E7E2D8] flex items-start space-x-4 rtl:space-x-reverse shadow-sm">
              <div className="w-9 h-9 border border-[#E7E2D8] bg-[#FAF6EE] flex items-center justify-center shrink-0">
                <Upload className="w-4 h-4 text-charcoal" />
              </div>
              <div className="space-y-1 flex-grow">
                <p className="text-xs text-charcoal leading-snug">
                  <strong className="font-semibold">{isRtl ? 'نشر مقال:' : 'Insight Published:'}</strong> {isRtl ? 'مستقبل التبريد السلبي في المناخات الجافة متاح الآن.' : '"The Future of Passive Cooling in Arid Climates" is now live.'}
                </p>
                <div className="text-[10px] text-stone-500 font-mono tracking-wider uppercase">
                  {isRtl ? 'أمس، 02:20 م • بواسطة الإدارة' : 'YESTERDAY, 14:20 PM • BY ADMIN'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="pb-3 border-b border-[#E7E2D8]">
            <h2 className="font-cinzel text-lg tracking-wider uppercase text-charcoal font-medium">
              {t.overview.quickActions}
            </h2>
          </div>

          <div className="space-y-3">
            {/* Primary Action Button */}
            <Link
              href="/admin/projects"
              className="w-full bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-widest uppercase p-4 transition-all flex items-center justify-between group shadow-sm"
            >
              <span>{t.overview.addNewProject}</span>
              <ArrowRight className="w-4 h-4 text-gold group-hover:text-white transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>

            {/* Secondary Action Button */}
            <Link
              href="/admin/insights"
              className="w-full bg-transparent hover:bg-charcoal hover:text-white border border-charcoal/40 text-charcoal text-xs font-semibold tracking-widest uppercase p-4 transition-all flex items-center justify-between group shadow-sm"
            >
              <span>{t.overview.writeArticle}</span>
              <ArrowRight className="w-4 h-4 text-charcoal group-hover:text-white transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>

          {/* System Status Widget */}
          <div className="bg-[#F3EDE3] border border-[#E7E2D8] p-5 space-y-3">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-stone-dark block">
              {t.overview.systemStatus}
            </span>

            <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-charcoal font-medium">
              <span className="w-2.5 h-2.5 bg-green-600 rounded-full" />
              <span>{t.overview.storageEngine}</span>
            </div>

            <div className="text-[11px] text-stone-600 font-light">
              {t.overview.i18nSync}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SPATIAL REGIONAL DISTRIBUTION & GFA TELEMETRY */}
      {/* ========================================================================= */}
      <div className="pt-2">
        <SpatialMapWidget isRtl={isRtl} />
      </div>
    </div>
  );
}
