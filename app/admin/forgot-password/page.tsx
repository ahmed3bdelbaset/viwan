'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ViwanMark } from '@/components/ui/Icons';
import { AdminLocale } from '@/lib/i18n/adminTranslations';
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Globe,
  ShieldAlert,
  Clock,
  RotateCcw
} from 'lucide-react';

export default function AdminForgotPasswordPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<AdminLocale>('ar');
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State (Held strictly in Component Memory - Zero LocalStorage / SessionStorage)
  const [email, setEmail] = useState('');
  const [requestId, setRequestId] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(5);

  // 10-Minute Live Countdown Timer for OTP
  const [otpTimerSeconds, setOtpTimerSeconds] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    const saved = localStorage.getItem('viwan_admin_locale') as AdminLocale;
    if (saved === 'en' || saved === 'ar') {
      setLocale(saved);
    }
  }, []);

  // OTP Expiration Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && otpTimerSeconds > 0) {
      interval = setInterval(() => {
        setOtpTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimerSeconds]);

  // Resend Cooldown Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendCooldown]);

  const toggleLanguage = () => {
    const next = locale === 'ar' ? 'en' : 'ar';
    setLocale(next);
    localStorage.setItem('viwan_admin_locale', next);
  };

  const isRtl = locale === 'ar';

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Step 1: Submit Email & Request 6-digit OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || (isRtl ? 'حدث خطأ أثناء معالجة الطلب.' : 'Failed to request password reset.'));
      } else {
        setRequestId(data.requestId || '');
        setSuccessMessage(data.message);
        setOtpTimerSeconds(600); // 10 minutes
        setResendCooldown(60);
        setCanResend(false);
        setStep(2);
      }
    } catch {
      setError(isRtl ? 'تعذر الاتصال بالسيرفر.' : 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError(isRtl ? 'يجب أن يتكون رمز التحقق من 6 أرقام.' : 'Verification code must be 6 digits.');
      return;
    }

    if (otpTimerSeconds <= 0) {
      setError(isRtl ? 'انتهت صلاحية رمز التحقق (10 دقائق). يرجى طلب رمز جديد.' : 'OTP expired. Please request a new one.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, otp }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.attemptsRemaining !== undefined) {
          setAttemptsRemaining(data.attemptsRemaining);
        }
        setError(data.error || (isRtl ? 'رمز التحقق غير صحيح.' : 'Invalid verification code.'));
      } else {
        setResetToken(data.resetToken || '');
        setStep(3);
      }
    } catch {
      setError(isRtl ? 'حدث خطأ أثناء التحقق.' : 'Verification error.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError(isRtl ? 'يجب ألا تقل كلمة المرور عن 8 خانات.' : 'Password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(isRtl ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || (isRtl ? 'فشل تحديث كلمة المرور.' : 'Password reset failed.'));
      } else {
        setStep(4);
        setTimeout(() => {
          router.push('/admin/login');
        }, 3000);
      }
    } catch {
      setError(isRtl ? 'حدث خطأ أثناء حفظ كلمة المرور.' : 'Error updating password.');
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
      {/* Subtle Blueprint Mesh */}
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
            {isRtl ? 'إعادة تعيين كلمة المرور - EMAIL OTP' : 'SECURE PASSWORD RECOVERY'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-4 text-xs font-mono">
          <div className={`flex items-center space-x-1.5 rtl:space-x-reverse ${step >= 1 ? 'text-gold' : 'text-stone-600'}`}>
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${step >= 1 ? 'border-gold bg-gold/10' : 'border-stone-700'}`}>1</span>
            <span className="text-[11px]">{isRtl ? 'البريد' : 'Email'}</span>
          </div>
          <span className="w-6 h-[1px] bg-stone-800" />
          <div className={`flex items-center space-x-1.5 rtl:space-x-reverse ${step >= 2 ? 'text-gold' : 'text-stone-600'}`}>
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${step >= 2 ? 'border-gold bg-gold/10' : 'border-stone-700'}`}>2</span>
            <span className="text-[11px]">{isRtl ? 'رمز OTP' : 'OTP Code'}</span>
          </div>
          <span className="w-6 h-[1px] bg-stone-800" />
          <div className={`flex items-center space-x-1.5 rtl:space-x-reverse ${step >= 3 ? 'text-gold' : 'text-stone-600'}`}>
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${step >= 3 ? 'border-gold bg-gold/10' : 'border-stone-700'}`}>3</span>
            <span className="text-[11px]">{isRtl ? 'كلمة السر' : 'Password'}</span>
          </div>
        </div>

        {/* Main Box */}
        <div className="bg-[#181818] border border-stone-800 p-8 sm:p-10 shadow-2xl space-y-6">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center space-x-2 rtl:space-x-reverse">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 1: ENTER EMAIL */}
          {/* ========================================================================= */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="space-y-1">
                <h2 className="font-cinzel text-lg tracking-wider uppercase text-white font-medium">
                  {isRtl ? 'طلب رمز التحقق' : 'REQUEST OTP CODE'}
                </h2>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  {isRtl
                    ? 'أدخل بريدك الإلكتروني المسجل وسنرسل لك رمز تحقق أمني مكون من 6 أرقام عبر البريد الإلكتروني.'
                    : 'Enter your registered email and we will dispatch a 6-digit security OTP code via Brevo.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 block">
                  {isRtl ? 'البريد الإلكتروني' : 'EMAIL ADDRESS'}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal hover:bg-gold border border-stone-700 hover:border-gold text-white text-xs font-semibold tracking-widest uppercase py-3.5 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50 group"
              >
                <span>{loading ? (isRtl ? 'جاري الإرسال عبر Brevo...' : 'Dispatching via Brevo...') : (isRtl ? 'إرسال رمز التحقق' : 'Send Verification OTP')}</span>
                <ArrowRight className="w-4 h-4 text-gold group-hover:text-white transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: VERIFY 6-DIGIT OTP */}
          {/* ========================================================================= */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-1">
                <h2 className="font-cinzel text-lg tracking-wider uppercase text-white font-medium">
                  {isRtl ? 'أدخل رمز التحقق (OTP)' : 'ENTER 6-DIGIT OTP'}
                </h2>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  {isRtl
                    ? `تم إرسال رمز الأمان إلى (${email}). الرمز صالح لمدة 10 دقائق.`
                    : `A 6-digit code has been dispatched to (${email}). Valid for 10 minutes.`}
                </p>
              </div>

              {/* Countdown & Attempts Badge */}
              <div className="flex items-center justify-between p-2.5 bg-stone-900/60 border border-stone-800 text-[11px]">
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-amber-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(otpTimerSeconds)}</span>
                </div>
                <div className="text-stone-400 font-mono">
                  {isRtl ? `المحاولات: ${attemptsRemaining}/5` : `Attempts: ${attemptsRemaining}/5`}
                </div>
              </div>

              {/* OTP Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 block">
                  {isRtl ? 'رمز التحقق (6 أرقام)' : '6-DIGIT OTP CODE'}
                </label>
                <div className="relative">
                  <KeyRound className={`w-4 h-4 text-stone-500 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    dir="ltr"
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className={`w-full bg-[#121212] border border-stone-800 focus:border-gold text-white text-center text-xl tracking-[0.5em] font-mono py-3 outline-none transition-colors`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6 || otpTimerSeconds <= 0}
                className="w-full bg-charcoal hover:bg-gold border border-stone-700 hover:border-gold text-white text-xs font-semibold tracking-widest uppercase py-3.5 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50 group"
              >
                <span>{loading ? (isRtl ? 'جاري التحقق...' : 'Verifying...') : (isRtl ? 'تأكيد الرمز' : 'Verify Code')}</span>
                <ArrowRight className="w-4 h-4 text-gold group-hover:text-white transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>

              {/* Resend Option */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  disabled={!canResend || loading}
                  onClick={handleRequestOtp}
                  className="text-xs text-stone-400 hover:text-gold transition-colors disabled:opacity-40 disabled:hover:text-stone-400 inline-flex items-center space-x-1.5 rtl:space-x-reverse"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>
                    {canResend
                      ? (isRtl ? 'إعادة إرسال رمز جديد' : 'Resend new code')
                      : (isRtl ? `إعادة الإرسال بعد (${resendCooldown}s)` : `Resend available in (${resendCooldown}s)`)}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: SET NEW PASSWORD */}
          {/* ========================================================================= */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-1">
                <h2 className="font-cinzel text-lg tracking-wider uppercase text-white font-medium">
                  {isRtl ? 'تعيين كلمة المرور الجديدة' : 'ENTER NEW PASSWORD'}
                </h2>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  {isRtl
                    ? 'اختر كلمة مرور قوية مكونة من 8 خانات على الأقل.'
                    : 'Choose a strong password with at least 8 characters.'}
                </p>
              </div>

              {/* New Password */}
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

              {/* Confirm Password */}
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
                disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}
                className="w-full bg-charcoal hover:bg-gold border border-stone-700 hover:border-gold text-white text-xs font-semibold tracking-widest uppercase py-3.5 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50 group"
              >
                <span>{loading ? (isRtl ? 'جاري الحفظ وإلغاء الجلسات...' : 'Updating & Revoking Sessions...') : (isRtl ? 'حفظ وتحديث كلمة المرور' : 'Save & Update Password')}</span>
                <ArrowRight className="w-4 h-4 text-gold group-hover:text-white transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: SUCCESS & AUTO-REDIRECT */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-cinzel text-lg text-white font-medium">
                  {isRtl ? 'تم تحديث كلمة المرور بنجاح' : 'Password Reset Complete'}
                </h3>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  {isRtl
                    ? 'تم تشفير كلمة المرور الجديدة وإلغاء كافة الجلسات السابقة عبر جميع الأجهزة. جاري تحويلك لصفحة تسجيل الدخول...'
                    : 'Your password is updated and all active sessions were terminated across all devices. Redirecting to login...'}
                </p>
              </div>
            </div>
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
