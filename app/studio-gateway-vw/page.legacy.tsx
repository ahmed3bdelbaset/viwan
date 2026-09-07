"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Lock,
  Menu,
  X,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Image as ImageIcon,
  Phone,
  MapPin,
  Users,
  BarChart3,
  Layers,
  Globe,
  Search,
  Upload,
  ChevronDown,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ChevronLeft,
  LayoutDashboard,
  FolderKanban,
  Building2,
  Calendar,
  LogOut,
  Star,
  Check,
  Link as LinkIcon,
  Compass,
  SlidersHorizontal,
  ListOrdered,
  Crop,
  Crosshair,
  ImagePlus,
  Copy,
  CheckCheck,
  Bell,
  Clock,
  LayoutGrid,
  List,
  Table as TableIcon,
  Download,
  MoreVertical,
  FileSpreadsheet,
  Filter,
} from "lucide-react"
import { Logo } from "@/components/site/logo"

// ── Types ────────────────────────────────────────────────────────────────────
type Tab = "overview" | "projects" | "team" | "gallery" | "settings"
type Project = { id:string; title:string; category:string; year:string; location:string; image:string; slug:string; featured:boolean }
type TeamMember = { id:string; name:string; role:string; bio:string; image:string; order:number }
type GalleryItem = { id:string; url:string; caption:string; category:string }
type SiteConfig = { phone:string; email:string; address:string; mapEmbedUrl:string; instagramUrl:string; behanceUrl:string; linkedinUrl:string; houzUrl:string }

// ── Luxury Architectural Auth Gate with 3-Step Brevo OTP Reset ───────────────
type AuthView = "login" | "forgot-step-1" | "forgot-step-2" | "forgot-step-3" | "success"

function AuthGate({ onAuth }: { onAuth: () => void }) {
  const [view, setView] = useState<AuthView>("login")
  const [isAr, setIsAr] = useState(true)
  const stepNum = view === "forgot-step-1" ? 1 : view === "forgot-step-2" ? 2 : view === "forgot-step-3" ? 3 : 0

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Status & UI states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [countdown, setCountdown] = useState(0)

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown(c => c - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  // Clear errors when view changes
  useEffect(() => {
    setError("")
    setSuccessMsg("")
  }, [view])

  // 1. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        onAuth()
      } else {
        setError(data.error || (isAr ? "بيانات الدخول غير صحيحة" : "Invalid email or password"))
      }
    } catch {
      setError(isAr ? "حدث خطأ في الاتصال بالخادم" : "Connection error")
    } finally {
      setLoading(false)
    }
  }

  // 2. Step 1: Request Brevo OTP & Verify Email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError(isAr ? "يرجى إدخال البريد الإلكتروني" : "Please enter your email")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request-otp", email }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok && data.success) {
        setSuccessMsg(
          isAr
            ? "تم التحقق من الحساب وإرسال رمز التحقق الأمني إلى بريدك الإلكتروني بنجاح."
            : "Verification code sent to your registered email via Brevo."
        )
        setCountdown(60)
        setView("forgot-step-2")
      } else {
        // Exact user requirement: "هذا الحساب غير مسجل لدينا"
        setError(data.error || (isAr ? "هذا الحساب غير مسجل لدينا" : "This account is not registered"))
      }
    } catch {
      setError(isAr ? "حدث خطأ في الاتصال بخدمة البريد" : "Connection error")
    } finally {
      setLoading(false)
    }
  }

  // 3. Step 2: Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim() || otp.trim().length < 6) {
      setError(isAr ? "يرجى إدخال كود التحقق المكون من 6 أرقام" : "Please enter the 6-digit code")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-otp", email, otp: otp.trim() }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok && data.resetToken) {
        setResetToken(data.resetToken)
        setView("forgot-step-3")
      } else {
        setError(data.error || (isAr ? "كود التحقق غير صحيح أو انتهت صلاحيته" : "Invalid or expired OTP"))
      }
    } catch {
      setError(isAr ? "حدث خطأ أثناء التحقق من الكود" : "Verification error")
    } finally {
      setLoading(false)
    }
  }

  // 4. Step 3: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setError(isAr ? "يجب ألا تقل كلمة المرور عن 6 خانات" : "Password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setError(isAr ? "كلمتا المرور غير متطابقتين" : "Passwords do not match")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-password",
          email,
          resetToken,
          newPassword,
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok && data.success) {
        setPassword("")
        // Automatically establish session and directly log into the account
        await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: newPassword }),
          credentials: "include",
        }).catch(() => null)

        onAuth()
      } else {
        setError(data.error || (isAr ? "فشل تحديث كلمة المرور" : "Failed to reset password"))
      }
    } catch {
      setError(isAr ? "حدث خطأ في الاتصال بالخادم" : "Connection error")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    WebkitBoxShadow: "0 0 0 1000px #161513 inset",
  }

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0C0B0A] text-ivory flex flex-col justify-between relative overflow-hidden select-none"
      style={{ fontFamily: isAr ? "var(--font-heading), sans-serif" : "var(--font-sans), sans-serif" }}
    >
      {/* Background Architectural Glows & Grid */}
      <div
        className="absolute -top-40 -start-40 size-[600px] bg-gold/5 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -end-40 size-[600px] bg-gold/5 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden="true"
      />

      {/* Top Bar: Language Switcher & Exit */}
      <header className="container-viwan py-6 flex items-center justify-between relative z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs eyebrow text-ivory/60 hover:text-gold transition-colors"
        >
          {isAr ? <ArrowRight className="size-3.5" /> : <ArrowLeft className="size-3.5" />}
          <span>{isAr ? "العودة للموقع الرئيسي" : "Back to Website"}</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsAr(!isAr)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-white/15 text-xs eyebrow text-ivory/70 hover:border-gold hover:text-gold transition-colors cursor-pointer bg-white/[0.02]"
        >
          <span>{isAr ? "English" : "العربية"}</span>
        </button>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10 overflow-hidden">
        <div className="w-full max-w-md flex flex-col items-center relative">
          {/* Card Wrapper with Centered Background V */}
          <div className="relative w-full flex items-center justify-center">

            {/* ── Background Architectural V Watermark (Cut by the Plaque) ── */}
            {/* 1. Mobile Version (Optimized for phone screens: 340px-440px) */}
            <div
              className="block sm:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 312 204"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="w-[min(90vw,350px)] h-[580px] opacity-90 drop-shadow-[0_0_35px_rgba(197,168,128,0.22)]"
              >
                <defs>
                  <linearGradient id="v-slash-left-mob" x1="0%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FAF8F5" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0.08" />
                  </linearGradient>
                  <linearGradient id="v-slash-mid-mob" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FAF8F5" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0.06" />
                  </linearGradient>
                  <linearGradient id="v-slash-gold-mob" x1="0%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#D4B489" stopOpacity="0.55" />
                    <stop offset="60%" stopColor="#AF7E49" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#8A6335" stopOpacity="0.18" />
                  </linearGradient>
                  <filter id="v-gold-glow-mob" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* 1. Left bold diagonal slash */}
                <path
                  d="M0 0 L42 0 L145 202 L109 202 Z"
                  fill="url(#v-slash-left-mob)"
                  stroke="rgba(250, 248, 245, 0.18)"
                  strokeWidth="0.75"
                />

                {/* 2. Inner thin diagonal slash */}
                <path
                  d="M222 0 L230 0 L156 141 L148 141 Z"
                  fill="url(#v-slash-mid-mob)"
                  stroke="rgba(250, 248, 245, 0.22)"
                  strokeWidth="0.75"
                />

                {/* 3. Outer right warm gold diagonal slash */}
                <path
                  d="M294 0 L311 0 L203 202 L188 202 Z"
                  fill="url(#v-slash-gold-mob)"
                  stroke="rgba(197, 168, 128, 0.45)"
                  strokeWidth="0.75"
                  filter="url(#v-gold-glow-mob)"
                />
              </svg>
            </div>

            {/* 2. Desktop / Tablet Version (Authentic wide architectural V) */}
            <div
              className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 312 204"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[660px] md:w-[820px] lg:w-[980px] xl:w-[1080px] aspect-[312/204] opacity-90 drop-shadow-[0_0_60px_rgba(197,168,128,0.22)]"
              >
                <defs>
                  <linearGradient id="v-slash-left-desk" x1="0%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FAF8F5" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0.08" />
                  </linearGradient>
                  <linearGradient id="v-slash-mid-desk" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FAF8F5" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0.06" />
                  </linearGradient>
                  <linearGradient id="v-slash-gold-desk" x1="0%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#D4B489" stopOpacity="0.50" />
                    <stop offset="60%" stopColor="#AF7E49" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#8A6335" stopOpacity="0.15" />
                  </linearGradient>
                  <filter id="v-gold-glow-desk" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="12" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* 1. Left bold diagonal slash */}
                <path
                  d="M0 0 L42 0 L145 202 L109 202 Z"
                  fill="url(#v-slash-left-desk)"
                  stroke="rgba(250, 248, 245, 0.15)"
                  strokeWidth="0.75"
                />

                {/* 2. Inner thin diagonal slash */}
                <path
                  d="M222 0 L230 0 L156 141 L148 141 Z"
                  fill="url(#v-slash-mid-desk)"
                  stroke="rgba(250, 248, 245, 0.18)"
                  strokeWidth="0.75"
                />

                {/* 3. Outer right warm gold diagonal slash */}
                <path
                  d="M294 0 L311 0 L203 202 L188 202 Z"
                  fill="url(#v-slash-gold-desk)"
                  stroke="rgba(197, 168, 128, 0.40)"
                  strokeWidth="0.75"
                  filter="url(#v-gold-glow-desk)"
                />
              </svg>
            </div>

            {/* Glassmorphic Architectural Plaque (Front layer that cuts through the V) */}
            <div className="relative z-10 w-full bg-[#141311] backdrop-blur-2xl border border-white/15 p-8 sm:p-10 rounded-xs shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden">
              {/* Subtle Gold Accent Top Border */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

            {/* Studio Branding */}
            <div className="flex flex-col items-center text-center mb-6">
              <Logo layout="stacked" />
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="mb-6 p-3.5 rounded-xs bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-fade-in">
                <span className="size-1.5 rounded-full bg-red-400 shrink-0" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMsg && (
              <div className="mb-6 p-3.5 rounded-xs bg-gold/10 border border-gold/40 text-gold text-xs flex items-center gap-2.5 animate-fade-in">
                <CheckCircle2 className="size-4 shrink-0" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* ============================================================= */}
            {/* VIEW 1: LOGIN                                                 */}
            {/* ============================================================= */}
            {view === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[11px] eyebrow text-ivory/60 uppercase tracking-wider mb-2">
                    {isAr ? "البريد الإلكتروني للإدارة" : "ADMIN EMAIL"}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="example@email.com"
                      style={inputStyle}
                      className="studio-login-input w-full bg-[#161513] border border-white/15 text-white text-xs sm:text-sm px-4 py-3 rounded-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-200 placeholder:text-white/20"
                    />
                    <Mail className="size-4 text-white/30 absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] eyebrow text-ivory/60 uppercase tracking-wider">
                      {isAr ? "كلمة المرور" : "PASSWORD"}
                    </label>
                    <button
                      type="button"
                      onClick={() => setView("forgot-step-1")}
                      className="text-[11px] text-gold hover:text-white transition-colors cursor-pointer eyebrow"
                    >
                      {isAr ? "نسيت كلمة السر؟" : "Forgot Password?"}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      style={inputStyle}
                      className="studio-login-input w-full bg-[#161513] border border-white/15 text-white text-xs sm:text-sm px-4 py-3 rounded-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-200 placeholder:text-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="size-8 flex items-center justify-center text-white/40 hover:text-gold absolute end-2 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-ivory text-charcoal font-medium text-xs tracking-widest eyebrow py-3.5 rounded-xs transition-all duration-300 shadow-sm active:scale-98 cursor-pointer disabled:opacity-50 mt-6 flex items-center justify-center gap-2"
                >
                  {loading && <RefreshCw className="size-3.5 animate-spin" />}
                  <span>{loading ? (isAr ? "جاري التحقق..." : "Authenticating...") : isAr ? "دخول الاستوديو" : "ENTER STUDIO"}</span>
                </button>
              </form>
            )}

            {/* ── 3-Stage Progress Stepper Strip ── */}
            {stepNum > 0 && (
              <div className="mb-8 pt-1">
                <div className="flex items-center justify-between relative px-2">
                  {/* Stage 1: Email */}
                  <div className="flex flex-col items-center gap-2 z-10 min-w-[70px]">
                    <div
                      className={`size-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                        stepNum > 1
                          ? "bg-gold text-charcoal shadow-[0_0_12px_rgba(197,168,128,0.35)]"
                          : stepNum === 1
                          ? "bg-gold text-charcoal ring-4 ring-gold/25 shadow-[0_0_16px_rgba(197,168,128,0.55)] font-bold"
                          : "bg-[#181715] border border-white/15 text-white/40"
                      }`}
                    >
                      {stepNum > 1 ? <Check className="size-4 stroke-[3]" /> : "1"}
                    </div>
                    <span
                      className={`text-[11px] eyebrow tracking-wider transition-colors duration-300 text-center ${
                        stepNum >= 1 ? "text-gold font-medium" : "text-ivory/40"
                      }`}
                    >
                      {isAr ? "البريد" : "Email"}
                    </span>
                  </div>

                  {/* Track 1 -> 2 */}
                  <div className="flex-1 h-0.5 mx-2 -mt-5 bg-white/10 relative overflow-hidden rounded-full">
                    <div
                      className={`h-full bg-gold transition-all duration-500 ease-out ${
                        stepNum >= 2 ? "w-full" : "w-0"
                      }`}
                    />
                  </div>

                  {/* Stage 2: OTP */}
                  <div className="flex flex-col items-center gap-2 z-10 min-w-[70px]">
                    <div
                      className={`size-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                        stepNum > 2
                          ? "bg-gold text-charcoal shadow-[0_0_12px_rgba(197,168,128,0.35)]"
                          : stepNum === 2
                          ? "bg-gold text-charcoal ring-4 ring-gold/25 shadow-[0_0_16px_rgba(197,168,128,0.55)] font-bold"
                          : "bg-[#181715] border border-white/15 text-white/40"
                      }`}
                    >
                      {stepNum > 2 ? <Check className="size-4 stroke-[3]" /> : "2"}
                    </div>
                    <span
                      className={`text-[11px] eyebrow tracking-wider transition-colors duration-300 text-center ${
                        stepNum >= 2 ? "text-gold font-medium" : "text-ivory/40"
                      }`}
                    >
                      {isAr ? "رمز التحقق" : "OTP Code"}
                    </span>
                  </div>

                  {/* Track 2 -> 3 */}
                  <div className="flex-1 h-0.5 mx-2 -mt-5 bg-white/10 relative overflow-hidden rounded-full">
                    <div
                      className={`h-full bg-gold transition-all duration-500 ease-out ${
                        stepNum >= 3 ? "w-full" : "w-0"
                      }`}
                    />
                  </div>

                  {/* Stage 3: New Password */}
                  <div className="flex flex-col items-center gap-2 z-10 min-w-[70px]">
                    <div
                      className={`size-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                        stepNum > 3
                          ? "bg-gold text-charcoal shadow-[0_0_12px_rgba(197,168,128,0.35)]"
                          : stepNum === 3
                          ? "bg-gold text-charcoal ring-4 ring-gold/25 shadow-[0_0_16px_rgba(197,168,128,0.55)] font-bold"
                          : "bg-[#181715] border border-white/15 text-white/40"
                      }`}
                    >
                      {stepNum > 3 ? <Check className="size-4 stroke-[3]" /> : "3"}
                    </div>
                    <span
                      className={`text-[11px] eyebrow tracking-wider transition-colors duration-300 text-center ${
                        stepNum === 3 ? "text-gold font-medium" : "text-ivory/40"
                      }`}
                    >
                      {isAr ? "كلمة المرور" : "Password"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* VIEW 2: FORGOT PASSWORD - STEP 1 (Email & Admin Check)       */}
            {/* ============================================================= */}
            {view === "forgot-step-1" && (
              <form onSubmit={handleRequestOtp} className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-[11px] eyebrow text-ivory/60 uppercase tracking-wider mb-2">
                    {isAr ? "البريد الإلكتروني للمسؤول" : "ADMIN EMAIL"}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="example@email.com"
                      style={inputStyle}
                      className="studio-login-input w-full bg-[#161513] border border-white/15 text-white text-xs sm:text-sm px-4 py-3 rounded-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-200 placeholder:text-white/20"
                    />
                    <Mail className="size-4 text-white/30 absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-ivory text-charcoal font-medium text-xs tracking-widest eyebrow py-3.5 rounded-xs transition-all duration-300 shadow-sm active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <RefreshCw className="size-3.5 animate-spin" />}
                  <span>{loading ? (isAr ? "جاري الفحص والإرسال..." : "Sending OTP...") : isAr ? "إرسال رمز التحقق (OTP)" : "SEND VERIFICATION CODE"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="w-full text-center text-xs text-ivory/60 hover:text-gold transition-colors pt-2 block eyebrow"
                >
                  {isAr ? "← العودة لتسجيل الدخول" : "← Back to Sign In"}
                </button>
              </form>
            )}

            {/* ============================================================= */}
            {/* VIEW 3: FORGOT PASSWORD - STEP 2 (Enter 6-Digit OTP)          */}
            {/* ============================================================= */}
            {view === "forgot-step-2" && (
              <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-in">
                <div className="text-center mb-2">
                  <span className="text-[11px] eyebrow text-gold/80 font-mono tracking-wider" dir="ltr">
                    {email}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] eyebrow text-ivory/60 uppercase tracking-wider mb-2">
                    {isAr ? "رمز التحقق (6 أرقام)" : "6-DIGIT OTP"}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                    placeholder="000000"
                    style={inputStyle}
                    className="studio-login-input w-full bg-[#161513] border border-gold/40 text-gold text-2xl tracking-[0.5em] text-center font-mono py-3 rounded-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-200 placeholder:text-gold/25"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-ivory/60">
                  <span>
                    {countdown > 0
                      ? isAr
                        ? `إعادة الإرسال بعد ${countdown} ثانية`
                        : `Resend code in ${countdown}s`
                      : isAr
                      ? "لم يصلك الرمز؟"
                      : "Didn't receive code?"}
                  </span>

                  <button
                    type="button"
                    disabled={countdown > 0 || loading}
                    onClick={handleRequestOtp}
                    className="text-gold hover:text-white transition-colors disabled:opacity-40 disabled:hover:text-gold cursor-pointer font-medium"
                  >
                    {isAr ? "إعادة إرسال الرمز" : "Resend OTP"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full bg-gold hover:bg-ivory text-charcoal font-medium text-xs tracking-widest eyebrow py-3.5 rounded-xs transition-all duration-300 shadow-sm active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <RefreshCw className="size-3.5 animate-spin" />}
                  <span>{loading ? (isAr ? "جاري التحقق..." : "Verifying...") : isAr ? "تحقق ومتابعة" : "VERIFY CODE"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setView("forgot-step-1")}
                  className="w-full text-center text-xs text-ivory/60 hover:text-gold transition-colors pt-1 block eyebrow"
                >
                  {isAr ? "تغيير البريد الإلكتروني" : "Change Email"}
                </button>
              </form>
            )}

            {/* ============================================================= */}
            {/* VIEW 4: FORGOT PASSWORD - STEP 3 (Create New Password)        */}
            {/* ============================================================= */}
            {view === "forgot-step-3" && (
              <form onSubmit={handleResetPassword} className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-[11px] eyebrow text-ivory/60 uppercase tracking-wider mb-2">
                    {isAr ? "كلمة المرور الجديدة" : "NEW PASSWORD"}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      style={inputStyle}
                      className="studio-login-input w-full bg-[#161513] border border-white/15 text-white text-xs sm:text-sm px-4 py-3 rounded-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-200 placeholder:text-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="size-8 flex items-center justify-center text-white/40 hover:text-gold absolute end-2 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] eyebrow text-ivory/60 uppercase tracking-wider mb-2">
                    {isAr ? "تأكيد كلمة المرور الجديدة" : "CONFIRM NEW PASSWORD"}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    style={inputStyle}
                    className="studio-login-input w-full bg-[#161513] border border-white/15 text-white text-xs sm:text-sm px-4 py-3 rounded-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-200 placeholder:text-white/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !newPassword || newPassword !== confirmPassword}
                  className="w-full bg-gold hover:bg-ivory text-charcoal font-medium text-xs tracking-widest eyebrow py-3.5 rounded-xs transition-all duration-300 shadow-sm active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
                >
                  {loading && <RefreshCw className="size-3.5 animate-spin" />}
                  <span>{loading ? (isAr ? "جاري تسجيل الدخول..." : "Signing in...") : isAr ? "تسجيل الدخول" : "SIGN IN"}</span>
                </button>
              </form>
            )}

            {/* ============================================================= */}
            {/* VIEW 5: SUCCESS CONFIRMATION                                  */}
            {/* ============================================================= */}
            {view === "success" && (
              <div className="text-center py-4 space-y-5 animate-fade-in">
                <div className="size-16 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto text-gold">
                  <CheckCircle2 className="size-8" />
                </div>

                <h3 className="font-serif text-xl text-white">
                  {isAr ? "تم تحديث كلمة المرور بنجاح" : "Password Updated"}
                </h3>

                <p className="text-xs text-ivory/70 leading-relaxed font-sans max-w-xs mx-auto">
                  {isAr
                    ? "تم تغيير كلمة المرور وتفعيلها في النظام. يمكنك الآن تسجيل الدخول مباشرة."
                    : "Your administrator password has been updated. You can now sign in to the studio."}
                </p>

                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="w-full bg-gold hover:bg-ivory text-charcoal font-medium text-xs tracking-widest eyebrow py-3.5 rounded-xs transition-all duration-300 shadow-sm active:scale-98 cursor-pointer"
                >
                  {isAr ? "تسجيل الدخول الآن" : "PROCEED TO SIGN IN"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>

      {/* Footer */}
      <footer className="container-viwan py-6 text-center relative z-20 text-[11px] text-ivory/40 eyebrow">
        <span>© 2026 VIWAN ARCHITECTURE & DESIGN STUDIO · ALL RIGHTS RESERVED</span>
      </footer>
    </div>
  )
}

// ── Master Dashboard Types ───────────────────────────────────────────────────
type Tab = "overview" | "projects" | "images" | "counters" | "admins" | "settings"

interface AdminUser {
  id: string
  name: string
  nameAr?: string
  email: string
  role: string
  roleAr?: string
  avatar?: string
  password?: string
  createdAt?: string
  status: 'active' | 'inactive'
}

interface SiteImageItem {
  id: string
  labelEn: string
  labelAr: string
  section: string
  currentUrl: string
  year?: string
  location?: string
  locationAr?: string
  description: string
  descriptionAr?: string
  aspectRatio: string
}

interface CounterMetric {
  id: string
  value: string
  labelEn: string
  labelAr: string
  subEn: string
  subAr: string
}

interface SiteSettings {
  phone: string
  phoneCairo?: string
  phoneRiyadh?: string
  phoneSyria?: string
  whatsapp?: string
  email: string
  emailCareers?: string
  city: string
  secondaryCity: string
  addressCairo?: string
  addressRiyadh?: string
  addressSyria?: string
  cairoProjectsCount?: string
  riyadhProjectsCount?: string
  syriaProjectsCount?: string
  impactProjects?: string
  impactM2?: string
  impactDisciplines?: string
  impactMarkets?: string
  mapLatitude?: number
  mapLongitude?: number
  mapZoom?: number
  mapLocationName?: string
  mapCaptionEn?: string
  mapCaptionAr?: string
  instagram?: string
  linkedin?: string
  behance?: string
  xTwitter?: string
  facebook?: string
  youtube?: string
}

interface ProjectData {
  id?: string
  title?: string
  name?: string
  titleAr?: string
  nameAr?: string
  slug: string
  category?: string
  categoryAr?: string
  type?: string
  typeAr?: string
  discipline?: string
  disciplines?: string[]
  location: string
  locationAr?: string
  year: string
  area?: string
  client?: string
  description: string
  descriptionAr?: string
  scope?: string[]
  scopeAr?: string[]
  cover?: string
  coverImage?: string
  image?: string
  interior?: string
  cinematic?: string
  images?: string[]
  featured?: boolean
  status?: string
}

const ARCHITECTURAL_DISCIPLINES = [
  { id: 'architecture', nameEn: 'Architecture', nameAr: 'الهندسة المعمارية', code: '01' },
  { id: 'interior-design', nameEn: 'Interior Design', nameAr: 'التصميم الداخلي', code: '02' },
  { id: 'urban-planning', nameEn: 'Urban Planning', nameAr: 'التخطيط العمراني', code: '03' },
  { id: 'landscape', nameEn: 'Landscape Architecture', nameAr: 'هندسة وتنسيق المواقع', code: '04' },
  { id: 'supervision', nameEn: 'Construction Supervision', nameAr: 'الإشراف الهندسي والتنفيذي', code: '05' },
  { id: 'restoration', nameEn: 'Historic Restoration', nameAr: 'الترميم وإحياء التراث', code: '06' },
  { id: 'contracting', nameEn: 'Turnkey Contracting', nameAr: 'المقاولات المتكاملة والمفتاح باليد', code: '07' },
  { id: 'sustainable', nameEn: 'Sustainable Engineering', nameAr: 'الهندسة المستدامة وكفاءة الطاقة', code: '08' },
]

// ── OVERVIEW TAB ────────────────────────────────────────────────────────────
function OverviewTab({
  projects,
  siteImages,
  admins,
  counters,
  settings,
  onNavigate,
  onEditProject,
  isAr,
}: {
  projects: ProjectData[]
  siteImages: SiteImageItem[]
  admins: AdminUser[]
  counters: CounterMetric[]
  settings: SiteSettings
  onNavigate: (tab: Tab) => void
  onEditProject: (p: ProjectData) => void
  onNewProject: () => void
  isAr: boolean
}) {
  const featuredCount = projects.filter((p) => p.featured).length

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Studio Banner */}
      <div className="relative overflow-hidden rounded-xs border border-white/10 bg-gradient-to-br from-[#161513] via-[#100F0E] to-[#0C0B0A] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-gold uppercase font-medium">
                {isAr ? 'لوحة تحكم استوديو إيوان المعماري' : 'VIWAN STUDIO ARCHITECTURAL GATEWAY'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-white font-serif font-light tracking-tight">
              {isAr ? 'منظومة إدارة المحتوى والهوية المعمارية' : 'Curated Architecture & Studio Content System'}
            </h1>
            <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
              {isAr
                ? 'إدارة متكاملة لمشاريع التخصصات الثمانية، مكتبة الصور المعمارية الكاملة (38 صورة عبر كافة الصفحات)، إحصائيات الأثر، المشرفين وفروع الاستوديو.'
                : 'Central orchestration for the 8 disciplines, full 38-asset site media library, animated impact counters, and regional branch operations.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onNewProject}
              className="px-4 py-2.5 rounded-xs bg-gold text-charcoal text-xs font-semibold eyebrow hover:bg-[#D4BC96] transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-gold/10"
            >
              <Plus className="size-3.5" />
              <span>{isAr ? 'إضافة مشروع جديد' : 'New Project'}</span>
            </button>
            <Link
              href="/projects"
              target="_blank"
              className="px-4 py-2.5 rounded-xs border border-white/20 text-white text-xs eyebrow hover:border-gold hover:text-gold transition-colors flex items-center gap-2 bg-white/[0.02]"
            >
              <span>{isAr ? 'معاينة المشاريع' : 'Live Projects'}</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </div>
        <div className="absolute -end-12 -bottom-12 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('projects')}
          className="bg-[#141311] border border-white/10 hover:border-gold/50 p-5 rounded-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-white/40 mb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-gold/80">01 / PROJECTS</span>
            <FolderKanban className="size-4 group-hover:text-gold transition-colors" />
          </div>
          <div className="text-3xl font-serif text-white font-light group-hover:text-gold transition-colors">{projects.length}</div>
          <p className="text-white/40 text-xs mt-1">
            {isAr ? `${featuredCount} مشروعاً مميزاً على الواجهة` : `${featuredCount} featured projects`}
          </p>
        </div>

        <div
          onClick={() => onNavigate('images')}
          className="bg-[#141311] border border-white/10 hover:border-gold/50 p-5 rounded-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-white/40 mb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-gold/80">02 / VISUALS</span>
            <ImageIcon className="size-4 group-hover:text-gold transition-colors" />
          </div>
          <div className="text-3xl font-serif text-white font-light group-hover:text-gold transition-colors">{siteImages.length}</div>
          <p className="text-white/40 text-xs mt-1">
            {isAr ? '38 صورة معمارية عبر 6 أقسام' : '38 visual assets across 6 sections'}
          </p>
        </div>

        <div
          onClick={() => onNavigate('counters')}
          className="bg-[#141311] border border-white/10 hover:border-gold/50 p-5 rounded-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-white/40 mb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-gold/80">03 / COUNTERS</span>
            <BarChart3 className="size-4 group-hover:text-gold transition-colors" />
          </div>
          <div className="text-3xl font-serif text-white font-light group-hover:text-gold transition-colors">
            {counters.find((c) => c.id === 'projects')?.value || '45+'}
          </div>
          <p className="text-white/40 text-xs mt-1">
            {isAr ? 'عدادات الأثر وتواجد المنطقة' : 'Live impact metrics & regional stats'}
          </p>
        </div>

        <div
          onClick={() => onNavigate('admins')}
          className="bg-[#141311] border border-white/10 hover:border-gold/50 p-5 rounded-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-white/40 mb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-gold/80">04 / ADMINS</span>
            <ShieldCheck className="size-4 group-hover:text-gold transition-colors" />
          </div>
          <div className="text-3xl font-serif text-white font-light group-hover:text-gold transition-colors">{admins.length}</div>
          <p className="text-white/40 text-xs mt-1">
            {isAr ? 'مشرفين بصلاحيات Brevo OTP' : 'Verified studio administrators'}
          </p>
        </div>
      </div>

      {/* Quick Showcase & Management */}
      <div className="bg-[#141311] border border-white/10 rounded-xs p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-white font-serif text-lg font-light">
              {isAr ? 'أحدث المشاريع المعمارية الموثقة' : 'Current Architectural Projects'}
            </h3>
            <p className="text-white/40 text-xs mt-0.5">
              {isAr ? 'نظرة سريعة على المشاريع الحالية في قاعدة البيانات' : 'Quick overview of current architectural projects'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-gold text-xs eyebrow hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isAr ? 'عرض الكل' : 'View All'}</span>
            <ArrowRight className="size-3 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.slice(0, 6).map((p) => (
            <div
              key={p.id || p.slug}
              className="group bg-[#181715] border border-white/5 hover:border-gold/40 rounded-xs overflow-hidden transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                <img
                  src={p.coverImage || p.cover || (p as any).image || '/images/hero-villa.png'}
                  alt={p.title || (p as any).name || 'Project'}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-2.5 start-2.5">
                  <span className="px-2 py-0.5 rounded-2xs bg-black/60 backdrop-blur-md text-[10px] font-mono text-gold border border-white/10">
                    {isAr ? (p.categoryAr || (p as any).typeAr || p.category || (p as any).type || 'الهندسة المعمارية') : (p.category || (p as any).type || 'Architecture')}
                  </span>
                </div>
                {p.featured && (
                  <div className="absolute top-2.5 end-2.5">
                    <span className="px-2 py-0.5 rounded-2xs bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold flex items-center gap-1">
                      <Star className="size-2.5 text-white fill-white" />
                      <span>{isAr ? 'مميز' : 'Featured'}</span>
                    </span>
                  </div>
                )}
                <div className="absolute bottom-2.5 start-2.5 end-2.5 text-white">
                  <h4 className="font-serif text-sm font-medium leading-tight truncate">
                    {isAr ? (p.titleAr || (p as any).nameAr || p.title || (p as any).name) : (p.title || (p as any).name)}
                  </h4>
                  <p className="text-[11px] text-white/60 mt-0.5 truncate">
                    {isAr ? (p.locationAr || p.location) : p.location} · {p.year}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => onEditProject(p)}
                  className="text-gold hover:text-[#E2CBA8] transition-colors eyebrow cursor-pointer flex items-center gap-1.5 text-[11px]"
                >
                  <Edit3 className="size-3" />
                  <span>{isAr ? 'تعديل التفاصيل' : 'Edit Details'}</span>
                </button>
                <Link
                  href={`/projects/${p.slug}`}
                  target="_blank"
                  className="text-white/40 hover:text-white transition-colors text-[11px] flex items-center gap-1"
                >
                  <span>{isAr ? 'معاينة' : 'Preview'}</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── PROJECTS TAB (BESPOKE ARCHITECTURAL MONOGRAPH & REGISTRY SUITE) ──────────
function ProjectsTab({
  projects,
  onRefresh,
  onEdit,
  editingProject,
  onCloseEdit,
  isAr,
  showToast,
  askConfirm,
  isCreating: isCreatingProp,
  onOpenCreate,
  onCloseCreate,
}: {
  projects: ProjectData[]
  onRefresh: () => void
  onEdit: (p: ProjectData) => void
  editingProject: ProjectData | null
  onCloseEdit: () => void
  isAr: boolean
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void
  askConfirm?: (title: string, message: string, onConfirm: () => void, confirmLabel?: string) => void
  isCreating?: boolean
  onOpenCreate?: () => void
  onCloseCreate?: () => void
}) {
  const [filterDiscipline, setFilterDiscipline] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'featured'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'featured' | 'title'>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'dual' | 'grid' | 'table'>('grid')
  const [quickActionSlug, setQuickActionSlug] = useState<string | null>(null)
  const [isCreatingLocal, setIsCreatingLocal] = useState(false)
  const isCreating = isCreatingProp !== undefined ? isCreatingProp : isCreatingLocal
  const handleOpenCreate = () => {
    if (onOpenCreate) onOpenCreate()
    else setIsCreatingLocal(true)
  }
  const handleCloseCreate = () => {
    if (onCloseCreate) onCloseCreate()
    else setIsCreatingLocal(false)
  }
  const [isDeleting, setIsDeleting] = useState(false)
  const [tablePage, setTablePage] = useState(1)
  const pageSize = 6

  // Project Metrics
  const totalCount = projects.length
  const publishedCount = projects.filter((p) => p.status !== 'Draft').length
  const draftCount = projects.filter((p) => p.status === 'Draft').length
  const featuredCount = projects.filter((p) => p.featured).length

  // Filter & Sort Projects
  const filtered = projects.filter((p) => {
    const pCategory = (p.category || (p as any).type || '').toLowerCase()
    const matchDiscipline =
      filterDiscipline === 'all' ||
      p.discipline === filterDiscipline ||
      pCategory === filterDiscipline

    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && p.status !== 'Draft') ||
      (filterStatus === 'draft' && p.status === 'Draft') ||
      (filterStatus === 'featured' && Boolean(p.featured))

    const titleEn = (p.title || (p as any).name || '').toLowerCase()
    const titleAr = (p.titleAr || (p as any).nameAr || '').toLowerCase()
    const loc = (p.location || (p as any).locationAr || '').toLowerCase()
    const refCode = `ref-${p.year || ''}-${(p.slug || '').slice(0, 3)}`.toLowerCase()

    const matchSearch =
      searchQuery === '' ||
      titleEn.includes(searchQuery.toLowerCase()) ||
      titleAr.includes(searchQuery.toLowerCase()) ||
      loc.includes(searchQuery.toLowerCase()) ||
      refCode.includes(searchQuery.toLowerCase()) ||
      (p.year && p.year.includes(searchQuery))

    return matchDiscipline && matchStatus && matchSearch
  })

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'featured') {
      if (a.featured === b.featured) return 0
      return a.featured ? -1 : 1
    }
    if (sortBy === 'oldest') {
      return (Number(a.year) || 0) - (Number(b.year) || 0)
    }
    if (sortBy === 'title') {
      const nameA = (a.titleAr || a.title || '').toLowerCase()
      const nameB = (b.titleAr || b.title || '').toLowerCase()
      return nameA.localeCompare(nameB)
    }
    // Default: newest
    return (Number(b.year) || 9999) - (Number(a.year) || 0)
  })

  // Table pagination
  const paginatedProjects = sorted.slice((tablePage - 1) * pageSize, tablePage * pageSize)
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))

  // Toggle Featured status directly
  const handleToggleFeatured = async (p: ProjectData) => {
    try {
      const nextFeatured = !p.featured
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: p.slug, updates: { featured: nextFeatured } }),
        credentials: 'include',
      })
      if (res.ok) {
        if (showToast) {
          showToast(
            nextFeatured
              ? (isAr ? `تم تمييز مشروع "${p.titleAr || p.title}" في الواجهة` : `Featured "${p.title}"`)
              : (isAr ? `تم إزالة التمييز عن المشروع` : `Unfeatured "${p.title}"`)
          )
        }
        onRefresh()
      }
    } catch {
      if (showToast) showToast(isAr ? 'فشل تعديل حالة التمييز' : 'Failed to update feature', 'error')
    }
  }

  // Delete project
  const handleDelete = async (slug: string, name: string) => {
    const confirmTitle = isAr ? 'حذف المشروع المعماري' : 'Delete Architectural Project'
    const confirmMsg = isAr
      ? `هل أنت متأكد من حذف مشروع "${name}" نهائياً من قاعدة البيانات وسجل المونوغراف؟`
      : `Are you sure you want to delete "${name}" permanently?`

    const executeDelete = async () => {
      setIsDeleting(true)
      try {
        const res = await fetch(`/api/admin/projects?slug=${encodeURIComponent(slug)}`, {
          method: 'DELETE',
          credentials: 'include',
        })
        if (res.ok) {
          if (showToast) showToast(isAr ? `تم حذف مشروع "${name}" بنجاح` : `Project "${name}" deleted`)
          onRefresh()
        } else {
          if (showToast) showToast(isAr ? 'فشل حذف المشروع' : 'Failed to delete project', 'error')
        }
      } catch {
        if (showToast) showToast(isAr ? 'حدث خطأ أثناء الاتصال بالخادم' : 'Connection error', 'error')
      } finally {
        setIsDeleting(false)
        setQuickActionSlug(null)
      }
    }

    if (askConfirm) {
      askConfirm(confirmTitle, confirmMsg, executeDelete)
    } else {
      if (confirm(confirmMsg)) executeDelete()
    }
  }

  // Export CSV Registry
  const handleExportCSV = () => {
    const headers = ['Ref Code', 'Title Ar', 'Title En', 'Discipline', 'Location', 'Year', 'Status', 'Featured', 'Slug']
    const rows = projects.map((p) => [
      `REF-${p.year || '2024'}-${(p.slug || '').slice(0, 3).toUpperCase()}`,
      `"${(p.titleAr || (p as any).nameAr || p.title || '').replace(/"/g, '""')}"`,
      `"${(p.title || (p as any).name || '').replace(/"/g, '""')}"`,
      `"${(p.categoryAr || (p as any).typeAr || p.category || '').replace(/"/g, '""')}"`,
      `"${(p.locationAr || p.location || '').replace(/"/g, '""')}"`,
      p.year || '',
      p.status || 'Published',
      p.featured ? 'Yes' : 'No',
      p.slug || '',
    ])
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `viwan-projects-registry-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    if (showToast) showToast(isAr ? 'تم تصدير كشف المشروعات بنجاح (CSV)' : 'Registry exported as CSV')
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in select-text">
      {/* ── TOP ARCHITECTURAL HEADER & REGISTRY STATS ──────────────────────── */}
      <div className="space-y-3 border-b border-white/10 pb-6">
        {/* Technical Subheader Coordinates */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-white/40 tracking-widest uppercase">
          <div className="flex items-center gap-2 text-gold/80">
            <span>CODE 04-ARC</span>
            <span className="text-white/20">//</span>
            <span>ATELIER V</span>
            <span className="text-white/20">//</span>
            <span className="text-white/60">PORTFOLIO REGISTRY</span>
          </div>
          <div className="hidden sm:block">METRIC GRID 1:25</div>
        </div>

        {/* Main Title & Action Pill */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pt-1">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-serif font-light text-white tracking-wide">
              {isAr ? 'إدارة المشاريع المعمارية' : 'Architectural Projects Portfolio'}
            </h1>
            <p className="text-white/50 text-xs sm:text-[13px] leading-relaxed">
              {isAr
                ? 'إدارة وتنظيم جميع المشاريع المعروضة في معرض أعمال الشركة والمونوغراف المعماري الرقمي مع ربط مخططات التنفيذ والتصنيف الإقراري.'
                : 'Architectural database managing all portfolio works, digital monograph entries, and BIM coordination classifications.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Project Metrics Badge (Plain Monochromatic) */}
            <div className="px-3.5 py-2 rounded-xs bg-[#0f0f13] border border-white/10 font-mono text-xs flex items-center gap-2.5 text-white/70">
              <span className="font-serif text-sm text-white font-medium">
                {totalCount} {isAr ? 'مشروعاً' : 'projects'}
              </span>
              <span className="text-white/20">|</span>
              <span className="text-white/85 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-white/50" />
                {publishedCount} {isAr ? 'منشور' : 'live'}
              </span>
              <span className="text-white/20">·</span>
              <span className="text-white/55">{draftCount} {isAr ? 'مسودة' : 'draft'}</span>
              <span className="text-white/20">·</span>
              <span className="text-white/55">{featuredCount} {isAr ? 'مميز' : 'featured'}</span>
            </div>

            {/* Add New Project Gold Button */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-xs bg-gold hover:bg-[#D4BC96] text-charcoal text-xs font-semibold eyebrow transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-gold/20"
            >
              <Plus className="size-3.5 stroke-[2.5]" />
              <span>{isAr ? 'إضافة مشروع جديد' : 'New Project'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── ARCHITECTURAL CONTROL & FILTER TOOLBAR ─────────────────────────── */}
      <div className="bg-[#0f0f13] border border-white/10 rounded-xs p-3.5 sm:p-4 space-y-3.5 shadow-xl">
        {/* Upper Row: Search & Filters & View Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 text-white/40 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={isAr ? 'البحث عن مشروع بالاسم، الموقع أو الكود #Ref...' : 'Search by title, location or #Ref code...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setTablePage(1)
              }}
              className="w-full bg-black/40 border border-white/10 rounded-xs ps-9 pe-4 py-2 text-xs text-white placeholder-white/30 focus:border-gold/60 focus:outline-none font-mono"
            />
          </div>

          {/* Filter Dropdowns & View Mode */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Discipline Dropdown */}
            <div className="relative">
              <select
                value={filterDiscipline}
                onChange={(e) => {
                  setFilterDiscipline(e.target.value)
                  setTablePage(1)
                }}
                className="bg-black/40 border border-white/10 rounded-xs px-3 py-2 text-white/80 focus:border-gold/60 focus:outline-none cursor-pointer text-xs font-mono"
              >
                <option value="all">{isAr ? 'كل التخصصات (Disciplines)' : 'All Disciplines'}</option>
                {ARCHITECTURAL_DISCIPLINES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} · {isAr ? d.nameAr : d.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as any)
                  setTablePage(1)
                }}
                className="bg-black/40 border border-white/10 rounded-xs px-3 py-2 text-white/80 focus:border-gold/60 focus:outline-none cursor-pointer text-xs font-mono"
              >
                <option value="all">{isAr ? 'حالة المشروع: الكل' : 'Status: All'}</option>
                <option value="published">{isAr ? 'منشور (Published)' : 'Published'}</option>
                <option value="draft">{isAr ? 'مسودة (Draft)' : 'Draft'}</option>
                <option value="featured">{isAr ? 'المميزة فقط (Featured)' : 'Featured'}</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black/40 border border-white/10 rounded-xs px-3 py-2 text-white/80 focus:border-gold/60 focus:outline-none cursor-pointer text-xs font-mono"
              >
                <option value="newest">{isAr ? 'ترتيب: الأحدث أولاً' : 'Sort: Newest'}</option>
                <option value="oldest">{isAr ? 'ترتيب: الأقدم أولاً' : 'Sort: Oldest'}</option>
                <option value="featured">{isAr ? 'المميزة أولاً' : 'Featured First'}</option>
                <option value="title">{isAr ? 'أبجدياً (A-Z)' : 'Title (A-Z)'}</option>
              </select>
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center p-0.5 bg-black/50 border border-white/10 rounded-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-2xs transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-gold text-charcoal font-bold' : 'text-white/40 hover:text-white'
                }`}
                title={isAr ? 'عرض البطاقات' : 'Grid View'}
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('dual')}
                className={`p-1.5 rounded-2xs transition-colors cursor-pointer ${
                  viewMode === 'dual' ? 'bg-gold text-charcoal font-bold' : 'text-white/40 hover:text-white'
                }`}
                title={isAr ? 'عرض مزدوج متكامل' : 'Dual View (Cards & Registry)'}
              >
                <List className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-2xs transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-gold text-charcoal font-bold' : 'text-white/40 hover:text-white'
                }`}
                title={isAr ? 'عرض جدول السجل' : 'Table Registry'}
              >
                <TableIcon className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Lower Row: Manual Order & Sync Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-white/5 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-white/50">
            <span>{isAr ? 'إعادة الترتيب اليدوي (Manual Order Active)' : 'Manual Ordering Active'}</span>
            <span className="text-white/20">•</span>
            <span className="text-gold/70 px-1.5 py-0.2 rounded-2xs bg-gold/10 border border-gold/20">
              ATELIER-IM024-5024
            </span>
          </div>

          <div className="flex items-center gap-2 text-white/40">
            <span className="size-1.5 rounded-full bg-gold animate-pulse" />
            <span>{isAr ? 'التحديث متزامن مع النسخة المطبوعة والموقع العام' : 'Sync active with digital monograph and web portfolio'}</span>
          </div>
        </div>
      </div>

      {/* ── VIEWPORT CONTENT: EMPTY STATE OR CARDS & REGISTRY ──────────────── */}
      {sorted.length === 0 ? (
        /* Empty State (Matching bottom card in reference Image 1) */
        <div className="bg-[#0f0f13] border border-white/10 rounded-xs p-10 sm:p-14 text-center space-y-4 max-w-2xl mx-auto shadow-2xl animate-fade-in">
          <div className="size-12 rounded-xs bg-gold/10 border border-gold/30 text-gold flex items-center justify-center mx-auto shadow-lg shadow-gold/10">
            <Building2 className="size-6" strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-gold/80 uppercase tracking-widest">
              {isAr ? 'حالة الفهرس الفارغ (EMPTY REGISTRY STATE)' : 'EMPTY REGISTRY STATE'}
            </div>
            <h3 className="text-lg sm:text-xl font-serif text-white font-light">
              {isAr ? 'لا توجد مشاريع مطابقة في هذا التصنيف' : 'No projects matching this filter'}
            </h3>
          </div>
          <p className="text-white/50 text-xs leading-relaxed max-w-md mx-auto">
            {isAr
              ? 'ابدأ بإضافة أول مشروع معماري أو اسحب ملفات الـ CAD ومخططات الـ BIM إلى المعرض الرقمي للبدء في فهرسة المونوغراف.'
              : 'Begin by creating an architectural entry or import CAD/BIM assets to index the studio monograph.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="px-5 py-2.5 rounded-xs bg-gold hover:bg-[#D4BC96] text-charcoal text-xs font-semibold eyebrow transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-gold/20"
            >
              <Plus className="size-3.5 stroke-[2.5]" />
              <span>{isAr ? 'إضافة مشروع معماري جديد' : 'Create New Project'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setFilterDiscipline('all')
                setFilterStatus('all')
              }}
              className="px-4 py-2.5 rounded-xs border border-white/15 hover:border-white/30 text-white/80 hover:text-white text-xs font-mono transition-colors cursor-pointer"
            >
              {isAr ? 'إعادة ضبط البحث' : 'Reset Filters'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* ── 1. ARCHITECTURAL CARDS GRID (AS IN IMAGE 1) ───────────────── */}
          {(viewMode === 'grid' || viewMode === 'dual') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
              {sorted.map((p) => {
                const refCode = `REF-${p.year || '2024'}-${(p.slug || '').slice(0, 3).toUpperCase()}`
                const isQuickActive = quickActionSlug === p.slug

                return (
                  <div
                    key={p.id || p.slug}
                    className="group relative bg-[#0f0f13] border border-white/10 hover:border-gold/40 rounded-xs overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl"
                  >
                    {/* ── CARD MEDIA HEADER ───────────────────────────────── */}
                    <div className="relative aspect-[16/10] w-full bg-black/60 overflow-hidden select-none">
                      <img
                        src={p.coverImage || p.cover || (p as any).image || '/images/hero-villa.png'}
                        alt={p.title || (p as any).name || 'Project'}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-103"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

                      {/* Top Badges: Category & Featured */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                        {/* Featured Badge - White Star, Monochromatic */}
                        {p.featured ? (
                          <span className="px-2.5 py-1 rounded-2xs bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-medium eyebrow flex items-center gap-1.5 shadow-md">
                            <Star className="size-3 text-white fill-white" />
                            <span>{isAr ? 'مميز (FEATURED)' : 'FEATURED'}</span>
                          </span>
                        ) : (
                          <span />
                        )}

                        {/* Category Badge */}
                        <span className="px-2.5 py-1 rounded-2xs bg-black/70 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/15">
                          {isAr ? (p.categoryAr || (p as any).typeAr || p.category || 'الهندسة المعمارية') : (p.category || 'Architecture')}
                        </span>
                      </div>

                      {/* Bottom Image Overlay Details: Code & Titles & Live Status (Plain Monochromatic) */}
                      <div className="absolute bottom-3 inset-x-3.5 text-white z-10 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-gold/90 font-bold tracking-widest">{refCode}</span>
                          <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/80">
                            <span className={`size-1.5 rounded-full ${p.status === 'Draft' ? 'bg-white/40' : 'bg-white/70'}`} />
                            <span>{p.status === 'Draft' ? (isAr ? 'مسودة' : 'Draft') : (isAr ? 'منشور' : 'Live')}</span>
                          </span>
                        </div>

                        <h3 className="font-serif text-base sm:text-lg font-light leading-tight truncate text-white group-hover:text-gold transition-colors">
                          {isAr ? (p.titleAr || (p as any).nameAr || p.title || (p as any).name) : (p.title || (p as any).name)}
                        </h3>
                        <div className="text-[10px] font-mono text-white/60 tracking-wider uppercase truncate">
                          {p.title || (p as any).name}
                        </div>
                      </div>

                      {/* ── QUICK ACTIONS OVERLAY (AS SHOWN IN IMAGE 1 CARD 1) ── */}
                      {isQuickActive && (
                        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center gap-4 animate-fade-in">
                          <div className="space-y-0.5">
                            <div className="text-[10px] font-mono text-gold uppercase tracking-widest">
                              {isAr ? 'لوحة الإجراءات السريعة' : 'QUICK ACTIONS'}
                            </div>
                            <div className="text-white font-serif text-sm font-medium">
                              {isAr ? (p.titleAr || p.title) : p.title}
                            </div>
                          </div>

                          <div className="flex flex-col w-full max-w-xs gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setQuickActionSlug(null)
                                onEdit(p)
                              }}
                              className="w-full py-2 rounded-xs bg-gold hover:bg-[#D4BC96] text-charcoal font-semibold text-xs eyebrow transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                            >
                              <Edit3 className="size-3.5" />
                              <span>{isAr ? 'تعديل (EDIT)' : 'EDIT'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(p.slug, isAr ? (p.titleAr || p.title) : p.title)}
                              className="w-full py-2 rounded-xs bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white font-semibold text-xs eyebrow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="size-3.5 text-white/60" />
                              <span>{isAr ? 'حذف (DELETE)' : 'DELETE'}</span>
                            </button>

                            <Link
                              href={`/projects/${p.slug}`}
                              target="_blank"
                              className="w-full py-2 rounded-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-mono transition-colors flex items-center justify-center gap-2"
                            >
                              <Eye className="size-3 text-gold" />
                              <span>{isAr ? 'معاينة حية في الموقع' : 'Live Preview'}</span>
                            </Link>
                          </div>

                          <button
                            type="button"
                            onClick={() => setQuickActionSlug(null)}
                            className="text-[11px] text-white/40 hover:text-white transition-colors cursor-pointer"
                          >
                            {isAr ? 'انقر هنا للإغلاق' : 'Click to close'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ── CARD BODY ───────────────────────────────────────── */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      {/* Location & Year Metadata */}
                      <div className="flex items-center justify-between text-xs font-mono text-white/60">
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin className="size-3.5 text-gold shrink-0" />
                          <span className="truncate">{isAr ? (p.locationAr || p.location) : p.location}</span>
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Calendar className="size-3.5 text-gold/70" />
                          <span>{p.year}</span>
                        </span>
                      </div>

                      {/* Narrative Text */}
                      <p className="text-white/60 text-xs sm:text-[13px] line-clamp-2 leading-relaxed font-sans">
                        {isAr ? (p.descriptionAr || p.description) : p.description}
                      </p>

                      {/* Scope & Discipline Chips */}
                      {p.scope && p.scope.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.scope.slice(0, 4).map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded-2xs text-white/70"
                            >
                              {s}
                            </span>
                          ))}
                          {p.scope.length > 4 && (
                            <span className="text-[10px] font-mono bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded-2xs text-gold/80">
                              +{p.scope.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ── CARD FOOTER & ACTIONS ───────────────────────────── */}
                    <div className="p-4 sm:p-5 pt-0 flex items-center justify-between border-t border-white/5 mt-1 text-xs">
                      {/* Status indicator on the right */}
                      <div className="text-[11px] font-mono text-white/50 flex items-center gap-1.5">
                        <span className={`size-1.5 rounded-full ${p.status === 'Draft' ? 'bg-white/40' : 'bg-white/70'}`} />
                        <span>{p.status === 'Draft' ? (isAr ? 'مسودة غير منشورة' : 'Unpublished Draft') : (isAr ? 'منشور في المعرض العام' : 'Public Portfolio')}</span>
                      </div>

                      {/* Action buttons on the left */}
                      <div className="flex items-center gap-2">
                        {/* 3-dots Quick Actions Toggle */}
                        <button
                          type="button"
                          onClick={() => setQuickActionSlug(isQuickActive ? null : p.slug)}
                          className="p-1.5 rounded-xs bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors cursor-pointer"
                          title={isAr ? 'الإجراءات السريعة' : 'Quick Actions'}
                        >
                          <MoreVertical className="size-3.5" />
                        </button>

                        {/* Preview */}
                        <Link
                          href={`/projects/${p.slug}`}
                          target="_blank"
                          className="px-2.5 py-1 rounded-xs bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono transition-colors flex items-center gap-1"
                        >
                          <Eye className="size-3 text-gold" />
                          <span>{isAr ? 'معاينة' : 'View'}</span>
                        </Link>

                        {/* Edit Button (Gold) */}
                        <button
                          type="button"
                          onClick={() => onEdit(p)}
                          className="px-3.5 py-1 rounded-xs bg-gold hover:bg-[#D4BC96] text-charcoal font-semibold text-xs eyebrow transition-colors cursor-pointer flex items-center gap-1 shadow-sm shadow-gold/20"
                        >
                          <Edit3 className="size-3" />
                          <span>{isAr ? 'تعديل المشروع' : 'Edit'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── 2. MONOGRAPH REGISTRY TABLE (AS IN IMAGE 1 SECTION 2) ──────── */}
          {(viewMode === 'table' || viewMode === 'dual') && (
            <div className="bg-[#0f0f13] border border-white/10 rounded-xs overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6">
              {/* Table Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-gold" />
                  <h3 className="font-serif text-base sm:text-lg text-white font-medium">
                    {isAr ? 'سجل المشروعات والمونوغراف التوثيقي' : 'Monograph Editorial & Projects Registry'}
                  </h3>
                  <span className="text-white/40 font-mono text-xs">
                    ({sorted.length} {isAr ? 'حفظت جميعاً' : 'total items'})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 rounded-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="size-3 text-gold" />
                    <span>{isAr ? 'تصدير كشف البيانات CSV' : 'Export CSV'}</span>
                  </button>
                </div>
              </div>

              {/* ── MOBILE VIEW: DEDICATED CARDS LIST (ZERO HORIZONTAL OVERFLOW) ── */}
              <div className="md:hidden divide-y divide-white/10">
                {paginatedProjects.map((p, idx) => {
                  const refCode = `REF-${p.year || '2024'}-${(p.slug || '').slice(0, 3).toUpperCase()}`
                  const rowIndex = (tablePage - 1) * pageSize + idx + 1

                  return (
                    <div key={p.id || p.slug} className="py-3.5 space-y-2.5">
                      {/* Top Row: Index, Thumbnail, Title, and White Star */}
                      <div className="flex items-start gap-3">
                        <span className="text-white/40 font-mono text-xs pt-1 shrink-0">
                          {String(rowIndex).padStart(2, '0')}
                        </span>

                        <div className="relative size-12 rounded-xs overflow-hidden bg-black/60 border border-white/10 shrink-0">
                          <img
                            src={p.coverImage || p.cover || (p as any).image || '/images/hero-villa.png'}
                            alt="Thumb"
                            className="object-cover w-full h-full"
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-serif text-sm font-medium text-white truncate">
                              {isAr ? (p.titleAr || (p as any).nameAr || p.title) : p.title}
                            </h4>
                            {/* Star Featured Toggle (White Star Icon) */}
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(p)}
                              className="p-1 rounded-xs hover:bg-white/10 transition-colors cursor-pointer shrink-0 text-white/30 hover:text-white"
                              title={p.featured ? (isAr ? 'إلغاء التمييز' : 'Unfeature') : (isAr ? 'تمييز في الواجهة' : 'Feature')}
                            >
                              <Star
                                className={`size-3.5 ${p.featured ? 'text-white fill-white' : 'text-white/20'}`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] font-mono text-white/50">
                            <span className="text-gold/90 font-bold">{refCode}</span>
                            <span>·</span>
                            <span>{p.year}</span>
                            <span>·</span>
                            <span className="truncate">{isAr ? (p.categoryAr || (p as any).typeAr || p.category || 'معماري') : (p.category || 'Architecture')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Location, Status Pill, and Actions */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Status Pill (Monochromatic) */}
                          <span className="px-2 py-0.5 rounded-2xs text-[10px] font-mono inline-flex items-center gap-1 bg-white/[0.08] text-white/90 border border-white/15 shrink-0">
                            <span className={`size-1 rounded-full ${p.status === 'Draft' ? 'bg-white/40' : 'bg-white/80'}`} />
                            <span>{p.status === 'Draft' ? (isAr ? 'مسودة' : 'Draft') : (isAr ? 'منشور' : 'Live')}</span>
                          </span>

                          <span className="text-[11px] text-white/50 truncate font-mono">
                            {isAr ? (p.locationAr || p.location) : p.location}
                          </span>
                        </div>

                        {/* Actions (Edit & Monochromatic Delete - NO Share Icon) */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => onEdit(p)}
                            className="px-2.5 py-1 rounded-xs bg-white/5 hover:bg-white/10 border border-white/15 text-gold text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="size-3" />
                            <span>{isAr ? 'تعديل' : 'Edit'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.slug, isAr ? (p.titleAr || p.title) : p.title)}
                            className="p-1.5 rounded-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 hover:text-white transition-colors cursor-pointer"
                            title={isAr ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ── DESKTOP VIEW: FULL DATA TABLE (HIDDEN ON MOBILE) ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-start text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-3 text-start">#</th>
                      <th className="py-3 px-3 text-start">{isAr ? 'المعاينة' : 'Preview'}</th>
                      <th className="py-3 px-3 text-start">{isAr ? 'اسم المشروع والكود' : 'Project & Code'}</th>
                      <th className="py-3 px-3 text-start">{isAr ? 'التصنيف' : 'Discipline'}</th>
                      <th className="py-3 px-3 text-start">{isAr ? 'الموقع' : 'Location'}</th>
                      <th className="py-3 px-3 text-start">{isAr ? 'السنة' : 'Year'}</th>
                      <th className="py-3 px-3 text-center">{isAr ? 'الحالة' : 'Status'}</th>
                      <th className="py-3 px-3 text-center">{isAr ? 'مميز' : 'Star'}</th>
                      <th className="py-3 px-3 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedProjects.map((p, idx) => {
                      const refCode = `REF-${p.year || '2024'}-${(p.slug || '').slice(0, 3).toUpperCase()}`
                      const rowIndex = (tablePage - 1) * pageSize + idx + 1

                      return (
                        <tr
                          key={p.id || p.slug}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          {/* Row Index */}
                          <td className="py-3.5 px-3 text-white/40">
                            {String(rowIndex).padStart(2, '0')}
                          </td>

                          {/* Thumbnail */}
                          <td className="py-3.5 px-3">
                            <div className="relative size-12 rounded-xs overflow-hidden bg-black/60 border border-white/10 shrink-0">
                              <img
                                src={p.coverImage || p.cover || (p as any).image || '/images/hero-villa.png'}
                                alt="Thumb"
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          </td>

                          {/* Project Name & Code */}
                          <td className="py-3.5 px-3">
                            <div className="space-y-0.5">
                              <div className="font-serif text-sm font-medium text-white group-hover:text-gold transition-colors">
                                {isAr ? (p.titleAr || (p as any).nameAr || p.title) : p.title}
                              </div>
                              <div className="text-[11px] text-white/50 flex items-center gap-2">
                                <span className="text-gold/80 font-bold">{refCode}</span>
                                <span className="text-white/20">·</span>
                                <span className="uppercase text-[10px] text-white/40">{p.title || (p as any).name}</span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-3 text-white/70">
                            <span className="px-2 py-0.5 rounded-2xs bg-white/5 border border-white/10 text-[10px]">
                              {isAr ? (p.categoryAr || (p as any).typeAr || p.category || 'الهندسة المعمارية') : (p.category || 'Architecture')}
                            </span>
                          </td>

                          {/* Location */}
                          <td className="py-3.5 px-3 text-white/60">
                            {isAr ? (p.locationAr || p.location) : p.location}
                          </td>

                          {/* Year */}
                          <td className="py-3.5 px-3 text-white/60">
                            {p.year}
                          </td>

                          {/* Status Pill (Monochromatic, No Green/Amber) */}
                          <td className="py-3.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-2xs text-[10px] inline-flex items-center gap-1 bg-white/[0.08] text-white/90 border border-white/15">
                              <span className={`size-1 rounded-full ${p.status === 'Draft' ? 'bg-white/40' : 'bg-white/80'}`} />
                              <span>{p.status === 'Draft' ? (isAr ? 'مسودة' : 'Draft') : (isAr ? 'منشور' : 'Live')}</span>
                            </span>
                          </td>

                          {/* Star Featured Toggle (White Star, No Emoji) */}
                          <td className="py-3.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(p)}
                              className="p-1 rounded-xs hover:bg-white/10 transition-colors cursor-pointer text-white/30 hover:text-white"
                              title={p.featured ? (isAr ? 'إلغاء التمييز' : 'Unfeature') : (isAr ? 'تمييز في الواجهة' : 'Feature')}
                            >
                              <Star
                                className={`size-3.5 ${p.featured ? 'text-white fill-white' : 'text-white/20'}`}
                              />
                            </button>
                          </td>

                          {/* Actions (Edit & Monochromatic Delete - NO Share Icon) */}
                          <td className="py-3.5 px-3 text-end">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => onEdit(p)}
                                className="p-1.5 rounded-xs text-gold hover:text-[#D4BC96] hover:bg-gold/10 transition-colors cursor-pointer"
                                title={isAr ? 'تعديل' : 'Edit'}
                              >
                                <Edit3 className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(p.slug, isAr ? (p.titleAr || p.title) : p.title)}
                                className="p-1.5 rounded-xs text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                title={isAr ? 'حذف' : 'Delete'}
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer & Pagination */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs font-mono text-white/40">
                <div>
                  {isAr
                    ? `عرض ${(tablePage - 1) * pageSize + 1} إلى ${Math.min(tablePage * pageSize, sorted.length)} من أصل ${sorted.length} مشروعاً`
                    : `Showing ${(tablePage - 1) * pageSize + 1} to ${Math.min(tablePage * pageSize, sorted.length)} of ${sorted.length}`}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={tablePage === 1}
                    onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 rounded-2xs bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
                  >
                    {isAr ? 'السابق' : 'Prev'}
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setTablePage(pg)}
                      className={`px-2.5 py-1 rounded-2xs transition-colors cursor-pointer ${
                        tablePage === pg ? 'bg-gold text-charcoal font-bold' : 'bg-white/5 hover:bg-white/10 text-white/70'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={tablePage === totalPages}
                    onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
                    className="px-2.5 py-1 rounded-2xs bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
                  >
                    {isAr ? 'التالي' : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── PROJECT ADD / EDIT FULL WORKSTATION MODAL ─────────────────────── */}
      {(isCreating || editingProject) && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            handleCloseCreate()
            onCloseEdit()
          }}
          onSaved={() => {
            handleCloseCreate()
            onCloseEdit()
            if (showToast) {
              showToast(isAr ? 'تم حفظ وتحديث المشروع في المونوغراف والموقع بنجاح!' : 'Project saved & live on site!')
            }
            onRefresh()
          }}
          isAr={isAr}
          showToast={showToast}
        />
      )}
    </div>
  )
}

// ── BESPOKE ARCHITECTURAL PROJECT ENTRY WORKSTATION (MATCHING REFERENCE IMAGE) ──
function ProjectModal({
  project,
  onClose,
  onSaved,
  isAr,
  showToast,
}: {
  project: ProjectData | null
  onClose: () => void
  onSaved: () => void
  isAr: boolean
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void
}) {
  const isEditing = !!project
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [copiedSlug, setCopiedSlug] = useState(false)
  const [showCustomServiceInput, setShowCustomServiceInput] = useState(false)
  const [customServiceText, setCustomServiceText] = useState('')
  const [focalPoint, setFocalPoint] = useState({ x: 42, y: 54 })
  const [showFocalPicker, setShowFocalPicker] = useState(false)

  // Standard architectural services
  const DEFAULT_SERVICES = [
    { id: 'arch', nameAr: 'التصميم المعماري', nameEn: 'Architectural Design' },
    { id: 'interior', nameAr: 'التصميم الداخلي والأثاث المخصص', nameEn: 'Interior Architecture & Custom FF&E' },
    { id: 'landscape', nameAr: 'تصميم اللاندسكيب والعوامل البيئية', nameEn: 'Landscape Architecture & Environmental' },
    { id: 'working', nameAr: 'الرسومات التنفيذية وتفاصيل الواجهات', nameEn: 'Working Drawings & Façade Detailing' },
    { id: 'specs', nameAr: 'التوثيق الفني ومراجعة المواصفات', nameEn: 'Technical Documentation & Specifications' },
    { id: 'mep', nameAr: 'التنسيق الإنشائي والكهروميكانيكي', nameEn: 'Structural & MEP Coordination' },
    { id: 'bim', nameAr: 'نمذجة معلومات البناء المتقدم (BIM Level 3)', nameEn: 'Advanced BIM Level 3 Modeling' },
  ]

  // Parse initial services from project scope
  const initialSelectedServices = () => {
    if (project?.scope && Array.isArray(project.scope) && project.scope.length > 0) {
      return project.scope
    }
    if (project?.scopeAr && Array.isArray(project.scopeAr) && project.scopeAr.length > 0) {
      return project.scopeAr
    }
    // Default checked like in reference image (5 active)
    return [
      'التصميم المعماري',
      'التصميم الداخلي والأثاث المخصص',
      'تصميم اللاندسكيب والعوامل البيئية',
      'الرسومات التنفيذية وتفاصيل الواجهات',
      'نمذجة معلومات البناء المتقدم (BIM Level 3)',
    ]
  }

  const [selectedServices, setSelectedServices] = useState<string[]>(initialSelectedServices())
  const [allServices, setAllServices] = useState(DEFAULT_SERVICES)

  // Initial gallery images
  const initialGallery = () => {
    if (!project) return []
    if (Array.isArray((project as any)?.gallery) && (project as any).gallery.length > 0) {
      return (project as any).gallery
    }
    const list: { url: string; caption: string }[] = []
    if ((project as any)?.interior) list.push({ url: (project as any).interior, caption: isAr ? 'صالة الارتفاع المزدوج' : 'Double Height Living' })
    if (project?.images && Array.isArray(project.images)) {
      project.images.forEach((img, idx) => {
        if (!list.some(l => l.url === img)) {
          const captions = [
            isAr ? 'واجهة الحجر المشطد' : 'Honed Stone Façade',
            isAr ? 'الفناء المائي والتدفق' : 'Water Courtyard Flow',
            isAr ? 'المسقط الأفقي وتوزيع الكتل' : 'Massing & Flow',
          ]
          list.push({ url: img, caption: captions[idx] || (isAr ? `لقطة معمارية 0${idx + 1}` : `View 0${idx + 1}`) })
        }
      })
    }
    return list
  }

  const [galleryImages, setGalleryImages] = useState<{ url: string; caption: string }[]>(initialGallery())

  // Form State
  const [formData, setFormData] = useState({
    title: project?.title || (project as any)?.name || '',
    titleAr: project?.titleAr || (project as any)?.nameAr || (project as any)?.title || '',
    slug: project?.slug || '',
    category: project?.category || (project as any)?.type || (project?.disciplines && project.disciplines[0]) || 'Ultra-Luxury Residential',
    categoryAr: project?.categoryAr || (project as any)?.typeAr || 'سكني فاخر',
    discipline: project?.discipline || (project?.disciplines && project.disciplines[0]?.toLowerCase()) || 'architecture',
    location: project?.location || '',
    locationAr: project?.locationAr || '',
    year: project?.year || new Date().getFullYear().toString(),
    area: project?.area || '',
    client: project?.client || '',
    description: project?.description || '',
    descriptionAr: project?.descriptionAr || '',
    shortDescription: (project as any)?.shortDescription || project?.tagline || '',
    shortDescriptionAr: (project as any)?.shortDescriptionAr || (project as any)?.taglineAr || '',
    coverImage: project?.coverImage || (project as any)?.cover || (project as any)?.image || '/images/hero-villa.png',
    featured: project?.featured ?? false,
    status: (project?.status === 'Draft' ? 'draft' : 'published') as 'published' | 'draft',
    order: (project as any)?.order || '01',
    privacy: 'public',
  })

  // Auto-generate slug from English title if new project
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updates: any = { title: val }
      if (!isEditing) {
        updates.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      }
      return { ...prev, ...updates }
    })
  }

  // File Upload Handler (Single or Multiple)
  const handleFileUpload = async (fileOrFiles: File | FileList | File[], target: 'cover' | 'gallery') => {
    setUploading(true)
    const files = (fileOrFiles as FileList).length !== undefined
      ? Array.from(fileOrFiles as FileList)
      : Array.isArray(fileOrFiles)
      ? fileOrFiles
      : [fileOrFiles as File]

    try {
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: fd,
          credentials: 'include',
        })
        const data = await res.json().catch(() => ({}))
        if (data.success && data.url) {
          if (target === 'cover') {
            setFormData((prev) => ({ ...prev, coverImage: data.url }))
            if (showToast) showToast(isAr ? 'تم رفع صورة الغلاف بنجاح' : 'Cover image uploaded successfully')
            break
          } else {
            setGalleryImages((prev) => [
              ...prev,
              { url: data.url, caption: isAr ? `لقطة تفصيلية 0${prev.length + 1}` : `Detail View 0${prev.length + 1}` },
            ])
          }
        } else {
          if (showToast) showToast(data.error || (isAr ? 'فشل رفع الصورة' : 'Failed to upload image'), 'error')
        }
      }
      if (target === 'gallery' && files.length > 1 && showToast) {
        showToast(isAr ? `تمت إضافة ${files.length} صور إلى المعرض` : `Added ${files.length} images to gallery`)
      }
    } catch {
      if (showToast) showToast(isAr ? 'خطأ أثناء رفع الصورة' : 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  // Toggle Service chip
  const toggleService = (name: string) => {
    setSelectedServices((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    )
  }

  // Add custom service
  const handleAddCustomService = () => {
    if (!customServiceText.trim()) return
    const newName = customServiceText.trim()
    if (!allServices.some((s) => s.nameAr === newName || s.nameEn === newName)) {
      setAllServices((prev) => [
        ...prev,
        { id: `custom-${Date.now()}`, nameAr: newName, nameEn: newName },
      ])
    }
    if (!selectedServices.includes(newName)) {
      setSelectedServices((prev) => [...prev, newName])
    }
    setCustomServiceText('')
    setShowCustomServiceInput(false)
  }

  // Delete gallery image
  const removeGalleryImage = (idx: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== idx))
  }

  // Copy Slug Handler
  const copySlug = () => {
    const fullUrl = `https://viwan.studio/projects/${formData.slug}`
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl)
    }
    setCopiedSlug(true)
    setTimeout(() => setCopiedSlug(false), 2200)
    if (showToast) showToast(isAr ? 'تم نسخ الرابط المعماري بنجاح' : 'Architectural URL copied')
  }

  // Data Integrity Score Calculation
  const integrityScore = () => {
    let score = 0
    let count = 0
    // Sec 1
    if (formData.title && formData.titleAr && formData.slug) {
      score += 25
      count += 1
    }
    // Sec 2
    if (formData.coverImage && galleryImages.length > 0) {
      score += 25
      count += 1
    }
    // Sec 3
    if ((formData.description || formData.descriptionAr) && selectedServices.length > 0) {
      score += 25
      count += 1
    }
    // Sec 4
    if (formData.status) {
      score += 25
      count += 1
    }
    return { percent: score, count }
  }

  const integrity = integrityScore()
  const arWords = (formData.descriptionAr || '').trim().split(/\s+/).filter(Boolean).length
  const enWords = (formData.description || '').trim().split(/\s+/).filter(Boolean).length

  // Save / Submit
  const handleSave = async (explicitStatus?: 'published' | 'draft') => {
    setSaving(true)
    const finalStatus = explicitStatus || formData.status

    try {
      const payload: any = {
        id: project?.id || formData.slug || `proj-${Date.now()}`,
        slug: formData.slug,
        title: formData.title,
        name: formData.title,
        titleAr: formData.titleAr || formData.title,
        nameAr: formData.titleAr || formData.title,
        category: formData.category,
        type: formData.category,
        categoryAr: formData.categoryAr,
        typeAr: formData.categoryAr,
        discipline: formData.discipline,
        disciplines: [formData.category],
        location: formData.location,
        locationAr: formData.locationAr || formData.location,
        year: formData.year,
        area: formData.area,
        client: formData.client,
        description: formData.description,
        descriptionAr: formData.descriptionAr || formData.description,
        shortDescription: formData.shortDescription,
        shortDescriptionAr: formData.shortDescriptionAr,
        tagline: formData.shortDescription,
        heading: formData.shortDescriptionAr,
        scope: selectedServices,
        scopeAr: selectedServices,
        cover: formData.coverImage,
        coverImage: formData.coverImage,
        interior: galleryImages[0]?.url || formData.coverImage,
        images: galleryImages.map((g) => g.url),
        gallery: galleryImages,
        featured: formData.featured,
        status: finalStatus === 'published' ? 'Completed' : 'Draft',
        order: formData.order,
      }

      const method = isEditing ? 'PUT' : 'POST'
      const bodyPayload = isEditing ? { slug: project?.slug || formData.slug, updates: payload } : payload

      const res = await fetch('/api/admin/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
        credentials: 'include',
      })

      if (res.ok) {
        onSaved()
      } else {
        const d = await res.json().catch(() => ({}))
        if (showToast) showToast(d.error || (isAr ? 'فشل حفظ المشروع' : 'Failed to save project'), 'error')
      }
    } catch {
      if (showToast) showToast(isAr ? 'خطأ في الاتصال بالخادم' : 'Network error', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070709] text-white flex flex-col font-sans animate-fade-in select-text">
      {/* ── TOP ARCHITECTURAL STATUS & BREADCRUMB BAR ────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0c0c10]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* User / Studio Persona & Coordinates */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="size-8 sm:size-9 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/40 flex items-center justify-center text-gold font-serif text-xs font-bold shrink-0">
            م.ط
          </div>
          <div className="hidden sm:block">
            <div className="text-white text-xs font-medium tracking-wide flex items-center gap-2">
              <span>{isAr ? 'م. طارق الحازمي' : 'Dr. Tareq Al-Hazmi'}</span>
              <span className="size-1.5 rounded-full bg-gold animate-pulse" />
            </div>
            <div className="text-[10px] font-mono text-white/40 tracking-wider">
              SENIOR LEAD ARCHITECT · ATELIER V
            </div>
          </div>
          <div className="h-5 w-px bg-white/10 hidden sm:block" />
          <button
            type="button"
            className="p-1.5 rounded-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors relative"
            title="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute top-1 end-1 size-1.5 rounded-full bg-gold" />
          </button>
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-white/[0.04] border border-white/10 text-[11px] font-mono text-white/60">
            <Clock className="size-3 text-gold" />
            <span>16:52</span>
            <span className="text-white/30">|</span>
            <span className="text-white/80">EN / AR</span>
          </div>
        </div>

        {/* Center / Right Breadcrumb & Location */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-white/50">
            <Building2 className="size-3.5 text-gold" />
            <span className="text-white/80">{isAr ? 'برج النخيل المكتبي [الرياض]' : 'Al Nakheel Tower [Riyadh]'}</span>
            <span className="text-white/30">/</span>
            <span className="text-white/90">{isAr ? 'المشاريع' : 'Projects'}</span>
            <span className="text-white/30">/</span>
            <span className="text-gold">{isEditing ? (isAr ? 'تعديل مشروع' : 'Edit Project') : (isAr ? 'إضافة مشروع' : 'New Entry')}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/projects/${formData.slug}`}
              target="_blank"
              className="px-3 py-1.5 rounded-xs bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{isAr ? 'معاينة حية في الموقع' : 'Live Preview'}</span>
              <ExternalLink className="size-3 text-gold" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-xs bg-white/5 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title={isAr ? 'إغلاق والتراجع' : 'Close'}
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── WORKSTATION BODY ─────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Page Title & Technical Metadata Header */}
        <div className="space-y-1.5 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3 text-[11px] font-mono text-gold/80 tracking-widest uppercase">
            <span>ARCH-MONO // REF-2024-NV</span>
            <span className="text-white/20">—</span>
            <span className="text-white/40">{isAr ? 'سجل المشاريع الخاصة' : 'Special Projects Register'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
            <h1 className="text-2xl sm:text-3xl font-serif font-light text-white tracking-wide">
              {isEditing ? (isAr ? 'تعديل بيانات المشروع المعماري' : 'Edit Architectural Project') : (isAr ? 'إضافة مشروع جديد' : 'Create Architectural Entry')}
            </h1>
            <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
              CREATE ARCHITECTURAL ENTRY
            </span>
          </div>
          <p className="text-white/50 text-xs sm:text-[13px] leading-relaxed max-w-3xl">
            {isAr
              ? 'أدخل المعلومات الأساسية للمشروع والمحتوى الذي سيظهر في معرض أعمال الشركة والمونوغراف الرقمي.'
              : 'Enter core project specifications, visual assets, and bilingual narrative to appear in the official monograph catalogue.'}
          </p>
        </div>

        {/* ── TWO-COLUMN ARCHITECTURAL GRID ───────────────────────────────── */}
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── LEFT COLUMN (SECTION 04 & DATA INTEGRITY) ────────────────── */}
          <aside className="lg:col-span-4 xl:col-span-4 space-y-6 order-2 lg:order-1">
            {/* Card 04: Publishing and Visibility Settings */}
            <div className="bg-[#0f0f13] border border-white/10 rounded-xs p-5 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="size-3.5 text-gold" />
                  <span className="font-mono text-xs text-gold uppercase tracking-wider">
                    04 | {isAr ? 'إعدادات النشر والظهور' : 'Publishing & Visibility'}
                  </span>
                </div>
              </div>

              {/* Project Status Segmented Switcher */}
              <div className="space-y-2">
                <label className="text-white/70 text-xs eyebrow block">
                  {isAr ? 'حالة المشروع (PROJECT STATUS)' : 'Project Status'}
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/50 border border-white/10 rounded-xs">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'published' })}
                    className={`py-2 px-3 rounded-2xs text-xs font-semibold eyebrow transition-all cursor-pointer ${
                      formData.status === 'published'
                        ? 'bg-gold text-charcoal shadow-sm shadow-gold/20'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {isAr ? 'منشور (Published)' : 'Published'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'draft' })}
                    className={`py-2 px-3 rounded-2xs text-xs font-medium eyebrow transition-all cursor-pointer ${
                      formData.status === 'draft'
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {isAr ? 'مسودة (Draft)' : 'Draft'}
                  </button>
                </div>
              </div>

              {/* Featured Monograph Showcase iOS Switch */}
              <div className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/5 rounded-xs">
                <div className="space-y-0.5">
                  <div className="text-white text-xs font-medium">
                    {isAr ? 'الظهور في واجهة الموقع' : 'Featured Showcase'}
                  </div>
                  <div className="text-white/40 text-[10px] font-mono">
                    Featured Monograph Showcase
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.featured}
                  onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.featured ? 'bg-gold' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-charcoal shadow-lg ring-0 transition duration-200 ease-in-out ${
                      formData.featured ? (isAr ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Showcase Order */}
              <div className="space-y-1.5">
                <label className="text-white/70 text-xs eyebrow block">
                  {isAr ? 'ترتيب العرض في المعرض الرئيسي' : 'Showcase Ordering'}
                </label>
                <div className="relative">
                  <ListOrdered className="size-3.5 text-white/40 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xs ps-9 pe-3 py-2.5 text-xs text-white focus:border-gold/60 focus:outline-none cursor-pointer"
                  >
                    <option value="01">{isAr ? 'المركز الأول (01 — تمييز رئيسي)' : '01 — Primary Showcase'}</option>
                    <option value="02">{isAr ? 'المركز الثاني (02)' : '02 — Second'}</option>
                    <option value="03">{isAr ? 'المركز الثالث (03)' : '03 — Third'}</option>
                    <option value="04">{isAr ? 'المركز الرابع (04)' : '04 — Fourth'}</option>
                    <option value="05">{isAr ? 'المركز الخامس (05)' : '05 — Fifth'}</option>
                    <option value="06">{isAr ? 'المركز السادس (06)' : '06 — Sixth'}</option>
                  </select>
                </div>
              </div>

              {/* Privacy and Sharing License */}
              <div className="space-y-1.5">
                <label className="text-white/70 text-xs eyebrow block">
                  {isAr ? 'تصريح الخصوصية والمشاركة' : 'Privacy & Distribution'}
                </label>
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-2xs bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                      <Globe className="size-3.5 text-gold" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-white text-xs font-medium">
                        {isAr ? 'معرض عام للجمهور (Public Portfolio)' : 'Public Portfolio'}
                      </div>
                      <div className="text-white/40 text-[10px]">
                        {isAr ? 'متاح للمؤتمرات والصحافة المعمارية' : 'Available for press and architectural monographs'}
                      </div>
                    </div>
                  </div>
                  <CheckCircle2 className="size-4 text-gold shrink-0" />
                </div>
              </div>

              {/* Architectural Seal Stamp */}
              <div className="p-3.5 bg-black/40 border border-white/10 rounded-xs font-mono text-xs space-y-2 select-none">
                <div className="flex items-center justify-between text-[10px] text-white/50 tracking-wider">
                  <span>ATELIER V / VIWAN ARCH SEAL</span>
                  <span className="text-gold/70">ARCH-CERT-2025</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-white font-serif font-bold text-xs tracking-wider">
                      DR. TAREQ AL-HAZMI
                    </div>
                    <div className="text-white/40 text-[10px]">
                      PRINCIPAL PARTNER · SIGNED
                    </div>
                  </div>
                  <div className="size-8 rounded-2xs bg-gold/10 border border-gold/40 text-gold flex items-center justify-center font-serif text-sm font-bold shadow-sm shadow-gold/20">
                    V
                  </div>
                </div>
              </div>
            </div>

            {/* Data Integrity / File Stats Card */}
            <div className="bg-[#0f0f13] border border-white/10 rounded-xs p-5 space-y-3 shadow-xl">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center justify-between">
                <span>{isAr ? 'إحصاءات الملف' : 'File Metrics'}</span>
                <span>DATA INTEGRITY</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div className="p-3.5 bg-black/40 border border-white/5 rounded-xs text-center">
                  <div className="text-2xl sm:text-3xl font-serif font-light text-gold">
                    {integrity.percent}%
                  </div>
                  <div className="text-white/40 text-[10px] mt-1 font-sans">
                    {isAr ? 'جاهزية النشر' : 'Readiness'}
                  </div>
                </div>
                <div className="p-3.5 bg-black/40 border border-white/5 rounded-xs text-center">
                  <div className="text-2xl sm:text-3xl font-serif font-light text-white">
                    {integrity.count}/4
                  </div>
                  <div className="text-white/40 text-[10px] mt-1 font-sans">
                    {isAr ? 'الأقسام مكتملة' : 'Sections Done'}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ── RIGHT COLUMN (SECTIONS 01, 02, 03) ───────────────────────── */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-6 order-1 lg:order-2">
            {/* ── SECTION 01: PROJECT CORE SPECIFICATIONS ────────────────── */}
            <section className="bg-[#0f0f13] border border-white/10 rounded-xs p-5 sm:p-7 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-2xs bg-gold/10 border border-gold/30 text-gold font-mono text-xs font-bold">
                    01
                  </span>
                  <h2 className="text-white font-serif text-sm sm:text-base font-medium tracking-wide">
                    {isAr ? 'معلومات المشروع' : 'Project Core Specifications'}
                  </h2>
                  <span className="text-white/30 hidden sm:inline font-mono text-xs">/ PROJECT CORE SPECIFICATIONS</span>
                </div>
                <span className="text-white/40 font-mono text-[11px]">BIM / REV-01</span>
              </div>

              {/* Row 1: Project Names (AR & EN) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Arabic Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-white/70 eyebrow">
                    <label>{isAr ? 'اسم المشروع (بالعربية) *' : 'Project Title (Arabic) *'}</label>
                    <span className="text-gold/80 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-2xs bg-gold/10 border border-gold/20">AR</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.titleAr}
                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                    placeholder="فيلا حجر نجد التكعيبية"
                    className="w-full bg-black/40 border border-white/10 rounded-xs px-3.5 py-2.5 text-white placeholder-white/20 focus:border-gold/60 focus:outline-none text-xs text-end rtl:text-start"
                  />
                </div>

                {/* English Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-white/70 eyebrow">
                    <label>{isAr ? '* PROJECT NAME (ENGLISH)' : 'Project Name (English) *'}</label>
                    <span className="text-white/60 text-[10px] font-mono px-1.5 py-0.2 rounded-2xs bg-white/10 border border-white/15">EN</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Najd Monolith Residence"
                    className="w-full bg-black/40 border border-white/10 rounded-xs px-3.5 py-2.5 text-white placeholder-white/20 focus:border-gold/60 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Row 2: Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Architectural Category / Discipline */}
                <div className="space-y-1.5">
                  <label className="text-white/70 text-xs eyebrow block">
                    {isAr ? 'التصنيف / التخصص المعماري' : 'Discipline Classification'}
                  </label>
                  <div className="relative">
                    <select
                      value={formData.discipline}
                      onChange={(e) => {
                        const found = ARCHITECTURAL_DISCIPLINES.find((d) => d.id === e.target.value)
                        setFormData({
                          ...formData,
                          discipline: e.target.value,
                          category: found ? found.nameEn : formData.category,
                          categoryAr: found ? found.nameAr : formData.categoryAr,
                        })
                      }}
                      className="w-full bg-[#141318] border border-white/10 rounded-xs px-3.5 py-2.5 text-xs text-white focus:border-gold/60 focus:outline-none cursor-pointer"
                    >
                      <option value="architecture">{isAr ? 'سكني فاخر | Ultra-Luxury Residential' : 'Ultra-Luxury Residential'}</option>
                      {ARCHITECTURAL_DISCIPLINES.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.code} · {isAr ? d.nameAr : d.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-white/70 text-xs eyebrow block">
                    {isAr ? 'الموقع الجغرافي' : 'Geographic Location'}
                  </label>
                  <div className="relative">
                    <MapPin className="size-3.5 text-gold absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={formData.locationAr}
                      onChange={(e) => setFormData({ ...formData, locationAr: e.target.value, location: e.target.value })}
                      placeholder="الرياض، وادي حنيفة — المملكة العربية السعودية"
                      className="w-full bg-black/40 border border-white/10 rounded-xs ps-9 pe-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-gold/60 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Delivery Year & Area (GBA) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Year */}
                <div className="space-y-1.5">
                  <label className="text-white/70 text-xs eyebrow block">
                    {isAr ? 'سنة الإنجاز' : 'Year Delivered'}
                  </label>
                  <div className="relative">
                    <Calendar className="size-3.5 text-gold absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="2024 (مكتمل التسليم)"
                      className="w-full bg-black/40 border border-white/10 rounded-xs ps-9 pe-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-gold/60 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Area GBA */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-white/70 eyebrow">
                    <label>{isAr ? 'المساحة الإجمالية (GBA)' : 'Gross Built Area (GBA)'}</label>
                    <span className="text-white/40 font-mono text-[10px]">SQM</span>
                  </div>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="2,850 م²"
                    className="w-full bg-black/40 border border-white/10 rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-gold/60 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Row 4: URL Slug with live copy and availability badge */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-white/70 eyebrow">
                  <label>{isAr ? 'المسار التعريفي للرابط (SLUG)' : 'Canonical URL Slug'}</label>
                  <span className="text-white/80 font-mono text-[10px] px-2 py-0.5 rounded-2xs bg-white/10 border border-white/20 flex items-center gap-1">
                    <Check className="size-2.5" />
                    <span>{isAr ? 'متاح ورابط فريد' : 'Unique & Available'}</span>
                  </span>
                </div>
                <div className="flex items-center font-mono text-xs">
                  <span className="px-3.5 py-2.5 bg-white/[0.04] border border-e-0 border-white/10 text-white/40 rounded-s-xs select-none">
                    viwan.studio/projects/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="flex-1 bg-black/40 border border-white/10 px-3 py-2.5 text-white placeholder-white/20 focus:border-gold/60 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={copySlug}
                    className="px-3 py-2.5 bg-white/[0.04] hover:bg-white/10 border border-s-0 border-white/10 text-white/60 hover:text-white rounded-e-xs transition-colors cursor-pointer"
                    title={isAr ? 'نسخ الرابط' : 'Copy link'}
                  >
                    {copiedSlug ? <CheckCheck className="size-3.5 text-gold" /> : <Copy className="size-3.5" />}
                  </button>
                </div>
              </div>
            </section>

            {/* ── SECTION 02: ARCHITECTURAL VISUAL ASSETS ─────────────────── */}
            <section className="bg-[#0f0f13] border border-white/10 rounded-xs p-5 sm:p-7 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-2xs bg-gold/10 border border-gold/30 text-gold font-mono text-xs font-bold">
                    02
                  </span>
                  <h2 className="text-white font-serif text-sm sm:text-base font-medium tracking-wide">
                    {isAr ? 'الصور والوسائط المعمارية' : 'Architectural Visual Assets'}
                  </h2>
                  <span className="text-white/30 hidden sm:inline font-mono text-xs">/ ARCHITECTURAL VISUAL ASSETS</span>
                </div>
                <span className="text-white/40 font-mono text-[11px]">
                  {galleryImages.length + 1} {isAr ? 'عينات محملة' : 'assets loaded'}
                </span>
              </div>

              {/* Hero Aperture (Cover Image) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-white/70 eyebrow">
                  <label>{isAr ? 'صورة الغلاف الرئيسية (HERO APERTURE)' : 'Primary Hero Aperture'}</label>
                  <span className="text-white/40 font-mono text-[10px]">16:9 ، دقة 4K عريض جداً</span>
                </div>

                <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-black/60 border border-white/10 rounded-xs overflow-hidden group shadow-2xl">
                  <img
                    src={formData.coverImage}
                    alt="Hero Aperture"
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-102"
                  />

                  {/* Top Success Badge */}
                  <div className="absolute top-3 start-3 z-10">
                    <span className="px-2.5 py-1 rounded-xs bg-black/80 backdrop-blur-md border border-white/20 text-white/90 font-mono text-[11px] flex items-center gap-1.5 shadow-lg">
                      <span className="size-1.5 rounded-full bg-white/70" />
                      <span>{isAr ? 'صورة الغلاف النشطة' : 'Active Cover Aperture'}</span>
                    </span>
                  </div>

                  {/* Bottom Frosted Glass Overlay Bar */}
                  <div className="absolute bottom-0 inset-x-0 z-10 bg-black/75 backdrop-blur-md border-t border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    {/* Focal Point Indicator */}
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-white/70">
                      <Crosshair className="size-3.5 text-gold" />
                      <span>{isAr ? `النقطة البؤرية: ${focalPoint.y}% Y / ${focalPoint.x}% X` : `Focal Point: ${focalPoint.y}% Y / ${focalPoint.x}% X`}</span>
                    </div>

                    {/* Center Crop Action */}
                    <button
                      type="button"
                      onClick={() => {
                        setFocalPoint({ x: 50, y: 50 })
                        if (showToast) showToast(isAr ? 'تم ضبط الاقتصاص على المركز' : 'Focal point centered')
                      }}
                      className="px-2.5 py-1 rounded-2xs bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Crop className="size-3 text-gold" />
                      <span>{isAr ? 'اقتصاص المركز' : 'Center Crop'}</span>
                    </button>

                    {/* Replace / URL Actions */}
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1 rounded-2xs bg-gold text-charcoal font-semibold text-xs eyebrow hover:bg-[#D4BC96] transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-gold/20">
                        <Upload className="size-3" />
                        <span>{uploading ? (isAr ? 'جاري الرفع...' : 'Uploading...') : (isAr ? 'استبدال الصورة' : 'Replace Image')}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, 'cover')
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt(isAr ? 'أدخل رابط الصورة البديل:' : 'Enter replacement image URL:', formData.coverImage)
                          if (url) setFormData({ ...formData, coverImage: url })
                        }}
                        className="p-1.5 rounded-2xs bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors cursor-pointer"
                        title={isAr ? 'إدخال رابط ويب' : 'Enter Web URL'}
                      >
                        <LinkIcon className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monograph Sequence (Thumbnails Grid) */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/70 eyebrow">
                  <label>{isAr ? 'معرض الصور الإضافية (MONOGRAPH SEQUENCE)' : 'Monograph Sequence'}</label>
                  <span className="text-white/40 text-[10px] font-mono">
                    {isAr ? 'اسحب لإعادة ترتيب التسلسل الفوتوغرافي' : 'Drag to reorder photographic sequence'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Add Image Upload Card */}
                  <label className="border-dashed border border-white/20 hover:border-gold/60 bg-white/[0.02] hover:bg-white/[0.05] rounded-xs flex flex-col items-center justify-center p-4 cursor-pointer text-center group aspect-[4/3] sm:aspect-[16/10] transition-all">
                    <div className="size-8 rounded-full bg-white/5 group-hover:bg-gold/15 flex items-center justify-center text-white/60 group-hover:text-gold transition-colors mb-2">
                      <ImagePlus className="size-4" />
                    </div>
                    <span className="text-xs text-white font-medium group-hover:text-gold transition-colors">
                      {isAr ? 'إضافة صورة' : 'Add Image'}
                    </span>
                    <span className="text-[10px] text-white/40 mt-0.5">
                      {isAr ? 'سحب الملفات هنا' : 'Drop files here'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileUpload(e.target.files, 'gallery')
                        }
                      }}
                    />
                  </label>

                  {/* Existing Thumbnails with Captions */}
                  {galleryImages.map((img, idx) => (
                    <div
                      key={img.url + idx}
                      className="relative aspect-[4/3] sm:aspect-[16/10] bg-black/50 border border-white/10 rounded-xs overflow-hidden group shadow-lg"
                    >
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                      {/* Top Delete Button (Monochromatic) */}
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1.5 end-1.5 size-6 rounded-2xs bg-black/80 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer opacity-0 group-hover:opacity-100 z-10"
                        title={isAr ? 'حذف من المعرض' : 'Delete'}
                      >
                        <Trash2 className="size-3" />
                      </button>

                      {/* Bottom Caption Pill */}
                      <div className="absolute bottom-0 inset-x-0 p-2 bg-black/85 backdrop-blur-sm border-t border-white/10">
                        <input
                          type="text"
                          value={img.caption}
                          onChange={(e) => {
                            const newCaption = e.target.value
                            setGalleryImages((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, caption: newCaption } : item))
                            )
                          }}
                          className="w-full bg-transparent border-none text-[10px] font-mono text-white/90 placeholder-white/30 focus:outline-none truncate"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── SECTION 03: EDITORIAL ESSAY & SERVICES ──────────────────── */}
            <section className="bg-[#0f0f13] border border-white/10 rounded-xs p-5 sm:p-7 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-2xs bg-gold/10 border border-gold/30 text-gold font-mono text-xs font-bold">
                    03
                  </span>
                  <h2 className="text-white font-serif text-sm sm:text-base font-medium tracking-wide">
                    {isAr ? 'محتوى المشروع والخدمات المقدمة' : 'Editorial Essay & Scope of Work'}
                  </h2>
                  <span className="text-white/30 hidden sm:inline font-mono text-xs">/ EDITORIAL ESSAY & SCOPE</span>
                </div>
                <span className="text-white/40 font-mono text-[11px]">BILINGUAL ESSAY</span>
              </div>

              {/* Row 1: Bilingual Essays with Word Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Arabic Architectural Essay */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-white/70 eyebrow">
                    <label>{isAr ? 'وصف المشروع المعماري (بالعربية)' : 'Architectural Narrative (Arabic)'}</label>
                    <span className="text-white/40 font-mono text-[10px]">{arWords} {isAr ? 'كلمة' : 'words'}</span>
                  </div>
                  <textarea
                    rows={6}
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xs p-3.5 text-xs sm:text-[13px] text-white placeholder-white/20 focus:border-gold/60 focus:outline-none leading-relaxed font-sans text-end rtl:text-start"
                  />
                </div>

                {/* English Architectural Essay */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-white/70 eyebrow">
                    <label>{isAr ? 'PROJECT DESCRIPTION (ENGLISH EDITORIAL)' : 'Project Description (English)'}</label>
                    <span className="text-white/40 font-mono text-[10px]">{enWords} WORDS</span>
                  </div>
                  <textarea
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xs p-3.5 text-xs sm:text-[13px] text-white placeholder-white/20 focus:border-gold/60 focus:outline-none leading-relaxed font-sans"
                  />
                </div>
              </div>

              {/* Row 2: Short Portfolio Card Decks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-white/70 text-xs eyebrow block">
                    {isAr ? 'وصف مقتضب لبطاقة المعرض (AR)' : 'Short Deck (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescriptionAr}
                    onChange={(e) => setFormData({ ...formData, shortDescriptionAr: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-gold/60 focus:outline-none text-end rtl:text-start"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/70 text-xs eyebrow block">
                    {isAr ? 'SHORT PORTFOLIO CARD DECK (EN)' : 'Short Deck (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-gold/60 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Services Provided (مراحل وخدمات العمل المعماري) */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/70 eyebrow">
                  <label>
                    {isAr ? 'الخدمات المقدمة ومراحل العمل المعماري (SERVICES PROVIDED)' : 'Services Provided & Scope'}
                  </label>
                  <span className="text-gold font-mono text-[10px]">
                    {selectedServices.length} {isAr ? 'خدمات مفعلة' : 'active'}
                  </span>
                </div>

                {/* Service Tag Chips */}
                <div className="flex flex-wrap gap-2">
                  {allServices.map((svc) => {
                    const active = selectedServices.includes(svc.nameAr) || selectedServices.includes(svc.nameEn)
                    return (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => toggleService(isAr ? svc.nameAr : svc.nameEn)}
                        className={`px-3 py-1.5 rounded-xs text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                          active
                            ? 'bg-gold/15 border border-gold/60 text-gold shadow-sm shadow-gold/10'
                            : 'bg-white/[0.02] border border-white/10 text-white/60 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <span>{isAr ? svc.nameAr : svc.nameEn}</span>
                        {active && <Check className="size-3 text-gold" />}
                      </button>
                    )
                  })}

                  {/* Add Custom Service Button / Form */}
                  {showCustomServiceInput ? (
                    <div className="flex items-center gap-1.5 bg-black/60 border border-gold/50 rounded-xs px-2 py-1">
                      <input
                        type="text"
                        autoFocus
                        value={customServiceText}
                        onChange={(e) => setCustomServiceText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustomService()}
                        placeholder={isAr ? 'اسم الخدمة الجديدة...' : 'New service name...'}
                        className="bg-transparent text-xs text-white placeholder-white/30 focus:outline-none font-mono w-36"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomService}
                        className="text-gold hover:text-white text-xs font-mono cursor-pointer"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCustomServiceInput(false)}
                        className="text-white/40 hover:text-white text-xs font-mono cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowCustomServiceInput(true)}
                      className="px-3 py-1.5 rounded-xs text-xs font-mono border border-dashed border-white/20 text-white/50 hover:text-gold hover:border-gold/50 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="size-3" />
                      <span>{isAr ? 'إضافة خدمة مخصصة' : 'Add Custom'}</span>
                    </button>
                  )}
                </div>
              </div>
            </section>
          </div>
        </form>
      </main>

      {/* ── STICKY BOTTOM ACTION BAR ─────────────────────────────────────── */}
      <footer className="sticky bottom-0 z-40 bg-[#0a0a0e]/95 backdrop-blur-md border-t border-white/10 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        {/* Right Status / Auto-save indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/50 order-2 sm:order-1">
          <span className="size-2 rounded-full bg-gold animate-pulse" />
          <span>
            {isAr
              ? 'آخر حفظ تلقائي منذ دقيقتين • تم مزامنة المسودة عبر الخادم'
              : 'Last auto-sync 2 mins ago · Draft synchronized'}
          </span>
        </div>

        {/* Left Action Buttons */}
        <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-white/50 hover:text-white underline-offset-4 hover:underline transition-colors cursor-pointer"
          >
            {isAr ? 'إلغاء والتراجع' : 'Cancel & Revert'}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('draft')}
            className="px-4 py-2.5 rounded-xs border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-mono transition-colors cursor-pointer disabled:opacity-50"
          >
            {isAr ? 'حفظ كمسودة' : 'Save Draft'}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('published')}
            className="px-6 py-2.5 rounded-xs bg-gold hover:bg-[#D4BC96] text-charcoal font-semibold text-xs eyebrow transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-gold/20 flex items-center gap-2"
          >
            <Sparkles className="size-3.5 fill-charcoal" />
            <span>
              {saving
                ? (isAr ? 'جاري النشر والحفظ...' : 'Publishing...')
                : (isAr ? 'حفظ ونشر المشروع' : 'Save & Publish Project')}
            </span>
          </button>
        </div>
      </footer>

      {/* ── TECHNICAL ARCHITECTURAL FOOTER ───────────────────────────────── */}
      <div className="bg-[#050507] border-t border-white/5 px-4 sm:px-8 py-3 text-[10px] font-mono text-white/30 flex flex-wrap items-center justify-between gap-4 select-none">
        <span>ISO 19650 BIM COMPLIANT</span>
        <span>LAT: 24.7136° N, LON: 46.6753° E</span>
        <span>{isAr ? 'نظام الأرشفة الموحد للمشاريع المعمارية' : 'Unified Architectural Archiving System'}</span>
        <span>ATELIER V / VIWAN ARCHITECTURAL EDITORIAL MONOGRAPH SYSTEM © 2025</span>
      </div>
    </div>
  )
}

// ── SITE MEDIA & IMAGES TAB (COMPLETE 38 IMAGES WITH MODAL EDIT) ───────────
function SiteImagesTab({
  siteImages,
  onRefresh,
  isAr,
}: {
  siteImages: SiteImageItem[]
  onRefresh: () => void
  isAr: boolean
}) {
  const [images, setImages] = useState<SiteImageItem[]>(siteImages)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingImage, setEditingImage] = useState<SiteImageItem | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    setImages(siteImages)
  }, [siteImages])

  const categories = [
    { id: 'all', labelEn: 'All Visuals', labelAr: 'كافة الصور', count: images.length },
    { id: 'Hero Banners', labelEn: 'Hero Banners', labelAr: 'صور الهيدر', count: images.filter((i) => i.section === 'Hero Banners').length },
    { id: 'The 8 Disciplines', labelEn: '8 Disciplines', labelAr: 'التخصصات الثمانية', count: images.filter((i) => i.section === 'The 8 Disciplines').length },
    { id: 'Featured Projects', labelEn: 'Projects', labelAr: 'المشاريع الهندسية', count: images.filter((i) => i.section === 'Featured Projects').length },
    { id: 'Interiors & Living Spaces', labelEn: 'Interiors', labelAr: 'المساحات الداخلية', count: images.filter((i) => i.section === 'Interiors & Living Spaces').length },
    { id: 'Architectural Materials', labelEn: 'Materials', labelAr: 'المواد والخامات', count: images.filter((i) => i.section === 'Architectural Materials').length },
    { id: 'Studio & Careers', labelEn: 'Studio & Atelier', labelAr: 'الاستوديو وبيئة العمل', count: images.filter((i) => i.section === 'Studio & Careers').length },
  ]

  const filteredImages = images.filter((img) => {
    const matchCategory = activeCategory === 'all' || img.section === activeCategory
    const matchSearch =
      searchQuery === '' ||
      img.labelEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.labelAr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.section?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.locationAr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.year?.includes(searchQuery)
    return matchCategory && matchSearch
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl sm:text-2xl font-serif font-light">
            {isAr ? 'مكتبة الصور والميديا المعمارية' : 'Architectural Visuals & Media Library'}
          </h2>
          <p className="text-white/40 text-xs mt-0.5">
            {isAr
              ? `تشمل كافة صور المشروع (${images.length} صورة) مع إمكانية تعديل العنوان، السنة، الموقع، واستبدال الصورة برابط ويب أو رفع من الجهاز`
              : `Complete catalogue of ${images.length} visual assets across all pages with title, year, location and dual upload/URL support`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreatingNew(true)}
          className="px-4 py-2.5 rounded-xs bg-gold text-charcoal text-xs font-semibold eyebrow hover:bg-[#D4BC96] transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-md shadow-gold/10"
        >
          <Plus className="size-3.5" />
          <span>{isAr ? 'إضافة صورة جديدة' : 'Add New Visual'}</span>
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xs bg-gold/10 border border-gold/40 text-gold text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Filter Category Pills & Search */}
      <div className="bg-[#141311] border border-white/10 rounded-xs p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="size-4 text-white/40 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'البحث بالاسم، القسم، الموقع، أو السنة...' : 'Search visuals by title, section, location, year...'}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs ps-10 pe-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold/60"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1.5 rounded-xs text-[11px] eyebrow whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === c.id
                    ? 'bg-gold text-charcoal font-semibold'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{isAr ? c.labelAr : c.labelEn}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeCategory === c.id ? 'bg-charcoal/20 text-charcoal' : 'bg-white/10 text-white/50'
                }`}>
                  {c.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visuals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            className="group bg-[#141311] border border-white/10 hover:border-gold/40 rounded-xs overflow-hidden transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image Preview Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                <img
                  src={img.currentUrl}
                  alt={img.labelEn}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute top-3 start-3">
                  <span className="px-2.5 py-0.5 rounded-2xs bg-black/70 backdrop-blur-md text-[10px] font-mono text-gold border border-white/10 uppercase">
                    {img.section}
                  </span>
                </div>
                <div className="absolute top-3 end-3">
                  <span className="px-2 py-0.5 rounded-2xs bg-black/70 text-[10px] text-white/50 font-mono border border-white/10">
                    {img.aspectRatio}
                  </span>
                </div>
                <div className="absolute bottom-3 start-3 end-3 text-white">
                  <h3 className="font-serif text-base font-medium leading-tight group-hover:text-gold transition-colors">
                    {isAr ? img.labelAr : img.labelEn}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-white/60 mt-1 font-mono">
                    {img.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-gold/70" />
                        {isAr ? (img.locationAr || img.location) : img.location}
                      </span>
                    )}
                    {img.year && (
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3 text-gold/70" />
                        {img.year}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description Snippet */}
              <div className="p-4 space-y-2">
                <p className="text-white/50 text-xs line-clamp-2 leading-relaxed font-light">
                  {isAr ? (img.descriptionAr || img.description) : img.description}
                </p>
                <div className="text-[10px] font-mono text-white/30 truncate">
                  {img.currentUrl}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 pt-0 flex items-center justify-between border-t border-white/5 mt-2 text-xs">
              <a
                href={img.currentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-white/40 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
              >
                <ExternalLink className="size-3" />
                <span>{isAr ? 'عرض الحجم الكامل' : 'Full View'}</span>
              </a>

              <button
                type="button"
                onClick={() => setEditingImage(img)}
                className="px-3 py-1.5 rounded-xs bg-white/5 hover:bg-gold hover:text-charcoal text-ivory text-xs transition-colors eyebrow cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="size-3" />
                <span>{isAr ? 'تعديل التفاصيل والصورة' : 'Edit Visual Details'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Visual Modal */}
      {(editingImage || isCreatingNew) && (
        <ImageEditModal
          image={editingImage}
          onClose={() => {
            setEditingImage(null)
            setIsCreatingNew(false)
          }}
          onSave={async (updated) => {
            let updatedList: SiteImageItem[] = []
            if (editingImage) {
              updatedList = images.map((i) => (i.id === updated.id ? updated : i))
            } else {
              updatedList = [updated, ...images]
            }
            setImages(updatedList)

            try {
              const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ siteImages: updatedList }),
                credentials: 'include',
              })
              if (res.ok) {
                if (showToast) {
                  showToast(isAr ? 'تم حفظ التعديلات على الصورة بنجاح' : 'Visual details saved successfully')
                } else {
                  setToast(isAr ? 'تم حفظ التعديلات على الصورة بنجاح' : 'Visual details saved successfully')
                  setTimeout(() => setToast(''), 3000)
                }
                setEditingImage(null)
                setIsCreatingNew(false)
                onRefresh()
              }
            } catch {
              if (showToast) showToast(isAr ? 'فشل حفظ الصورة' : 'Failed to save image', 'error')
            }
          }}
          isAr={isAr}
          showToast={showToast}
        />
      )}
    </div>
  )
}

// ── IMAGE EDIT MODAL (DUAL UPLOAD / URL & FULL METADATA) ─────────────────────
function ImageEditModal({
  image,
  onClose,
  onSave,
  isAr,
  showToast,
}: {
  image: SiteImageItem | null
  onClose: () => void
  onSave: (img: SiteImageItem) => void
  isAr: boolean
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void
}) {
  const isEditing = !!image
  const [sourceMode, setSourceMode] = useState<'upload' | 'url'>('upload')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<SiteImageItem>({
    id: image?.id || `img-${Date.now()}`,
    labelEn: image?.labelEn || '',
    labelAr: image?.labelAr || '',
    section: image?.section || 'Hero Banners',
    currentUrl: image?.currentUrl || '/images/hero-villa.png',
    year: image?.year || '2024',
    location: image?.location || 'New Cairo, Egypt',
    locationAr: image?.locationAr || 'القاهرة الجديدة، مصر',
    description: image?.description || '',
    descriptionAr: image?.descriptionAr || '',
    aspectRatio: image?.aspectRatio || '16/9',
  })

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, currentUrl: data.url }))
        if (showToast) showToast(isAr ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully')
      } else {
        if (showToast) showToast(data.error || (isAr ? 'فشل رفع الصورة' : 'Failed to upload image'), 'error')
      }
    } catch {
      if (showToast) showToast(isAr ? 'خطأ أثناء رفع الصورة' : 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fade-in" />
      <div className="relative z-10 w-full max-w-3xl bg-[#141311] border border-white/10 rounded-xs shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-white font-serif text-xl sm:text-2xl font-light">
              {isEditing
                ? isAr
                  ? 'تعديل تفاصيل وبيانات الصورة'
                  : 'Edit Visual Asset Details'
                : isAr
                ? 'إضافة صورة جديدة للمشروع'
                : 'Add New Project Visual'}
            </h3>
            <p className="text-white/40 text-xs mt-0.5">
              {isAr
                ? 'تعديل العنوان، السنة، الموقع، والوصف، مع إمكانية الرفع من الجهاز أو إدخال رابط مباشر'
                : 'Configure title, year, location, narrative, and source via device upload or direct web URL'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Visual Source Switcher */}
          <div className="space-y-3 p-4 bg-white/[0.02] border border-white/10 rounded-xs">
            <div className="flex items-center justify-between">
              <span className="text-gold text-xs eyebrow uppercase tracking-wider">
                {isAr ? 'مصدر الصورة (تحميل من الجهاز أو رابط من الويب)' : 'Visual Source (Upload or Web URL)'}
              </span>
              <div className="flex items-center bg-black/40 p-0.5 rounded-xs border border-white/10">
                <button
                  type="button"
                  onClick={() => setSourceMode('upload')}
                  className={`px-3 py-1 rounded-2xs text-[11px] eyebrow transition-colors cursor-pointer ${
                    sourceMode === 'upload' ? 'bg-gold text-charcoal font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {isAr ? 'تحميل من الجهاز' : 'Device Upload'}
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('url')}
                  className={`px-3 py-1 rounded-2xs text-[11px] eyebrow transition-colors cursor-pointer ${
                    sourceMode === 'url' ? 'bg-gold text-charcoal font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {isAr ? 'رابط ويب' : 'Web URL'}
                </button>
              </div>
            </div>

            {sourceMode === 'upload' ? (
              <div className="border border-dashed border-white/20 hover:border-gold/50 rounded-xs p-6 text-center space-y-3 transition-colors bg-white/[0.01]">
                <Upload className="size-6 text-gold/80 mx-auto" />
                <div>
                  <p className="text-white text-xs font-medium">
                    {isAr ? 'اضغط لاختيار صورة من جهازك' : 'Click or browse to select an image from your device'}
                  </p>
                  <p className="text-white/40 text-[11px] mt-0.5">JPG, PNG, WebP up to 10MB</p>
                </div>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors">
                  <span>{uploading ? (isAr ? 'جاري الرفع...' : 'Uploading...') : isAr ? 'اختيار ملف' : 'Browse File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-white/70 eyebrow">{isAr ? 'رابط الصورة المباشر (Web URL)' : 'Direct Web URL'}</label>
                <input
                  type="text"
                  required
                  value={formData.currentUrl}
                  onChange={(e) => setFormData({ ...formData, currentUrl: e.target.value })}
                  placeholder="https://... or /images/..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3.5 py-2.5 text-white font-mono text-[11px] focus:border-gold/60 focus:outline-none"
                />
              </div>
            )}

            {/* Live Preview Box */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative aspect-[16/10] w-full sm:w-48 bg-black/60 border border-white/10 rounded-xs overflow-hidden shrink-0">
                <img src={formData.currentUrl} alt="Preview" className="object-cover w-full h-full" />
              </div>
              <div className="space-y-1 text-white/50 text-[11px] font-mono">
                <p className="text-white font-medium">{isAr ? 'معاينة الرابط النشط:' : 'Active Preview URL:'}</p>
                <p className="truncate max-w-md">{formData.currentUrl}</p>
                <p className="text-gold/80">{formData.aspectRatio} · {formData.section}</p>
              </div>
            </div>
          </div>

          {/* Title Row (En & Ar) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-white/70 eyebrow">{isAr ? 'عنوان الصورة (English) *' : 'Visual Title (English) *'}</label>
              <input
                type="text"
                required
                value={formData.labelEn}
                onChange={(e) => setFormData({ ...formData, labelEn: e.target.value })}
                placeholder="e.g. Modern Villa Courtyard"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3.5 py-2.5 text-white placeholder-white/20 focus:border-gold/60 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-white/70 eyebrow">{isAr ? 'عنوان الصورة (العربية) *' : 'Visual Title (Arabic) *'}</label>
              <input
                type="text"
                required
                value={formData.labelAr}
                onChange={(e) => setFormData({ ...formData, labelAr: e.target.value })}
                placeholder="مثال: فناء الفيلا المعماري"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3.5 py-2.5 text-white placeholder-white/20 focus:border-gold/60 focus:outline-none text-end rtl:text-start"
              />
            </div>
          </div>

          {/* Section & Aspect Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-white/70 eyebrow">{isAr ? 'القسم / التصنيف *' : 'Category / Section *'}</label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full bg-[#1A1917] border border-white/10 rounded-xs px-3 py-2.5 text-white focus:border-gold/60 focus:outline-none"
              >
                <option value="Hero Banners">Hero Banners (صور الهيدر الرئيسية)</option>
                <option value="The 8 Disciplines">The 8 Disciplines (التخصصات الثمانية)</option>
                <option value="Featured Projects">Featured Projects (المشاريع المميزة)</option>
                <option value="Interiors & Living Spaces">Interiors & Living Spaces (المساحات الداخلية)</option>
                <option value="Architectural Materials">Architectural Materials (الخامات والمواد)</option>
                <option value="Studio & Careers">Studio & Careers (الاستوديو وبيئة العمل)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 eyebrow">{isAr ? 'نسبة الأبعاد (Aspect Ratio)' : 'Aspect Ratio'}</label>
              <select
                value={formData.aspectRatio}
                onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
                className="w-full bg-[#1A1917] border border-white/10 rounded-xs px-3 py-2.5 text-white focus:border-gold/60 focus:outline-none font-mono"
              >
                <option value="16/9">16:9 (Landscape Widescreen)</option>
                <option value="16/10">16:10 (Architectural Portfolio)</option>
                <option value="4/3">4:3 (Editorial Standard)</option>
                <option value="21/9">21:9 (Cinematic Banner)</option>
                <option value="1/1">1:1 (Square Material)</option>
                <option value="9/16">9:16 (Vertical Story)</option>
              </select>
            </div>
          </div>

          {/* Year & Location (En & Ar) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-white/70 eyebrow">{isAr ? 'سنة التوثيق / التنفيذ' : 'Year'}</label>
              <input
                type="text"
                value={formData.year || ''}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3.5 py-2.5 text-white placeholder-white/20 focus:border-gold/60 focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-white/70 eyebrow">{isAr ? 'الموقع (English)' : 'Location (English)'}</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="New Cairo, Egypt"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3.5 py-2.5 text-white placeholder-white/20 focus:border-gold/60 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-white/70 eyebrow">{isAr ? 'الموقع (العربية)' : 'Location (Arabic)'}</label>
              <input
                type="text"
                value={formData.locationAr || ''}
                onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })}
                placeholder="القاهرة الجديدة، مصر"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3.5 py-2.5 text-white placeholder-white/20 focus:border-gold/60 focus:outline-none text-end rtl:text-start"
              />
            </div>
          </div>

          {/* Description En & Ar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-white/70 eyebrow">{isAr ? 'الوصف المعماري (English)' : 'Narrative (English)'}</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Monumental travertine and glass villa at twilight..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3.5 py-2 text-white placeholder-white/20 focus:border-gold/60 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-white/70 eyebrow">{isAr ? 'الوصف المعماري (العربية)' : 'Narrative (Arabic)'}</label>
              <textarea
                rows={2}
                value={formData.descriptionAr || ''}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                placeholder="كتل معمارية متوازنة من الترافيرتين والزجاج عند الغسق..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3.5 py-2 text-white placeholder-white/20 focus:border-gold/60 focus:outline-none text-end rtl:text-start"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xs border border-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xs bg-gold text-charcoal font-semibold hover:bg-[#D4BC96] transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : isAr ? 'حفظ تفاصيل الصورة' : 'Save Visual Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── COUNTERS TAB ────────────────────────────────────────────────────────────
function CountersTab({
  counters,
  settings,
  onRefresh,
  isAr,
  showToast,
}: {
  counters: CounterMetric[]
  settings: SiteSettings
  onRefresh: () => void
  isAr: boolean
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void
}) {
  const [metrics, setMetrics] = useState<CounterMetric[]>(counters)
  const [mapCounts, setMapCounts] = useState({
    cairo: settings.cairoProjectsCount || '28+',
    riyadh: settings.riyadhProjectsCount || '14+',
    syria: settings.syriaProjectsCount || '5+',
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    setMetrics(counters)
    setMapCounts({
      cairo: settings.cairoProjectsCount || '28+',
      riyadh: settings.riyadhProjectsCount || '14+',
      syria: settings.syriaProjectsCount || '5+',
    })
  }, [counters, settings])

  const handleMetricChange = (id: string, field: keyof CounterMetric, val: string) => {
    setMetrics((items) => items.map((m) => (m.id === id ? { ...m, [field]: val } : m)))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          counters: metrics,
          settings: {
            ...settings,
            impactProjects: metrics.find((m) => m.id === 'projects')?.value || settings.impactProjects,
            impactM2: metrics.find((m) => m.id === 'm2')?.value || settings.impactM2,
            impactDisciplines: metrics.find((m) => m.id === 'disciplines')?.value || settings.impactDisciplines,
            impactMarkets: metrics.find((m) => m.id === 'studios')?.value || settings.impactMarkets,
            cairoProjectsCount: mapCounts.cairo,
            riyadhProjectsCount: mapCounts.riyadh,
            syriaProjectsCount: mapCounts.syria,
          },
        }),
        credentials: 'include',
      })
      if (res.ok) {
        if (showToast) {
          showToast(isAr ? 'تم حفظ العدادات وإحصائيات الأثر بنجاح' : 'Counters and regional stats saved!')
        } else {
          setToast(isAr ? 'تم حفظ العدادات وإحصائيات الأثر بنجاح' : 'Counters and regional stats saved!')
          setTimeout(() => setToast(''), 3000)
        }
        onRefresh()
      }
    } catch {
      if (showToast) showToast(isAr ? 'فشل حفظ إحصائيات الأثر' : 'Error saving metrics', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl sm:text-2xl font-serif font-light">
            {isAr ? 'العدادات المتحركة وإحصائيات الأثر' : 'Animated CountUp & Impact Metrics'}
          </h2>
          <p className="text-white/40 text-xs mt-0.5">
            {isAr
              ? 'التحكم في الأرقام التي تظهر في عداد الأثر المعماري (CountUp) مثل 45+ و 140K+ وأرقام مشاريع الخريطة الإقليمية.'
              : 'Edit live CountUp counter numbers across the site and regional branch counts.'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 rounded-xs bg-gold text-charcoal font-semibold text-xs eyebrow hover:bg-[#D4BC96] transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : isAr ? 'حفظ التعديلات' : 'Save Changes'}
        </button>
      </div>

      {toast && !showToast && (
        <div className="p-4 rounded-xs bg-gold/10 border border-gold/40 text-gold text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Impact CountUp Counters */}
      <div className="bg-[#141311] border border-white/10 rounded-xs p-6 space-y-6">
        <h3 className="text-gold text-xs eyebrow uppercase tracking-wider">
          {isAr ? 'عدادات الصفحة الرئيسية (Home Impact Section)' : 'Homepage Impact Counters'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((m) => (
            <div key={m.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gold text-xs font-mono font-medium">#{m.id}</span>
                <span className="text-[10px] text-white/40 font-mono">CountUp Animated</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-white/70 text-xs eyebrow">{isAr ? 'القيمة المعروضة (Value) *' : 'Display Value *'}</label>
                <input
                  type="text"
                  value={m.value}
                  onChange={(e) => handleMetricChange(m.id, 'value', e.target.value)}
                  placeholder="e.g. 45+ or 140K+"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-gold font-serif text-xl focus:border-gold/60 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/50 text-[11px] eyebrow">{isAr ? 'الوصف (English)' : 'Label (English)'}</label>
                  <input
                    type="text"
                    value={m.labelEn}
                    onChange={(e) => handleMetricChange(m.id, 'labelEn', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-2.5 py-1.5 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/50 text-[11px] eyebrow">{isAr ? 'الوصف (العربية)' : 'Label (Arabic)'}</label>
                  <input
                    type="text"
                    value={m.labelAr}
                    onChange={(e) => handleMetricChange(m.id, 'labelAr', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-2.5 py-1.5 text-white text-xs text-end rtl:text-start"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Reach Map Counters */}
      <div className="bg-[#141311] border border-white/10 rounded-xs p-6 space-y-6">
        <h3 className="text-gold text-xs eyebrow uppercase tracking-wider">
          {isAr ? 'عدادات الخريطة الإقليمية (Regional Map Projects)' : 'Regional Map Projects'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xs space-y-2">
            <label className="text-white/80 text-xs block font-serif">
              {isAr ? 'مشاريع استوديو القاهرة (مصر)' : 'Cairo Studio (Egypt)'}
            </label>
            <input
              type="text"
              value={mapCounts.cairo}
              onChange={(e) => setMapCounts({ ...mapCounts, cairo: e.target.value })}
              placeholder="28+"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-gold font-serif text-lg focus:border-gold/60 focus:outline-none"
            />
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xs space-y-2">
            <label className="text-white/80 text-xs block font-serif">
              {isAr ? 'مشاريع استوديو الرياض (السعودية)' : 'Riyadh Studio (KSA)'}
            </label>
            <input
              type="text"
              value={mapCounts.riyadh}
              onChange={(e) => setMapCounts({ ...mapCounts, riyadh: e.target.value })}
              placeholder="14+"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-gold font-serif text-lg focus:border-gold/60 focus:outline-none"
            />
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xs space-y-2">
            <label className="text-white/80 text-xs block font-serif">
              {isAr ? 'مشاريع استوديو دمشق (سوريا)' : 'Damascus Studio (Syria)'}
            </label>
            <input
              type="text"
              value={mapCounts.syria}
              onChange={(e) => setMapCounts({ ...mapCounts, syria: e.target.value })}
              placeholder="5+"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-gold font-serif text-lg focus:border-gold/60 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── ADMINS TAB (FULL CRUD & BREVO OTP SUPPORT) ──────────────────────────────
function AdminsTab({
  admins,
  onRefresh,
  isAr,
  showToast,
  askConfirm,
}: {
  admins: AdminUser[]
  onRefresh: () => void
  isAr: boolean
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void
  askConfirm?: (title: string, message: string, onConfirm: () => void, confirmLabel?: string) => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    email: '',
    role: 'Architectural Director',
    roleAr: 'مدير التصميم المعماري',
    password: '',
    avatar: '/images/consultation-architects.jpg',
  })

  const openCreate = () => {
    setEditingAdmin(null)
    setFormData({
      name: '',
      nameAr: '',
      email: '',
      role: 'Architectural Director',
      roleAr: 'مدير التصميم المعماري',
      password: '',
      avatar: '/images/consultation-architects.jpg',
    })
    setModalOpen(true)
  }

  const openEdit = (a: AdminUser) => {
    setEditingAdmin(a)
    setFormData({
      name: a.name || '',
      nameAr: a.nameAr || '',
      email: a.email || '',
      role: a.role || 'Architectural Director',
      roleAr: a.roleAr || 'مدير التصميم المعماري',
      password: a.password || '',
      avatar: a.avatar || '/images/consultation-architects.jpg',
    })
    setModalOpen(true)
  }

  const handleDelete = async (email: string, name: string) => {
    if (email.toLowerCase() === 'admin@viwan.studio') {
      if (showToast) showToast(isAr ? 'لا يمكن حذف الحساب الإداري الرئيسي للاستوديو' : 'Cannot delete the master studio admin', 'error')
      return
    }
    const confirmTitle = isAr ? 'حذف المسؤول' : 'Delete Studio Admin'
    const confirmMsg = isAr ? `هل أنت متأكد من حذف حساب المسؤول "${name}" نهائياً؟` : `Delete admin "${name}"?`

    const executeDelete = async () => {
      try {
        const res = await fetch(`/api/admin/admins?email=${encodeURIComponent(email)}`, {
          method: 'DELETE',
          credentials: 'include',
        })
        if (res.ok) {
          if (showToast) showToast(isAr ? `تم حذف المسؤول "${name}" بنجاح` : `Admin "${name}" deleted`)
          onRefresh()
        } else {
          if (showToast) showToast(isAr ? 'فشل حذف المسؤول' : 'Failed to delete', 'error')
        }
      } catch {
        if (showToast) showToast(isAr ? 'خطأ في الاتصال' : 'Connection error', 'error')
      }
    }

    if (askConfirm) {
      askConfirm(confirmTitle, confirmMsg, executeDelete)
    } else {
      if (confirm(confirmMsg)) executeDelete()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      })
      if (res.ok) {
        setModalOpen(false)
        if (showToast) showToast(isAr ? 'تم حفظ بيانات المسؤول بنجاح' : 'Admin saved successfully')
        onRefresh()
      } else {
        const d = await res.json().catch(() => ({}))
        if (showToast) showToast(d.error || (isAr ? 'فشل حفظ المسؤول' : 'Failed to save admin'), 'error')
      }
    } catch {
      if (showToast) showToast(isAr ? 'حدث خطأ أثناء حفظ المسؤول' : 'Error saving admin', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white text-xl sm:text-2xl font-serif font-light">
            {isAr ? 'إدارة المسؤولين وصلاحيات الدخول' : 'Studio Administrators & Access Credentials'}
          </h2>
          <p className="text-white/40 text-xs mt-0.5">
            {isAr
              ? 'إدارة حسابات المهندسين والمسؤولين المصرح لهم بالدخول، وربطهم بنظام التحقق السحابي Brevo OTP.'
              : 'Manage verified studio directors and credentials, integrated with Brevo OTP cloud recovery.'}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xs bg-gold text-charcoal text-xs font-semibold eyebrow hover:bg-[#D4BC96] transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-md shadow-gold/10"
        >
          <Plus className="size-3.5" />
          <span>{isAr ? 'إضافة مسؤول جديد' : 'New Administrator'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map((admin) => (
          <div
            key={admin.id || admin.email}
            className="bg-[#141311] border border-white/10 hover:border-gold/40 rounded-xs p-5 space-y-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="relative size-12 rounded-full overflow-hidden border border-gold/40 bg-black/40 shrink-0">
                <img
                  src={admin.avatar || '/images/consultation-architects.jpg'}
                  alt={admin.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-white font-serif text-sm font-medium truncate">
                  {isAr ? (admin.nameAr || admin.name) : admin.name}
                </h4>
                <p className="text-gold text-[11px] eyebrow mt-0.5">
                  {isAr ? (admin.roleAr || admin.role) : admin.role}
                </p>
              </div>
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xs space-y-2 text-xs">
              <div className="flex items-center justify-between text-white/50 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3 text-gold/70" />
                  <span className="font-mono text-white/80">{admin.email}</span>
                </span>
                <span className="px-2 py-0.5 rounded-2xs bg-gold/10 text-gold text-[10px]">
                  {isAr ? 'مفعل' : 'Active'}
                </span>
              </div>
              <div className="flex items-center justify-between text-white/40 text-[11px] pt-1 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3 text-gold/70" />
                  <span>{isAr ? 'مصرح بالـ OTP' : 'OTP Authorized'}</span>
                </span>
                <span>{admin.createdAt || '2026-03'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => openEdit(admin)}
                className="px-3 py-1.5 rounded-xs bg-white/5 hover:bg-gold hover:text-charcoal text-ivory text-xs transition-colors eyebrow cursor-pointer flex items-center gap-1"
              >
                <Edit3 className="size-3" />
                <span>{isAr ? 'تعديل' : 'Edit'}</span>
              </button>
              {admin.email.toLowerCase() !== 'admin@viwan.studio' && (
                <button
                  type="button"
                  onClick={() => handleDelete(admin.email, isAr ? (admin.nameAr || admin.name) : admin.name)}
                  className="p-1.5 rounded-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
                  title={isAr ? 'حذف' : 'Delete'}
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fade-in" />
          <div className="relative z-10 w-full max-w-lg bg-[#141311] border border-white/10 rounded-xs shadow-2xl p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-white font-serif text-xl font-light">
                {editingAdmin ? (isAr ? 'تعديل بيانات المسؤول' : 'Edit Administrator') : isAr ? 'إضافة مسؤول جديد' : 'New Administrator'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="size-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-white/70 eyebrow">{isAr ? 'الاسم (English) *' : 'Full Name (English) *'}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/70 eyebrow">{isAr ? 'الاسم (العربية)' : 'Full Name (Arabic)'}</label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white text-end rtl:text-start"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-white/70 eyebrow">{isAr ? 'البريد الإلكتروني المعتمد *' : 'Authorized Admin Email *'}</label>
                <input
                  type="email"
                  required
                  disabled={editingAdmin?.email.toLowerCase() === 'admin@viwan.studio'}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="director@viwan.studio"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-white/70 eyebrow">{isAr ? 'الدور الوظيفي' : 'Role Title'}</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Senior Architect"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/70 eyebrow">{isAr ? 'كلمة المرور' : 'Access Password'}</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Leave unchanged or set new"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-white/70 eyebrow">{isAr ? 'رابط الصورة الشخصية (Avatar)' : 'Avatar Image URL'}</label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xs border border-white/15 text-white/70"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xs bg-gold text-charcoal font-semibold"
                >
                  {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : isAr ? 'حفظ المسؤول' : 'Save Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ── SETTINGS TAB (BRANCH CONTACT, SOCIAL & MAP) ─────────────────────────────
function SettingsTab({
  settings,
  onRefresh,
  isAr,
  showToast,
}: {
  settings: SiteSettings
  onRefresh: () => void
  isAr: boolean
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void
}) {
  const [formData, setFormData] = useState<SiteSettings>(settings)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    setFormData(settings)
  }, [settings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: formData }),
        credentials: 'include',
      })
      if (res.ok) {
        if (showToast) {
          showToast(isAr ? 'تم حفظ إعدادات الفروع وبيانات التواصل بنجاح' : 'Settings updated successfully!')
        } else {
          setToast(isAr ? 'تم حفظ إعدادات الفروع وبيانات التواصل بنجاح' : 'Settings updated successfully!')
          setTimeout(() => setToast(''), 3000)
        }
        onRefresh()
      }
    } catch {
      if (showToast) showToast(isAr ? 'حدث خطأ أثناء تحديث الإعدادات' : 'Error updating settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl sm:text-2xl font-serif font-light">
            {isAr ? 'إعدادات الفروع والتواصل الاجتماعي' : 'Regional Offices & Communication Channels'}
          </h2>
          <p className="text-white/40 text-xs mt-0.5">
            {isAr
              ? 'تعديل أرقام هواتف فروع القاهرة والرياض ودمشق، روابط وسائل التواصل الاجتماعي، وعناوين المقرات.'
              : 'Manage contact coordinates for Cairo HQ, Riyadh, Syria, and official social media handles.'}
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xs bg-gold text-charcoal font-semibold text-xs eyebrow hover:bg-[#D4BC96] transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-gold/10"
        >
          {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : isAr ? 'حفظ كافة الإعدادات' : 'Save All Settings'}
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xs bg-gold/10 border border-gold/40 text-gold text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Cairo HQ */}
      <div className="bg-[#141311] border border-white/10 rounded-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Building2 className="size-4 text-gold" />
          <h3 className="text-white font-serif text-base font-medium">
            {isAr ? 'استوديو القاهرة (المقر الرئيسي)' : 'Cairo Studio HQ (Main Office)'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">{isAr ? 'رقم الهاتف' : 'Phone'}</label>
            <input
              type="text"
              value={formData.phoneCairo || formData.phone}
              onChange={(e) => setFormData({ ...formData, phoneCairo: e.target.value, phone: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">{isAr ? 'واتساب المباشر' : 'WhatsApp'}</label>
            <input
              type="text"
              value={formData.whatsapp || ''}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">{isAr ? 'العنوان (English)' : 'Address (English)'}</label>
            <input
              type="text"
              value={formData.addressCairo || ''}
              onChange={(e) => setFormData({ ...formData, addressCairo: e.target.value })}
              placeholder="El Tessen St, New Cairo, Egypt"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">{isAr ? 'العنوان (العربية)' : 'Address (Arabic)'}</label>
            <input
              type="text"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="شارع التسعين، القاهرة الجديدة، مصر"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white text-end rtl:text-start"
            />
          </div>
        </div>
      </div>

      {/* Riyadh Studio */}
      <div className="bg-[#141311] border border-white/10 rounded-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Building2 className="size-4 text-gold" />
          <h3 className="text-white font-serif text-base font-medium">
            {isAr ? 'استوديو الرياض (المملكة العربية السعودية)' : 'Riyadh Studio (Kingdom of Saudi Arabia)'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">{isAr ? 'رقم هاتف الرياض' : 'Riyadh Phone'}</label>
            <input
              type="text"
              value={formData.phoneRiyadh || ''}
              onChange={(e) => setFormData({ ...formData, phoneRiyadh: e.target.value })}
              placeholder="+966 11 000 0000"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">{isAr ? 'عنوان فرع الرياض' : 'Riyadh Address'}</label>
            <input
              type="text"
              value={formData.addressRiyadh || ''}
              onChange={(e) => setFormData({ ...formData, addressRiyadh: e.target.value })}
              placeholder="King Fahd Rd, Al Olaya, Riyadh, KSA"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white"
            />
          </div>
        </div>
      </div>

      {/* Damascus / Syria Studio */}
      <div className="bg-[#141311] border border-white/10 rounded-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Building2 className="size-4 text-gold" />
          <h3 className="text-white font-serif text-base font-medium">
            {isAr ? 'استوديو دمشق (الجمهورية العربية السورية)' : 'Damascus Studio (Syria)'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">{isAr ? 'رقم هاتف دمشق' : 'Damascus Phone'}</label>
            <input
              type="text"
              value={formData.phoneSyria || ''}
              onChange={(e) => setFormData({ ...formData, phoneSyria: e.target.value })}
              placeholder="+963 11 000 0000"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">{isAr ? 'عنوان فرع دمشق' : 'Damascus Address'}</label>
            <input
              type="text"
              value={formData.addressSyria || ''}
              onChange={(e) => setFormData({ ...formData, addressSyria: e.target.value })}
              placeholder="Abu Roumaneh, Damascus, Syria"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white"
            />
          </div>
        </div>
      </div>

      {/* Social Media Handles */}
      <div className="bg-[#141311] border border-white/10 rounded-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Globe className="size-4 text-gold" />
          <h3 className="text-white font-serif text-base font-medium">
            {isAr ? 'روابط منصات التواصل الاجتماعي' : 'Social Media Profiles'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">Instagram</label>
            <input
              type="text"
              value={formData.instagram || ''}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="https://instagram.com/viwan.studio"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white font-mono text-[11px]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">LinkedIn</label>
            <input
              type="text"
              value={formData.linkedin || ''}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/company/viwan"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white font-mono text-[11px]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">Behance</label>
            <input
              type="text"
              value={formData.behance || ''}
              onChange={(e) => setFormData({ ...formData, behance: e.target.value })}
              placeholder="https://behance.net/viwan"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white font-mono text-[11px]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">X (Twitter)</label>
            <input
              type="text"
              value={formData.xTwitter || ''}
              onChange={(e) => setFormData({ ...formData, xTwitter: e.target.value })}
              placeholder="https://x.com/viwanstudio"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white font-mono text-[11px]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">Facebook</label>
            <input
              type="text"
              value={formData.facebook || ''}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              placeholder="https://facebook.com/viwan.studio"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white font-mono text-[11px]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-white/70 eyebrow">YouTube</label>
            <input
              type="text"
              value={formData.youtube || ''}
              onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
              placeholder="https://youtube.com/@viwanstudio"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xs px-3 py-2 text-white font-mono text-[11px]"
            />
          </div>
        </div>
      </div>
    </form>
  )
}

// ── MASTER GATEWAY COMPONENT ────────────────────────────────────────────────
export default function StudioGatewayPage() {
  const [authed, setAuthed] = useState<boolean>(false)
  const [checking, setChecking] = useState<boolean>(true)
  const [tab, setTab] = useState<Tab>("overview")
  const [isAr, setIsAr] = useState<boolean>(true)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  // Data states
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [siteImages, setSiteImages] = useState<SiteImageItem[]>([])
  const [counters, setCounters] = useState<CounterMetric[]>([])
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [settings, setSettings] = useState<SiteSettings>({
    phone: '+20 100 000 0000',
    email: 'info@viwan.studio',
    city: 'New Cairo, Egypt',
    secondaryCity: 'Riyadh, KSA',
    impactProjects: '45+',
    impactM2: '140K+',
    impactDisciplines: '8',
    impactMarkets: '3',
  })

  // Selected project for editing / creating
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null)
  const [isCreatingProject, setIsCreatingProject] = useState(false)

  // UI/UX Pro Max: Global Toast & Confirm Dialog State
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([])
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3800)
  }

  const askConfirm = (title: string, message: string, onConfirm: () => void, confirmLabel?: string) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmLabel,
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        onConfirm()
      },
    })
  }

  // Check initial admin auth session
  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => {
        if (r.ok) {
          setAuthed(true)
          loadAllData()
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  // Load all master dashboard data
  const loadAllData = async () => {
    try {
      const [projRes, setRes, admRes] = await Promise.all([
        fetch("/api/admin/projects", { credentials: "include" }).then((r) => r.json()).catch(() => ({})),
        fetch("/api/admin/settings", { credentials: "include" }).then((r) => r.json()).catch(() => ({})),
        fetch("/api/admin/admins", { credentials: "include" }).then((r) => r.json()).catch(() => ({})),
      ])

      if (Array.isArray(projRes.projects)) {
        const normalized = projRes.projects.map((p: any) => ({
          ...p,
          id: p.id || p.slug,
          slug: p.slug,
          title: p.title || p.name || 'Untitled Project',
          name: p.name || p.title || 'Untitled Project',
          titleAr: p.titleAr || p.nameAr || p.title || p.name,
          nameAr: p.nameAr || p.titleAr || p.title || p.name,
          coverImage: p.coverImage || p.cover || p.image || '/images/hero-villa.png',
          cover: p.cover || p.coverImage || p.image || '/images/hero-villa.png',
          category: p.category || p.type || (p.disciplines && p.disciplines[0]) || 'Architecture',
          type: p.type || p.category || (p.disciplines && p.disciplines[0]) || 'Architecture',
          categoryAr: p.categoryAr || p.typeAr || p.category || p.type || 'الهندسة المعمارية',
        }))
        setProjects(normalized)
      }
      if (setRes.settings) setSettings(setRes.settings)
      if (Array.isArray(setRes.siteImages)) setSiteImages(setRes.siteImages)
      if (Array.isArray(setRes.counters)) setCounters(setRes.counters)
      if (Array.isArray(admRes.admins)) setAdmins(admRes.admins)
    } catch (e) {
      console.error('Error loading dashboard data:', e)
    }
  }

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE", credentials: "include" })
    setAuthed(false)
  }

  const navigateTab = (target: Tab) => {
    setTab(target)
    setDrawerOpen(false)
  }

  const handleEditProjectFromOverview = (p: ProjectData) => {
    setIsCreatingProject(false)
    setEditingProject(p)
    setTab('projects')
  }

  const handleNewProject = () => {
    setEditingProject(null)
    setIsCreatingProject(true)
    setTab('projects')
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0C0B0A] flex items-center justify-center">
        <div className="w-10 h-px bg-gold animate-pulse" />
      </div>
    )
  }

  if (!authed) {
    return <AuthGate onAuth={() => { setAuthed(true); loadAllData(); }} />
  }

  // Pure realistic Lucide icons - ZERO emojis!
  const navItems: { id: Tab; num: string; labelEn: string; labelAr: string; Icon: any; count?: number }[] = [
    { id: "overview", num: "01", labelEn: "Home", labelAr: "نظرة عامة", Icon: LayoutDashboard },
    { id: "projects", num: "02", labelEn: "Projects", labelAr: "المشاريع المعمارية", Icon: FolderKanban, count: projects.length },
    { id: "images", num: "03", labelEn: "Site Visuals", labelAr: "مكتبة الصور والميديا", Icon: ImageIcon, count: siteImages.length },
    { id: "counters", num: "04", labelEn: "Impact Counters", labelAr: "إحصائيات الأثر والعدادات", Icon: BarChart3 },
    { id: "admins", num: "05", labelEn: "Studio Admins", labelAr: "المشرفين وصلاحيات الدخول", Icon: ShieldCheck, count: admins.length },
    { id: "settings", num: "06", labelEn: "Branches & Contact", labelAr: "الفروع وبيانات التواصل", Icon: Building2 },
  ]

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0C0B0A] text-ivory flex flex-col selection:bg-gold selection:text-charcoal"
      style={{ fontFamily: isAr ? "var(--font-heading), sans-serif" : "var(--font-sans), sans-serif" }}
    >
      {/* ── TOP NAVIGATION BAR (WITH 3-LINE BURGER BUTTON) ───────────────── */}
      <header className="sticky top-0 z-40 bg-[#121110]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* 3-Line Burger Menu Button (Pure lines, NO black square background) */}
          <button
            type="button"
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="group flex flex-col justify-center gap-1.5 size-9 p-1.5 focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Drawer"
          >
            <span
              className={`w-6 h-0.5 bg-ivory/80 group-hover:bg-gold transition-all duration-300 ${
                drawerOpen ? 'rotate-45 translate-y-2 bg-gold' : ''
              }`}
            />
            <span
              className={`w-4 group-hover:w-6 h-0.5 bg-ivory/80 group-hover:bg-gold transition-all duration-300 ${
                drawerOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-5 group-hover:w-6 h-0.5 bg-ivory/80 group-hover:bg-gold transition-all duration-300 ${
                drawerOpen ? '-rotate-45 -translate-y-2 bg-gold' : ''
              }`}
            />
          </button>

          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-block">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.25em] text-white">V// VIWAN</span>
            </Link>
            <span className="hidden sm:inline-block h-4 w-px bg-white/15" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] eyebrow text-gold/80 tracking-widest uppercase">
                {isAr ? 'لوحة تحكم الاستوديو المعماري' : 'STUDIO GATEWAY'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language Pill Switcher */}
          <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-sm p-0.5">
            <button
              type="button"
              onClick={() => setIsAr(false)}
              className={`px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                !isAr ? 'bg-[#C5A880] text-[#0C0B0A] font-semibold' : 'text-white/60 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setIsAr(true)}
              className={`px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                isAr ? 'bg-[#C5A880] text-[#0C0B0A] font-semibold' : 'text-white/60 hover:text-white'
              }`}
            >
              العربية
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 text-xs eyebrow text-ivory/60 hover:text-gold transition-colors"
          >
            <span>{isAr ? 'الموقع الرئيسي' : 'View Site'}</span>
            <ExternalLink className="size-3" />
          </Link>

          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-xs text-xs text-red-400/80 hover:text-red-300 hover:bg-red-950/20 transition-colors eyebrow cursor-pointer flex items-center gap-1"
          >
            <LogOut className="size-3" />
            <span>{isAr ? 'خروج' : 'Sign Out'}</span>
          </button>
        </div>
      </header>

      {/* ── LUXURY SLIDE-OUT DRAWER (MATCHING IMAGE 2 EXACTLY) ────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex animate-fade-in">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Menu Panel */}
          <aside
            className="relative z-10 w-full max-w-sm sm:max-w-md bg-[#0D0C0B] border-r rtl:border-r-0 rtl:border-l border-white/10 h-full flex flex-col justify-between p-6 sm:p-8 shadow-2xl overflow-y-auto animate-slide-in select-none"
          >
            <div>
              {/* Drawer Top Bar matching Image 2 */}
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
                {/* Brand */}
                <div className="flex items-center gap-3">
                  <span className="font-serif text-xl tracking-[0.25em] text-white font-light">V// VIWAN</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Language Switcher Pill */}
                  <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-xs p-0.5">
                    <button
                      type="button"
                      onClick={() => setIsAr(false)}
                      className={`px-2.5 py-1 text-[11px] transition-colors cursor-pointer ${
                        !isAr ? 'bg-[#C5A880] text-[#0C0B0A] font-semibold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAr(true)}
                      className={`px-2.5 py-1 text-[11px] transition-colors cursor-pointer ${
                        isAr ? 'bg-[#C5A880] text-[#0C0B0A] font-semibold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      العربية
                    </button>
                  </div>

                  {/* Circular Close Button */}
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="size-9 rounded-full border border-white/10 hover:border-gold/50 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Eyebrow matching Image 2 */}
              <div className="mt-8 mb-4">
                <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#C5A880]/85 uppercase font-medium">
                  {isAr ? 'لوحة التحكم والمنظومة المعمارية' : 'NAVIGATION & DISCIPLINES'}
                </p>
              </div>

              {/* Numbered Luxury Items matching Image 2 typography */}
              <nav className="divide-y divide-white/[0.06]">
                {navItems.map((item) => {
                  const ItemIcon = item.Icon
                  const isActive = tab === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateTab(item.id)}
                      className="w-full flex items-center justify-between py-4 group cursor-pointer text-start transition-colors"
                    >
                      <div className="flex items-baseline gap-4">
                        <span className={`font-mono text-xs transition-colors ${
                          isActive ? 'text-[#C5A880] font-medium' : 'text-gold/60 group-hover:text-gold'
                        }`}>
                          {item.num}
                        </span>
                        <span
                          className={`font-serif text-2xl sm:text-[26px] font-light tracking-tight transition-colors duration-300 ${
                            isActive ? 'text-[#C5A880]' : 'text-white/85 group-hover:text-[#C5A880]'
                          }`}
                        >
                          {isAr ? item.labelAr : item.labelEn}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {typeof item.count === 'number' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/40 group-hover:text-gold/80 transition-colors">
                            {item.count}
                          </span>
                        )}
                        <ItemIcon
                          className={`size-5 transition-colors duration-300 ${
                            isActive ? 'text-gold' : 'text-white/20 group-hover:text-gold/80'
                          }`}
                        />
                      </div>
                    </button>
                  )
                })}
              </nav>

              {/* Studio Locations Block matching Image 2 bottom */}
              <div className="mt-10 pt-6 border-t border-white/[0.08] space-y-4">
                <p className="text-[10px] font-mono tracking-[0.25em] text-gold/80 uppercase font-medium">
                  {isAr ? 'مكاتب واستوديوهات إيوان' : 'OUR STUDIOS'}
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <h5 className="font-serif font-medium text-white/90">
                      {isAr ? 'استوديو القاهرة (المقر الرئيسي)' : 'Cairo Studio'}
                    </h5>
                    <p className="text-white/40 text-[11px] mt-0.5">
                      {isAr ? 'شارع التسعين، القاهرة الجديدة، مصر' : 'El Tessen St, New Cairo, Egypt'}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-serif font-medium text-white/90">
                      {isAr ? 'استوديو الرياض' : 'Riyadh Studio'}
                    </h5>
                    <p className="text-white/40 text-[11px] mt-0.5">
                      {isAr ? 'طريق الملك فهد، العليا، الرياض، السعودية' : 'King Fahd Rd, Al Olaya, Riyadh, KSA'}
                    </p>
                  </div>
                </div>

                {/* Email and Phone with Realistic Line Icons */}
                <div className="pt-3 border-t border-white/[0.06] space-y-1.5 text-xs text-white/60">
                  <a
                    href="mailto:info@viwan.studio"
                    className="flex items-center gap-2 hover:text-gold transition-colors"
                  >
                    <Mail className="size-3.5 text-gold/70" />
                    <span>info@viwan.studio</span>
                  </a>
                  <a
                    href="tel:+201000000000"
                    className="flex items-center gap-2 hover:text-gold transition-colors font-mono text-[11px]"
                  >
                    <Phone className="size-3.5 text-gold/70" />
                    <span>+20 100 000 0000</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Actions inside Drawer */}
            <div className="pt-6 border-t border-white/10 space-y-2.5 mt-8">
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xs border border-white/15 text-xs eyebrow text-ivory/80 hover:text-gold hover:border-gold transition-colors"
              >
                <ExternalLink className="size-3.5" />
                <span>{isAr ? 'الذهاب للموقع الرئيسي' : 'Visit Live Website'}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xs bg-red-950/30 text-red-300 hover:bg-red-950/60 text-xs eyebrow transition-colors cursor-pointer"
              >
                <LogOut className="size-3.5" />
                <span>{isAr ? 'تسجيل الخروج من البوابة' : 'Sign Out of Studio'}</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── MAIN DASHBOARD BODY (DESKTOP SIDEBAR + ACTIVE TAB CONTENT) ────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-shrink-0 bg-[#0E0E0C] border-r rtl:border-r-0 rtl:border-l border-white/10 flex-col justify-between p-5 sticky top-16 h-[calc(100vh-65px)]">
          <div className="space-y-6">
            <div className="px-3 pt-2">
              <p className="text-gold text-[9px] eyebrow tracking-[0.3em] uppercase">
                {isAr ? 'أقسام لوحة التحكم' : 'STUDIO MODULES'}
              </p>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const ItemIcon = item.Icon
                const isActive = tab === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xs text-xs eyebrow tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gold/15 text-gold border border-gold/40 font-semibold'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ItemIcon className={`size-4 ${isActive ? 'text-gold' : 'text-white/40'}`} />
                      <span>{isAr ? item.labelAr : item.labelEn}</span>
                    </div>
                    {typeof item.count === 'number' && (
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono">
                        {item.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="p-3 bg-white/[0.02] rounded-xs border border-white/5 text-[11px] text-white/40 space-y-1">
              <p className="text-gold eyebrow">{isAr ? 'استوديو إيوان المعماري' : 'VIWAN Architecture'}</p>
              <p>v2.5 · {isAr ? 'اتصال آمن ومحمي' : 'TLS 1.3 Certified'}</p>
            </div>
          </div>
        </aside>

        {/* Dynamic Main Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {tab === "overview" && (
              <OverviewTab
                projects={projects}
                siteImages={siteImages}
                admins={admins}
                counters={counters}
                settings={settings}
                onNavigate={navigateTab}
                onEditProject={handleEditProjectFromOverview}
                onNewProject={handleNewProject}
                isAr={isAr}
              />
            )}

            {tab === "projects" && (
              <ProjectsTab
                projects={projects}
                onRefresh={loadAllData}
                onEdit={(p) => {
                  setIsCreatingProject(false)
                  setEditingProject(p)
                }}
                editingProject={editingProject}
                onCloseEdit={() => setEditingProject(null)}
                isCreating={isCreatingProject}
                onOpenCreate={handleNewProject}
                onCloseCreate={() => setIsCreatingProject(false)}
                isAr={isAr}
                showToast={showToast}
                askConfirm={askConfirm}
              />
            )}

            {tab === "images" && (
              <SiteImagesTab
                siteImages={siteImages}
                onRefresh={loadAllData}
                isAr={isAr}
                showToast={showToast}
              />
            )}

            {tab === "counters" && (
              <CountersTab
                counters={counters}
                settings={settings}
                onRefresh={loadAllData}
                isAr={isAr}
                showToast={showToast}
              />
            )}

            {tab === "admins" && (
              <AdminsTab
                admins={admins}
                onRefresh={loadAllData}
                isAr={isAr}
                showToast={showToast}
                askConfirm={askConfirm}
              />
            )}

            {tab === "settings" && (
              <SettingsTab
                settings={settings}
                onRefresh={loadAllData}
                isAr={isAr}
                showToast={showToast}
              />
            )}
          </div>
        </main>
      </div>

      {/* ── UI/UX PRO MAX: BESPOKE ARCHITECTURAL TOAST CONTAINER ── */}
      <div className="fixed top-20 end-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-xs border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-fade-in transition-all duration-300 ${
              t.type === 'success'
                ? 'bg-[#0B1711]/95 border-emerald-500/40 text-emerald-100 shadow-emerald-950/40'
                : t.type === 'error'
                ? 'bg-[#1D0C0C]/95 border-rose-500/40 text-rose-100 shadow-rose-950/40'
                : 'bg-[#151412]/95 border-gold/40 text-ivory shadow-black/60'
            }`}
          >
            <div className="flex items-center gap-3">
              {t.type === 'success' ? (
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              ) : t.type === 'error' ? (
                <X className="size-4 text-rose-400 shrink-0" />
              ) : (
                <Sparkles className="size-4 text-gold shrink-0" />
              )}
              <span className="text-xs font-sans font-medium leading-relaxed">{t.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="text-white/40 hover:text-white transition-colors cursor-pointer p-1"
              aria-label="Close notification"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* ── UI/UX PRO MAX: BESPOKE CONFIRMATION DIALOG ── */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141311] border border-white/15 rounded-xs p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-xs bg-white/10 border border-white/20 flex items-center justify-center text-white/80 shrink-0 mt-0.5">
                <Trash2 className="size-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-serif font-medium text-white">{confirmModal.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{confirmModal.message}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-1.5 rounded-xs border border-white/15 text-xs text-white/70 hover:text-white hover:border-white/30 transition-colors cursor-pointer eyebrow"
              >
                {confirmModal.cancelLabel || (isAr ? 'إلغاء' : 'Cancel')}
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-4 py-1.5 rounded-xs bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold transition-colors cursor-pointer eyebrow shadow-sm"
              >
                {confirmModal.confirmLabel || (isAr ? 'تأكيد الحذف' : 'Confirm Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
