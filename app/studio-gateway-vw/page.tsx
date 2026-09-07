'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ViwanMark } from '@/components/ui/Icons';

export default function StudioGatewayPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center text-stone-300 p-6 text-center select-none">
      <div className="relative mb-6">
        <ViwanMark className="w-16 h-16 animate-pulse" isDark={true} />
      </div>
      <div className="w-8 h-8 border-2 border-[#B08A5A] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-xs uppercase tracking-[0.25em] text-[#B08A5A] font-medium font-sans">
        جاري التحويل إلى لوحة التحكم المعمارية...
      </p>
      <p className="text-[10px] text-stone-500 font-mono mt-1">
        Redirecting to VIWAN Architectural Console (/admin)
      </p>
    </div>
  );
}
