'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, Camera, SlidersHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string; // 3D Render
  afterImage: string;  // As-Built Photography
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  isRtl?: boolean;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = '3D RENDER / المخطط الافتراضي',
  afterLabel = 'AS-BUILT / الواقع بعد التنفيذ',
  className = '',
  isRtl = false,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(Math.round(percentage));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className={`space-y-3 ${className}`} dir="ltr">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full aspect-[16/9] overflow-hidden select-none cursor-ew-resize border border-stone-800 bg-stone-950 shadow-md group"
      >
        {/* Under Layer: After (As-Built Reality) */}
        <img
          src={afterImage}
          alt="After: As-Built"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Top Layer: Before (3D Render) clipped by sliderPosition */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt="Before: 3D Render"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        </div>

        {/* Vertical Divider Hairline */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.8)]"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Centered Knob / Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-charcoal border-2 border-gold text-white flex items-center justify-center shadow-2xl pointer-events-none group-hover:scale-110 transition-transform">
            <SlidersHorizontal className="w-4 h-4 text-gold" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm border border-stone-700 px-2.5 py-1 text-[9px] font-mono tracking-wider uppercase text-white flex items-center space-x-1 pointer-events-none">
          <Sparkles className="w-3 h-3 text-gold" />
          <span>{beforeLabel}</span>
        </div>

        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm border border-stone-700 px-2.5 py-1 text-[9px] font-mono tracking-wider uppercase text-white flex items-center space-x-1 pointer-events-none">
          <Camera className="w-3 h-3 text-gold" />
          <span>{afterLabel}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
        <span>3D COMPUTATIONAL RENDER ({sliderPosition}%)</span>
        <span className="text-stone-400">← DRAG SLIDER TO REVEAL REALITY →</span>
        <span>AS-BUILT ARCHITECTURE ({100 - sliderPosition}%)</span>
      </div>
    </div>
  );
};
