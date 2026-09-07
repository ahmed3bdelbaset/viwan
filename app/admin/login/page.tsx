'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ViwanMark } from '@/components/ui/Icons';
import { AuthService } from '@/lib/auth';
import { AdminLocale, adminTranslations } from '@/lib/i18n/adminTranslations';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Globe } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<AdminLocale>('ar');
  const [email, setEmail] = useState('');
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
    } catch (err) {
      setError(isRtl ? 'حدث خطأ أثناء الاتصال' : 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-charcoal flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none ${
        isRtl ? 'font-cairo' : 'font-montserrat'
      }`}
    >
      {/* Background Architectural Blueprint Subtle Mesh */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #B08A5A30 1px, transparent 1px),
            linear-gradient(to bottom, #B08A5A30 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Language Switcher in Top Corner */}
      <div className="absolute top-6 right-6 rtl:right-auto rtl:left-6 z-20">
        <button
          onClick={toggleLanguage}
          className="border border-stone-700 bg-stone-900/80 hover:border-gold px-3.5 py-1.5 text-xs text-stone-300 hover:text-white flex items-center space-x-2 rtl:space-x-reverse transition-colors backdrop-blur-sm"
        >
          <Globe className="w-3.5 h-3.5 text-gold" />
          <span className="font-semibold">{locale === 'ar' ? 'English' : 'العربية'}</span>
        </button>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <ViwanMark className="w-16 h-16 mx-auto" isDark={true} />
          <h1 className="font-cinzel text-3xl font-bold tracking-[0.25em] text-white">
            {t.title}
          </h1>
          <p className="text-[10px] tracking-[0.3em] text-gold uppercase font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#181818] border border-stone-800 p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="font-cinzel text-lg tracking-wider uppercase text-white font-medium">
              {t.subtitle}
            </h2>
            <p className="text-xs text-stone-400 font-light">
              {t.desc}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-xs text-red-300 space-y-1">
              <p>{error}</p>
              {retryCountdown && (
                <p className="font-mono text-amber-400 font-semibold text-[11px]">
                  {isRtl
                    ? `⏳ يرجى الانتظار: ${retryCountdown} ثانية قبل إعادة المحاولة`
                    : `⏳ Security Lockout: Please wait ${retryCountdown}s before retrying`}
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 block">
                {t.email}
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 text-stone-500 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className={`w-full bg-[#121212] border border-stone-800 focus:border-gold text-white text-xs ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-3 outline-none transition-colors font-mono`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 block">
                {t.password}
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 text-stone-500 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-[#121212] border border-stone-800 focus:border-gold text-white text-xs ${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-3 outline-none transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 bg-stone-900 border-stone-700 text-gold focus:ring-0 rounded-none cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs text-stone-400 font-light cursor-pointer">
                  {t.rememberMe}
                </label>
              </div>

              <Link
                href="/admin/forgot-password"
                className="text-[11px] text-stone-400 hover:text-gold transition-colors"
              >
                {isRtl ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal hover:bg-gold border border-stone-700 hover:border-gold text-white text-xs font-semibold tracking-widest uppercase py-3.5 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50 group"
            >
              <span>{loading ? t.signingIn : t.signInBtn}</span>
              <ArrowRight className="w-4 h-4 text-gold group-hover:text-white transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </button>
          </form>

          <div className="pt-4 border-t border-stone-800 text-center">
            <Link href={`/${locale}`} className="text-xs text-stone-500 hover:text-gold transition-colors">
              {t.backToSite}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
