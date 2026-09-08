'use client';

import React from 'react';
import { Project } from '@/lib/admin-types';
import { ViwanBrandLogo, ViwanMark } from '@/components/ui/Icons';
import { Printer, Download, X, MapPin, Calendar, Building, Layers } from 'lucide-react';

interface ProjectMonographPrintProps {
  project: Project;
  onClose: () => void;
  isRtl?: boolean;
  locale?: string;
}

export const ProjectMonographPrint: React.FC<ProjectMonographPrintProps> = ({
  project,
  onClose,
  isRtl = false,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm overflow-y-auto flex justify-center p-4 sm:p-8">
      {/* Container holding Action Toolbar & Printable Canvas */}
      <div className="w-full max-w-4xl space-y-4">
        {/* Screen-Only Action Toolbar */}
        <div className="print:hidden bg-charcoal text-white p-4 border border-stone-800 flex items-center justify-between shadow-2xl">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <ViwanMark className="w-6 h-6" isDark={true} />
            <div className="text-left rtl:text-right">
              <span className="text-xs font-cinzel tracking-widest text-gold block">
                VIWAN ARCHITECTURAL MONOGRAPH EXPORT
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                Publication-Ready Client Presentation Portfolio (PDF)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={handlePrint}
              className="bg-gold hover:bg-gold-light text-charcoal px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 rtl:space-x-reverse transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>{isRtl ? 'طباعة / حفظ كـ PDF فاخر' : 'Print / Save as PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="bg-stone-800 hover:bg-stone-700 text-stone-300 p-2 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Monograph Document Canvas */}
        <div
          id="viwan-monograph-document"
          className="bg-white text-charcoal p-8 sm:p-14 shadow-2xl space-y-10 border border-stone-300 print:border-none print:shadow-none print:p-0 print:m-0"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="border-b-2 border-charcoal pb-6 flex items-start justify-between">
            <ViwanBrandLogo isDark={false} className="scale-95 origin-top-left rtl:origin-top-right" />
            <div className="text-right rtl:text-left font-mono text-[10px] text-stone-600 space-y-0.5">
              <div className="font-bold text-charcoal">{project.code}</div>
              <div>DOC REF: VIWAN-MONO-{project.year}-{project.id.slice(-4)}</div>
              <div>CLASSIFICATION: EXECUTIVE CLIENT DOSSIER</div>
              <div>DATE: {new Date().toLocaleDateString('en-GB')}</div>
            </div>
          </div>

          {/* Title & Core Architectural Abstract */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-gold font-mono text-xs uppercase tracking-widest">
              <span>{project.sector_en}</span>
              <span>•</span>
              <span>{project.location_en}</span>
              {project.lifecycle_stage && (
                <>
                  <span>•</span>
                  <span className="font-bold">STAGE: {project.lifecycle_stage.toUpperCase()}</span>
                </>
              )}
            </div>
            <h1 className="font-cinzel text-3xl sm:text-4xl text-charcoal font-bold tracking-tight">
              {isRtl ? (project.title_ar || project.title_en) : project.title_en}
            </h1>
            <p className="font-cinzel text-lg text-stone-600 font-light italic">
              {isRtl ? (project.subtitle_ar || project.subtitle_en) : project.subtitle_en}
            </p>
          </div>

          {/* Hero Render Banner */}
          {project.cover_image && (
            <div className="w-full aspect-[16/9] overflow-hidden bg-stone-100 border border-stone-300 shadow-sm">
              <img
                src={project.cover_image}
                alt={project.title_en}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: project.focal_point
                    ? `${project.focal_point.x}% ${project.focal_point.y}%`
                    : 'center',
                }}
              />
            </div>
          )}

          {/* Technical Specifications Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#FAF6EE] border border-[#E7E2D8]">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-stone-500 tracking-wider block">
                {isRtl ? 'الجهة المالكة / العميل' : 'CLIENT / OWNER'}
              </span>
              <span className="text-xs font-semibold text-charcoal">
                {isRtl ? (project.client_ar || project.client_en || 'مجموعة خاصة') : (project.client_en || 'Private Client')}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-stone-500 tracking-wider block">
                {isRtl ? 'الموقع الجغرافي' : 'LOCATION'}
              </span>
              <span className="text-xs font-semibold text-charcoal">
                {isRtl ? project.location_ar : project.location_en}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-stone-500 tracking-wider block">
                {isRtl ? 'المساحة المبنية' : 'GROSS FLOOR AREA'}
              </span>
              <span className="text-xs font-semibold text-charcoal">
                {project.area_sqm || '30,000 m²'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-stone-500 tracking-wider block">
                {isRtl ? 'سنة الإنجاز / التسليم' : 'COMPLETION YEAR'}
              </span>
              <span className="text-xs font-semibold text-charcoal">
                {project.year}
              </span>
            </div>
          </div>

          {/* Architectural Vision & Technical Narrative */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-3">
              <h2 className="font-cinzel text-sm font-bold uppercase tracking-widest text-charcoal border-b border-stone-200 pb-2">
                {isRtl ? 'الرؤية المعمارية والمفهوم التصميمي' : 'ARCHITECTURAL CONCEPT & VISION'}
              </h2>
              <p className="text-xs text-stone-700 leading-relaxed font-light text-justify">
                {isRtl ? (project.vision_ar || project.vision_en) : (project.vision_en || project.vision_ar)}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-cinzel text-sm font-bold uppercase tracking-widest text-charcoal border-b border-stone-200 pb-2">
                {isRtl ? 'الأنظمة الهندسية والاستدامة' : 'SYSTEMS, MATERIALS & PERFORMANCE'}
              </h2>
              <p className="text-xs text-stone-700 leading-relaxed font-light text-justify">
                {isRtl ? (project.details_ar || project.details_en) : (project.details_en || project.details_ar)}
              </p>
            </div>
          </div>

          {/* Services Disciplines List */}
          {project.services_en && project.services_en.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono uppercase text-stone-500 tracking-wider block">
                {isRtl ? 'نطاق الخدمات الهندسية المقدمة من فيوان:' : 'DELIVERED DISCIPLINES & CONSULTANCY SCOPE:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {(isRtl ? (project.services_ar || project.services_en) : project.services_en).map((srv, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-stone-100 border border-stone-300 px-3 py-1 text-charcoal"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Snapshot Grid (Print Layout) */}
          {project.gallery_images && project.gallery_images.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="font-cinzel text-xs font-bold uppercase tracking-widest text-charcoal">
                {isRtl ? 'ملحق الصور والمخططات المعمارية' : 'ARCHITECTURAL ELEVATIONS & RENDERS'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.gallery_images.slice(0, 3).map((img, i) => (
                  <div key={i} className="aspect-[4/3] bg-stone-100 overflow-hidden border border-stone-300">
                    <img src={img} alt={`Render ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Footer with Signoff */}
          <div className="pt-8 border-t border-stone-300 grid grid-cols-2 gap-6 text-[10px] font-mono text-stone-500">
            <div>
              <div className="font-bold text-charcoal uppercase">VIWAN ARCHITECTURE CONSULTANCY</div>
              <div>Cairo Studio • Riyadh Studio • Dubai Alliance</div>
              <div>info@viwan.com • www.viwan.com</div>
            </div>
            <div className="text-right rtl:text-left space-y-1">
              <div className="font-bold text-charcoal">AUTHENTICATED MONOGRAPH</div>
              <div className="italic text-stone-400">Chief Architect Review Passed</div>
              <div className="w-28 h-[1px] bg-stone-400 ml-auto rtl:ml-0 rtl:mr-auto my-1" />
              <div>AUTHORIZED ARCHITECT SIGNATURE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
