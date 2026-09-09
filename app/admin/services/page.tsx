'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataStore } from '@/lib/store';
import { ServiceItem } from '@/lib/types';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import { useViwanModal } from '@/components/ui/ViwanModalProvider';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Check,
  Layers,
  Sparkles,
  X
} from 'lucide-react';

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
    title_en: '',
    title_ar: '',
    desc_en: '',
    desc_ar: '',
    status: 'Active',
    display_order: 1
  });

  const loadServices = () => {
    setServices(DataStore.getServices());
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      id: `srv-${Date.now()}`,
      code: `SRV-${String(services.length + 1).padStart(2, '0')}`,
      title_en: '',
      title_ar: '',
      desc_en: '',
      desc_ar: '',
      status: 'Active',
      display_order: services.length + 1
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
        isRtl ? 'تم حذف التخصص الهندسي بنجاح' : 'Service deleted successfully',
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

    const srvToSave: ServiceItem = {
      id: formData.id || `srv-${Date.now()}`,
      code: formData.code || 'SRV-NEW',
      title_en: formData.title_en,
      title_ar: formData.title_ar || formData.title_en,
      desc_en: formData.desc_en || '',
      desc_ar: formData.desc_ar || '',
      status: formData.status || 'Active',
      display_order: Number(formData.display_order) || 1
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
      s.code.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* ========================================================================= */}
      {/* 1. HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E2D8]">
        <div>
          <h1 className="font-cinzel text-2xl text-charcoal uppercase tracking-wide">
            {t.services.title}
          </h1>
          <p className="text-xs text-stone-text font-light mt-0.5">
            {t.services.subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className={`w-4 h-4 text-stone-400 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحث عن تخصص أو كود...' : 'Search services or code...'}
              className={`w-full bg-white border border-[#E7E2D8] focus:border-gold text-xs text-charcoal ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 outline-none`}
            />
          </div>

          {/* Add Service Button */}
          <button
            onClick={handleOpenAdd}
            className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse shrink-0 group shadow-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 text-gold group-hover:text-white" />
            <span>{isRtl ? 'إضافة خدمة جديدة' : 'Add New Service'}</span>
          </button>

          {/* Public Page Link */}
          <Link
            href="/services"
            target="_blank"
            className="hidden md:flex text-xs text-gold hover:underline items-center space-x-1 rtl:space-x-reverse font-medium shrink-0"
          >
            <span>{t.services.viewPublic}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SERVICES: MOBILE CARDS LAYOUT (Full Screen, Zero Horizontal Scroll) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredServices.length === 0 ? (
          <div className="bg-white border border-[#E7E2D8] p-8 text-center text-xs text-stone-500">
            {isRtl ? 'لا توجد خدمات مطابقة للبحث' : 'No services found'}
          </div>
        ) : (
          filteredServices.map((srv, idx) => (
            <div
              key={srv.id}
              className="bg-white border border-[#E7E2D8] p-4 space-y-3.5 shadow-sm hover:border-gold/60 transition-colors"
            >
              {/* Top Row: Code + Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-[10px] font-mono font-semibold text-gold bg-gold/10 px-2 py-0.5 border border-gold/30">
                    {srv.code}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    #{srv.display_order || idx + 1}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 border ${
                    srv.status === 'Active'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-stone-100 text-stone-500 border-stone-300'
                  }`}
                >
                  {srv.status === 'Active' ? t.expertise.active : t.expertise.inactive}
                </span>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h3 className="font-cinzel text-xs font-bold text-charcoal uppercase">
                  {isRtl ? srv.title_ar : srv.title_en}
                </h3>
                <p className="text-[11px] text-stone-text font-light leading-relaxed">
                  {isRtl ? srv.desc_ar : srv.desc_en}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-[#E7E2D8]/60 flex items-center justify-end space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => handleOpenEdit(srv)}
                  className="p-2 bg-[#FAF6EE] hover:bg-gold hover:text-white text-charcoal border border-[#E7E2D8] transition-colors"
                  title={t.projects.edit}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(srv.id, isRtl ? srv.title_ar : srv.title_en)}
                  className="p-2 bg-[#FAF6EE] hover:bg-red-600 hover:text-white text-red-600 border border-[#E7E2D8] transition-colors"
                  title={t.projects.delete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. SERVICES: DESKTOP GRID LAYOUT (Hidden on Mobile) */}
      {/* ========================================================================= */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv, idx) => (
          <div
            key={srv.id}
            className="bg-white p-6 border border-[#E7E2D8] space-y-4 shadow-sm flex flex-col justify-between hover:border-gold/60 transition-colors group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-gold bg-gold/10 px-2.5 py-0.5 border border-gold/30">
                  {srv.code}
                </span>
                <span
                  className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 border ${
                    srv.status === 'Active'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-stone-100 text-stone-500 border-stone-300'
                  }`}
                >
                  {srv.status === 'Active' ? t.expertise.active : t.expertise.inactive}
                </span>
              </div>
              <h3 className="font-cinzel text-sm font-semibold uppercase text-charcoal group-hover:text-gold transition-colors">
                {isRtl ? srv.title_ar : srv.title_en}
              </h3>
              <p className="text-xs text-stone-text font-light leading-relaxed">
                {isRtl ? srv.desc_ar : srv.desc_en}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E7E2D8] flex items-center justify-between text-xs">
              <span className="text-stone-400 font-mono text-[11px]">
                {t.services.position} {String(srv.display_order || idx + 1).padStart(2, '0')}
              </span>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => handleOpenEdit(srv)}
                  className="p-1.5 text-stone-400 hover:text-gold transition-colors"
                  title={t.projects.edit}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(srv.id, isRtl ? srv.title_ar : srv.title_en)}
                  className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                  title={t.projects.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 3. ADD / EDIT SERVICE LUXURY MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#FAF7F2]/95 dark:bg-[#161513]/95 backdrop-blur-2xl border border-white/70 dark:border-stone-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] max-w-2xl w-full my-auto max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative rounded-[28px] sm:rounded-[36px] custom-scrollbar animate-fade-in">
            <div className="flex items-start justify-between border-b border-[#E7E2D8]/80 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold px-2.5 py-0.5 rounded-full bg-gold/10 inline-block mb-1">
                  {editingService ? (isRtl ? 'تعديل التخصص' : 'EDIT SERVICE') : (isRtl ? 'خدمة جديدة' : 'NEW SERVICE')}
                </span>
                <h2 className="font-cinzel text-xl text-charcoal dark:text-ivory font-medium">
                  {editingService
                    ? (isRtl ? 'تعديل التخصص والخدمة' : 'Edit Architecture Service')
                    : (isRtl ? 'إضافة خدمة معمارية جديدة' : 'Add New Architecture Service')}
                </h2>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  {isRtl ? 'تحديث ونشر الخدمات المعمارية والهندسية المتكاملة.' : 'Configure discipline codes and bilingual descriptions.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-stone-400 hover:text-charcoal dark:hover:text-ivory hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-charcoal block">
                    {isRtl ? 'كود الخدمة' : 'Service Code'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="SRV-ARCH"
                    className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal font-mono outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-charcoal block">
                    {isRtl ? 'ترتيب الظهور' : 'Display Order'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.display_order || 1}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-charcoal block">
                  {isRtl ? 'اسم الخدمة (بالإنجليزي)' : 'Service Title (EN)'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title_en || ''}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="Architecture Consultancy"
                  className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-charcoal block">
                  {isRtl ? 'اسم الخدمة (بالعربي)' : 'Service Title (AR)'}
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.title_ar || ''}
                  onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  placeholder="الاستشارات والتصميم المعماري"
                  className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-charcoal block">
                  {isRtl ? 'الوصف المختصر (بالإنجليزي)' : 'Description (EN)'}
                </label>
                <textarea
                  rows={2}
                  value={formData.desc_en || ''}
                  onChange={(e) => setFormData({ ...formData, desc_en: e.target.value })}
                  placeholder="Full 9-step lifecycle design, authority approvals and tender support."
                  className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-charcoal block">
                  {isRtl ? 'الوصف المختصر (بالعربي)' : 'Description (AR)'}
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={formData.desc_ar || ''}
                  onChange={(e) => setFormData({ ...formData, desc_ar: e.target.value })}
                  placeholder="تصميم كامل يغطي الـ 9 مراحل المعمارية، تراخيص البناء واعتماد المخططات."
                  className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-charcoal block">
                  {isRtl ? 'حالة النشر' : 'Publish Status'}
                </label>
                <select
                  value={formData.status || 'Active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                >
                  <option value="Active">{isRtl ? 'نشط (معروض بالموقع)' : 'Active (Visible)'}</option>
                  <option value="Inactive">{isRtl ? 'غير نشط (معطل)' : 'Inactive'}</option>
                </select>
              </div>

              <div className="flex items-center justify-center gap-4 pt-6 border-t border-[#E7E2D8]/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-[#E7E2D8] hover:border-stone-400 bg-white dark:bg-black/30 text-xs font-medium text-stone-600 dark:text-stone-300 rounded-xl transition-colors cursor-pointer min-w-[120px]"
                >
                  {t.projects.cancel}
                </button>
                <button
                  type="submit"
                  className="px-10 py-3 bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-widest uppercase rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer min-w-[180px]"
                >
                  <Check className="w-4 h-4 text-gold" />
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
            ? `هل أنت متأكد من رغبتك في حذف التخصص الهندسي "${deleteModal.title}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : `Are you sure you want to delete service "${deleteModal.title}"? This action cannot be undone.`
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
