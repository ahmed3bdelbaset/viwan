'use client';

import React, { useState, useEffect } from 'react';
import { DataStore } from '@/lib/store';
import { CompanyInfo, ContactPhone, ContactEmail, StudioLocation } from '@/lib/types';
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
  ShieldCheck,
  MapPin
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [info, setInfo] = useState<CompanyInfo | null>(null);
  const [saved, setSaved] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const { t, isRtl } = useAdminLang();
  const { showSuccess, showError, showConfirm } = useViwanModal();

  useEffect(() => {
    // Start with cached or initial data
    const initial = DataStore.getCompanyInfo();
    setInfo(initial);

    // Sync from persistent server database
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.companyInfo) {
          setInfo(json.companyInfo);
          localStorage.setItem('viwan_company_info', JSON.stringify(json.companyInfo));
        }
      })
      .catch(() => {});
  }, []);

  if (!info) return null;

  const handleSaveSection = async (sectionTitle?: string) => {
    if (!info) return;

    // Synchronize cairo_studio & riyadh_studio with studios list
    const updatedInfo: CompanyInfo = { ...info };
    if (updatedInfo.studios && updatedInfo.studios.length > 0) {
      const cairo =
        updatedInfo.studios.find(
          (s) =>
            s.id === 'studio-cairo' ||
            s.title_en?.toLowerCase().includes('cairo') ||
            s.title_ar?.includes('القاهرة')
        ) || updatedInfo.studios[0];

      const riyadh =
        updatedInfo.studios.find(
          (s) =>
            s.id === 'studio-riyadh' ||
            s.title_en?.toLowerCase().includes('riyadh') ||
            s.title_ar?.includes('الرياض')
        ) || (updatedInfo.studios.length > 1 ? updatedInfo.studios[1] : updatedInfo.studios[0]);

      if (cairo) {
        updatedInfo.cairo_studio = {
          ...updatedInfo.cairo_studio,
          title_en: cairo.title_en,
          title_ar: cairo.title_ar,
          address_en: cairo.address_en,
          address_ar: cairo.address_ar,
          phone: cairo.phone || updatedInfo.cairo_studio?.phone || '',
          email: cairo.email || updatedInfo.cairo_studio?.email || '',
        };
      }

      if (riyadh) {
        updatedInfo.riyadh_studio = {
          ...updatedInfo.riyadh_studio,
          title_en: riyadh.title_en,
          title_ar: riyadh.title_ar,
          address_en: riyadh.address_en,
          address_ar: riyadh.address_ar,
          phone: riyadh.phone || updatedInfo.riyadh_studio?.phone || '',
          email: riyadh.email || updatedInfo.riyadh_studio?.email || '',
        };
      }
    }

    DataStore.saveCompanyInfo(updatedInfo);
    setInfo(updatedInfo);

    const generalEmail =
      updatedInfo.emails?.find(
        (e) => e.label_en.toLowerCase().includes('general') || e.label_ar.includes('عام')
      )?.email ||
      updatedInfo.emails?.[0]?.email ||
      'info@viwan.net';

    const consultEmail =
      updatedInfo.emails?.find(
        (e) => e.label_en.toLowerCase().includes('consult') || e.label_ar.includes('استشار')
      )?.email ||
      updatedInfo.emails?.[1]?.email ||
      generalEmail;

    const careersEmail =
      updatedInfo.emails?.find(
        (e) => e.label_en.toLowerCase().includes('career') || e.label_ar.includes('توظيف')
      )?.email ||
      updatedInfo.emails?.[2]?.email ||
      generalEmail;

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyInfo: updatedInfo,
          settings: {
            phone: updatedInfo.phones?.[0]?.number || '+20 100 000 0000',
            phoneCairo:
              updatedInfo.phones?.find(
                (p) => p.label_en.toLowerCase().includes('cairo') || p.label_ar.includes('القاهرة')
              )?.number || updatedInfo.phones?.[0]?.number,
            phoneRiyadh:
              updatedInfo.phones?.find(
                (p) => p.label_en.toLowerCase().includes('riyadh') || p.label_ar.includes('الرياض')
              )?.number || updatedInfo.phones?.[1]?.number,
            whatsapp:
              updatedInfo.social?.whatsapp ||
              updatedInfo.phones?.find((p) => p.is_whatsapp)?.number ||
              '+20 100 000 0000',
            email: generalEmail,
            emailGeneral: generalEmail,
            emailConsultations: consultEmail,
            emailCareers: careersEmail,
            linkedin: updatedInfo.social?.linkedin || '',
            instagram: updatedInfo.social?.instagram || '',
            facebook: updatedInfo.social?.facebook || '',
            youtube: updatedInfo.social?.youtube || '',
            behance: updatedInfo.social?.behance || '',
            footerSummaryEn: updatedInfo.footer_summary_en || '',
            footerSummaryAr: updatedInfo.footer_summary_ar || '',
            addressCairo:
              updatedInfo.cairo_studio?.address_ar || updatedInfo.cairo_studio?.address_en || '',
            addressRiyadh:
              updatedInfo.riyadh_studio?.address_ar || updatedInfo.riyadh_studio?.address_en || '',
          },
        }),
      });

      showSuccess(
        isRtl
          ? `تم حفظ ${sectionTitle || 'البيانات'} وتحديث الفوتر والموقع مباشرة بنجاح`
          : `${sectionTitle || 'Settings'} saved and live website/footer updated successfully!`
      );
    } catch (err) {
      console.error('Failed to sync settings:', err);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSaveSection(isRtl ? 'كافة الإعدادات' : 'All Settings');
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

  // Studio Handlers
  const handleAddStudio = () => {
    const currentStudios: StudioLocation[] =
      info.studios && info.studios.length > 0
        ? [...info.studios]
        : [
            {
              id: 'studio-cairo',
              title_en: info.cairo_studio?.title_en || 'Cairo Main Studio',
              title_ar: info.cairo_studio?.title_ar || 'استوديو القاهرة الرئيسي',
              address_en: info.cairo_studio?.address_en || '12 Design District, Zamalek, Cairo, Egypt',
              address_ar: info.cairo_studio?.address_ar || '12 حي التصميم، الزمالك، القاهرة، مصر',
              phone: info.cairo_studio?.phone || '+20 12 3456 7890',
              email: info.cairo_studio?.email || 'studio@viwan.com',
            },
            {
              id: 'studio-riyadh',
              title_en: info.riyadh_studio?.title_en || 'Riyadh Studio',
              title_ar: info.riyadh_studio?.title_ar || 'استوديو الرياض',
              address_en: info.riyadh_studio?.address_en || 'King Abdullah Financial District (KAFD), Riyadh, Saudi Arabia',
              address_ar: info.riyadh_studio?.address_ar || 'مركز الملك عبد الله المالي (KAFD)، الرياض، المملكة العربية السعودية',
              phone: info.riyadh_studio?.phone || '+966 11 234 5678',
              email: info.riyadh_studio?.email || 'riyadh@viwan.com',
            },
          ];

    const newStudio: StudioLocation = {
      id: `studio-${Date.now()}`,
      title_en: 'New Studio Branch',
      title_ar: 'مقر استوديو جديد',
      address_en: '',
      address_ar: '',
      phone: '',
      email: '',
    };

    setInfo({
      ...info,
      studios: [...currentStudios, newStudio],
    });
  };

  const handleUpdateStudio = (id: string, field: keyof StudioLocation, val: any) => {
    const currentStudios: StudioLocation[] =
      info.studios && info.studios.length > 0
        ? [...info.studios]
        : [
            {
              id: 'studio-cairo',
              title_en: info.cairo_studio?.title_en || 'Cairo Main Studio',
              title_ar: info.cairo_studio?.title_ar || 'استوديو القاهرة الرئيسي',
              address_en: info.cairo_studio?.address_en || '',
              address_ar: info.cairo_studio?.address_ar || '',
              phone: info.cairo_studio?.phone || '',
              email: info.cairo_studio?.email || '',
            },
            {
              id: 'studio-riyadh',
              title_en: info.riyadh_studio?.title_en || 'Riyadh Studio',
              title_ar: info.riyadh_studio?.title_ar || 'استوديو الرياض',
              address_en: info.riyadh_studio?.address_en || '',
              address_ar: info.riyadh_studio?.address_ar || '',
              phone: info.riyadh_studio?.phone || '',
              email: info.riyadh_studio?.email || '',
            },
          ];

    setInfo({
      ...info,
      studios: currentStudios.map((s) => (s.id === id ? { ...s, [field]: val } : s)),
    });
  };

  const handleDeleteStudio = (id: string) => {
    const currentStudios = info.studios || [];
    if (currentStudios.length <= 1) {
      showError(
        isRtl ? 'يجب الإبقاء على مقر استوديو رئيسي واحد على الأقل' : 'At least one studio location must remain'
      );
      return;
    }
    setInfo({
      ...info,
      studios: currentStudios.filter((s) => s.id !== id),
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

          {/* Section 1 Save Button */}
          <div className="pt-4 border-t border-[#E7E2D8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-stone-500 font-light">
              {isRtl ? 'حفظ وتحديث قنوات وروابط التواصل الاجتماعي مباشرة دون الحاجة للنزول لآخر الصفحة' : 'Save social channels directly without scrolling to page bottom'}
            </span>
            <button
              type="button"
              onClick={() => handleSaveSection(isRtl ? 'قنوات التواصل الاجتماعي' : 'Social Channels')}
              className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-wider uppercase px-5 py-2.5 transition-all flex items-center space-x-2 rtl:space-x-reverse shadow-xs cursor-pointer active:scale-98"
            >
              <Save className="w-3.5 h-3.5 text-gold" />
              <span>{isRtl ? 'حفظ قنوات التواصل' : 'Save Social Channels'}</span>
            </button>
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

          {/* Section 2 Save Button */}
          <div className="pt-4 border-t border-[#E7E2D8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-stone-500 font-light">
              {isRtl ? 'حفظ وتحديث أرقام هواتف الاستوديو والواتساب مباشرة في الفوتر والموقع' : 'Save studio phone numbers and WhatsApp directly to live site'}
            </span>
            <button
              type="button"
              onClick={() => handleSaveSection(isRtl ? 'أرقام الهواتف والتواصل' : 'Phone Numbers')}
              className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-wider uppercase px-5 py-2.5 transition-all flex items-center space-x-2 rtl:space-x-reverse shadow-xs cursor-pointer active:scale-98"
            >
              <Save className="w-3.5 h-3.5 text-gold" />
              <span>{isRtl ? 'حفظ أرقام الهواتف' : 'Save Phone Numbers'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MULTIPLE EMAIL INQUIRY ADDRESSES */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#E7E2D8] p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-4">
            <button
              type="button"
              onClick={handleAddEmail}
              className="bg-charcoal hover:bg-gold text-white text-[11px] font-semibold tracking-wider uppercase px-4 py-2 transition-all flex items-center space-x-1.5 rtl:space-x-reverse shadow-sm shrink-0"
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

          {/* Section 3 Save Button */}
          <div className="pt-4 border-t border-[#E7E2D8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-stone-500 font-light">
              {isRtl ? 'حفظ وتحديث عناوين البريد الإلكتروني الرسمية للاستوديو مباشرة' : 'Save official email addresses directly to live site'}
            </span>
            <button
              type="button"
              onClick={() => handleSaveSection(isRtl ? 'عناوين البريد الإلكتروني' : 'Email Addresses')}
              className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-wider uppercase px-5 py-2.5 transition-all flex items-center space-x-2 rtl:space-x-reverse shadow-xs cursor-pointer active:scale-98"
            >
              <Save className="w-3.5 h-3.5 text-gold" />
              <span>{isRtl ? 'حفظ عناوين البريد' : 'Save Email Addresses'}</span>
            </button>
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

          {/* Section 4 Save Button */}
          <div className="pt-4 border-t border-[#E7E2D8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-stone-500 font-light">
              {isRtl ? 'حفظ وتحديث نبذة وهوية الفوتر بالعربية والإنجليزية مباشرة في الموقع' : 'Save footer bio and studio summary directly to live site'}
            </span>
            <button
              type="button"
              onClick={() => handleSaveSection(isRtl ? 'نبذة الفوتر والتعريف' : 'Footer Bio')}
              className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-wider uppercase px-5 py-2.5 transition-all flex items-center space-x-2 rtl:space-x-reverse shadow-xs cursor-pointer active:scale-98"
            >
              <Save className="w-3.5 h-3.5 text-gold" />
              <span>{isRtl ? 'حفظ نبذة الفوتر' : 'Save Footer Bio'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. STUDIO HEADQUARTERS & ADDRESSES (DYNAMIC MULTI-BRANCH) */}
        {/* ========================================================================= */}
        <div className="bg-white p-7 border border-[#E7E2D8] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E7E2D8]">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-[#FAF6EE] border border-[#E7E2D8] flex items-center justify-center text-charcoal">
                <Building className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h2 className="font-cinzel text-sm font-semibold uppercase text-charcoal">
                  {t.settings.studiosTitle}
                </h2>
                <p className="text-[11px] text-stone-text font-light">
                  {isRtl ? 'إدارة مقرات ومكاتب الاستوديو الحالية وإضافة مقرات وعناوين جديدة ديناميكياً' : 'Manage existing and new studio branches and locations dynamically'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddStudio}
              className="bg-charcoal hover:bg-gold text-white text-[11px] font-semibold tracking-wider uppercase px-4 py-2 transition-all flex items-center space-x-1.5 rtl:space-x-reverse shadow-sm shrink-0 cursor-pointer active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة مقر استوديو جديد' : 'Add New Studio'}</span>
            </button>
          </div>

          <div className="space-y-5">
            {((info.studios && info.studios.length > 0)
              ? info.studios
              : [
                  {
                    id: 'studio-cairo',
                    title_en: info.cairo_studio?.title_en || 'Cairo Main Studio',
                    title_ar: info.cairo_studio?.title_ar || 'استوديو القاهرة الرئيسي',
                    address_en: info.cairo_studio?.address_en || '12 Design District, Zamalek, Cairo, Egypt',
                    address_ar: info.cairo_studio?.address_ar || '12 حي التصميم، الزمالك، القاهرة، مصر',
                    phone: info.cairo_studio?.phone || '+20 12 3456 7890',
                    email: info.cairo_studio?.email || 'studio@viwan.com',
                  },
                  {
                    id: 'studio-riyadh',
                    title_en: info.riyadh_studio?.title_en || 'Riyadh Studio',
                    title_ar: info.riyadh_studio?.title_ar || 'استوديو الرياض',
                    address_en: info.riyadh_studio?.address_en || 'King Abdullah Financial District (KAFD), Riyadh, Saudi Arabia',
                    address_ar: info.riyadh_studio?.address_ar || 'مركز الملك عبد الله المالي (KAFD)، الرياض، المملكة العربية السعودية',
                    phone: info.riyadh_studio?.phone || '+966 11 234 5678',
                    email: info.riyadh_studio?.email || 'riyadh@viwan.com',
                  },
                ]
            ).map((studio, idx) => (
              <div key={studio.id || idx} className="p-5 bg-[#FAF6EE]/40 border border-[#E7E2D8] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E2D8]/60">
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                    <MapPin className="w-4 h-4 text-gold shrink-0" />
                    <span className="font-cinzel text-xs font-semibold text-charcoal uppercase">
                      {isRtl
                        ? (studio.title_ar || `مقر استوديو #${idx + 1}`)
                        : (studio.title_en || `Studio Branch #${idx + 1}`)}
                    </span>
                  </div>

                  {(info.studios || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteStudio(studio.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                      title={isRtl ? 'حذف هذا المقر' : 'Delete this studio'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Studio Names (EN & AR) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-stone-500 font-semibold">
                      {isRtl ? 'اسم المقر (بالإنجليزية)' : 'Studio Name (EN)'}
                    </label>
                    <input
                      type="text"
                      value={studio.title_en || ''}
                      onChange={(e) => handleUpdateStudio(studio.id, 'title_en', e.target.value)}
                      placeholder="e.g. Cairo Main Studio"
                      className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-stone-500 font-semibold">
                      {isRtl ? 'اسم المقر (بالعربية)' : 'Studio Name (AR)'}
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={studio.title_ar || ''}
                      onChange={(e) => handleUpdateStudio(studio.id, 'title_ar', e.target.value)}
                      placeholder="مثال: استوديو القاهرة الرئيسي"
                      className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Studio Addresses (EN & AR) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-stone-500 font-semibold">
                      {t.settings.addressEn}
                    </label>
                    <input
                      type="text"
                      value={studio.address_en || ''}
                      onChange={(e) => handleUpdateStudio(studio.id, 'address_en', e.target.value)}
                      placeholder="e.g. 12 Design District, Zamalek, Cairo, Egypt"
                      className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-stone-500 font-semibold">
                      {t.settings.addressAr}
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={studio.address_ar || ''}
                      onChange={(e) => handleUpdateStudio(studio.id, 'address_ar', e.target.value)}
                      placeholder="مثال: 12 حي التصميم، الزمالك، القاهرة، مصر"
                      className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Direct Phone & Email for Branch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-stone-500 font-semibold">
                      {isRtl ? 'الهاتف المباشر للمقر (اختياري)' : 'Branch Direct Phone (Optional)'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={studio.phone || ''}
                      onChange={(e) => handleUpdateStudio(studio.id, 'phone', e.target.value)}
                      placeholder="+20 12 3456 7890"
                      className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal font-mono outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-stone-500 font-semibold">
                      {isRtl ? 'البريد الإلكتروني للمقر (اختياري)' : 'Branch Direct Email (Optional)'}
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      value={studio.email || ''}
                      onChange={(e) => handleUpdateStudio(studio.id, 'email', e.target.value)}
                      placeholder="studio@viwan.com"
                      className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal font-mono outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 5 Save Button */}
          <div className="pt-4 border-t border-[#E7E2D8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-stone-500 font-light">
              {isRtl ? 'حفظ وتحديث كافة مقرات الاستوديو وعناوين المكاتب الحالية والجديدة' : 'Save all studio headquarters and branch locations'}
            </span>
            <button
              type="button"
              onClick={() => handleSaveSection(isRtl ? 'مقرات الاستوديو والعناوين' : 'Studio Locations')}
              className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-wider uppercase px-5 py-2.5 transition-all flex items-center space-x-2 rtl:space-x-reverse shadow-xs cursor-pointer active:scale-98"
            >
              <Save className="w-3.5 h-3.5 text-gold" />
              <span>{isRtl ? 'حفظ مقرات الاستوديو' : 'Save Studio Locations'}</span>
            </button>
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
