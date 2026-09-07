import React from 'react';

/**
 * Exact vector recreation of VIWAN's iconic architectural 'V' emblem
 * Matching user design:
 * - Left stroke: Thick solid charcoal / white diagonal (\)
 * - Middle stroke: Thin crisp charcoal / light diagonal (/)
 * - Right stroke: Warm architectural gold diagonal (/)
 */
export const ViwanMark: React.FC<{ className?: string; isDark?: boolean; goldColor?: string }> = ({
  className = "w-8 h-8",
  isDark = false,
  goldColor = "#B08A5A"
}) => (
  <svg
    viewBox="0 0 130 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} shrink-0`}
  >
    {/* Left Thick Slanted Stroke (\) */}
    <polygon
      points="12,12 30,12 66,88 48,88"
      fill={isDark ? "#FFFFFF" : "#111111"}
    />
    {/* Center Thin Slanted Line (/) */}
    <polygon
      points="90.5,12 94.5,12 68.5,66 64.5,66"
      fill={isDark ? "#E5E7EB" : "#111111"}
    />
    {/* Right Architectural Gold Stroke (/) */}
    <polygon
      points="114,12 124.5,12 87.5,88 77,88"
      fill={goldColor}
    />
  </svg>
);

/**
 * Full Horizontal VIWAN Brand Logo
 */
export const ViwanBrandLogo: React.FC<{
  className?: string;
  isDark?: boolean;
  subtitle?: string;
}> = ({
  className = "",
  isDark = false,
  subtitle = "ARCHITECTURE CONSULTANCY"
}) => (
  <div dir="ltr" className={`flex items-center space-x-3.5 ${className}`}>
    <ViwanMark className="w-8 h-8 sm:w-9 sm:h-9" isDark={isDark} />
    <div className="flex flex-col justify-center text-left">
      <span
        className={`font-cinzel text-xl sm:text-2xl font-bold tracking-[0.2em] leading-none ${
          isDark ? "text-white" : "text-charcoal"
        }`}
      >
        VIWAN
      </span>
      <span
        className={`text-[8px] sm:text-[9px] tracking-[0.25em] font-montserrat uppercase font-medium mt-1 ${
          isDark ? "text-stone-400" : "text-stone-500"
        }`}
      >
        {subtitle}
      </span>
    </div>
  </div>
);

export const ViwanOfficialLogo: React.FC<{ className?: string; alt?: string; isDark?: boolean }> = ({
  className = "w-10 h-10",
  alt = "VIWAN Architecture",
  isDark = false
}) => (
  <ViwanMark className={className} isDark={isDark} />
);

/**
 * Replaced legacy compass icon with VIWAN's iconic architectural mark
 */
export const CompassLogo: React.FC<{ className?: string; color?: string; isDark?: boolean }> = ({
  className = "w-6 h-6",
  color = "#B08A5A",
  isDark = false
}) => (
  <ViwanMark className={className} isDark={isDark} goldColor={color} />
);

export const BlueprintIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="0" />
    <path d="M3 9H21" />
    <path d="M9 21V9" />
    <path d="M15 9V15" />
  </svg>
);

export const StructuralIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M3 21L12 3L21 21H3Z" />
    <path d="M12 3V21" />
    <path d="M7.5 12H16.5" />
  </svg>
);

export const MepIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <rect x="4" y="4" width="16" height="16" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 4V9" />
    <path d="M12 15V20" />
    <path d="M4 12H9" />
    <path d="M15 12H20" />
  </svg>
);

export const ManagementIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="0" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

export const SupervisionIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const SustainabilityIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 3C7 3 3 8 3 13C3 18 7 21 12 21C17 21 21 17 21 12C21 7 17 3 12 3Z" />
    <path d="M12 21C12 15 15 12 21 12" />
  </svg>
);
