'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataStore } from '@/lib/store';
import { InsightArticle } from '@/lib/types';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import { Plus, Edit2, Trash2, Eye, FileText, ArrowRight, X } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ImageUploader } from '@/components/ui/ImageUploader';

export default function AdminInsightsPage() {
  const [insights, setInsights] = useState<InsightArticle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<InsightArticle | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: ''
  });

  const { t, isRtl, locale } = useAdminLang();

  const [formData, setFormData] = useState<Partial<InsightArticle>>({
    title_en: '',
    title_ar: '',
    category_en: 'Sustainability',
    category_slug: 'sustainability',
    author_en: 'Dr. Tarek Mansour',
    author_ar: 'د. طارق منصور',
    excerpt_en: '',
    excerpt_ar: '',
    content_en: '',
    content_ar: '',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
    featured: false
  });

  const load = () => {
    setInsights(DataStore.getInsights());
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({
      id: `ins-${Date.now()}`,
      slug: `insight-${insights.length + 1}`,
      title_en: '',
      title_ar: '',
      category_en: 'Sustainability',
      category_slug: 'sustainability',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author_en: 'Dr. Tarek Mansour',
      author_ar: 'د. طارق منصور',
      read_time_en: '5 min read',
      read_time_ar: '5 دقائق',
      excerpt_en: '',
      excerpt_ar: '',
      content_en: '',
      content_ar: '',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art: InsightArticle) => {
    setEditingArticle(art);
    setFormData({ ...art });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDeleteArticle = () => {
    if (deleteModal.id) {
      DataStore.deleteInsight(deleteModal.id);
      load();
      setDeleteModal({ isOpen: false, id: '', title: '' });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_en) return;

    const toSave: InsightArticle = {
      id: formData.id || `ins-${Date.now()}`,
      slug: formData.slug || formData.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title_en: formData.title_en,
      title_ar: formData.title_ar || formData.title_en,
      category_en: formData.category_en || 'Sustainability',
      category_ar: formData.category_ar || 'الاستدامة',
      category_slug: (formData.category_slug as any) || 'sustainability',
      date: formData.date || 'Oct 2024',
      author_en: formData.author_en || 'VIWAN Editorial',
      author_ar: formData.author_ar || 'هيئة تحرير إيوان',
      read_time_en: formData.read_time_en || '5 min read',
      read_time_ar: formData.read_time_ar || '5 دقائق',
      excerpt_en: formData.excerpt_en || '',
      excerpt_ar: formData.excerpt_ar || '',
      content_en: formData.content_en || '',
      content_ar: formData.content_ar || '',
      image: formData.image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
      featured: !!formData.featured
    };

    DataStore.saveInsight(toSave);
    load();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E2D8]">
        <div>
          <h1 className="font-cinzel text-2xl text-charcoal uppercase tracking-wide">
            {t.insights.title}
          </h1>
          <p className="text-xs text-stone-text font-light mt-0.5">
            {t.insights.subtitle}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-sm w-full sm:w-auto"
        >
          <span>{t.insights.addNew}</span>
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. INSIGHTS: MOBILE CARDS LAYOUT (Full Width, Zero Horizontal Scroll) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {insights.length === 0 ? (
          <div className="bg-white border border-[#E7E2D8] p-8 text-center text-xs text-stone-500">
            {isRtl ? 'لا توجد مقالات منشورة' : 'No articles found'}
          </div>
        ) : (
          insights.map((art) => (
            <div
              key={art.id}
              className="bg-white border border-[#E7E2D8] p-4 space-y-3 shadow-sm hover:border-gold/60 transition-colors"
            >
              {/* Top Row: Cover Image + Title & Excerpt */}
              <div className="flex items-start space-x-3 rtl:space-x-reverse min-w-0">
                <img
                  src={art.image}
                  alt={art.title_en}
                  className="w-16 h-14 object-cover border border-[#E7E2D8] shrink-0 shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-semibold text-gold uppercase tracking-wider block">
                    {art.category_en}
                  </span>
                  <h3 className="font-cinzel text-xs font-bold text-charcoal uppercase line-clamp-1 mt-0.5">
                    {isRtl ? art.title_ar : art.title_en}
                  </h3>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 font-light">
                    {isRtl ? art.excerpt_ar : art.excerpt_en}
                  </p>
                </div>
              </div>

              {/* Bottom Row: Author + Date + Actions */}
              <div className="pt-2 border-t border-[#E7E2D8]/60 flex items-center justify-between text-xs">
                <div className="text-[11px] text-stone-600 truncate max-w-[180px]">
                  <span className="text-stone-400">{isRtl ? 'الكاتب: ' : 'By: '}</span>
                  <span className="font-medium">{isRtl ? art.author_ar : art.author_en}</span>
                  <span className="text-stone-400 mx-1.5">•</span>
                  <span className="text-stone-500 font-mono text-[10px]">{art.date}</span>
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse shrink-0">
                  <button
                    onClick={() => handleOpenEdit(art)}
                    className="p-2 bg-[#FAF6EE] hover:bg-gold hover:text-white text-charcoal border border-[#E7E2D8] transition-colors"
                    title={t.projects.edit}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(art.id, isRtl ? art.title_ar : art.title_en)}
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
      {/* 2. INSIGHTS: DESKTOP TABLE LAYOUT (Hidden on Mobile) */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-white border border-[#E7E2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead>
              <tr className="border-b border-[#E7E2D8] text-[10px] tracking-widest uppercase text-stone-500 font-semibold bg-[#FAF6EE]/50">
                <th className="py-4 px-6">{t.insights.tableArticle}</th>
                <th className="py-4 px-6">{t.insights.tableCategory}</th>
                <th className="py-4 px-6">{t.insights.tableAuthor}</th>
                <th className="py-4 px-6">{t.insights.tableDate}</th>
                <th className="py-4 px-6 text-right rtl:text-left">{t.insights.tableActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D8]">
              {insights.map((art) => (
                <tr key={art.id} className="hover:bg-[#FAF6EE]/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <img src={art.image} alt={art.title_en} className="w-12 h-10 object-cover border border-[#E7E2D8]" />
                      <div className="space-y-0.5 max-w-sm">
                        <div className="font-cinzel text-xs font-semibold text-charcoal uppercase line-clamp-1">
                          {isRtl ? art.title_ar : art.title_en}
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">
                          {isRtl ? art.excerpt_ar : art.excerpt_en}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-stone-dark font-medium">{art.category_en}</td>
                  <td className="py-4 px-6 text-stone-text">{isRtl ? art.author_ar : art.author_en}</td>
                  <td className="py-4 px-6 text-stone-500 font-mono text-[11px]">{art.date}</td>
                  <td className="py-4 px-6 text-right rtl:text-left">
                    <div className="flex items-center justify-end rtl:justify-start space-x-3 rtl:space-x-reverse">
                      <button onClick={() => handleOpenEdit(art)} className="p-1 text-stone-500 hover:text-charcoal">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(art.id, isRtl ? art.title_ar : art.title_en)} className="p-1 text-stone-400 hover:text-red-600">
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

      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#FAF6EE] max-w-xl w-full my-auto max-h-[88vh] overflow-y-auto border border-[#E7E2D8] p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} p-2 text-stone-500 hover:text-charcoal`}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-cinzel text-xl text-charcoal uppercase">
              {editingArticle ? t.insights.editModalTitle : t.insights.addModalTitle}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-charcoal block">{t.insights.titleEn}</label>
                <input
                  type="text"
                  required
                  value={formData.title_en || ''}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="The Future of Passive Cooling..."
                  className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-charcoal block">{t.insights.titleAr}</label>
                <input
                  type="text"
                  dir="rtl"
                  value={formData.title_ar || ''}
                  onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  placeholder="مستقبل التبريد السلبي في المناخات الجافة..."
                  className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-charcoal block">{t.insights.categoryEn}</label>
                  <select
                    value={formData.category_slug || 'sustainability'}
                    onChange={(e) => setFormData({ ...formData, category_slug: e.target.value as any, category_en: e.target.options[e.target.selectedIndex].text })}
                    className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                  >
                    <option value="sustainability">Sustainability</option>
                    <option value="urban-design">Urban Design</option>
                    <option value="technology">Technology</option>
                    <option value="practice">Practice</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-charcoal block">{t.insights.authorEn}</label>
                  <input
                    type="text"
                    value={formData.author_en || ''}
                    onChange={(e) => setFormData({ ...formData, author_en: e.target.value })}
                    className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold"
                  />
                </div>
              </div>

              <ImageUploader
                label={t.insights.image}
                value={formData.image || ''}
                onChange={(val) => setFormData({ ...formData, image: val })}
                isRtl={isRtl}
              />

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-charcoal block">{t.insights.excerptEn}</label>
                <textarea
                  rows={2}
                  value={formData.excerpt_en || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                  className="w-full bg-white border border-[#E7E2D8] p-2 text-xs text-charcoal outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="pt-4 border-t border-[#E7E2D8] flex items-center justify-end space-x-3 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-xs text-stone-500 uppercase font-medium"
                >
                  {t.insights.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-widest uppercase px-6 py-2 transition-colors"
                >
                  {t.insights.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Luxury Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={t.insights.deleteTitle}
        message={t.insights.deleteMessage}
        confirmLabel={t.projects.delete}
        cancelLabel={t.projects.cancel}
        isDestructive={true}
        onConfirm={confirmDeleteArticle}
        onCancel={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
      />
    </div>
  );
}
