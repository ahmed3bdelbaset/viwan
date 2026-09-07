'use client';

import React, { useState, useEffect } from 'react';
import { DataStore } from '@/lib/store';
import { CompanyInfo, ContactPhone, ContactEmail } from '@/lib/types';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import { useViwanModal } from '@/components/ui/ViwanModalProvider';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  YouTubeIcon,
  LinkedInIcon
} from '@/components/ui/SocialIcons';
import {
  Check,
  RefreshCw,
  Plus,
  Trash2,
  Phone,
  Mail,
  Share2,
  Building,
  Save,
  MessageCircle,
  Download,
  Upload,
  Database,
  HardDrive,
  ShieldCheck
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [info, setInfo] = useState<CompanyInfo | null>(null);
  const [saved, setSaved] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const { t, isRtl } = useAdminLang();
  const { showSuccess, showError, showConfirm } = useViwanModal();

  useEffect(() => {
    setInfo(DataStore.getCompanyInfo());
  }, []);

  if (!info) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.saveCompanyInfo(info);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleConfirmReset = () => {
    DataStore.resetDefaults();
    setInfo(DataStore.getCompanyInfo());
    setResetModalOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Phone Handlers
  const handleAddPhone = () => {
    const newPhone: ContactPhone = {
      id: `p-${Date.now()}`,
      label_en: 'Direct Line',
      label_ar: 'خط مباشر',
      number: '+20 100 000 0000',
      is_whatsapp: false
    };
    setInfo({
      ...info,
      phones: [...(info.phones || []), newPhone]
    });
  };

  const handleUpdatePhone = (id: string, field: keyof ContactPhone, val: any) => {
    setInfo({
      ...info,
      phones: (info.phones || []).map((p) => (p.id === id ? { ...p, [field]: val } : p))
    });
  };

  const handleDeletePhone = (id: string) => {
    setInfo({
      ...info,
      phones: (info.phones || []).filter((p) => p.id !== id)
    });
  };

  // Email Handlers
  const handleAddEmail = () => {
    const newEmail: ContactEmail = {
      id: `e-${Date.now()}`,
      label_en: 'Department Email',
      label_ar: 'بريد القسم',
      email: 'inquiry@viwan.com'
    };
    setInfo({
      ...info,
      emails: [...(info.emails || []), newEmail]
    });
  };

  const handleUpdateEmail = (id: string, field: keyof ContactEmail, val: string) => {
    setInfo({
      ...info,
      emails: (info.emails || []).map((e) => (e.id === id ? { ...e, [field]: val } : e))
    });
  };

  const handleDeleteEmail = (id: string) => {
    setInfo({
      ...info,
      emails: (info.emails || []).filter((e) => e.id !== id)
    });
  };

  return (
    <div className="space-y-10 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E2D8]">
        <div>
          <h1 className="font-cinzel text-2xl text-charcoal uppercase tracking-wide">
            {t.settings.title}
          </h1>
          <p className="text-xs text-stone-text font-light mt-0.5">
            {t.settings.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setResetModalOpen(true)}
          className="border border-[#E7E2D8] bg-white hover:border-red-500 hover:text-red-600 px-4 py-2 text-xs flex items-center space-x-2 rtl:space-x-reverse text-stone-dark transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t.settings.resetDefaults}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* ========================================================================= */}
        {/* 1. SOCIAL MEDIA CHANNELS */}
        {/* ========================================================================= */}
        <div className="bg-white p-7 border border-[#E7E2D8] shadow-sm space-y-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse pb-4 border-b border-[#E7E2D8]">
            <div className="w-8 h-8 bg-[#FAF6EE] border border-[#E7E2D8] flex items-center justify-center text-charcoal">
              <Share2 className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h2 className="font-cinzel text-sm font-semibold uppercase text-charcoal">
                {t.settings.socialTitle}
              </h2>
              <p className="text-[11px] text-stone-text font-light">
                {t.settings.socialSubtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facebook */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-charcoal flex items-center space-x-2 rtl:space-x-reverse">
                <FacebookIcon className="w-4 h-4 text-gold" />
                <span>{t.settings.facebook}</span>
              </label>
              <input
                type="url"
                value={info.social.facebook || ''}
                onChange={(e) => setInfo({ ...info, social: { ...info.social, facebook: e.target.value } })}
                placeholder="https://facebook.com/viwan.architecture"
                className="w-full bg-[#FAF6EE]/50 border border-[#E7E2D8] focus:border-gold focus:bg-white p-2.5 text-xs text-charcoal outline-none transition-colors"
              />
            </div>

            {/* Instagram */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-charcoal flex items-center space-x-2 rtl:space-x-reverse">
                <InstagramIcon className="w-4 h-4 text-gold" />
                <span>{t.settings.instagram}</span>
              </label>
              <input
                type="url"
                value={info.social.instagram || ''}
                onChange={(e) => setInfo({ ...info, social: { ...info.social, instagram: e.target.value } })}
                placeholder="https://instagram.com/viwan.architecture"
                className="w-full bg-[#FAF6EE]/50 border border-[#E7E2D8] focus:border-gold focus:bg-white p-2.5 text-xs text-charcoal outline-none transition-colors"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-charcoal flex items-center space-x-2 rtl:space-x-reverse">
                <WhatsAppIcon className="w-4 h-4 text-gold" />
                <span>{t.settings.whatsapp}</span>
              </label>
              <input
                type="text"
                value={info.social.whatsapp || ''}
                onChange={(e) => setInfo({ ...info, social: { ...info.social, whatsapp: e.target.value } })}
                placeholder="https://wa.me/201000000000"
                className="w-full bg-[#FAF6EE]/50 border border-[#E7E2D8] focus:border-gold focus:bg-white p-2.5 text-xs text-charcoal outline-none transition-colors"
              />
            </div>

            {/* YouTube */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-charcoal flex items-center space-x-2 rtl:space-x-reverse">
                <YouTubeIcon className="w-4 h-4 text-gold" />
                <span>{t.settings.youtube}</span>
              </label>
              <input
                type="url"
                value={info.social.youtube || ''}
                onChange={(e) => setInfo({ ...info, social: { ...info.social, youtube: e.target.value } })}
                placeholder="https://youtube.com/@viwan"
                className="w-full bg-[#FAF6EE]/50 border border-[#E7E2D8] focus:border-gold focus:bg-white p-2.5 text-xs text-charcoal outline-none transition-colors"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11px] font-semibold uppercase text-charcoal flex items-center space-x-2 rtl:space-x-reverse">
                <LinkedInIcon className="w-4 h-4 text-gold" />
                <span>{t.settings.linkedin}</span>
              </label>
              <input
                type="url"
                value={info.social.linkedin || ''}
                onChange={(e) => setInfo({ ...info, social: { ...info.social, linkedin: e.target.value } })}
                placeholder="https://linkedin.com/company/viwan"
                className="w-full bg-[#FAF6EE]/50 border border-[#E7E2D8] focus:border-gold focus:bg-white p-2.5 text-xs text-charcoal outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MULTIPLE STUDIO PHONE NUMBERS */}
        {/* ========================================================================= */}
        <div className="bg-white p-7 border border-[#E7E2D8] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E7E2D8]">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-[#FAF6EE] border border-[#E7E2D8] flex items-center justify-center text-charcoal">
                <Phone className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h2 className="font-cinzel text-sm font-semibold uppercase text-charcoal">
                  {t.settings.phonesTitle}
                </h2>
                <p className="text-[11px] text-stone-text font-light">
                  {t.settings.phonesSubtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddPhone}
              className="bg-charcoal hover:bg-gold text-white text-[11px] font-semibold tracking-wider uppercase px-4 py-2 transition-all flex items-center space-x-1.5 rtl:space-x-reverse shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.settings.addPhone}</span>
            </button>
          </div>

          <div className="space-y-4">
            {(info.phones || []).map((ph, idx) => (
              <div key={ph.id || idx} className="p-4 bg-[#FAF6EE]/40 border border-[#E7E2D8] grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[10px] uppercase text-stone-500 font-semibold">{t.settings.phoneLabel} (EN)</label>
                  <input
                    type="text"
                    value={ph.label_en}
                    onChange={(e) => handleUpdatePhone(ph.id, 'label_en', e.target.value)}
                    className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[10px] uppercase text-stone-500 font-semibold">{t.settings.phoneLabel} (AR)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={ph.label_ar}
                    onChange={(e) => handleUpdatePhone(ph.id, 'label_ar', e.target.value)}
                    className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[10px] uppercase text-stone-500 font-semibold">{t.settings.phoneNumber}</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={ph.number}
                    onChange={(e) => handleUpdatePhone(ph.id, 'number', e.target.value)}
                    className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal font-mono outline-none focus:border-gold"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-end space-x-3 rtl:space-x-reverse pt-4 sm:pt-0">
                  <label className="flex items-center space-x-1 rtl:space-x-reverse text-[10px] text-stone-dark cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!ph.is_whatsapp}
                      onChange={(e) => handleUpdatePhone(ph.id, 'is_whatsapp', e.target.checked)}
                      className="accent-gold w-3.5 h-3.5"
                    />
                    <span>{t.settings.whatsappBadge}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDeletePhone(ph.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MULTIPLE EMAIL INQUIRY ADDRESSES */}
        {/* ========================================================================= */}
        <div className="bg-white p-7 border border-[#E7E2D8] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E7E2D8]">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-[#FAF6EE] border border-[#E7E2D8] flex items-center justify-center text-charcoal">
                <Mail className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h2 className="font-cinzel text-sm font-semibold uppercase text-charcoal">
                  {t.settings.emailsTitle}
                </h2>
                <p className="text-[11px] text-stone-text font-light">
                  {t.settings.emailsSubtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddEmail}
              className="bg-charcoal hover:bg-gold text-white text-[11px] font-semibold tracking-wider uppercase px-4 py-2 transition-all flex items-center space-x-1.5 rtl:space-x-reverse shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.settings.addEmail}</span>
            </button>
          </div>

          <div className="space-y-4">
            {(info.emails || []).map((em, idx) => (
              <div key={em.id || idx} className="p-4 bg-[#FAF6EE]/40 border border-[#E7E2D8] grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[10px] uppercase text-stone-500 font-semibold">{t.settings.emailLabel} (EN)</label>
                  <input
                    type="text"
                    value={em.label_en}
                    onChange={(e) => handleUpdateEmail(em.id, 'label_en', e.target.value)}
                    className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[10px] uppercase text-stone-500 font-semibold">{t.settings.emailLabel} (AR)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={em.label_ar}
                    onChange={(e) => handleUpdateEmail(em.id, 'label_ar', e.target.value)}
                    className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                  />
                </div>

                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[10px] uppercase text-stone-500 font-semibold">{t.settings.emailAddress}</label>
                  <input
                    type="email"
                    dir="ltr"
                    value={em.email}
                    onChange={(e) => handleUpdateEmail(em.id, 'email', e.target.value)}
                    className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal font-mono outline-none focus:border-gold"
                  />
                </div>

                <div className="sm:col-span-1 flex items-center justify-end pt-4 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => handleDeleteEmail(em.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. FOOTER SUMMARY BIO TEXT */}
        {/* ========================================================================= */}
        <div className="bg-white p-7 border border-[#E7E2D8] shadow-sm space-y-6">
          <div className="pb-4 border-b border-[#E7E2D8]">
            <h2 className="font-cinzel text-sm font-semibold uppercase text-charcoal">
              {t.settings.footerTitle}
            </h2>
            <p className="text-[11px] text-stone-text font-light">
              {t.settings.footerSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-charcoal block">
                {t.settings.footerSummaryEn}
              </label>
              <textarea
                rows={4}
                value={info.footer_summary_en}
                onChange={(e) => setInfo({ ...info, footer_summary_en: e.target.value })}
                className="w-full bg-[#FAF6EE]/50 border border-[#E7E2D8] focus:border-gold focus:bg-white p-3 text-xs text-charcoal outline-none resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-charcoal block">
                {t.settings.footerSummaryAr}
              </label>
              <textarea
                rows={4}
                dir="rtl"
                value={info.footer_summary_ar}
                onChange={(e) => setInfo({ ...info, footer_summary_ar: e.target.value })}
                className="w-full bg-[#FAF6EE]/50 border border-[#E7E2D8] focus:border-gold focus:bg-white p-3 text-xs text-charcoal outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. STUDIO HEADQUARTERS & ADDRESSES */}
        {/* ========================================================================= */}
        <div className="bg-white p-7 border border-[#E7E2D8] shadow-sm space-y-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse pb-4 border-b border-[#E7E2D8]">
            <Building className="w-4 h-4 text-gold" />
            <div>
              <h2 className="font-cinzel text-sm font-semibold uppercase text-charcoal">
                {t.settings.studiosTitle}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cairo Studio */}
            <div className="p-4 bg-[#FAF6EE]/50 border border-[#E7E2D8] space-y-3">
              <h3 className="font-cinzel text-xs font-semibold uppercase text-charcoal">{t.settings.cairoStudio}</h3>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-stone-500">{t.settings.addressEn}</label>
                <input
                  type="text"
                  value={info.cairo_studio.address_en}
                  onChange={(e) => setInfo({ ...info, cairo_studio: { ...info.cairo_studio, address_en: e.target.value } })}
                  className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-stone-500">{t.settings.addressAr}</label>
                <input
                  type="text"
                  dir="rtl"
                  value={info.cairo_studio.address_ar}
                  onChange={(e) => setInfo({ ...info, cairo_studio: { ...info.cairo_studio, address_ar: e.target.value } })}
                  className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none"
                />
              </div>
            </div>

            {/* Riyadh Studio */}
            <div className="p-4 bg-[#FAF6EE]/50 border border-[#E7E2D8] space-y-3">
              <h3 className="font-cinzel text-xs font-semibold uppercase text-charcoal">{t.settings.riyadhStudio}</h3>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-stone-500">{t.settings.addressEn}</label>
                <input
                  type="text"
                  value={info.riyadh_studio.address_en}
                  onChange={(e) => setInfo({ ...info, riyadh_studio: { ...info.riyadh_studio, address_en: e.target.value } })}
                  className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-stone-500">{t.settings.addressAr}</label>
                <input
                  type="text"
                  dir="rtl"
                  value={info.riyadh_studio.address_ar}
                  onChange={(e) => setInfo({ ...info, riyadh_studio: { ...info.riyadh_studio, address_ar: e.target.value } })}
                  className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. DATABASE BACKUP & DATA PERSISTENCE */}
        <div className="bg-white border border-[#E7E2D8] p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E2D8]">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-9 h-9 bg-[#FAF6EE] border border-gold/40 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="font-cinzel text-base text-charcoal uppercase tracking-wider font-semibold">
                  {isRtl ? 'النسخ الاحتياطي وحفظ البيانات الدائم' : 'Data Persistence & Complete Backup'}
                </h2>
                <p className="text-xs text-stone-text font-light mt-0.5">
                  {isRtl
                    ? 'تصدير واستعادة كافة بيانات المشاريع، المقالات، الإعدادات، والوسائط بنقرة واحدة.'
                    : 'Export and restore all projects, insights, sectors, media, and settings instantly.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Download Backup Button */}
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch('/api/admin/backup');
                    if (!res.ok) throw new Error('فشل تصدير النسخة الاحتياطية');
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `viwan_backup_${new Date().toISOString().slice(0, 10)}.json`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    showSuccess(
                      isRtl
                        ? 'تم تصدير وحفظ ملف النسخة الاحتياطية بنجاح على جهازك!'
                        : 'Backup file exported and downloaded successfully!',
                      isRtl ? 'تصدير النسخة الاحتياطية' : 'Backup Export'
                    );
                  } catch (err: any) {
                    showError(err.message || 'Error exporting backup');
                  }
                }}
                className="bg-[#FAF6EE] hover:bg-gold hover:text-white text-charcoal border border-[#E7E2D8] hover:border-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 rtl:space-x-reverse shadow-xs"
              >
                <Download className="w-4 h-4 text-gold" />
                <span>{isRtl ? 'تحميل نسخة احتياطية (JSON)' : 'Export Full Backup'}</span>
              </button>

              {/* Restore Backup Button */}
              <label className="bg-charcoal hover:bg-gold text-white border border-charcoal hover:border-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 rtl:space-x-reverse cursor-pointer shadow-xs">
                <Upload className="w-4 h-4 text-gold" />
                <span>{isRtl ? 'استعادة من نسخة احتياطية' : 'Restore from Backup'}</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    try {
                      const text = await file.text();
                      const parsed = JSON.parse(text);

                      const confirmed = await showConfirm(
                        isRtl
                          ? 'هل أنت متأكد من استعادة هذه النسخة الاحتياطية؟ سيتم تحديث وتثبيت كافة المشاريع والإعدادات والمقالات المضمنة في الملف.'
                          : 'Are you sure you want to restore this backup? It will update existing projects, settings, and insights.',
                        isRtl ? 'تأكيد استعادة البيانات' : 'Confirm Restore'
                      );

                      if (!confirmed) {
                        e.target.value = '';
                        return;
                      }

                      setIsRestoring(true);
                      const res = await fetch('/api/admin/backup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(parsed),
                      });

                      const result = await res.json();
                      setIsRestoring(false);

                      if (result.success) {
                        setInfo(DataStore.getCompanyInfo());
                        showSuccess(
                          isRtl
                            ? `تمت استعادة كافة البيانات بنجاح تام!\n• المشاريع: ${result.stats?.projects || 0}\n• المقالات: ${result.stats?.insights || 0}\n• القطاعات: ${result.stats?.expertise || 0}`
                            : 'All data, projects, and settings restored successfully!',
                          isRtl ? 'تمت الاستعادة بنجاح' : 'Restore Successful'
                        );
                      } else {
                        throw new Error(result.error || 'فشل استعادة البيانات');
                      }
                    } catch (err: any) {
                      setIsRestoring(false);
                      showError(err.message || 'الملف المرفوع غير صالح أو حدث خطأ أثناء الاستعادة');
                    } finally {
                      e.target.value = '';
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="bg-[#FAF6EE]/70 border border-[#E7E2D8] p-4 text-xs text-stone-600 leading-relaxed flex items-start space-x-3 rtl:space-x-reverse">
            <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-charcoal block mb-0.5">
                {isRtl ? 'دليل استمرارية البيانات في بيئات الإنتاج (Production Persistence):' : 'Production Persistence Architecture:'}
              </span>
              <p>
                {isRtl
                  ? 'عند عمل Deploy على منصات مثل Vercel، يمكنك أخذ نسخة احتياطية من هنا قبل الرفع واستعادتها بضغطة زر واحدة. وللحفظ السحابي الدائم بدون أي تدخل، المنصة مهيأة أيضاً للربط مع قواعد البيانات السحابية (PostgreSQL / Turso / Supabase) عبر متغير البيئة DATABASE_URL.'
                  : 'On ephemeral serverless platforms like Vercel, use the one-click Export/Restore above to preserve data, or connect a remote persistent cloud database (PostgreSQL / Turso / Supabase) via DATABASE_URL.'}
              </p>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-4 z-20 bg-[#FAF6EE]/95 backdrop-blur-sm p-4 border border-[#E7E2D8] flex items-center justify-between shadow-lg">
          <div>
            {saved ? (
              <span className="text-xs text-green-700 font-semibold flex items-center space-x-1.5 rtl:space-x-reverse">
                <Check className="w-4 h-4" />
                <span>{t.settings.savedSuccess}</span>
              </span>
            ) : (
              <span className="text-xs text-stone-dark font-light">
                {isRtl ? 'التعديلات تحدث الفوتر وصفحات التواصل بشكل مباشر وفوري.' : 'Changes will immediately update the live footer and contact channels.'}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-widest uppercase px-8 py-3.5 transition-all flex items-center space-x-2 rtl:space-x-reverse shadow-sm"
          >
            <Save className="w-4 h-4 text-gold" />
            <span>{t.settings.saveChanges}</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Luxury Modal */}
      <ConfirmModal
        isOpen={resetModalOpen}
        title={t.settings.resetTitle}
        message={t.settings.resetMessage}
        confirmLabel={t.settings.resetDefaults}
        cancelLabel={t.projects.cancel}
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setResetModalOpen(false)}
      />
    </div>
  );
}
