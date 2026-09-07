'use client';

import React, { useRef, useState } from 'react';
import { Crosshair, RotateCcw, Smartphone, Monitor, Square, Check } from 'lucide-react';
import { FocalPoint } from '@/lib/admin-types';

interface FocalPointPickerProps {
  imageUrl: string;
  value?: FocalPoint;
  onChange: (point: FocalPoint) => void;
  isRtl?: boolean;
}

export const FocalPointPicker: React.FC<FocalPointPickerProps> = ({
  imageUrl,
  value = { x: 50, y: 50 },
  onChange,
  isRtl = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculatePoint = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.round(Math.max(0, Math.min(100, rawX)));
    const clampedY = Math.round(Math.max(0, Math.min(100, rawY)));
    onChange({ x: clampedX, y: clampedY });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    calculatePoint(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      calculatePoint(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  if (!imageUrl) {
    return (
      <div className="p-4 border border-dashed border-[#E7E2D8] bg-[#FAF6EE] text-center text-xs text-stone-500">
        {isRtl ? 'يرجى رفع صورة الغلاف أولاً لتحديد نقطة التركيز البصري' : 'Please upload a cover image first to calibrate focal point'}
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white p-4 border border-[#E7E2D8] shadow-sm">
      <div className="flex items-center justify-between border-b border-[#F3EDE3] pb-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Crosshair className="w-4 h-4 text-gold" />
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal">
            {isRtl ? 'معايرة نقطة التركيز البصري المعمارية (Focal Point)' : 'Architectural Focal Point Calibration'}
          </span>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-[10px] font-mono bg-[#FAF6EE] px-2 py-0.5 border border-[#E7E2D8] text-stone-600">
            X: {value.x}% | Y: {value.y}%
          </span>
          <button
            type="button"
            onClick={() => onChange({ x: 50, y: 50 })}
            className="p-1 text-stone-400 hover:text-charcoal hover:bg-[#FAF6EE] transition-colors"
            title={isRtl ? 'إعادة ضبط للمنتصف (50%, 50%)' : 'Reset to Center (50%, 50%)'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-stone-500 font-light leading-relaxed">
        {isRtl
          ? 'انقر أو اسحب المؤشر إلى الجزء الأهم في المبنى (الواجهة الرئيسية أو المدخل). يضمن هذا ظهور الرندر بأعلى جاذبية دون اقتطاع عشوائي على شاشات الهواتف والكمبيوتر.'
          : 'Click or drag the crosshair to the building’s most significant architectural feature (e.g. entrance, cantilever). This guarantees optimal framing across mobile, desktop, and card views.'}
      </p>

      {/* Main Interactive Canvas */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full aspect-[16/9] bg-stone-900 overflow-hidden cursor-crosshair select-none border border-stone-800"
      >
        <img
          src={imageUrl}
          alt="Focal target"
          className="w-full h-full object-cover pointer-events-none opacity-90"
        />

        {/* Horizontal Hairline */}
        <div
          className="absolute left-0 right-0 h-[1px] bg-gold/70 pointer-events-none shadow-[0_0_8px_rgba(176,138,90,0.8)]"
          style={{ top: `${value.y}%` }}
        />

        {/* Vertical Hairline */}
        <div
          className="absolute top-0 bottom-0 w-[1px] bg-gold/70 pointer-events-none shadow-[0_0_8px_rgba(176,138,90,0.8)]"
          style={{ left: `${value.x}%` }}
        />

        {/* Crosshair Target Reticle */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
          style={{ left: `${value.x}%`, top: `${value.y}%` }}
        >
          <div className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center bg-black/40 shadow-xl">
            <div className="w-2 h-2 rounded-full bg-gold" />
          </div>
        </div>
      </div>

      {/* Live Responsive Framer Previews */}
      <div className="pt-2 border-t border-[#F3EDE3] space-y-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-600 block">
          {isRtl ? 'المعاينة التلقائية عبر الشاشات المختلفة:' : 'Responsive Framing Previews:'}
        </span>
        <div className="grid grid-cols-3 gap-3">
          {/* 1. Desktop 16:9 Banner */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1 rtl:space-x-reverse text-[9px] text-stone-500 font-mono">
              <Monitor className="w-3 h-3 text-stone-400" />
              <span>Desktop (16:9)</span>
            </div>
            <div className="w-full aspect-[16/9] bg-stone-200 overflow-hidden border border-[#E7E2D8]">
              <img
                src={imageUrl}
                alt="Desktop preview"
                className="w-full h-full object-cover"
                style={{ objectPosition: `${value.x}% ${value.y}%` }}
              />
            </div>
          </div>

          {/* 2. Mobile 9:16 Story / Header */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1 rtl:space-x-reverse text-[9px] text-stone-500 font-mono">
              <Smartphone className="w-3 h-3 text-stone-400" />
              <span>Mobile Header</span>
            </div>
            <div className="w-full aspect-[4/3] bg-stone-200 overflow-hidden border border-[#E7E2D8]">
              <img
                src={imageUrl}
                alt="Mobile preview"
                className="w-full h-full object-cover"
                style={{ objectPosition: `${value.x}% ${value.y}%` }}
              />
            </div>
          </div>

          {/* 3. Square 1:1 Thumbnail */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1 rtl:space-x-reverse text-[9px] text-stone-500 font-mono">
              <Square className="w-3 h-3 text-stone-400" />
              <span>Square (1:1)</span>
            </div>
            <div className="w-full aspect-square bg-stone-200 overflow-hidden border border-[#E7E2D8]">
              <img
                src={imageUrl}
                alt="Square preview"
                className="w-full h-full object-cover"
                style={{ objectPosition: `${value.x}% ${value.y}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
