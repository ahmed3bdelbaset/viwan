'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ViwanMark } from '@/components/ui/Icons';
import { AuthService } from '@/lib/auth';
import { AdminLocale, adminTranslations } from '@/lib/i18n/adminTranslations';
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

export default function AdminLoginPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<AdminLocale>('ar');
  const [mode, setMode] = useState<AuthMode>('login');

  // Login credentials
  const [email, setEmail] = useState('admin@viwan.studio');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  // Brevo OTP Forgot Password state
  const [forgotEmail, setForgotEmail] = useState('admin@viwan.studio');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Timers & Cooldowns
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpTimerSeconds, setOtpTimerSeconds] = useState(600); // 10 minutes

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);

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

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ── 1. Handle Login ────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (retryCountdown) return;
    setError('');
    setSuccessMsg('');
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

  // ── 2. Brevo OTP: Step 1 - Request OTP ──────────────────────────────────────
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const targetEmail = forgotEmail.trim().toLowerCase();
    if (!targetEmail) {
      setError(isRtl ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request-otp', email: targetEmail }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || (isRtl ? 'تعذر إرسال كود التحقق عبر Brevo.' : 'Failed to send OTP via Brevo.'));
      } else {
        setSuccessMsg(data.message || (isRtl ? 'تم إرسال كود التحقق بنجاح عبر Brevo.' : 'OTP sent successfully via Brevo.'));
        setResendCooldown(60);
        setOtpTimerSeconds(600);
        setOtp('');
        setMode('forgot-2');
      }
    } catch {
      setError(isRtl ? 'تعذر الاتصال بالخادم' : 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  // ── 3. Brevo OTP: Step 2 - Verify OTP ───────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanOtp = otp.trim();
    if (cleanOtp.length < 6) {
      setError(isRtl ? 'يرجى إدخال كود التحقق المكون من 6 أرقام' : 'Please enter the 6-digit OTP');
      return;
    }

    if (otpTimerSeconds <= 0) {
      setError(isRtl ? 'انتهت صلاحية كود التحقق (10 دقائق). يرجى طلب كود جديد.' : 'OTP expired. Please request a new code.');
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
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || (isRtl ? 'كود التحقق غير صحيح' : 'Invalid OTP code'));
      } else {
        setResetToken(data.resetToken || '');
        setSuccessMsg('');
        setMode('forgot-3');
      }
    } catch {
      setError(isRtl ? 'حدث خطأ أثناء التحقق' : 'Verification error');
    } finally {
      setLoading(false);
    }
  };

  // ── 4. Brevo OTP: Step 3 - Set New Password ─────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setError(isRtl ? 'يجب ألا تقل كلمة المرور عن 6 خانات' : 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(isRtl ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
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
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || (isRtl ? 'فشل تحديث كلمة المرور' : 'Failed to update password'));
      } else {
        setMode('forgot-success');
        setTimeout(() => {
          router.push('/admin');
        }, 1600);
      }
    } catch {
      setError(isRtl ? 'حدث خطأ أثناء حفظ كلمة المرور' : 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP handler ──────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request-otp', email: forgotEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(isRtl ? 'تمت إعادة إرسال رمز التحقق عبر Brevo بنجاح.' : 'New OTP sent via Brevo.');
        setResendCooldown(60);
        setOtpTimerSeconds(600);
      } else {
        setError(data.error || (isRtl ? 'تعذر إعادة إرسال الرمز' : 'Failed to resend OTP'));
      }
    } catch {
      setError(isRtl ? 'خطأ في الاتصال بالخادم' : 'Server error');
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
      className="min-h-screen w-full relative flex flex-col lg:flex-row overflow-x-hidden select-none bg-[#F7F4EC]"
    >
      {/* ========================================================================= */}
      {/* MOBILE SPLIT BACKGROUND (Visible on < lg screens) */}
      {/* Left 50% = Olive Tree Terrace Image | Right 50% = Warm Cream Stone */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed inset-0 z-0 pointer-events-none flex">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/45" />
        </div>

        {/* Right Half: Warm White/Cream Stone Background */}
        <div className="w-1/2 h-full bg-[#F7F4EC] relative" />
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP LEFT COLUMN: ARCHITECTURAL EDITORIAL TERRACE (Visible on lg+) */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative min-h-screen flex-col justify-between p-12 xl:p-16 z-10 overflow-hidden shrink-0">
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

          <p
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`text-xs xl:text-sm text-stone-200/90 font-light leading-relaxed ${
              isRtl ? 'font-cairo' : 'font-sans'
            }`}
          >
            {isRtl
              ? 'في فيوان، نُحوّل الرؤى المعمارية إلى فراغات ذات معنى ملهم عبر التناغم الهندسي، نقاء الخامات، وصدق التفاصيل.'
              : 'At VIWAN, we transform architectural visions into meaningful spaces through geometric harmony, pure materials, and honest detailing.'}
          </p>

          <div className="flex items-center gap-3 pt-2 text-[11px] font-mono tracking-widest text-[#B08A5A]">
            <span>01</span>
            <span className="w-4 h-[1px] bg-[#B08A5A]" />
            <span>03</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: LOGIN & BREVO OTP RECOVERY (Always on the right) */}
      {/* ========================================================================= */}
      <div className="flex-1 relative min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 z-10 overflow-y-auto">
        {/* Top Header Bar: Consistent placement so switching language never jumps */}
        <div className="w-full flex items-center justify-between z-20">
          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3.5 py-1.5 rounded-full border border-white/50 lg:border-[#E5DFD3] bg-white/80 lg:bg-white text-xs text-[#1C1B19] hover:text-[#8C6D45] hover:border-[#8C6D45] transition-all flex items-center gap-1.5 shadow-2xs backdrop-blur-md cursor-pointer active:scale-95 font-medium"
            title={isRtl ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
          >
            <Globe className="w-3.5 h-3.5 text-[#8C6D45]" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              {locale === 'ar' ? 'AR' : 'EN'}
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

        {/* Center Stage: The Luxury Floating Form Card */}
        {/* Centered on mobile across the 50/50 split (half over image, half over white) */}
        <div className="w-full flex items-center justify-center my-auto py-8">
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`w-full max-w-[460px] bg-gradient-to-r from-[#FAF6EE]/50 via-[#FAF6EE]/75 to-[#FAF6EE]/95 lg:from-[#FAF6EE] lg:to-[#FAF6EE] lg:bg-[#FAF6EE] backdrop-blur-xl lg:backdrop-blur-none rounded-[26px] p-7 sm:p-10 border border-white/50 lg:border-[#E7E1D4] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.4)] space-y-6 transition-all duration-300 ${
              isRtl ? 'font-cairo' : 'font-sans'
            }`}
          >
            {/* 1. VIWAN Brand Header */}
            <div className="text-center space-y-1.5 select-none">
              <div className="flex justify-center mb-2">
                <ViwanMark className="w-11 h-11" isDark={false} />
              </div>
              <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.3em] text-[#111111] uppercase">
                V I W A N
              </h1>
              <p className="text-[8.5px] font-sans tracking-[0.28em] text-[#8C6D45] uppercase font-semibold">
                ARCHITECTURE & DESIGN STUDIO
              </p>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="p-3 bg-red-50/90 border border-red-200 text-xs text-red-700 rounded-lg space-y-1 animate-shake">
                <p className="font-medium">{error}</p>
                {retryCountdown && (
                  <p className="font-mono text-amber-700 font-semibold text-[11px]">
                    {isRtl
                      ? `⏳ يرجى الانتظار: ${retryCountdown} ثانية قبل إعادة المحاولة`
                      : `⏳ Security Lockout: Please wait ${retryCountdown}s`}
                  </p>
                )}
              </div>
            )}

            {/* Success Message Display */}
            {successMsg && (
              <div className="p-3 bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-800 rounded-lg font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW A: STANDARD SIGN-IN FORM */}
            {/* =============================================================== */}
            {mode === 'login' && (
              <>
                <div className="text-center space-y-1 pt-1">
                  <h2 className="text-lg sm:text-xl font-bold text-[#111111]">
                    {t.title}
                  </h2>
                  <p className="text-xs text-stone-600 font-light">
                    {t.desc}
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email Input */}
                  <div className="space-y-1">
                    <div className="relative flex items-center bg-gradient-to-r from-white/60 via-white/80 to-white/95 lg:bg-white border border-[#E5DFD3] rounded-lg focus-within:border-[#8C6D45] focus-within:ring-1 focus-within:ring-[#8C6D45]/30 focus-within:bg-white transition-all backdrop-blur-xs">
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
                    <div className="relative flex items-center bg-gradient-to-r from-white/60 via-white/80 to-white/95 lg:bg-white border border-[#E5DFD3] rounded-lg focus-within:border-[#8C6D45] focus-within:ring-1 focus-within:ring-[#8C6D45]/30 focus-within:bg-white transition-all backdrop-blur-xs">
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
                        className="pe-3.5 text-stone-400 hover:text-[#111111] transition-colors cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Options Row: Remember Session & Forgot Password Button */}
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

                    {/* Forgot Password Trigger Button (Opens Brevo 3-Step Flow) */}
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setSuccessMsg('');
                        setForgotEmail(email || 'admin@viwan.studio');
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
                          ? 'أدخل بريدك الإلكتروني المسجل وسنرسل لك كود التحقق السري (OTP) عبر Brevo.'
                          : 'Enter your registered administrator email to receive a 6-digit OTP code via Brevo.'}
                      </p>
                    </div>

                    <form onSubmit={handleRequestOtp} className="space-y-4">
                      <div className="space-y-1">
                        <div className="relative flex items-center bg-gradient-to-r from-white/60 via-white/80 to-white/95 lg:bg-white border border-[#E5DFD3] rounded-lg focus-within:border-[#8C6D45] focus-within:ring-1 focus-within:ring-[#8C6D45]/30 focus-within:bg-white transition-all backdrop-blur-xs">
                          <div className="ps-3.5 text-stone-400 pointer-events-none shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            required
                            dir="ltr"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="admin@viwan.studio"
                            className="w-full bg-transparent p-3 text-xs text-[#111111] placeholder:text-stone-400 outline-none font-sans font-medium"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1C1B19] hover:bg-[#8C6D45] text-white py-3.5 px-6 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.98] group mt-1"
                      >
                        <span>
                          {loading
                            ? (isRtl ? 'جاري الإرسال عبر Brevo...' : 'Sending via Brevo...')
                            : (isRtl ? 'إرسال رمز التحقق (Brevo OTP)' : 'Send Verification OTP')}
                        </span>
                        {isRtl ? (
                          <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                        )}
                      </button>

                      <div className="text-center pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setError('');
                            setSuccessMsg('');
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
                      <h2 className="text-lg sm:text-xl font-bold text-[#111111]">
                        {isRtl ? 'تأكيد رمز التحقق' : 'Enter Security Code'}
                      </h2>
                      <p className="text-xs text-stone-600 font-light leading-relaxed">
                        {isRtl
                          ? 'تم إرسال كود سري من 6 أرقام عبر Brevo إلى:'
                          : 'A 6-digit security code was dispatched via Brevo to:'}
                      </p>
                      <div className="inline-block mt-1 px-3 py-1 bg-[#8C6D45]/10 border border-[#8C6D45]/20 rounded-md text-xs font-mono text-[#8C6D45] font-semibold">
                        {forgotEmail}
                      </div>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="relative flex items-center bg-gradient-to-r from-white/60 via-white/80 to-white/95 lg:bg-white border border-[#E5DFD3] rounded-lg focus-within:border-[#8C6D45] focus-within:ring-1 focus-within:ring-[#8C6D45]/30 focus-within:bg-white transition-all backdrop-blur-xs">
                          <div className="ps-3.5 text-stone-400 pointer-events-none shrink-0">
                            <KeyRound className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            dir="ltr"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="0 0 0 0 0 0"
                            className="w-full bg-transparent p-3 text-base text-center tracking-[0.45em] font-mono font-bold text-[#111111] placeholder:text-stone-300 outline-none"
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
                              <span>{isRtl ? 'إعادة الإرسال عبر Brevo' : 'Resend Code via Brevo'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className="w-full bg-[#1C1B19] hover:bg-[#8C6D45] text-white py-3.5 px-6 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.98] group mt-1"
                      >
                        <span>{loading ? (isRtl ? 'جاري التحقق...' : 'Verifying...') : (isRtl ? 'تأكيد ومتابعة' : 'Verify & Proceed')}</span>
                        {isRtl ? (
                          <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                        )}
                      </button>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setError('');
                            setSuccessMsg('');
                            setMode('forgot-1');
                          }}
                          className="text-[#8C6D45] hover:text-[#111111] hover:underline font-medium transition-colors cursor-pointer"
                        >
                          {isRtl ? 'تغيير البريد' : 'Change Email'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setError('');
                            setSuccessMsg('');
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
                      <h2 className="text-lg sm:text-xl font-bold text-[#111111]">
                        {isRtl ? 'تعيين كلمة المرور الجديدة' : 'Set New Password'}
                      </h2>
                      <p className="text-xs text-stone-600 font-light leading-relaxed">
                        {isRtl
                          ? 'أدخل كلمة المرور الجديدة لحساب المسؤول الرئيسي (6 خانات على الأقل).'
                          : 'Enter your new master administrator password (minimum 6 characters).'}
                      </p>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                      {/* New Password */}
                      <div className="space-y-1">
                        <div className="relative flex items-center bg-gradient-to-r from-white/60 via-white/80 to-white/95 lg:bg-white border border-[#E5DFD3] rounded-lg focus-within:border-[#8C6D45] focus-within:ring-1 focus-within:ring-[#8C6D45]/30 focus-within:bg-white transition-all backdrop-blur-xs">
                          <div className="ps-3.5 text-stone-400 pointer-events-none shrink-0">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            dir="ltr"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder={isRtl ? 'كلمة المرور الجديدة' : 'New Password'}
                            className="w-full bg-transparent p-3 text-xs text-[#111111] placeholder:text-stone-400 outline-none font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="pe-3.5 text-stone-400 hover:text-[#111111] transition-colors cursor-pointer"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1">
                        <div className="relative flex items-center bg-gradient-to-r from-white/60 via-white/80 to-white/95 lg:bg-white border border-[#E5DFD3] rounded-lg focus-within:border-[#8C6D45] focus-within:ring-1 focus-within:ring-[#8C6D45]/30 focus-within:bg-white transition-all backdrop-blur-xs">
                          <div className="ps-3.5 text-stone-400 pointer-events-none shrink-0">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            dir="ltr"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                            className="w-full bg-transparent p-3 text-xs text-[#111111] placeholder:text-stone-400 outline-none font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="pe-3.5 text-stone-400 hover:text-[#111111] transition-colors cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1C1B19] hover:bg-[#8C6D45] text-white py-3.5 px-6 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-[0.98] group mt-1"
                      >
                        <span>
                          {loading
                            ? (isRtl ? 'جاري الحفظ...' : 'Saving...')
                            : (isRtl ? 'حفظ كلمة المرور والدخول إلى اللوحة' : 'Save & Enter Dashboard')}
                        </span>
                        {isRtl ? (
                          <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                        )}
                      </button>
                    </form>
                  </>
                )}

                {/* ── STEP SUCCESS: Completed & Redirecting ── */}
                {mode === 'forgot-success' && (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
                      <Sparkles className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-base font-bold text-emerald-900">
                      {isRtl ? 'تم تحديث كلمة المرور بنجاح!' : 'Password Updated Successfully!'}
                    </h3>
                    <p className="text-xs text-stone-600">
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

        {/* Bottom Footer Row */}
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
