'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ViwanMark } from '@/components/ui/Icons';
import { AdminLocale } from '@/lib/i18n/adminTranslations';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldAlert, Globe } from 'lucide-react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [locale, setLocale] = useState<AdminLocale>('ar');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [validating, setValidating] = useState(true);
  const [tokenError, setTokenError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('viwan_admin_locale') as AdminLocale;
    if (saved === 'en' || saved === 'ar') {
      setLocale(saved);
    }

    if (!token) {
      setTokenValid(false);
      setTokenError('رمز استعادة كلمة المرور مفقود أو غير صالح.');
      setValidating(false);
      return;
    }

    // Non-destructive GET verification to test token without consuming it
    fetch(`/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setTokenError(data.error || 'الرابط منتهي الصلاحية أو تم استخدامه مسبقاً.');
        }
      })
      .catch(() => {
        setTokenValid(false);
        setTokenError('فشل التحقق من صحة الرابط.');
      })
      .finally(() => {
        setValidating(false);
      });
  }, [token]);

  const toggleLanguage = () => {
    const next = locale === 'ar' ? 'en' : 'ar';
    setLocale(next);
    localStorage.setItem('viwan_admin_locale', next);
  };

  const isRtl = locale === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError(isRtl ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError(isRtl ? 'يجب أن تتكون كلمة المرور من 8 خانات على الأقل.' : 'Password must be at least 8 characters long.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || (isRtl ? 'فشل تحديث كلمة المرور' : 'Password reset failed'));
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/login');
        }, 3000);
      }
    } catch {
      setError(isRtl ? 'حدث خطأ في الاتصال بالسيرفر' : 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-charcoal flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none ${
        isRtl ? 'font-cairo' : 'font-montserrat'
      }`}
    >
      {/* Background Subtle Mesh */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #B08A5A30 1px, transparent 1px),
            linear-gradient(to bottom, #B08A5A30 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Language Switcher */}
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
            VIWAN
          </h1>
          <p className="text-[10px] tracking-[0.3em] text-gold uppercase font-medium">
            {isRtl ? 'تعيين كلمة المرور الجديدة' : 'SECURE PASSWORD RESET'}
          </p>
        </div>

        {/* Box */}
        <div className="bg-[#181818] border border-stone-800 p-8 sm:p-10 shadow-2xl space-y-6">
          {validating ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-stone-400 font-light">
                {isRtl ? 'جاري التحقق الآمن من صلاحية الرابط...' : 'Verifying cryptographic token...'}
              </p>
            </div>
          ) : !tokenValid ? (
            <div className="space-y-4">
              <div className="p-4 bg-red-950/60 border border-red-800 text-xs text-red-300 space-y-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse font-semibold">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{isRtl ? 'رابط غير صالح أو منتهي' : 'Invalid or Expired Link'}</span>
                </div>
                <p className="text-stone-300 text-[11px] leading-relaxed font-light">{tokenError}</p>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/admin/forgot-password"
                  className="inline-block bg-charcoal hover:bg-gold border border-stone-700 text-white text-xs font-semibold tracking-wider uppercase py-2.5 px-6 transition-all"
                >
                  {isRtl ? 'طلب رابط جديد' : 'Request New Link'}
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-cinzel text-lg text-white font-medium">
                  {isRtl ? 'تم تغيير كلمة المرور بنجاح' : 'Password Reset Complete'}
                </h3>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  {isRtl
                    ? 'تم تشفير كلمة المرور الجديدة وإلغاء جميع الجلسات القديمة. جاري تحويلك لصفحة الدخول...'
                    : 'Your password is updated and all active sessions were terminated. Redirecting to login...'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <h2 className="font-cinzel text-lg tracking-wider uppercase text-white font-medium">
                  {isRtl ? 'أدخل كلمة المرور الجديدة' : 'ENTER NEW PASSWORD'}
                </h2>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  {isRtl
                    ? 'اختر كلمة مرور قوية مكونة من 8 أحرف وأرقام على الأقل.'
                    : 'Choose a strong password with at least 8 characters.'}
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-xs text-red-300">
                  {error}
                </div>
              )}

              {/* New Password Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 block">
                  {isRtl ? 'كلمة المرور الجديدة' : 'NEW PASSWORD'}
                </label>
                <div className="relative">
                  <Lock className={`w-4 h-4 text-stone-500 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    dir="ltr"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 block">
                  {isRtl ? 'تأكيد كلمة المرور' : 'CONFIRM PASSWORD'}
                </label>
                <div className="relative">
                  <Lock className={`w-4 h-4 text-stone-500 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    dir="ltr"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-[#121212] border border-stone-800 focus:border-gold text-white text-xs ${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-3 outline-none transition-colors`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-charcoal hover:bg-gold border border-stone-700 hover:border-gold text-white text-xs font-semibold tracking-widest uppercase py-3.5 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50 group"
              >
                <span>{submitting ? (isRtl ? 'جاري الحفظ...' : 'Updating...') : (isRtl ? 'تأكيد وتغيير كلمة المرور' : 'Update Password')}</span>
                <ArrowRight className="w-4 h-4 text-gold group-hover:text-white transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-stone-800 text-center">
            <Link href="/admin/login" className="text-xs text-stone-400 hover:text-gold transition-colors">
              {isRtl ? '← العودة لتسجيل الدخول' : '← Back to Login'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-charcoal flex items-center justify-center text-gold font-cinzel text-sm">
          LOADING...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
