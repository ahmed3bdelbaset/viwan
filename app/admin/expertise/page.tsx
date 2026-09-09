'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataStore } from '@/lib/store';
import { ExpertiseSector } from '@/lib/types';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  ExternalLink,
  Plus,
  Search,
  Edit2,
  Trash2,
  Hash,
  Layers,
  X,
  Check
} from 'lucide-react';

export default function AdminExpertisePage() {
  const [sectors, setSectors] = useState<ExpertiseSector[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<ExpertiseSector | null>(null);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: ''
  });

  const { t, isRtl, locale } = useAdminLang();

  const [formData, setFormData] = useState<Partial<ExpertiseSector>>({
    name_en: '',
    name_ar: '',
    count: 10,
    status: 'Active',
    description_en: '',
    description_ar: '',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'
  });

  const loadSectors = () => {
    setSectors(DataStore.getExpertiseSectors());
  };

  useEffect(() => {
    loadSectors();
  }, []);

  const handleOpenAdd = () => {
    setEditingSector(null);
    setFormData({
      id: `sec-${Date.now()}`,
      name_en: '',
      name_ar: '',
      count: 12,
      status: 'Active',
      description_en: 'Architectural excellence tailored to the highest engineering standards.',
      description_ar: 'تميز معماري واستشارات هندسية مصممة وفق أرقى المعايير العالمية.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      display_order: sectors.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sec: ExpertiseSector) => {
    setEditingSector(sec);
    setFormData({ ...sec });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const confirmDeleteSector = () => {
    if (deleteModal.id) {
      DataStore.deleteExpertiseSector(deleteModal.id);
      loadSectors();
      setDeleteModal({ isOpen: false, id: '', name: '' });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_en) {
      alert(isRtl ? 'يرجى إدخال اسم القطاع بالإنجليزي' : 'Please provide sector name in English');
      return;
    }

    const secToSave: ExpertiseSector = {
      id: formData.id || `sec-${Date.now()}`,
      name_en: formData.name_en,
      name_ar: formData.name_ar || formData.name_en,
      count: Number(formData.count) || 0,
      status: formData.status || 'Active',
      description_en: formData.description_en || '',
      description_ar: formData.description_ar || '',
      image: formData.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      display_order: formData.display_order || 1
    };

    DataStore.saveExpertiseSector(secToSave);
    loadSectors();
    setIsModalOpen(false);
  };

  const filteredSectors = sectors.filter((s) => {
    const query = searchQuery.toLowerCase().trim();
    return !query ||
      s.name_en.toLowerCase().includes(query) ||
      s.name_ar.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-8">
      {/* ========================================================================= */}
      {/* 1. HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E2D8]">
        <div>
          <h1 className="font-cinzel text-2xl text-charcoal uppercase tracking-wide">
            {t.expertise.title}
          </h1>
          <p className="text-xs text-stone-text font-light mt-0.5">
            {t.expertise.subtitle}
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
              placeholder={t.expertise.searchPlaceholder}
              className={`w-full bg-white border border-[#E7E2D8] focus:border-gold text-xs text-charcoal ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 outline-none`}
            />
          </div>

          {/* Add Sector Button */}
          <button
            onClick={handleOpenAdd}
            className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse shrink-0 group shadow-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 text-gold group-hover:text-white" />
            <span>{t.expertise.addNew}</span>
          </button>

          {/* Public Page Link */}
          <Link
            href="/services"
            target="_blank"
            className="hidden md:flex text-xs text-gold hover:underline items-center space-x-1 rtl:space-x-reverse font-medium shrink-0"
          >
            <span>{t.expertise.viewPublic}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. EXPERTISE: MOBILE CARDS LAYOUT (Full Screen, No Horizontal Scroll) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredSectors.length === 0 ? (
          <div className="bg-white border border-[#E7E2D8] p-8 text-center text-xs text-stone-500">
            {isRtl ? 'لا توجد قطاعات مطابقة للبحث' : 'No sectors found'}
          </div>
        ) : (
          filteredSectors.map((sec) => (
            <div
              key={sec.id}
              className="bg-white border border-[#E7E2D8] p-4 space-y-3.5 shadow-sm hover:border-gold/60 transition-colors"
            >
              {/* Top Row: Image + Name + Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0">
                  {sec.image && (
                    <div className="w-14 h-12 bg-stone-200 border border-[#E7E2D8] overflow-hidden shrink-0 shadow-sm">
                      <img
                        src={sec.image}
                        alt={sec.name_en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-cinzel text-xs font-bold text-charcoal uppercase truncate">
                      {isRtl ? sec.name_ar : sec.name_en}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-mono mt-0.5 truncate">
                      {isRtl ? sec.name_en : sec.name_ar}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 border shrink-0 ${
                    sec.status === 'Active'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-stone-100 text-stone-500 border-stone-300'
                  }`}
                >
                  {sec.status === 'Active' ? t.expertise.active : t.expertise.inactive}
                </span>
              </div>

              {/* Bottom Row: Counter + Visibility + Actions */}
              <div className="pt-2 border-t border-[#E7E2D8]/60 flex items-center justify-between">
                <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-gold/10 border border-gold/40 px-3 py-1 text-charcoal font-semibold text-xs">
                  <span className="font-cinzel text-sm text-gold font-bold">{sec.count}</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-stone-600">
                    {isRtl ? 'مشروع منجز' : 'projects'}
                  </span>
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse shrink-0">
                  <button
                    onClick={() => handleOpenEdit(sec)}
                    className="p-2 bg-[#FAF6EE] hover:bg-gold hover:text-white text-charcoal border border-[#E7E2D8] transition-colors"
                    title={t.projects.edit}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(sec.id, isRtl ? sec.name_ar : sec.name_en)}
                    className="p-2 bg-[#FAF6EE] hover:bg-red-600 hover:text-white text-red-600 border border-[#E7E2D8] transition-colors"
                    title={t.projects.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. EXPERTISE: DESKTOP TABLE LAYOUT (Hidden on Mobile) */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-white border border-[#E7E2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead>
              <tr className="border-b border-[#E7E2D8] text-[10px] tracking-widest uppercase text-stone-500 font-semibold bg-[#FAF6EE]/50">
                <th className="py-4 px-6">{t.expertise.tableSector}</th>
                <th className="py-4 px-6">{t.expertise.tableProjects}</th>
                <th className="py-4 px-6">{t.expertise.tableStatus}</th>
                <th className="py-4 px-6">{t.expertise.tableVisibility}</th>
                <th className="py-4 px-6 text-right rtl:text-left">{t.expertise.tableActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D8]">
              {filteredSectors.map((sec) => (
                <tr key={sec.id} className="hover:bg-[#FAF6EE]/40 transition-colors group">
                  {/* Sector Name & Image */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                      {sec.image && (
                        <div className="w-12 h-10 bg-stone-200 border border-[#E7E2D8] overflow-hidden shrink-0 shadow-sm">
                          <img
                            src={sec.image}
                            alt={sec.name_en}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-cinzel text-xs font-semibold text-charcoal uppercase group-hover:text-gold transition-colors">
                          {isRtl ? sec.name_ar : sec.name_en}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                          {isRtl ? sec.name_en : sec.name_ar}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Projects Count (Counter) */}
                  <td className="py-4 px-6">
                    <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse bg-gold/10 border border-gold/40 px-3 py-1 text-charcoal font-semibold text-xs">
                      <span className="font-cinzel text-sm text-gold font-bold">{sec.count}</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-stone-600">
                        {isRtl ? 'مشروع' : 'projects'}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    <span
                      className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 border ${
                        sec.status === 'Active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-stone-100 text-stone-500 border-stone-300'
                      }`}
                    >
                      {sec.status === 'Active' ? t.expertise.active : t.expertise.inactive}
                    </span>
                  </td>

                  {/* Visibility */}
                  <td className="py-4 px-6">
                    <span className="text-xs text-gold font-medium flex items-center space-x-1 rtl:space-x-reverse">
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.expertise.enabled}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right rtl:text-left">
                    <div className="flex items-center justify-end rtl:justify-start space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => handleOpenEdit(sec)}
                        className="p-1.5 text-stone-400 hover:text-gold transition-colors"
                        title={t.projects.edit}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sec.id, isRtl ? sec.name_ar : sec.name_en)}
                        className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                        title={t.projects.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ADD / EDIT EXPERTISE SECTOR & COUNTER MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#FAF7F2]/95 dark:bg-[#161513]/95 backdrop-blur-2xl border border-white/70 dark:border-stone-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] max-w-2xl w-full my-auto max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative rounded-[28px] sm:rounded-[36px] custom-scrollbar animate-fade-in">
            <div className="flex items-start justify-between border-b border-[#E7E2D8]/80 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold px-2.5 py-0.5 rounded-full bg-gold/10 inline-block mb-1">
                  {editingSector ? (isRtl ? 'تعديل قطاع التخصص' : 'EDIT SECTOR') : (isRtl ? 'قطاع جديد' : 'NEW SECTOR')}
                </span>
                <h2 className="font-cinzel text-xl text-charcoal dark:text-ivory font-medium">
                  {editingSector ? t.expertise.editModalTitle : t.expertise.addModalTitle}
                </h2>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  {t.expertise.subtitle}
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

            <form onSubmit={handleSave} className="space-y-5">
              {/* Sector Cover Image */}
              <ImageUploader
                label={t.expertise.coverImage}
                value={formData.image || ''}
                onChange={(val) => setFormData({ ...formData, image: val })}
                isRtl={isRtl}
              />

              {/* Sector Name Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                    {t.expertise.nameEn}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_en || ''}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="Hospitality & Resorts"
                    className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                    {t.expertise.nameAr}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={formData.name_ar || ''}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    placeholder="الضيافة والمنتجعات السياحية"
                    className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Counter Number & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block flex items-center space-x-1 rtl:space-x-reverse">
                    <Hash className="w-3.5 h-3.5 text-gold" />
                    <span>{t.expertise.count}</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.count ?? 0}
                    onChange={(e) => setFormData({ ...formData, count: Number(e.target.value) })}
                    placeholder="48"
                    className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal font-mono font-semibold outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                    {t.expertise.status}
                  </label>
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                  >
                    <option value="Active">{t.expertise.active}</option>
                    <option value="Inactive">{t.expertise.inactive}</option>
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                  {t.expertise.descEn}
                </label>
                <textarea
                  rows={2}
                  value={formData.description_en || ''}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder="Overview of engineering and design expertise in this vertical..."
                  className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                  {t.expertise.descAr}
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={formData.description_ar || ''}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  placeholder="نبذة عن الإمكانيات والحلول المعمارية المقدمة لهذا القطاع..."
                  className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold resize-none"
                />
              </div>

              {/* Actions - Centered */}
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-[#E7E2D8]/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-[#E7E2D8] hover:border-stone-400 bg-white dark:bg-black/30 text-xs font-medium text-stone-600 dark:text-stone-300 rounded-xl transition-colors cursor-pointer min-w-[120px]"
                >
                  {t.expertise.cancel}
                </button>
                <button
                  type="submit"
                  className="px-10 py-3 bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-widest uppercase rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer min-w-[180px]"
                >
                  <Check className="w-4 h-4 text-gold" />
                  <span>{t.expertise.save}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Luxury Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={t.expertise.deleteTitle}
        message={t.expertise.deleteMessage}
        confirmLabel={t.projects.delete}
        cancelLabel={t.projects.cancel}
        isDestructive={true}
        onConfirm={confirmDeleteSector}
        onCancel={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
      />
    </div>
  );
}
