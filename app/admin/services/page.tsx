'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataStore } from '@/lib/store';
import { ServiceItem } from '@/lib/types';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import { useViwanModal } from '@/components/ui/ViwanModalProvider';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ViwanMark } from '@/components/ui/Icons';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Check,
  Briefcase,
  X,
  Image as ImageIcon
} from 'lucide-react';

const PRESET_SERVICE_IMAGES = [
  { label: 'Architecture', url: '/images/service-architecture.jpg' },
  { label: 'Interior Design', url: '/images/service-interior-design.jpg' },
  { label: 'Landscape', url: '/images/service-landscape-design.jpg' },
  { label: 'Urban Design', url: '/images/service-urban-design.jpg' },
  { label: 'Engineering', url: '/images/service-engineering.jpg' },
  { label: 'Project Mgmt', url: '/images/service-project-management.jpg' },
  { label: 'Finishing & Fit-Out', url: '/images/service-fitout-marble.jpg' },
  { label: 'Supervision', url: '/images/service-construction-supervision.jpg' },
];

export default function AdminServicesPage() {
  const { t, isRtl, locale } = useAdminLang();
  const { showSuccess, showError } = useViwanModal();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: ''
  });

  const [formData, setFormData] = useState<Partial<ServiceItem>>({
    code: '',
    num: '',
    slug: '',
    title_en: '',
    title_ar: '',
    desc_en: '',
    desc_ar: '',
    image: '/images/service-architecture.jpg',
    status: 'Active',
    display_order: 1
  });

  const loadServices = () => {
    const list = DataStore.getServices();
    list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    setServices([...list]);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    const nextOrder = services.length + 1;
    setFormData({
      id: `srv-${Date.now()}`,
      code: `SRV-${String(nextOrder).padStart(2, '0')}`,
      num: String(nextOrder).padStart(2, '0'),
      slug: `service-${nextOrder}`,
      title_en: '',
      title_ar: '',
      desc_en: '',
      desc_ar: '',
      image: '/images/service-architecture.jpg',
      status: 'Active',
      display_order: nextOrder
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: ServiceItem) => {
    setEditingService(srv);
    setFormData({ ...srv });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDelete = () => {
    if (deleteModal.id) {
      DataStore.deleteService(deleteModal.id);
      loadServices();
      setDeleteModal({ isOpen: false, id: '', title: '' });
      showSuccess(
        isRtl ? 'تم حذف الخدمة المعمارية بنجاح' : 'Service deleted successfully',
        isRtl ? 'حذف خدمة' : 'Delete Service'
      );
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_en) {
      showError(isRtl ? 'يرجى إدخال اسم الخدمة بالإنجليزي' : 'Please provide service title in English');
      return;
    }

    const orderNum = Number(formData.display_order) || 1;
    const srvToSave: ServiceItem = {
      id: formData.id || `srv-${Date.now()}`,
      code: formData.code || `SRV-${String(orderNum).padStart(2, '0')}`,
      num: formData.num || String(orderNum).padStart(2, '0'),
      slug: formData.slug || formData.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title_en: formData.title_en,
      title_ar: formData.title_ar || formData.title_en,
      desc_en: formData.desc_en || '',
      desc_ar: formData.desc_ar || '',
      image: formData.image || '/images/service-architecture.jpg',
      alt: formData.title_en,
      status: formData.status || 'Active',
      display_order: orderNum
    };

    DataStore.saveService(srvToSave);
    loadServices();
    setIsModalOpen(false);
    showSuccess(
      isRtl ? 'تم حفظ وتحديث الخدمة بنجاح' : 'Service saved successfully',
      isRtl ? 'تم الحفظ' : 'Saved'
    );
  };

  const filteredServices = services.filter((s) => {
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      s.title_en.toLowerCase().includes(query) ||
      s.title_ar.toLowerCase().includes(query) ||
      (s.code && s.code.toLowerCase().includes(query));
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* ========================================================================= */}
      {/* 1. HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E2D8]/70">
        <div>
          <h1 className="font-cinzel text-2xl text-charcoal uppercase tracking-wide font-medium">
            {t.services.title}
          </h1>
          <p className="text-xs text-stone-text font-light mt-0.5">
            {isRtl ? 'إدارة خطوات دورة البناء المعمارية والتخصصات الهندسية المتكاملة مع الموقع العام' : t.services.subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className={`w-4 h-4 text-stone-400 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحث عن خدمة أو كود...' : 'Search services or code...'}
              className={`w-full bg-white/90 backdrop-blur-sm border border-[#E7E2D8] focus:border-gold text-xs text-charcoal rounded-full ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 outline-none shadow-sm`}
            />
          </div>

          {/* Add Service Button */}
          <button
            onClick={handleOpenAdd}
            className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-wider uppercase px-6 py-2.5 rounded-full transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse shrink-0 group shadow-sm hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold group-hover:text-white" />
            <span>{isRtl ? 'إضافة خدمة جديدة' : 'Add New Service'}</span>
          </button>

          {/* Public Page Link */}
          <Link
            href="/services"
            target="_blank"
            className="hidden md:flex text-xs text-gold hover:underline items-center space-x-1 rtl:space-x-reverse font-medium shrink-0 px-2"
          >
            <span>{t.services.viewPublic}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SERVICES: LUXURY ROUNDED CARDS GRID (Matches Image 3 Aesthetic) */}
      {/* ========================================================================= */}
      {filteredServices.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md border border-[#E7E2D8] rounded-[28px] p-12 text-center text-xs text-stone-500 shadow-sm">
          {isRtl ? 'لا توجد خدمات مطابقة للبحث' : 'No services found'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((srv, idx) => (
            <div
              key={srv.id}
              className="bg-white/90 backdrop-blur-md rounded-[28px] border border-[#E7E2D8]/80 hover:border-gold/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Top Image Banner with Rounded Top Corners */}
                <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                  <img
                    src={srv.image || '/images/service-architecture.jpg'}
                    alt={srv.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/service-architecture.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-gold bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-gold/30">
                      {srv.code || `SRV-${String(srv.display_order || idx + 1).padStart(2, '0')}`}
                    </span>

                    <span
                      className={`text-[9px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full backdrop-blur-md border ${
                        srv.status === 'Active'
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                          : 'bg-stone-900/70 text-stone-300 border-stone-600/40'
                      }`}
                    >
                      {srv.status === 'Active' ? t.expertise.active : t.expertise.inactive}
                    </span>
                  </div>

                  {/* Order Tag Bottom on Image */}
                  <div className="absolute bottom-3 start-3">
                    <span className="text-[10px] font-mono font-medium text-white/90 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md">
                      #{String(srv.display_order || idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 space-y-2">
                  <h3 className="font-cinzel text-sm font-bold uppercase text-charcoal group-hover:text-gold transition-colors line-clamp-1">
                    {isRtl ? srv.title_ar : srv.title_en}
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {isRtl ? srv.title_en : srv.title_ar}
                  </p>
                  <p className="text-xs text-stone-text font-light leading-relaxed line-clamp-2 pt-1">
                    {isRtl ? srv.desc_ar : srv.desc_en}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-3 border-t border-[#E7E2D8]/70 flex items-center justify-between bg-stone-50/50">
                <span className="text-stone-400 font-mono text-[11px]">
                  {t.services.position} {String(srv.display_order || idx + 1).padStart(2, '0')}
                </span>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="p-2 rounded-full bg-white hover:bg-gold hover:text-white text-stone-600 border border-[#E7E2D8] transition-all shadow-xs cursor-pointer"
                    title={t.projects.edit}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id, isRtl ? srv.title_ar : srv.title_en)}
                    className="p-2 rounded-full bg-white hover:bg-rose-600 hover:text-white text-rose-600 border border-[#E7E2D8] transition-all shadow-xs cursor-pointer"
                    title={t.projects.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ADD / EDIT SERVICE MODAL (Pixel-Perfect Matching Image 1) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[99999] bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#181716]/95 backdrop-blur-2xl border border-white/20 rounded-[32px] p-7 sm:p-9 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-white overflow-hidden my-auto max-h-[90vh] overflow-y-auto custom-scrollbar transform animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle Viwan Watermark behind content */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.05]">
              <ViwanMark className="w-72 h-72 text-white" isDark={true} />
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 end-5 text-stone-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Centered Icon Header */}
            <div className="flex justify-center pt-1 relative z-10">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gold/10 border border-gold/30">
                <Briefcase className="w-8 h-8 text-gold" />
              </div>
            </div>

            {/* Modal Titles Centered */}
            <div className="space-y-1.5 text-center relative z-10">
              <h2 className="font-cinzel text-lg sm:text-xl font-bold tracking-wide text-white uppercase">
                {editingService
                  ? (isRtl ? 'تعديل التخصص والخدمة المعمارية' : 'Edit Architecture Service')
                  : (isRtl ? 'إضافة خدمة معمارية جديدة للموقع' : 'Add New Architecture Service')}
              </h2>
              <p className="text-xs text-stone-300 font-light max-w-md mx-auto">
                {isRtl ? 'تحديث ونشر الخدمات المعمارية لتظهر تلقائياً في صفحة الخدمات بالموقع العام.' : 'Configure services and image to reflect on public services page.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4 relative z-10">
              {/* Row 1: Code & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-semibold text-stone-300 block tracking-wider">
                    {isRtl ? 'كود الخدمة' : 'Service Code'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="SRV-ARCH"
                    className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 text-xs text-white font-mono outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-semibold text-stone-300 block tracking-wider">
                    {isRtl ? 'ترتيب الظهور' : 'Display Order'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.display_order || 1}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 text-xs text-white outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Row 2: Title EN */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-semibold text-stone-300 block tracking-wider">
                  {isRtl ? 'اسم الخدمة (بالإنجليزي)' : 'Service Title (EN)'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title_en || ''}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="Architecture Consultancy"
                  className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 text-xs text-white outline-none focus:border-gold"
                />
              </div>

              {/* Row 3: Title AR */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-semibold text-stone-300 block tracking-wider">
                  {isRtl ? 'اسم الخدمة (بالعربي)' : 'Service Title (AR)'}
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.title_ar || ''}
                  onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  placeholder="الاستشارات والتصميم المعماري"
                  className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 text-xs text-white outline-none focus:border-gold"
                />
              </div>

              {/* Row 4: Service Image URL & Presets */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                <label className="text-[10px] uppercase font-semibold text-gold block tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'صورة الخدمة المعمارية' : 'Service Image'}</span>
                </label>

                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/service-architecture.jpg"
                    className="flex-1 bg-white/5 border border-white/15 rounded-xl p-2.5 text-xs text-white outline-none focus:border-gold font-mono"
                  />
                  {formData.image && (
                    <div className="w-12 h-10 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-stone-800">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Quick Presets for luxury images */}
                <div className="pt-1">
                  <span className="text-[10px] text-stone-400 block mb-1.5">
                    {isRtl ? 'أو اختر صورة من مكتبة الموقع:' : 'Or choose from library presets:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_SERVICE_IMAGES.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className={`text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          formData.image === preset.url
                            ? 'bg-gold text-white border-gold'
                            : 'bg-white/5 text-stone-300 border-white/10 hover:border-gold/50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 5: Descriptions */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-semibold text-stone-300 block tracking-wider">
                  {isRtl ? 'الوصف المفصل (بالإنجليزي)' : 'Description (EN)'}
                </label>
                <textarea
                  rows={2}
                  value={formData.desc_en || ''}
                  onChange={(e) => setFormData({ ...formData, desc_en: e.target.value })}
                  placeholder="Full 9-step lifecycle design, authority approvals and tender support."
                  className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 text-xs text-white outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-semibold text-stone-300 block tracking-wider">
                  {isRtl ? 'الوصف المفصل (بالعربي)' : 'Description (AR)'}
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={formData.desc_ar || ''}
                  onChange={(e) => setFormData({ ...formData, desc_ar: e.target.value })}
                  placeholder="تصميم كامل يغطي الـ 9 مراحل المعمارية، تراخيص البناء واعتماد المخططات."
                  className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 text-xs text-white outline-none focus:border-gold resize-none"
                />
              </div>

              {/* Row 6: Status */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-semibold text-stone-300 block tracking-wider">
                  {isRtl ? 'حالة النشر' : 'Publish Status'}
                </label>
                <select
                  value={formData.status || 'Active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-[#1e1d1b] border border-white/15 rounded-2xl p-3 text-xs text-white outline-none focus:border-gold cursor-pointer"
                >
                  <option value="Active">{isRtl ? 'نشط (معروض بصفحة الخدمات بالموقع)' : 'Active (Visible on public site)'}</option>
                  <option value="Inactive">{isRtl ? 'غير نشط (معطل ومخفي)' : 'Inactive (Hidden)'}</option>
                </select>
              </div>

              {/* Action Buttons Centered (Pill rounded-full) */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 border border-white/20 bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white text-xs sm:text-sm font-medium tracking-wider rounded-full transition-all cursor-pointer min-w-[110px]"
                >
                  {t.projects.cancel}
                </button>
                <button
                  type="submit"
                  className="px-9 py-3 bg-gradient-to-r from-[#967448] to-[#b38e5d] hover:brightness-110 text-white text-xs sm:text-sm font-semibold tracking-wider rounded-full transition-all shadow-lg shadow-gold/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-w-[140px]"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingService ? (isRtl ? 'حفظ التعديلات' : 'Save Changes') : (isRtl ? 'حفظ ونشر الخدمة' : 'Save Service')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={isRtl ? 'حذف الخدمة' : 'Delete Service'}
        message={
          isRtl
            ? `هل أنت متأكد من رغبتك في حذف التخصص والخدمة المعمارية "${deleteModal.title}"؟`
            : `Are you sure you want to delete service "${deleteModal.title}"?`
        }
        confirmLabel={t.projects.delete}
        cancelLabel={t.projects.cancel}
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
      />
    </div>
  );
}
