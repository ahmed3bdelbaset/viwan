'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ViwanMark } from '@/components/ui/Icons';
import { AuthService } from '@/lib/auth';
import { AdminLocale, adminTranslations } from '@/lib/i18n/adminTranslations';
import { useLanguage } from '@/lib/i18n';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Globe,
  Check,
  KeyRound,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

type AuthMode = 'login' | 'forgot-1' | 'forgot-2' | 'forgot-3' | 'forgot-success';

const ERROR_DICTIONARY: Record<string, { ar: string; en: string }> = {
  ACCOUNT_NOT_FOUND: {
    ar: 'هذا الحساب غير مسجل لدينا في سجلات الإدارة',
    en: 'This account is not registered in our system.',
  },
  RATE_LIMIT_EXCEEDED: {
    ar: 'تم تجاوز الحد الأقصى للمحاولات المسموح بها. يرجى إعادة المحاولة بعد 15 دقيقة.',
    en: 'Maximum attempts exceeded. Please try again in 15 minutes.',
  },
  INVALID_CREDENTIALS: {
    ar: 'بيانات الدخول غير صحيحة، يرجى التحقق من البريد وكلمة المرور',
    en: 'Invalid credentials. Please check your email and password.',
  },
  REQUIRED_FIELDS: {
    ar: 'يرجى إدخال البريد الإلكتروني وكلمة المرور',
    en: 'Please enter your email and password.',
  },
  INVALID_EMAIL: {
    ar: 'يرجى إدخال بريد إلكتروني صالح',
    en: 'Please enter a valid email address.',
  },
  SEND_FAILED: {
    ar: 'تعذر إرسال كود التحقق. يرجى المحاولة لاحقاً.',
    en: 'Failed to send verification code. Please try again.',
  },
  INVALID_OTP: {
    ar: 'كود التحقق غير صحيح أو انتهت صلاحيته',
    en: 'Invalid or expired verification code.',
  },
  OTP_SHORT: {
    ar: 'يرجى إدخال كود التحقق المكون من 6 أرقام',
    en: 'Please enter the 6-digit verification code.',
  },
  EXPIRED_OTP: {
    ar: 'انتهت صلاحية كود التحقق (10 دقائق). يرجى طلب كود جديد.',
    en: 'Verification code expired (10 minutes). Please request a new code.',
  },
  EXPIRED_TOKEN: {
    ar: 'انتهت صلاحية جلسة إعادة التعيين، يرجى طلب كود جديد.',
    en: 'Reset session expired. Please request a new code.',
  },
  PASSWORD_TOO_SHORT: {
    ar: 'يجب ألا تقل كلمة المرور عن 6 خانات',
    en: 'Password must be at least 6 characters long.',
  },
  PASSWORD_MISMATCH: {
    ar: 'كلمتا المرور غير متطابقتين',
    en: 'Passwords do not match.',
  },
  SAVE_FAILED: {
    ar: 'فشل تحديث كلمة المرور في قاعدة البيانات',
    en: 'Failed to update password in database.',
  },
  SERVER_ERROR: {
    ar: 'حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة لاحقاً',
    en: 'A server connection error occurred. Please try again later.',
  },
  AUTH_FAILED: {
    ar: 'فشل التحقق من بيانات الدخول',
    en: 'Authentication failed. Please check your credentials.',
  },
};

const SUCCESS_DICTIONARY: Record<string, { ar: string; en: string }> = {
  OTP_SENT: {
    ar: 'تم إرسال كود التحقق بنجاح إلى بريدك المسجل.',
    en: 'Verification code sent successfully to your registered email.',
  },
  OTP_RESENT: {
    ar: 'تمت إعادة إرسال رمز التحقق بنجاح.',
    en: 'New verification code sent successfully.',
  },
  OTP_VERIFIED: {
    ar: 'تم التحقق من الرمز بنجاح.',
    en: 'Code verified successfully.',
  },
  PASSWORD_RESET_SUCCESS: {
    ar: 'تم تحديث كلمة المرور وتسجيل الدخول بنجاح!',
    en: 'Password updated and authenticated successfully!',
  },
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { setLang } = useLanguage();
  const [locale, setLocale] = useState<AdminLocale>('ar');
  const [mode, setMode] = useState<AuthMode>('login');

  // Login credentials (clean and empty by default)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Brevo OTP Forgot Password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Timers & Cooldowns
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpTimerSeconds, setOtpTimerSeconds] = useState(600); // 10 minutes

  // Status & Feedback with Reactive Bilingual Dictionaries
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [customError, setCustomError] = useState<{ ar: string; en: string } | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [customSuccess, setCustomSuccess] = useState<{ ar: string; en: string } | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);

  const clearMessages = () => {
    setErrorCode(null);
    setCustomError(null);
    setSuccessCode(null);
    setCustomSuccess(null);
  };

  const getErrorMessage = () => {
    if (errorCode && ERROR_DICTIONARY[errorCode]) {
      return ERROR_DICTIONARY[errorCode][locale];
    }
    if (customError) {
      return customError[locale] || customError.ar || customError.en;
    }
    return null;
  };

  const getSuccessMessage = () => {
    if (successCode && SUCCESS_DICTIONARY[successCode]) {
      return SUCCESS_DICTIONARY[successCode][locale];
    }
    if (customSuccess) {
      return customSuccess[locale] || customSuccess.ar || customSuccess.en;
    }
    return null;
  };

  // Check URL params on mount (?mode=forgot)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'forgot') {
        setMode('forgot-1');
      }
    }
  }, []);

  // Login lockout timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (retryCountdown && retryCountdown > 0) {
      timer = setInterval(() => {
        setRetryCountdown((prev) => (prev && prev > 1 ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [retryCountdown]);

  // Resend OTP cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // OTP expiration timer (10 mins)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'forgot-2' && otpTimerSeconds > 0) {
      timer = setInterval(() => {
        setOtpTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, otpTimerSeconds]);

  // Load saved locale & check existing auth
  useEffect(() => {
    const saved = (localStorage.getItem('viwan_admin_locale') || localStorage.getItem('viwan_lang') || 'ar') as AdminLocale;
    if (saved === 'en' || saved === 'ar') {
      setLocale(saved);
      if (setLang) setLang(saved);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      }
    }
    if (AuthService.isAuthenticated()) {
      router.push('/admin');
    }
  }, [router, setLang]);

  const toggleLanguage = () => {
    const next = locale === 'ar' ? 'en' : 'ar';
    setLocale(next);
    localStorage.setItem('viwan_admin_locale', next);
    localStorage.setItem('viwan_lang', next);
    if (setLang) setLang(next);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next;
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    }
  };

  const isRtl = locale === 'ar';
  const t = adminTranslations[locale].login;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ── 1. Handle Login ────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (retryCountdown) return;
    clearMessages();
    setLoading(true);

    try {
      const res = await AuthService.login(email, password, locale);
      if (res.success) {
        router.push('/admin');
      } else {
        if (res.retryAfter) {
          setRetryCountdown(res.retryAfter);
        }
        if (res.code && ERROR_DICTIONARY[res.code]) {
          setErrorCode(res.code);
        } else {
          setErrorCode('INVALID_CREDENTIALS');
        }
      }
    } catch {
      setErrorCode('SERVER_ERROR');
    } finally {
      setLoading(false);
    }
  };

  // ── 2. Brevo OTP: Step 1 - Request OTP ──────────────────────────────────────
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    const targetEmail = forgotEmail.trim().toLowerCase();
    if (!targetEmail) {
      setErrorCode('INVALID_EMAIL');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request-otp', email: targetEmail, locale }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorCode(data.code || 'SEND_FAILED');
      } else {
        setSuccessCode('OTP_SENT');
        setResendCooldown(60);
        setOtpTimerSeconds(600);
        setOtp('');
        setMode('forgot-2');
      }
    } catch {
      setErrorCode('SERVER_ERROR');
    } finally {
      setLoading(false);
    }
  };

  // ── 3. Brevo OTP: Step 2 - Verify OTP ───────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const cleanOtp = otp.trim();
    if (cleanOtp.length < 6) {
      setErrorCode('OTP_SHORT');
      return;
    }

    if (otpTimerSeconds <= 0) {
      setErrorCode('EXPIRED_OTP');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify-otp',
          email: forgotEmail.trim().toLowerCase(),
          otp: cleanOtp,
          locale,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorCode(data.code || 'INVALID_OTP');
      } else {
        setResetToken(data.resetToken || '');
        setSuccessCode('OTP_VERIFIED');
        setMode('forgot-3');
      }
    } catch {
      setErrorCode('SERVER_ERROR');
    } finally {
      setLoading(false);
    }
  };

  // ── 4. Brevo OTP: Step 3 - Set New Password ─────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (newPassword.length < 6) {
      setErrorCode('PASSWORD_TOO_SHORT');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorCode('PASSWORD_MISMATCH');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset-password',
          email: forgotEmail.trim().toLowerCase(),
          resetToken,
          newPassword,
          locale,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorCode(data.code || 'SAVE_FAILED');
      } else {
        setSuccessCode('PASSWORD_RESET_SUCCESS');
        setMode('forgot-success');
        setTimeout(() => {
          router.push('/admin');
        }, 1600);
      }
    } catch {
      setErrorCode('SERVER_ERROR');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP handler ──────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    clearMessages();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request-otp', email: forgotEmail.trim().toLowerCase(), locale }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessCode('OTP_RESENT');
        setResendCooldown(60);
        setOtpTimerSeconds(600);
      } else {
        setErrorCode(data.code || 'SEND_FAILED');
      }
    } catch {
      setErrorCode('SERVER_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const getStepNumber = () => {
    if (mode === 'forgot-1') return 1;
    if (mode === 'forgot-2') return 2;
    if (mode === 'forgot-3' || mode === 'forgot-success') return 3;
    return 0;
  };

  return (
    // Outer container is strictly dir="ltr" so the tree column is always on the left
    // and the form column is always on the right, regardless of Arabic/English language toggle!
    <div
      dir="ltr"
      className="h-[100dvh] max-h-[100dvh] w-full relative flex flex-col justify-between overflow-hidden select-none bg-[#F7F4EC] overscroll-none"
    >
      {/* ========================================================================= */}
      {/* 50/50 SPLIT BACKGROUND (Universal across all screens: Desktop & Mobile) */}
      {/* Left 50% = Olive Tree Terrace Image | Right 50% = Warm Cream Stone */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none flex">
        {/* Left Half: Architectural Terrace Photo */}
        <div className="w-1/2 h-full relative overflow-hidden">
          <Image
            src="/images/admin-login-terrace.jpg"
            alt="VIWAN Architectural Courtyard Terrace"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          {/* Subtle atmospheric vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/50" />
        </div>

        {/* Right Half: Warm White/Cream Stone Background */}
        <div className="w-1/2 h-full bg-[#F7F4EC] relative" />
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP EDITORIAL SIDE PILLARS (Far Left Column outside the card) */}
      {/* ========================================================================= */}
      <div className="hidden 2xl:flex fixed left-12 top-12 bottom-12 z-10 w-[240px] flex-col justify-between pointer-events-none">
        {/* Top-Left Brand Pillar Tagline */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-stone-200 font-light leading-relaxed">
            <div>SPACES</div>
            <div>PEOPLE</div>
            <div>POSSIBILITIES</div>
          </div>
          <div className="w-8 h-[1.5px] bg-[#B08A5A]" />
        </div>

        {/* Bottom-Left Editorial Vision Narrative */}
        <div className="space-y-3">
          <h2 className="font-cinzel text-3xl text-[#FAF6EE] font-normal leading-[1.12]">
            Designing
            <br />
            a Better
            <br />
            Tomorrow
          </h2>
          <div className="w-8 h-[1.5px] bg-[#B08A5A]" />
          <div className="flex items-center gap-3 pt-1 text-[11px] font-mono tracking-widest text-[#B08A5A]">
            <span>01</span>
            <span className="w-4 h-[1px] bg-[#B08A5A]" />
            <span>03</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT WRAPPER (Top Header, Centered Floating Card, Bottom Footer) */}
      {/* ========================================================================= */}
      <div className="relative z-20 h-full max-h-[100dvh] flex flex-col justify-between p-3.5 sm:p-8 lg:p-12 overflow-hidden overscroll-none">
        {/* Top Header Bar: Consistent placement so switching language never jumps */}
        <div className="w-full flex items-center justify-between z-20 shrink-0">
          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3.5 py-1.5 rounded-full border border-white/50 lg:border-[#E5DFD3] bg-white/80 lg:bg-white text-xs text-[#1C1B19] hover:text-[#8C6D45] hover:border-[#8C6D45] transition-all flex items-center gap-1.5 shadow-2xs backdrop-blur-md cursor-pointer active:scale-95 font-medium z-30 select-none"
            title={isRtl ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-[#8C6D45]" />
            <span className="font-semibold tracking-wider text-[11px]">
              {locale === 'ar' ? 'English' : 'العربية'}
            </span>
          </button>

          {/* Right Pillar Mark (Desktop: ADMIN PORTAL / Mobile: Brand Pill) */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#8C6D45] uppercase">
              <span className="w-4 h-[1px] bg-[#8C6D45]" />
              ADMIN PORTAL
            </span>
          </div>
        </div>

        {/* Center Stage: The Luxury Floating Form Card Centered in the middle of the screen */}
        <div className="w-full flex-1 flex items-center justify-center my-auto py-1 sm:py-6 overflow-y-auto sm:overflow-visible">
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`w-[82%] sm:w-full max-w-[305px] sm:max-w-[440px] bg-gradient-to-r from-[#FAF6EE]/45 via-[#FAF6EE]/70 to-[#FAF6EE]/92 backdrop-blur-md rounded-[20px] sm:rounded-[26px] p-3.5 sm:p-8 border border-white/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.4)] space-y-3 sm:space-y-5 transition-all duration-300 ${
              isRtl ? 'font-cairo' : 'font-sans'
            }`}
          >
            {/* 1. VIWAN Brand Header */}
            <div className="text-center space-y-1 select-none">
              <div className="flex justify-center mb-1 sm:mb-2">
                <ViwanMark className="w-8 h-8 sm:w-11 sm:h-11" isDark={false} />
              </div>
              <h1 className="font-cinzel text-lg sm:text-2xl font-bold tracking-[0.28em] text-[#111111] uppercase">
                V I W A N
              </h1>
              <p className="text-[7.5px] sm:text-[8.5px] font-sans tracking-[0.25em] text-[#8C6D45] uppercase font-semibold">
                ARCHITECTURE & DESIGN STUDIO
              </p>
            </div>

            {/* Error Message Display (Dynamic reactive error switching on language change) */}
            {getErrorMessage() && (
              <div className="p-3 sm:p-3.5 bg-red-50/95 dark:bg-[#201515] border border-red-200/80 dark:border-red-900/40 text-xs text-red-700 dark:text-red-400 rounded-sm space-y-1.5 animate-shake">
                <p className="font-medium leading-relaxed">{getErrorMessage()}</p>
                {retryCountdown && errorCode !== 'RATE_LIMIT_EXCEEDED' && (
                  <p className="font-sans text-[#8C6D45] dark:text-[#C5A880] font-medium text-[11px] tracking-wide">
                    {isRtl
                      ? 'تم تعليق المحاولات مؤقتاً لأسباب أمنية. يرجى إعادة المحاولة بعد 15 دقيقة.'
                      : 'Security notice: Please try again in 15 minutes.'}
                  </p>
                )}
              </div>
            )}

            {/* Success Message Display */}
            {getSuccessMessage() && (
              <div className="p-2.5 sm:p-3 bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-800 rounded-lg font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{getSuccessMessage()}</span>
              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW A: STANDARD SIGN-IN FORM */}
            {/* =============================================================== */}
            {mode === 'login' && (
              <>
                <div className="text-center pt-0.5 select-none">
                  <p className="text-[11px] sm:text-xs text-stone-600 font-light leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                  {/* Email Input */}
                  <div className="space-y-1">
                    <div className="relative flex items-center bg-gradient-to-r from-white/60 via-white/80 to-white/95 lg:bg-white border border-[#E5DFD3] rounded-lg focus-within:border-[#8C6D45] focus-within:ring-1 focus-within:ring-[#8C6D45]/30 focus-within:bg-white transition-all backdrop-blur-xs">
                      <div className="ps-3 sm:ps-3.5 text-stone-400 pointer-events-none shrink-0">
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        dir="ltr"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full bg-transparent p-2.5 sm:p-3 text-xs text-[#111111] placeholder:text-stone-400 outline-none font-sans font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <div className="relative flex items-center bg-gradient-to-r from-white/60 via-white/80 to-white/95 lg:bg-white border border-[#E5DFD3] rounded-lg focus-within:border-[#8C6D45] focus-within:ring-1 focus-within:ring-[#8C6D45]/30 focus-within:bg-white transition-all backdrop-blur-xs">
                      <div className="ps-3 sm:ps-3.5 text-stone-400 pointer-events-none shrink-0">
                        <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        dir="ltr"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-transparent p-2.5 sm:p-3 text-xs text-[#111111] placeholder:text-stone-400 outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="pe-3 sm:pe-3.5 text-stone-400 hover:text-[#111111] transition-colors cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Options Row: Forgot Password Button (Remember Me completely removed) */}
                  <div className="flex items-center justify-end text-xs pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        clearMessages();
                        setForgotEmail(email || '');
                        setMode('forgot-1');
                      }}
                      className="text-[11px] sm:text-xs text-[#8C6D45] hover:text-[#111111] hover:underline transition-colors font-medium cursor-pointer"
                    >
                      {isRtl ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1C1B19] hover:bg-[#8C6D45] text-white py-2.5 sm:py-3.5 px-5 sm:px-6 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.98] group mt-1"
                  >
                    <span>{loading ? t.signingIn : (isRtl ? 'تسجيل الدخول إلى اللوحة' : 'Sign in to Dashboard')}</span>
                    {isRtl ? (
                      <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:translate-x-1 transition-transform" />
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
                    href="/"
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
              </>
            )}

            {/* =============================================================== */}
            {/* VIEW B: BREVO 3-STEP PASSWORD RECOVERY FLOW */}
            {/* =============================================================== */}
            {mode.startsWith('forgot') && (
              <div className="space-y-5 animate-fade-in">
                {/* 3-Step Luxury Progress Pills */}
                <div className="flex items-center justify-center gap-2 pt-1 pb-1 select-none">
                  {/* Step 1 Pill */}
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider transition-all ${
                      getStepNumber() === 1
                        ? 'bg-[#1C1B19] text-[#FAF6EE] shadow-xs'
                        : getStepNumber() > 1
                        ? 'bg-[#8C6D45]/15 text-[#8C6D45]'
                        : 'bg-stone-200/60 text-stone-400'
                    }`}
                  >
                    <span>1</span>
                    <span className="hidden sm:inline">{isRtl ? 'طلب الرمز' : 'Request'}</span>
                  </div>

                  <div className={`w-3 h-px ${getStepNumber() > 1 ? 'bg-[#8C6D45]' : 'bg-stone-300'}`} />

                  {/* Step 2 Pill */}
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider transition-all ${
                      getStepNumber() === 2
                        ? 'bg-[#1C1B19] text-[#FAF6EE] shadow-xs'
                        : getStepNumber() > 2
                        ? 'bg-[#8C6D45]/15 text-[#8C6D45]'
                        : 'bg-stone-200/60 text-stone-400'
                    }`}
                  >
                    <span>2</span>
                    <span className="hidden sm:inline">{isRtl ? 'تأكيد الـ OTP' : 'Verify'}</span>
                  </div>

                  <div className={`w-3 h-px ${getStepNumber() > 2 ? 'bg-[#8C6D45]' : 'bg-stone-300'}`} />

                  {/* Step 3 Pill */}
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider transition-all ${
                      getStepNumber() === 3
                        ? 'bg-[#1C1B19] text-[#FAF6EE] shadow-xs'
                        : 'bg-stone-200/60 text-stone-400'
                    }`}
                  >
                    <span>3</span>
                    <span className="hidden sm:inline">{isRtl ? 'كلمة المرور' : 'Password'}</span>
                  </div>
                </div>

                {/* ── STEP 1: Enter Email & Request Brevo OTP ── */}
                {mode === 'forgot-1' && (
                  <>
                    <div className="text-center space-y-1">
                      <h2 className="text-lg sm:text-xl font-bold text-[#111111]">
                        {isRtl ? 'استعادة كلمة المرور' : 'Password Recovery'}
                      </h2>
                      <p className="text-xs text-stone-600 font-light leading-relaxed">
                        {isRtl
                          ? 'أدخل بريدك الإلكتروني المسجل وسنرسل لك كود التحقق السري (OTP).'
                          : 'Enter your registered administrator email to receive a 6-digit security code (OTP).'}
                      </p>
                    </div>

                    <form onSubmit={handleRequestOtp} className="space-y-3 sm:space-y-4">
                      <div className="space-y-1">
                        <div className="relative flex items-center bg-gradient-to-r from-white/60 via-white/80 to-white/95 lg:bg-white border border-[#E5DFD3] rounded-lg focus-within:border-[#8C6D45] focus-within:ring-1 focus-within:ring-[#8C6D45]/30 focus-within:bg-white transition-all backdrop-blur-xs">
                          <div className="ps-3 sm:ps-3.5 text-stone-400 pointer-events-none shrink-0">
                            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <input
                            type="email"
                            required
                            dir="ltr"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="example@email.com"
                            className="w-full bg-transparent p-2.5 sm:p-3 text-xs text-[#111111] placeholder:text-stone-400 outline-none font-sans font-medium"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1C1B19] hover:bg-[#8C6D45] text-white py-2.5 sm:py-3.5 px-5 sm:px-6 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.98] group mt-1"
                      >
                        <span>
                          {loading
                            ? (isRtl ? 'جاري الإرسال...' : 'Sending...')
                            : (isRtl ? 'إرسال رمز التحقق (OTP)' : 'Send Verification Code (OTP)')}
                        </span>
                        {isRtl ? (
                          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:translate-x-1 transition-transform" />
                        )}
                      </button>

                      <div className="text-center pt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            clearMessages();
                            setMode('login');
                          }}
                          className="text-xs text-[#8C6D45] hover:text-[#111111] hover:underline font-medium transition-colors cursor-pointer"
                        >
                          {isRtl ? '← العودة إلى تسجيل الدخول' : '← Back to Sign In'}
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* ── STEP 2: Verify 6-digit OTP Code ── */}
                {mode === 'forgot-2' && (
                  <>
                    <div className="text-center space-y-1">
                      <h2 className="text-base sm:text-xl font-bold text-[#111111]">
                        {isRtl ? 'تأكيد رمز التحقق' : 'Enter Security Code'}
                      </h2>
                      <p className="text-[11px] sm:text-xs text-stone-600 font-light leading-relaxed">
                        {isRtl
                          ? 'تم إرسال كود سري من 6 أرقام إلى:'
                          : 'A 6-digit security code was dispatched to:'}
                      </p>
                      <div className="inline-block mt-0.5 px-2.5 py-0.5 bg-[#8C6D45]/10 border border-[#8C6D45]/20 rounded-md text-xs font-mono text-[#8C6D45] font-semibold">
                        {forgotEmail}
                      </div>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-3 sm:space-y-4">
                      <div className="space-y-1">
                        <div className="relative flex items-center bg-gradient-to-r from-white/60 via-white/80 to-white/95 lg:bg-white border border-[#E5DFD3] rounded-lg focus-within:border-[#8C6D45] focus-within:ring-1 focus-within:ring-[#8C6D45]/30 focus-within:bg-white transition-all backdrop-blur-xs">
                          <div className="ps-3 sm:ps-3.5 text-stone-400 pointer-events-none shrink-0">
                            <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            dir="ltr"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="0 0 0 0 0 0"
                            className="w-full bg-transparent p-2.5 sm:p-3 text-base text-center tracking-[0.45em] font-mono font-bold text-[#111111] placeholder:text-stone-300 outline-none"
                          />
                        </div>

                        {/* Expiration Timer & Resend */}
                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                          <div className="flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5 text-[#8C6D45]" />
                            <span>
                              {isRtl ? 'صلاحية الرمز:' : 'Expires:'} {formatTimer(otpTimerSeconds)}
                            </span>
                          </div>

                          {resendCooldown > 0 ? (
                            <span className="font-mono text-stone-400">
                              {isRtl ? `إعادة الإرسال (${resendCooldown}ث)` : `Resend (${resendCooldown}s)`}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              disabled={loading}
                              className="text-[#8C6D45] hover:text-[#111111] font-medium flex items-center gap-1 hover:underline cursor-pointer disabled:opacity-50"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{isRtl ? 'إعادة إرسال الرمز' : 'Resend Code'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className="w-full bg-[#1C1B19] hover:bg-[#8C6D45] text-white py-2.5 sm:py-3.5 px-5 sm:px-6 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.98] group mt-1"
                      >
                        <span>{loading ? (isRtl ? 'جاري التحقق...' : 'Verifying...') : (isRtl ? 'تأكيد ومتابعة' : 'Verify & Proceed')}</span>
                        {isRtl ? (
                          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:translate-x-1 transition-transform" />
                        )}
                      </button>

                      <div className="flex items-center justify-between text-xs pt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            clearMessages();
                            setMode('forgot-1');
                          }}
                          className="text-[#8C6D45] hover:text-[#111111] hover:underline font-medium transition-colors cursor-pointer"
                        >
                          {isRtl ? 'تغيير البريد' : 'Change Email'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            clearMessages();
                            setMode('login');
                          }}
                          className="text-stone-500 hover:text-[#111111] hover:underline font-medium transition-colors cursor-pointer"
                        >
                          {isRtl ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* ── STEP 3: Set New Master Password ── */}
                {mode === 'forgot-3' && (
                  <>
                    <div className="text-center space-y-1">
                      <h2 className="text-base sm:text-xl font-bold text-[#111111]">
                        {isRtl ? 'تعيين كلمة المرور الجديدة' : 'Set New Password'}
                      </h2>
                      <p className="text-[11px] sm:text-xs text-stone-600 font-light leading-relaxed">
                        {isRtl
                          ? 'أدخل كلمة المرور الجديدة لحساب المسؤول الرئيسي (6 خانات على الأقل).'
                          : 'Enter your new master administrator password (minimum 6 characters).'}
                      </p>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-3 sm:space-y-4">
                      {/* New Password */}
                      <div className="space-y-1">
                        <div className="relative flex items-center bg-gradient-to-r from-white/60 via-white/80 to-white/95 lg:bg-white border border-[#E5DFD3] rounded-lg focus-within:border-[#8C6D45] focus-within:ring-1 focus-within:ring-[#8C6D45]/30 focus-within:bg-white transition-all backdrop-blur-xs">
                          <div className="ps-3 sm:ps-3.5 text-stone-400 pointer-events-none shrink-0">
                            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            dir="ltr"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder={isRtl ? 'كلمة المرور الجديدة' : 'New Password'}
                            className="w-full bg-transparent p-2.5 sm:p-3 text-xs text-[#111111] placeholder:text-stone-400 outline-none font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="pe-3 sm:pe-3.5 text-stone-400 hover:text-[#111111] transition-colors cursor-pointer"
                          >
                            {showNewPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1">
                        <div className="relative flex items-center bg-gradient-to-r from-white/60 via-white/80 to-white/95 lg:bg-white border border-[#E5DFD3] rounded-lg focus-within:border-[#8C6D45] focus-within:ring-1 focus-within:ring-[#8C6D45]/30 focus-within:bg-white transition-all backdrop-blur-xs">
                          <div className="ps-3 sm:ps-3.5 text-stone-400 pointer-events-none shrink-0">
                            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            dir="ltr"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                            className="w-full bg-transparent p-2.5 sm:p-3 text-xs text-[#111111] placeholder:text-stone-400 outline-none font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="pe-3 sm:pe-3.5 text-stone-400 hover:text-[#111111] transition-colors cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1C1B19] hover:bg-[#8C6D45] text-white py-2.5 sm:py-3.5 px-5 sm:px-6 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.98] group mt-1"
                      >
                        <span>
                          {loading
                            ? (isRtl ? 'جاري الحفظ...' : 'Saving...')
                            : (isRtl ? 'حفظ كلمة المرور والدخول إلى اللوحة' : 'Save & Enter Dashboard')}
                        </span>
                        {isRtl ? (
                          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:translate-x-1 transition-transform" />
                        )}
                      </button>
                    </form>
                  </>
                )}

                {/* ── STEP SUCCESS: Completed & Redirecting ── */}
                {mode === 'forgot-success' && (
                  <div className="text-center py-5 space-y-2.5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-emerald-900">
                      {isRtl ? 'تم تحديث كلمة المرور بنجاح!' : 'Password Updated Successfully!'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-stone-600">
                      {isRtl
                        ? 'تم تسجيل الدخول تلقائياً. جاري تحويلك إلى لوحة التحكم...'
                        : 'Authenticated successfully. Redirecting to your dashboard...'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Footer Row: Centered, Responsive, and styled in Luxury Bronze (#8C6D45) */}
        <div className="w-full z-20 pt-2 pb-1 sm:pt-4 sm:pb-2 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase select-none">
          {/* Left Narrative Snippet (Desktop) */}
          <div className="hidden md:flex items-center gap-2 text-stone-300/80 font-serif">
            <span className="text-xs font-cinzel text-stone-200">Designing a Better Tomorrow</span>
            <span className="w-4 h-[1px] bg-[#8C6D45]" />
          </div>

          {/* Centered Brand OS - Prominently in center across all devices */}
          <div className="mx-auto flex items-center justify-center gap-2 text-center text-[#8C6D45] font-semibold tracking-[0.25em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D45]/50 animate-pulse" />
            <span>VIWAN STUDIO // OS 2026</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D45]/50 animate-pulse" />
          </div>

          {/* Right Pillar Mark (Desktop) */}
          <div className="hidden md:flex items-center gap-2 text-[#8C6D45]">
            <span className="w-4 h-[1px] bg-[#8C6D45]" />
            <span>BUILT ON A VISION</span>
          </div>
        </div>
      </div>
    </div>
  );
}
