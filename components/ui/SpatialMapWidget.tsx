'use client';

import React, { useState } from 'react';
import { MapPin, Building2, Layers, Compass, ArrowUpRight } from 'lucide-react';
import { ViwanMark } from '@/components/ui/Icons';

interface CityHub {
  id: string;
  name_en: string;
  name_ar: string;
  country_en: string;
  country_ar: string;
  x: number; // percentage on map coordinate system
  y: number; // percentage on map coordinate system
  projectsCount: number;
  gfaM2: string;
  activeStatus: string;
  highlightedProject: string;
  highlightedProjectAr: string;
}

const HUBS: CityHub[] = [
  {
    id: 'cairo',
    name_en: 'Cairo Studio',
    name_ar: 'استوديو القاهرة',
    country_en: 'Egypt',
    country_ar: 'مصر',
    x: 28,
    y: 38,
    projectsCount: 16,
    gfaM2: '185,000 m²',
    activeStatus: 'Hub Active',
    highlightedProject: 'Private Residence 01',
    highlightedProjectAr: 'إقامة خاصة 01 - القاهرة الجديدة',
  },
  {
    id: 'alamein',
    name_en: 'Coastal Architecture',
    name_ar: 'العمارة الساحلية',
    country_en: 'Egypt',
    country_ar: 'مصر',
    x: 22,
    y: 28,
    projectsCount: 8,
    gfaM2: '92,000 m²',
    activeStatus: 'Coastal Portfolio',
    highlightedProject: 'Lake House',
    highlightedProjectAr: 'منزل البحيرة - العين السخنة',
  },
  {
    id: 'riyadh',
    name_en: 'Riyadh HQ Studio',
    name_ar: 'مقر الرياض الرئيسي',
    country_en: 'Saudi Arabia',
    country_ar: 'المملكة العربية السعودية',
    x: 62,
    y: 52,
    projectsCount: 24,
    gfaM2: '340,000 m²',
    activeStatus: 'Strategic Headquarters',
    highlightedProject: 'Urban Commercial Hub',
    highlightedProjectAr: 'المركز التجاري الحضري بالرياض',
  },
  {
    id: 'jeddah',
    name_en: 'Residential Urbanism',
    name_ar: 'العمران السكني',
    country_en: 'Saudi Arabia & Egypt',
    country_ar: 'مصر والسعودية',
    x: 52,
    y: 68,
    projectsCount: 9,
    gfaM2: '74,000 m²',
    activeStatus: 'Private Sanctuaries',
    highlightedProject: 'The Urban Retreat',
    highlightedProjectAr: 'الملاذ الحضري - الشيخ زايد',
  },
  {
    id: 'dubai',
    name_en: 'Regional Heritage',
    name_ar: 'التراث الإقليمي المعاصر',
    country_en: 'GCC & Egypt',
    country_ar: 'الخليج ومصر',
    x: 82,
    y: 48,
    projectsCount: 6,
    gfaM2: '65,000 m²',
    activeStatus: 'Regional Alliance',
    highlightedProject: 'Private Majlis',
    highlightedProjectAr: 'المجلس الخاص - العاصمة الإدارية',
  },
];

export const SpatialMapWidget: React.FC<{ isRtl?: boolean }> = ({ isRtl = false }) => {
  const [selectedHub, setSelectedHub] = useState<CityHub>(HUBS[2]); // Default to Riyadh

  const totalProjects = HUBS.reduce((acc, h) => acc + h.projectsCount, 0);

  return (
    <div className="bg-white border border-[#E7E2D8] p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F3EDE3] pb-4 gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Compass className="w-4 h-4 text-gold" />
            <h3 className="font-cinzel text-sm font-semibold uppercase tracking-widest text-charcoal">
              {isRtl ? 'خريطة الانتشار الجغرافي المعماري' : 'Spatial Regional Distribution & GFA'}
            </h3>
          </div>
          <p className="text-xs text-stone-500 font-light">
            {isRtl
              ? 'توزيع استوديوهات ومشاريع فيوان الاستراتيجية عبر المملكة العربية السعودية، مصر، والخليج'
              : 'Strategic project footprint and gross floor area across Saudi Arabia, Egypt & Gulf region'}
          </p>
        </div>

        {/* Total GFA Summary Pill */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse bg-[#FAF6EE] px-4 py-2 border border-[#E7E2D8]">
          <div className="text-left rtl:text-right">
            <span className="text-[9px] uppercase font-mono tracking-widest text-stone-500 block">
              {isRtl ? 'إجمالي المساحات قيد الإشراف' : 'TOTAL DESIGNED GFA'}
            </span>
            <span className="font-cinzel text-base text-charcoal font-bold">
              756,000 m²
            </span>
          </div>
          <div className="h-6 w-[1px] bg-stone-300" />
          <div className="text-left rtl:text-right">
            <span className="text-[9px] uppercase font-mono tracking-widest text-stone-500 block">
              {isRtl ? 'المشاريع الإقليمية' : 'ACTIVE HUBS'}
            </span>
            <span className="font-cinzel text-base text-gold font-bold">
              {totalProjects}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Map Coordinate Board (8 Cols) */}
        <div className="lg:col-span-8 relative aspect-[16/9] bg-[#141414] border border-stone-800 overflow-hidden select-none">
          {/* Subtle Coordinate Grid Blueprint */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #B08A5A40 1px, transparent 1px),
                linear-gradient(to bottom, #B08A5A40 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Background Vector Stylized Landforms */}
          <svg
            viewBox="0 0 1000 600"
            className="w-full h-full object-cover opacity-20 pointer-events-none fill-stone-600"
          >
            {/* Egypt / Nile Basin contour silhouette */}
            <path d="M120,80 Q250,110 320,160 L380,260 Q340,380 280,480 L160,420 Q110,250 120,80 Z" />
            {/* Red Sea Trench */}
            <path d="M370,160 Q430,300 480,480 L520,460 Q460,260 410,130 Z" opacity="0.1" />
            {/* Arabian Peninsula silhouette */}
            <path d="M430,130 Q650,110 880,240 Q940,360 820,490 Q650,560 480,480 Q440,320 430,130 Z" />
          </svg>

          {/* Watermark Emblem */}
          <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none">
            <ViwanMark className="w-24 h-24" isDark={true} />
          </div>

          {/* City Hub Pins */}
          {HUBS.map((hub) => {
            const isSelected = hub.id === selectedHub.id;
            return (
              <div
                key={hub.id}
                onClick={() => setSelectedHub(hub)}
                style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                {/* Ping Ring on Selected */}
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-gold/40 animate-ping pointer-events-none" />
                )}

                {/* Main Pin Dot */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border shadow-lg ${
                    isSelected
                      ? 'bg-gold border-white text-charcoal scale-125'
                      : 'bg-[#222222] border-gold/70 text-gold hover:scale-110 hover:border-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>

                {/* Floating Tag */}
                <div
                  className={`absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 text-[9px] font-mono tracking-wider transition-all pointer-events-none border ${
                    isSelected
                      ? 'bg-white text-charcoal border-gold font-bold shadow-md'
                      : 'bg-black/80 text-stone-300 border-stone-800 group-hover:border-stone-500'
                  }`}
                >
                  {isRtl ? hub.name_ar : hub.name_en} ({hub.projectsCount})
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Hub Inspection Drawer (4 Cols) */}
        <div className="lg:col-span-4 bg-[#FAF6EE] border border-[#E7E2D8] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-stone-500">
              {selectedHub.activeStatus}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h4 className="font-cinzel text-lg text-charcoal font-bold">
              {isRtl ? selectedHub.name_ar : selectedHub.name_en}
            </h4>
            <p className="text-xs text-stone-600 font-light">
              {isRtl ? selectedHub.country_ar : selectedHub.country_en}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white p-3 border border-[#E7E2D8]">
              <span className="text-[9px] text-stone-500 uppercase font-mono block">
                {isRtl ? 'المشاريع المنفذة' : 'Projects'}
              </span>
              <span className="font-cinzel text-xl text-charcoal font-bold">
                {selectedHub.projectsCount}
              </span>
            </div>
            <div className="bg-white p-3 border border-[#E7E2D8]">
              <span className="text-[9px] text-stone-500 uppercase font-mono block">
                {isRtl ? 'المساحة المبنية' : 'GFA (m²)'}
              </span>
              <span className="font-cinzel text-sm text-gold font-bold">
                {selectedHub.gfaM2}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E7E2D8] space-y-1.5">
            <span className="text-[10px] font-semibold text-stone-600 uppercase tracking-wider block">
              {isRtl ? 'المشروع الأبرز في هذا القطاع:' : 'Anchor Landmark Project:'}
            </span>
            <div className="p-3 bg-white border border-[#E7E2D8] flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal">
                {isRtl ? selectedHub.highlightedProjectAr : selectedHub.highlightedProject}
              </span>
              <ArrowUpRight className="w-4 h-4 text-gold" />
            </div>
          </div>

          {/* Quick Hub Switcher Chips */}
          <div className="pt-2">
            <span className="text-[9px] uppercase font-mono tracking-widest text-stone-400 block mb-1.5">
              {isRtl ? 'اختر المدينة للعرض:' : 'SWITCH REGION:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {HUBS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHub(h)}
                  className={`text-[10px] px-2.5 py-1 transition-all border ${
                    h.id === selectedHub.id
                      ? 'bg-charcoal text-white border-charcoal font-medium'
                      : 'bg-white text-stone-600 border-[#E7E2D8] hover:border-gold'
                  }`}
                >
                  {isRtl ? h.name_ar.replace('استوديو ', '').replace('مقر ', '') : h.name_en.replace(' Studio', '')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
