'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import { useViwanModal } from '@/components/ui/ViwanModalProvider';
import { SiteImageItem, DEFAULT_SITE_IMAGES } from '@/lib/site-images';
import {
  Upload,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  Image as ImageIcon,
  Search,
  Filter,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminMediaPage() {
  const { isRtl } = useAdminLang();
  const { showConfirm, showNotification, showError } = useViwanModal();

  const [siteImages, setSiteImages] = useState<SiteImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewImage, setPreviewImage] = useState<SiteImageItem | null>(null);

  // Hidden file inputs per image
  const fileInputRef = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.siteImages) && data.siteImages.length > 0) {
          setSiteImages(data.siteImages);
        } else {
          setSiteImages(DEFAULT_SITE_IMAGES);
        }
      }
    } catch (err) {
      console.error('Failed to load site images:', err);
      setSiteImages(DEFAULT_SITE_IMAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const saveUpdatedImages = async (updatedList: SiteImageItem[], successMsg?: string) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteImages: updatedList }),
      });

      if (res.ok) {
        setSiteImages(updatedList);
        showNotification(
          successMsg || (isRtl ? 'تم تحديث الصورة وحفظها بنجاح' : 'Image updated and saved successfully'),
          isRtl ? 'إدارة الوسائط' : 'Media Management'
        );
      } else {
        throw new Error('Server returned error');
      }
    } catch (err) {
      console.error('Failed to save image:', err);
      showError(
        isRtl ? 'حدث خطأ أثناء حفظ الصورة في قاعدة البيانات' : 'Failed to save image update to database',
        isRtl ? 'خطأ في الحفظ' : 'Error'
      );
    }
  };

  const handleFileUpload = async (id: string, file: File) => {
    try {
      setUploadingId(id);
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const uploadData = await uploadRes.json();

      if (uploadData.url) {
        const updatedList = siteImages.map((img) =>
          img.id === id ? { ...img, currentUrl: uploadData.url } : img
        );
        await saveUpdatedImages(
          updatedList,
          isRtl ? `تم رفع صورة جديدة بنجاح (${uploadData.fileName})` : `New image uploaded successfully (${uploadData.fileName})`
        );
      }
    } catch (err) {
      console.error('Error during upload:', err);
      showError(
        isRtl ? 'فشل رفع الملف. تأكد من حجم ونوع الصورة.' : 'File upload failed. Check format and size.',
        isRtl ? 'خطأ' : 'Error'
      );
    } finally {
      setUploadingId(null);
    }
  };

  const handleResetToDefault = async (id: string) => {
    const defaultItem = DEFAULT_SITE_IMAGES.find((i) => i.id === id);
    if (!defaultItem) return;

    const confirmed = await showConfirm(
      isRtl
        ? `هل تريد استرجاع الصورة الافتراضية الأصلية لهذا العنصر؟\n(${defaultItem.labelAr || defaultItem.labelEn})`
        : `Reset this visual to its original default asset?\n(${defaultItem.labelEn})`,
      isRtl ? 'استعادة الصورة الأصلية' : 'Reset to Default'
    );
    if (!confirmed) return;

    const updatedList = siteImages.map((img) =>
      img.id === id ? { ...img, currentUrl: defaultItem.currentUrl } : img
    );
    await saveUpdatedImages(
      updatedList,
      isRtl ? 'تمت استعادة الصورة الافتراضية بنجاح' : 'Restored default image asset'
    );
  };

  const handleUrlEdit = (id: string, currentVal: string) => {
    const newUrl = prompt(
      isRtl ? 'أدخل الرابط المباشر الجديد للصورة (يبدأ بـ / أو https://):' : 'Enter direct image URL or path:',
      currentVal
    );

    if (newUrl && newUrl.trim() !== currentVal) {
      const updatedList = siteImages.map((img) =>
        img.id === id ? { ...img, currentUrl: newUrl.trim() } : img
      );
      saveUpdatedImages(updatedList);
    }
  };

  // Section categories
  const sections = [
    { id: 'all', labelEn: 'All Assets', labelAr: 'كافة الأصول والصور' },
    { id: 'Hero Banners', labelEn: '7 Pages Hero Banners', labelAr: 'هيدرز الصفحات السبع' },
    { id: 'The 8 Disciplines', labelEn: 'The 8 Disciplines', labelAr: 'التخصصات الثمانية' },
    { id: 'Featured Projects', labelEn: 'Featured Projects', labelAr: 'المشاريع المميزة' },
    { id: 'Architectural Materials', labelEn: 'Materiality Lab', labelAr: 'مختبر المواد والخامات' },
    { id: 'Studio & Careers', labelEn: 'Studio & Careers', labelAr: 'الاستوديو والوظائف' },
  ];

  const filteredImages = siteImages.filter((img) => {
    if (activeSection !== 'all' && img.section !== activeSection) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      img.id.toLowerCase().includes(query) ||
      img.labelEn.toLowerCase().includes(query) ||
      (img.labelAr && img.labelAr.toLowerCase().includes(query)) ||
      (img.location && img.location.toLowerCase().includes(query)) ||
      (img.description && img.description.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D8] pb-6">
        <div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <h1 className="font-cinzel text-2xl font-normal text-charcoal tracking-wide uppercase">
              {isRtl ? 'إدارة صور وهيدرز الموقع' : 'SITE IMAGES & MEDIA HUB'}
            </h1>
            <span className="bg-charcoal text-gold text-[11px] font-mono px-2.5 py-0.5 tracking-wider">
              {siteImages.length} {isRtl ? 'صورة' : 'ASSETS'}
            </span>
          </div>
          <p className="text-xs text-stone-600 font-light mt-1 max-w-3xl">
            {isRtl
              ? 'التحكم المركزي في كافة صور الهيدر للصفحات السبع (الرئيسية، المشاريع، الخدمات، الاستوديو، منهجية العمل، الوظائف، التواصل) وصور التخصصات المعمارية والمواد، دون الحاجة لتعديل أي كود.'
              : 'Centralized visual control for all 7 public page heroes (Home, Projects, Services, Studio, How We Work, Careers, Contact) plus discipline & material showcases without code changes.'}
          </p>
        </div>

        <button
          onClick={fetchImages}
          className="inline-flex items-center space-x-2 rtl:space-x-reverse border border-[#E7E2D8] bg-white hover:border-gold px-4 py-2 text-xs text-charcoal transition-colors self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gold ${loading ? 'animate-spin' : ''}`} />
          <span>{isRtl ? 'تحديث الوسائط' : 'REFRESH ASSETS'}</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Sections */}
        <div className="flex flex-wrap items-center gap-1.5">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3.5 py-2 text-xs tracking-wider uppercase font-medium transition-colors ${
                activeSection === sec.id
                  ? 'bg-charcoal text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-[#E7E2D8] hover:border-gold'
              }`}
            >
              {isRtl ? sec.labelAr : sec.labelEn}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'بحث في أسماء الصور والأقسام...' : 'Search visuals by title or page...'}
            className="w-full bg-white border border-[#E7E2D8] pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 text-xs text-charcoal focus:outline-none focus:border-gold shadow-xs"
          />
        </div>
      </div>

      {/* Grid of Images */}
      {loading ? (
        <div className="py-24 text-center text-xs text-stone-500 font-cinzel tracking-widest uppercase">
          {isRtl ? 'جاري تحميل أصول الصور من قاعدة البيانات...' : 'LOADING VISUAL ASSETS FROM DATABASE...'}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#E7E2D8] p-8">
          <ImageIcon className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <p className="font-cinzel text-sm text-charcoal uppercase">
            {isRtl ? 'لا توجد أصول مطابقة للبحث' : 'NO MATCHING ASSETS FOUND'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredImages.map((img) => {
            const isUploading = uploadingId === img.id;
            const defaultItem = DEFAULT_SITE_IMAGES.find((i) => i.id === img.id);
            const isModified = defaultItem && defaultItem.currentUrl !== img.currentUrl;

            return (
              <div
                key={img.id}
                className="bg-white border border-[#E7E2D8] overflow-hidden flex flex-col justify-between shadow-sm hover:border-gold/60 transition-colors group"
              >
                {/* Top Image Preview Box */}
                <div className="relative aspect-[16/10] bg-stone-900 overflow-hidden border-b border-[#E7E2D8]">
                  <img
                    src={img.currentUrl}
                    alt={img.labelEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback if local upload image was deleted
                      (e.target as HTMLImageElement).src = defaultItem?.currentUrl || '/images/hero-villa.png';
                    }}
                  />

                  {/* Section Badge */}
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1.5 z-10">
                    <span className="bg-charcoal/85 backdrop-blur-xs text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border border-white/10">
                      {img.section}
                    </span>
                    {isModified && (
                      <span className="bg-amber-600/90 text-white text-[9px] font-mono uppercase tracking-wider px-2 py-0.5">
                        {isRtl ? 'مخصصة' : 'CUSTOM'}
                      </span>
                    )}
                  </div>

                  {/* Quick Zoom / Preview Overlay Button */}
                  <button
                    onClick={() => setPreviewImage(img)}
                    className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 bg-white/90 hover:bg-white text-charcoal p-2 shadow-md transition-colors opacity-0 group-hover:opacity-100 z-10"
                    title={isRtl ? 'معاينة بحجم كامل' : 'View full preview'}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Uploading Spinner */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-charcoal/80 flex flex-col items-center justify-center text-gold z-20 space-y-2">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <span className="text-[11px] font-mono tracking-widest uppercase">
                        {isRtl ? 'جاري الرفع والحفظ...' : 'UPLOADING ASSET...'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content & Metadata */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-cinzel text-sm font-semibold text-charcoal leading-snug">
                        {isRtl ? img.labelAr || img.labelEn : img.labelEn}
                      </h3>
                      <span className="text-[10px] font-mono text-stone-400 shrink-0">
                        {img.aspectRatio || '16:9'}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 font-light line-clamp-2 leading-relaxed">
                      {isRtl ? img.descriptionAr || img.description : img.description}
                    </p>

                    <div className="text-[11px] text-stone-400 font-mono truncate pt-1" title={img.currentUrl}>
                      <span className="text-stone-500 font-semibold">{isRtl ? 'المسار:' : 'Path:'} </span>
                      {img.currentUrl}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-[#F3EDE3] flex items-center justify-between gap-2">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => {
                        fileInputRef.current[img.id] = el;
                      }}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(img.id, file);
                      }}
                    />

                    {/* Upload New Image Button */}
                    <button
                      onClick={() => fileInputRef.current[img.id]?.click()}
                      disabled={isUploading}
                      className="flex-1 bg-charcoal hover:bg-gold text-white px-3 py-2 text-xs font-medium tracking-wider uppercase flex items-center justify-center space-x-1.5 rtl:space-x-reverse transition-colors shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-gold group-hover:text-white" />
                      <span>{isRtl ? 'رفع صورة جديدة' : 'REPLACE IMAGE'}</span>
                    </button>

                    {/* Direct URL button */}
                    <button
                      onClick={() => handleUrlEdit(img.id, img.currentUrl)}
                      className="border border-[#E7E2D8] hover:border-gold px-2.5 py-2 text-xs text-stone-600 hover:text-charcoal bg-white transition-colors"
                      title={isRtl ? 'إدخال مسار رابط مباشر' : 'Enter direct URL'}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    {/* Reset to Default */}
                    {isModified && (
                      <button
                        onClick={() => handleResetToDefault(img.id)}
                        className="border border-[#E7E2D8] hover:border-red-400 px-2.5 py-2 text-xs text-stone-500 hover:text-red-600 bg-white transition-colors"
                        title={isRtl ? 'استعادة الصورة الافتراضية' : 'Reset to default asset'}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Preview Modal */}
      {previewImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[99999] flex items-center justify-center p-4 sm:p-8"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-[#181716]/95 backdrop-blur-2xl border border-white/20 rounded-[32px] max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.6)] animate-fade-in my-auto text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/20">
              <div>
                <span className="text-[10px] font-mono text-gold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-gold/10 inline-block mb-1">
                  {previewImage.section} • {previewImage.id}
                </span>
                <h3 className="font-cinzel text-base text-white font-medium">
                  {isRtl ? previewImage.labelAr || previewImage.labelEn : previewImage.labelEn}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-stone-400 hover:text-white px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isRtl ? 'إغلاق ✕' : 'CLOSE ✕'}
              </button>
            </div>

            {/* Modal Image View */}
            <div className="relative flex-1 min-h-[50vh] max-h-[70vh] bg-black/40 flex items-center justify-center p-4 overflow-hidden">
              <img
                src={previewImage.currentUrl}
                alt={previewImage.labelEn}
                className="max-h-[65vh] w-auto max-w-full object-contain mx-auto rounded-xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-black/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <p className="text-stone-300 font-light">
                {isRtl ? previewImage.descriptionAr || previewImage.description : previewImage.description}
              </p>

              <button
                type="button"
                onClick={() => {
                  fileInputRef.current[previewImage.id]?.click();
                  setPreviewImage(null);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#967448] to-[#b38e5d] hover:brightness-110 text-white font-semibold tracking-wider uppercase rounded-full transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
              >
                {isRtl ? 'استبدال هذه الصورة' : 'CHANGE THIS IMAGE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
