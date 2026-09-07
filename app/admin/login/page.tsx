'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ViwanMark } from '@/components/ui/Icons';
import { AuthService } from '@/lib/auth';
import { AdminLocale, adminTranslations } from '@/lib/i18n/adminTranslations';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Globe, Check } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<AdminLocale>('ar');
  const [email, setEmail] = useState('admin@viwan.studio');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (retryCountdown && retryCountdown > 0) {
      timer = setInterval(() => {
        setRetryCountdown((prev) => (prev && prev > 1 ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [retryCountdown]);

  useEffect(() => {
    const saved = localStorage.getItem('viwan_admin_locale') as AdminLocale;
    if (saved === 'en' || saved === 'ar') {
      setLocale(saved);
    }
    if (AuthService.isAuthenticated()) {
      router.push('/admin');
    }
  }, [router]);

  const toggleLanguage = () => {
    const next = locale === 'ar' ? 'en' : 'ar';
    setLocale(next);
    localStorage.setItem('viwan_admin_locale', next);
  };

  const isRtl = locale === 'ar';
  const t = adminTranslations[locale].login;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (retryCountdown) return;
    setError('');
    setLoading(true);

    try {
      const res = await AuthService.login(email, password, remember);
      if (res.success) {
        router.push('/admin');
      } else {
        if (res.retryAfter) {
          setRetryCountdown(res.retryAfter);
        }
        setError(res.error || (isRtl ? 'فشل التحقق من بيانات الدخول' : 'Authentication failed'));
      }
    } catch {
      setError(isRtl ? 'حدث خطأ أثناء الاتصال بالخادم' : 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`min-h-screen w-full relative flex flex-col lg:flex-row overflow-x-hidden select-none bg-[#F7F4EC] ${
        isRtl ? 'font-cairo' : 'font-sans'
      }`}
    >
      {/* ========================================================================= */}
      {/* MOBILE FULL-SCREEN BACKGROUND (Visible on < lg screens) */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed inset-0 z-0">
        <Image
          src="/images/admin-login-terrace.jpg"
          alt="VIWAN Architectural Courtyard Terrace"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft atmospheric gradient for text and card readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55 pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP LEFT COLUMN: ARCHITECTURAL EDITORIAL TERRACE (Visible on lg+) */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative min-h-screen flex-col justify-between p-12 xl:p-16 z-10 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/admin-login-terrace.jpg"
            alt="VIWAN Architectural Courtyard Terrace"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          {/* Subtle vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/35 pointer-events-none" />
        </div>

        {/* Top-Left Brand Pillar Tagline */}
        <div className="relative z-10 space-y-2">
          <div className="text-[10px] xl:text-[11px] font-mono tracking-[0.3em] uppercase text-stone-200 font-light leading-relaxed">
            <div>SPACES</div>
            <div>PEOPLE</div>
            <div>POSSIBILITIES</div>
          </div>
          <div className="w-8 h-[1.5px] bg-[#B08A5A]" />
        </div>

        {/* Bottom-Left Editorial Vision Narrative */}
        <div className="relative z-10 space-y-4 max-w-sm">
          <h2 className="font-cinzel text-3xl xl:text-4xl text-[#FAF6EE] font-normal leading-[1.12]">
            Designing
            <br />
            a Better
            <br />
            Tomorrow
          </h2>

          <div className="w-8 h-[1.5px] bg-[#B08A5A]" />

          <p className="text-xs xl:text-sm text-stone-200/90 font-light leading-relaxed">
            {isRtl
              ? 'في فيوان، نُحوّل الرؤى المعمارية إلى فراغات ذات معنى ملهم عبر التناغم الهندسي، نقاء الخامات، وصدق التفاصيل.'
              : 'At VIWAN, we turn ideas into meaningful spaces through architecture, design and innovation.'}
          </p>

          <div className="pt-2">
            <span className="text-[10px] font-mono tracking-widest text-stone-300 uppercase">
              01 &nbsp;/&nbsp; 03
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN (DESKTOP) & FULL CONTAINER (MOBILE): LOGIN WORKSTATION */}
      {/* ========================================================================= */}
      <div className="relative z-10 flex-1 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16">
        {/* Top Header Row on Desktop / Mobile */}
        <div className="w-full flex items-center justify-between z-20">
          {/* Mobile-only Top Brand Tagline */}
          <div className="lg:hidden space-y-1.5">
            <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] uppercase text-stone-200 font-light">
              SPACES / PEOPLE / POSSIBILITIES
            </div>
            <div className="w-6 h-[1.5px] bg-[#B08A5A]" />
          </div>

          {/* Desktop Left Blank Spacer (for RTL/LTR balance) */}
          <div className="hidden lg:block" />

          {/* Top-Right: Language Selector & Admin Portal Badge */}
          <div className="flex items-center gap-4">
            <span className="hidden lg:inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#8C6D45] uppercase">
              <span className="w-4 h-[1px] bg-[#8C6D45]" />
              ADMIN PORTAL
            </span>

            <button
              type="button"
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-full border border-stone-300/80 lg:border-[#E5DFD3] bg-white/85 lg:bg-white text-xs text-charcoal hover:text-[#B08A5A] hover:border-[#B08A5A] transition-all flex items-center gap-1.5 shadow-2xs backdrop-blur-sm cursor-pointer active:scale-95"
              title={isRtl ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
            >
              <Globe className="w-3.5 h-3.5 text-[#B08A5A]" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                {locale === 'ar' ? 'AR' : 'EN'}
              </span>
            </button>
          </div>
        </div>

        {/* Center Stage: The Luxury Floating Login Card */}
        <div className="w-full flex items-center justify-center my-auto py-8">
          <div className="w-full max-w-[450px] bg-[#FAF6EE]/95 lg:bg-[#FAF6EE] backdrop-blur-md lg:backdrop-blur-none rounded-[24px] p-7 sm:p-10 border border-[#E7E1D4] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12),0_0_0_1px_rgba(201,193,181,0.25)] space-y-6 animate-fade-in">
            {/* 1. VIWAN Brand Header inside Card */}
            <div className="text-center space-y-1.5 select-none">
              <div className="flex justify-center mb-2">
                <ViwanMark className="w-11 h-11" isDark={false} />
              </div>
              <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.3em] text-[#111111] uppercase">
                V I W A N
              </h1>
              <p className="text-[8.5px] font-sans tracking-[0.28em] text-[#B08A5A] uppercase font-semibold">
                ARCHITECTURE & DESIGN STUDIO
              </p>
            </div>

            {/* 2. Portal Title & Welcome Text */}
            <div className="text-center space-y-1 pt-1">
              <h2 className="font-cairo text-lg sm:text-xl font-bold text-[#111111]">
                {t.title}
              </h2>
              <p className="text-xs text-stone-500 font-light">
                {t.desc}
              </p>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg space-y-1 animate-shake">
                <p>{error}</p>
                {retryCountdown && (
                  <p className="font-mono text-amber-700 font-semibold text-[11px]">
                    {isRtl
                      ? `⏳ يرجى الانتظار: ${retryCountdown} ثانية قبل إعادة المحاولة`
                      : `⏳ Security Lockout: Please wait ${retryCountdown}s`}
                  </p>
                )}
              </div>
            )}

            {/* 3. Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1">
                <div className="relative flex items-center bg-white border border-[#E5DFD3] rounded-lg focus-within:border-[#B08A5A] focus-within:ring-1 focus-within:ring-[#B08A5A]/30 transition-all">
                  <div className="ps-3.5 text-stone-400 pointer-events-none shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@viwan.studio"
                    className="w-full bg-transparent p-3 text-xs text-[#111111] placeholder:text-stone-400 outline-none font-sans font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="relative flex items-center bg-white border border-[#E5DFD3] rounded-lg focus-within:border-[#B08A5A] focus-within:ring-1 focus-within:ring-[#B08A5A]/30 transition-all">
                  <div className="ps-3.5 text-stone-400 pointer-events-none shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-transparent p-3 text-xs text-[#111111] placeholder:text-stone-400 outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="pe-3.5 text-stone-400 hover:text-charcoal transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options Row: Remember Session & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600 font-medium">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={remember}
                    onClick={() => setRemember(!remember)}
                    className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                      remember
                        ? 'bg-[#8C6D45] border border-[#8C6D45] text-white'
                        : 'bg-white border border-[#E5DFD3]'
                    }`}
                  >
                    {remember && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  <span className="text-[11px] sm:text-xs text-stone-700">
                    {isRtl ? 'تذكر الجلسة لمدة 30 يوماً' : 'Remember for 30 days'}
                  </span>
                </label>

                <Link
                  href="/admin/forgot-password"
                  className="text-[11px] sm:text-xs text-[#8C6D45] hover:text-[#111111] hover:underline transition-colors font-medium"
                >
                  {t.forgotPassword}
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1C1B19] hover:bg-[#8C6D45] text-white py-3.5 px-6 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.98] group mt-2"
              >
                <span>{loading ? t.signingIn : (isRtl ? 'تسجيل الدخول إلى اللوحة' : 'Sign in to Dashboard')}</span>
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-px flex-1 bg-[#E7E1D4]" />
              <span className="text-xs text-stone-400 font-sans">
                {isRtl ? 'أو' : 'or'}
              </span>
              <div className="h-px flex-1 bg-[#E7E1D4]" />
            </div>

            {/* Back to Public Site Link */}
            <div className="text-center pt-0.5">
              <Link
                href={`/${locale}`}
                className="inline-flex items-center gap-1.5 text-xs text-[#8C6D45] hover:text-[#111111] font-medium transition-colors group"
              >
                {isRtl ? (
                  <>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    <span>العودة إلى الموقع العام</span>
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    <span>Return to Public Website</span>
                  </>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer Row on Desktop / Mobile */}
        <div className="w-full flex items-center justify-between z-20 text-[10px] font-mono tracking-widest text-[#8C6D45] uppercase">
          {/* Mobile Bottom Narrative Snippet */}
          <div className="lg:hidden text-stone-300/90 text-left rtl:text-right space-y-1 font-serif">
            <div className="text-sm font-cinzel">Designing a Better Tomorrow</div>
            <div className="w-6 h-[1px] bg-[#B08A5A]" />
          </div>

          <div className="hidden lg:block text-stone-400">
            VIWAN STUDIO // OS 2026
          </div>

          {/* Desktop Right Pillar Mark */}
          <div className="hidden lg:flex items-center gap-2">
            <span>BUILT ON A VISION</span>
            <span className="w-4 h-[1px] bg-[#8C6D45]" />
          </div>
        </div>
      </div>
    </div>
  );
}
