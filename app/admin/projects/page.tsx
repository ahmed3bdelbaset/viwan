'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import { useViwanModal } from '@/components/ui/ViwanModalProvider';
import {
  FolderKanban,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Upload,
  RefreshCw,
  X,
  Check,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Eye
} from 'lucide-react';

export interface AdminProjectItem {
  id: string;
  code: string;
  slug: string;
  index?: string;
  name: string;
  nameAr?: string;
  title: string;
  title_en: string;
  title_ar: string;
  subtitle_en?: string;
  subtitle_ar?: string;
  tagline?: string;
  location: string;
  location_en: string;
  location_ar: string;
  country?: string;
  country_en?: string;
  country_ar?: string;
  year: number;
  client_en?: string;
  client_ar?: string;
  area_sqm?: string;
  type?: string;
  category: string;
  sector_en?: string;
  sector_ar?: string;
  disciplines: string[];
  scope?: string[];
  description?: string;
  descriptionAr?: string;
  philosophy?: string;
  vision_en?: string;
  vision_ar?: string;
  cover: string;
  gallery: string[];
  featured?: boolean;
  is_featured?: boolean;
}

const DISCIPLINES_LIST = [
  { id: 'Architecture', labelEn: 'Architecture', labelAr: 'الهندسة المعمارية', code: '01', slug: 'architecture' },
  { id: 'Interior Design', labelEn: 'Interior Design', labelAr: 'التصميم الداخلي', code: '02', slug: 'interior-design' },
  { id: 'Landscape', labelEn: 'Landscape Architecture', labelAr: 'اللاندسكيب', code: '03', slug: 'landscape' },
  { id: 'Urban Design', labelEn: 'Urban Design & Masterplanning', labelAr: 'التخطيط العمراني', code: '04', slug: 'urban-design' },
  { id: 'Engineering', labelEn: 'Integrated Engineering', labelAr: 'الهندسة المتكاملة', code: '05', slug: 'engineering' },
];

export default function AdminProjectsPage() {
  const { isRtl } = useAdminLang();
  const { showConfirm, showNotification, showError } = useViwanModal();

  const [projects, setProjects] = useState<AdminProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Form State
  const [form, setForm] = useState<Partial<AdminProjectItem>>({
    title_en: '',
    title_ar: '',
    slug: '',
    category: 'Architecture',
    disciplines: ['Architecture'],
    location_en: 'New Cairo, Egypt',
    location_ar: 'القاهرة الجديدة، مصر',
    year: 2026,
    client_en: 'Private Client',
    client_ar: 'عميل خاص',
    area_sqm: '1,850 m²',
    subtitle_en: '',
    subtitle_ar: '',
    description: '',
    descriptionAr: '',
    cover: '/images/hero-villa.png',
    gallery: [],
    is_featured: false,
    scope: ['Concept Design', 'Architectural Documentation', 'BIM Coordination'],
  });

  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      title_en: '',
      title_ar: '',
      slug: '',
      category: 'Architecture',
      disciplines: ['Architecture'],
      location_en: 'New Cairo, Egypt',
      location_ar: 'القاهرة الجديدة، مصر',
      year: new Date().getFullYear(),
      client_en: 'Private VIP Client',
      client_ar: 'عميل خاص',
      area_sqm: '1,500 m²',
      subtitle_en: 'A home in harmony with its surroundings.',
      subtitle_ar: 'منزل متناغم مع محيطه الطبيعي ويوفر ملاذاً هادئاً.',
      description: 'A refined balance of modern architecture, timeless natural materials, and serene outdoor spaces.',
      descriptionAr: 'توازن دقيق بين روعة العمارة الحديثة والمواد الطبيعية والمساحات الخارجية الهادئة.',
      cover: '/images/hero-villa.png',
      gallery: [],
      is_featured: false,
      scope: ['Architecture Design', 'BIM Coordination'],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: AdminProjectItem) => {
    setEditingId(project.id);
    setForm({
      ...project,
      title_en: project.title_en || project.title || project.name,
      title_ar: project.title_ar || project.nameAr || project.title,
      cover: project.cover || '/images/hero-villa.png',
      gallery: Array.isArray(project.gallery) ? project.gallery : [],
      disciplines: Array.isArray(project.disciplines) && project.disciplines.length > 0 ? project.disciplines : [project.category || 'Architecture'],
      is_featured: Boolean(project.is_featured || project.featured),
    });
    setIsModalOpen(true);
  };

  const handleCoverUpload = async (file: File) => {
    try {
      setUploadingCover(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setForm((prev) => ({ ...prev, cover: data.url }));
          showNotification(isRtl ? 'تم رفع صورة الغلاف بنجاح' : 'Cover image uploaded', isRtl ? 'تم الرفع' : 'Uploaded');
        }
      }
    } catch (err) {
      console.error('Error uploading cover:', err);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (files: FileList) => {
    try {
      setUploadingGallery(true);
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append('file', files[i]);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (res.ok) {
          const data = await res.json();
          if (data.url) uploadedUrls.push(data.url);
        }
      }
      if (uploadedUrls.length > 0) {
        setForm((prev) => ({
          ...prev,
          gallery: [...(prev.gallery || []), ...uploadedUrls],
        }));
        showNotification(
          isRtl ? `تمت إضافة ${uploadedUrls.length} صور للمعرض` : `Added ${uploadedUrls.length} images to gallery`,
          isRtl ? 'معرض الصور' : 'Gallery'
        );
      }
    } catch (err) {
      console.error('Error uploading gallery:', err);
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title_en && !form.title_ar) {
      showError(isRtl ? 'يرجى إدخال اسم المشروع' : 'Please enter project title', isRtl ? 'تنبيه' : 'Alert');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        title: form.title_en || form.title_ar,
        name: form.title_en || form.title_ar,
        titleAr: form.title_ar || form.title_en,
        nameAr: form.title_ar || form.title_en,
        type: form.category || 'Architecture',
        featured: form.is_featured,
      };

      let res: Response;
      if (editingId) {
        res = await fetch('/api/admin/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        showNotification(
          editingId
            ? (isRtl ? 'تم تحديث المشروع بنجاح ومزامنته مع الموقع' : 'Project updated and synced with site')
            : (isRtl ? 'تم إنشاء المشروع بنجاح وإدراجه في الموقع' : 'Project created and published to site'),
          isRtl ? 'إدارة المشاريع' : 'Project Management'
        );
        setIsModalOpen(false);
        fetchProjects();
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      console.error('Error saving project:', err);
      showError(isRtl ? 'فشل حفظ المشروع' : 'Failed to save project', isRtl ? 'خطأ' : 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (project: AdminProjectItem) => {
    const confirmed = await showConfirm(
      isRtl
        ? `هل أنت متأكد من رغبتك في حذف مشروع "${project.title_ar || project.title_en}" نهائياً من قاعدة البيانات والموقع؟`
        : `Are you sure you want to permanently delete "${project.title_en || project.title_ar}"?`,
      isRtl ? 'تأكيد حذف المشروع' : 'Confirm Project Delete'
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${project.id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== project.id));
        showNotification(isRtl ? 'تم حذف المشروع بنجاح' : 'Project deleted', isRtl ? 'تم الحذف' : 'Deleted');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleToggleFeatured = async (project: AdminProjectItem) => {
    const updatedFeatured = !Boolean(project.is_featured || project.featured);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          featured: updatedFeatured,
          is_featured: updatedFeatured,
        }),
      });

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, is_featured: updatedFeatured, featured: updatedFeatured } : p))
        );
        showNotification(
          updatedFeatured
            ? (isRtl ? 'تم تعيين المشروع كمشروع مميز' : 'Project marked as Featured')
            : (isRtl ? 'تمت إزالة تمييز المشروع' : 'Project unmarked as Featured'),
          isRtl ? 'المشاريع المميزة' : 'Featured'
        );
      }
    } catch (err) {
      console.error('Error toggling featured:', err);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (selectedDiscipline !== 'ALL') {
      const pDiscs = Array.isArray(p.disciplines) ? p.disciplines : [p.category];
      if (!pDiscs.some((d) => d.toLowerCase() === selectedDiscipline.toLowerCase())) {
        return false;
      }
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.title_en && p.title_en.toLowerCase().includes(q)) ||
      (p.title_ar && p.title_ar.toLowerCase().includes(q)) ||
      (p.location_en && p.location_en.toLowerCase().includes(q)) ||
      (p.location_ar && p.location_ar.toLowerCase().includes(q)) ||
      (p.client_en && p.client_en.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D8] pb-6">
        <div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <h1 className="font-cinzel text-2xl font-normal text-charcoal tracking-wide uppercase">
              {isRtl ? 'إدارة محفظة المشاريع المعمارية' : 'ARCHITECTURAL PORTFOLIO MANAGEMENT'}
            </h1>
            <span className="bg-charcoal text-gold text-[11px] font-mono px-2.5 py-0.5 tracking-wider">
              {projects.length} {isRtl ? 'مشروع' : 'PROJECTS'}
            </span>
          </div>
          <p className="text-xs text-stone-600 font-light mt-1 max-w-3xl">
            {isRtl
              ? 'إضافة وتعديل وحذف وتصنيف المشاريع في التخصصات الخمسة (عمارة، تصميم داخلي، لاندسكيب، تخطيط عمراني، هندسة). كافة التعديلات تحفظ في قاعدة البيانات وتظهر فورياً في صفحة المشاريع العامة.'
              : 'Create, edit, classify, and publish projects across the 5 disciplines. All changes save directly to the persistent database and reflect instantly on the public projects page.'}
          </p>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button
            onClick={fetchProjects}
            className="p-2.5 border border-[#E7E2D8] bg-white hover:border-gold text-charcoal transition-colors shadow-xs"
            title={isRtl ? 'تحديث المشاريع' : 'Refresh Projects'}
          >
            <RefreshCw className={`w-4 h-4 text-gold ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="bg-charcoal hover:bg-gold text-white px-4 py-2.5 text-xs font-medium tracking-wider uppercase flex items-center space-x-2 rtl:space-x-reverse transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-gold group-hover:text-white" />
            <span>{isRtl ? 'إضافة مشروع جديد' : 'ADD NEW PROJECT'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Disciplines Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedDiscipline('ALL')}
            className={`px-3.5 py-2 text-xs tracking-wider uppercase font-medium transition-colors ${
              selectedDiscipline === 'ALL'
                ? 'bg-charcoal text-white shadow-xs'
                : 'bg-white text-stone-600 border border-[#E7E2D8] hover:border-gold'
            }`}
          >
            {isRtl ? 'كافة التخصصات' : 'ALL DISCIPLINES'}
          </button>

          {DISCIPLINES_LIST.map((disc) => (
            <button
              key={disc.id}
              onClick={() => setSelectedDiscipline(disc.id)}
              className={`px-3.5 py-2 text-xs tracking-wider uppercase font-medium transition-colors ${
                selectedDiscipline === disc.id
                  ? 'bg-charcoal text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-[#E7E2D8] hover:border-gold'
              }`}
            >
              {isRtl ? disc.labelAr : disc.labelEn}
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
            placeholder={isRtl ? 'بحث باسم المشروع أو الموقع...' : 'Search by title, client, location...'}
            className="w-full bg-white border border-[#E7E2D8] pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 text-xs text-charcoal focus:outline-none focus:border-gold shadow-xs"
          />
        </div>
      </div>

      {/* Projects Grid / Cards */}
      {loading ? (
        <div className="py-24 text-center text-xs text-stone-500 font-cinzel tracking-widest uppercase">
          {isRtl ? 'جاري تحميل المشاريع المعمارية...' : 'LOADING ARCHITECTURAL PROJECTS...'}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#E7E2D8] p-8">
          <FolderKanban className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <p className="font-cinzel text-sm text-charcoal uppercase">
            {isRtl ? 'لا توجد مشاريع مطابقة' : 'NO PROJECTS FOUND'}
          </p>
          <p className="text-xs text-stone-500 mt-1">
            {isRtl ? 'اضغط على زر "إضافة مشروع جديد" لبدء إدراج أعمالك في المنصة.' : 'Click "Add New Project" to publish your first case study.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isFeatured = Boolean(project.is_featured || project.featured);

            return (
              <div
                key={project.id}
                className="bg-white border border-[#E7E2D8] overflow-hidden flex flex-col justify-between shadow-sm hover:border-gold/60 transition-colors group"
              >
                {/* Project Cover Preview */}
                <div className="relative aspect-[16/10] bg-stone-900 overflow-hidden border-b border-[#E7E2D8]">
                  <img
                    src={project.cover || '/images/hero-villa.png'}
                    alt={project.title_en || project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/hero-villa.png';
                    }}
                  />

                  {/* Discipline Badge */}
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1.5 z-10">
                    <span className="bg-charcoal/90 backdrop-blur-xs text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border border-white/10">
                      {project.category || (project.disciplines && project.disciplines[0]) || 'Architecture'}
                    </span>
                    {isFeatured && (
                      <span className="bg-gold text-charcoal text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-charcoal text-charcoal" />
                        <span>{isRtl ? 'مميز' : 'FEATURED'}</span>
                      </span>
                    )}
                  </div>

                  {/* Year Tag */}
                  <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-10">
                    <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5">
                      {project.year || 2026}
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-cinzel text-base font-semibold text-charcoal leading-snug">
                      {isRtl ? project.title_ar || project.title_en : project.title_en || project.title_ar}
                    </h3>

                    {(project.subtitle_en || project.subtitle_ar) && (
                      <p className="text-xs text-stone-600 font-light line-clamp-2">
                        {isRtl ? project.subtitle_ar || project.subtitle_en : project.subtitle_en || project.subtitle_ar}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gold" />
                        {isRtl ? project.location_ar || project.location_en : project.location_en || project.location_ar}
                      </span>
                      {project.client_en && (
                        <span className="font-light">
                          {isRtl ? project.client_ar || project.client_en : project.client_en}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-3 border-t border-[#F3EDE3] flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                      <button
                        onClick={() => openEditModal(project)}
                        className="border border-[#E7E2D8] hover:border-gold bg-[#FAF6EE] px-3 py-1.5 text-xs text-charcoal flex items-center space-x-1 rtl:space-x-reverse transition-colors"
                        title={isRtl ? 'تعديل بيانات المشروع' : 'Edit project'}
                      >
                        <Edit2 className="w-3.5 h-3.5 text-gold" />
                        <span>{isRtl ? 'تعديل' : 'EDIT'}</span>
                      </button>

                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`border px-2.5 py-1.5 text-xs transition-colors ${
                          isFeatured
                            ? 'border-gold bg-gold/15 text-charcoal'
                            : 'border-[#E7E2D8] hover:border-stone-400 bg-white text-stone-500'
                        }`}
                        title={isRtl ? 'تبديل حالة التمييز' : 'Toggle featured'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-gold text-gold' : ''}`} />
                      </button>

                      <Link
                        href="/projects"
                        target="_blank"
                        className="border border-[#E7E2D8] hover:border-stone-400 px-2.5 py-1.5 text-xs text-stone-500 bg-white transition-colors"
                        title={isRtl ? 'معاينة في صفحة المشاريع العامة' : 'View on public projects page'}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <button
                      onClick={() => handleDeleteProject(project)}
                      className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                      title={isRtl ? 'حذف المشروع' : 'Delete project'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT PROJECT MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E2D8] max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E7E2D8] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
                  {editingId ? (isRtl ? 'تعديل مشروع قائم' : 'EDIT ARCHITECTURAL PROJECT') : (isRtl ? 'إضافة مشروع جديد' : 'ADD NEW ARCHITECTURAL PROJECT')}
                </span>
                <h2 className="font-cinzel text-xl text-charcoal font-medium mt-1">
                  {form.title_en || form.title_ar || (isRtl ? 'مشروع جديد' : 'New Project')}
                </h2>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-charcoal transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProject} className="space-y-6">
              {/* Row 1: Title English & Arabic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'اسم المشروع (باللغة الإنجليزية) *' : 'PROJECT TITLE (ENGLISH) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title_en || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        title_en: val,
                        slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      }));
                    }}
                    placeholder="e.g. Private Residence 01"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'اسم المشروع (باللغة العربية) *' : 'PROJECT TITLE (ARABIC) *'}
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={form.title_ar || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, title_ar: e.target.value }))}
                    placeholder="مثال: إقامة خاصة 01"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold font-cairo"
                  />
                </div>
              </div>

              {/* Row 2: The 5 Disciplines (الخصائص الـ 5 والتخصص المعماري) */}
              <div className="space-y-3 p-4 bg-[#FAF6EE] border border-[#E7E2D8]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                      {isRtl ? 'الخصائص الـ 5 والتخصص المعماري للمشروع *' : 'THE 5 DISCIPLINES (PROJECT CATEGORY) *'}
                    </label>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {isRtl ? 'اختر التخصص الذي ينتمي إليه المشروع ليتم ربطه وعرضه معه في صفحة المشاريع العامة.' : 'Select the primary discipline to group this project with in the public portfolio.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-semibold text-charcoal uppercase tracking-wider">{isRtl ? 'السنة:' : 'Year:'}</span>
                    <input
                      type="number"
                      value={form.year || 2026}
                      onChange={(e) => setForm((prev) => ({ ...prev, year: parseInt(e.target.value) || 2026 }))}
                      className="w-24 bg-white border border-[#E7E2D8] px-2 py-1 text-xs text-charcoal focus:outline-none focus:border-gold font-mono text-center"
                    />
                  </div>
                </div>

                {/* 5 Disciplines Interactive Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                  {DISCIPLINES_LIST.map((d) => {
                    const isSelected = form.category === d.id || form.category === d.slug || (Array.isArray(form.disciplines) && (form.disciplines.includes(d.id) || form.disciplines.includes(d.slug)));
                    return (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            category: d.id,
                            disciplines: [d.id],
                          }));
                        }}
                        className={`p-3 text-start border transition-all flex flex-col justify-between gap-2 cursor-pointer rounded-xs ${
                          isSelected
                            ? 'border-gold bg-charcoal text-ivory ring-1 ring-gold shadow-xs'
                            : 'border-[#E7E2D8] bg-white hover:border-gold/60 text-charcoal'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-gold' : 'text-stone-400'}`}>
                            {d.code}
                          </span>
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 text-gold" />
                          ) : (
                            <span className="size-2 rounded-full bg-stone-300" />
                          )}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? 'text-ivory' : 'text-charcoal'} font-cairo`}>
                            {d.labelAr}
                          </div>
                          <div className={`text-[9px] uppercase tracking-wider truncate mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                            {d.labelEn}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Clear visual feedback */}
                <div className="p-2.5 bg-white border border-[#E7E2D8] text-[11px] text-stone-600 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>
                    {isRtl
                      ? `سيتم ربط هذا المشروع بقسم (${DISCIPLINES_LIST.find(d => d.id === form.category)?.labelAr || 'التصميم الداخلي'}) في صفحة المشاريع العامة (/projects) بجانب المشاريع الأخرى من نفس التخصص.`
                      : `This project is linked to (${form.category || 'Architecture'}) and will be displayed in that discipline section on the public /projects page.`}
                  </span>
                </div>
              </div>

              {/* Row 3: Location EN & AR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'الموقع (باللغة الإنجليزية)' : 'LOCATION (ENGLISH)'}
                  </label>
                  <input
                    type="text"
                    value={form.location_en || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, location_en: e.target.value, location: e.target.value }))}
                    placeholder="e.g. New Cairo, Egypt"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'الموقع (باللغة العربية)' : 'LOCATION (ARABIC)'}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={form.location_ar || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, location_ar: e.target.value }))}
                    placeholder="مثال: القاهرة الجديدة، مصر"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold font-cairo"
                  />
                </div>
              </div>

              {/* Row 4: Client & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'العميل' : 'CLIENT'}
                  </label>
                  <input
                    type="text"
                    value={form.client_en || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, client_en: e.target.value, client_ar: e.target.value }))}
                    placeholder="e.g. Private VIP Client"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'المساحة المبنية' : 'BUILT-UP AREA'}
                  </label>
                  <input
                    type="text"
                    value={form.area_sqm || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, area_sqm: e.target.value }))}
                    placeholder="e.g. 1,850 m²"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Row 5: Subtitles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'شعار / نبذة سريعة (EN)' : 'SUBTITLE / TAGLINE (EN)'}
                  </label>
                  <input
                    type="text"
                    value={form.subtitle_en || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, subtitle_en: e.target.value, tagline: e.target.value }))}
                    placeholder="A home in harmony with its surroundings."
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'شعار / نبذة سريعة (AR)' : 'SUBTITLE / TAGLINE (AR)'}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={form.subtitle_ar || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, subtitle_ar: e.target.value }))}
                    placeholder="منزل متناغم مع محيطه الطبيعي ويوفر ملاذاً هادئاً."
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold font-cairo"
                  />
                </div>
              </div>

              {/* Cover Image Upload Section */}
              <div className="p-4 bg-[#FAF6EE] border border-[#E7E2D8] space-y-3">
                <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                  {isRtl ? 'صورة الغلاف الرئيسية (Cover Image) *' : 'PRIMARY COVER IMAGE *'}
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-32 h-20 bg-stone-200 border border-[#E7E2D8] overflow-hidden shrink-0 relative">
                    <img
                      src={form.cover || '/images/hero-villa.png'}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    {uploadingCover && (
                      <div className="absolute inset-0 bg-charcoal/70 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 text-gold animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      ref={coverInputRef}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCoverUpload(file);
                      }}
                    />

                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={uploadingCover}
                        className="px-3 py-1.5 bg-charcoal hover:bg-gold text-white text-xs font-medium flex items-center space-x-1.5 rtl:space-x-reverse transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-gold group-hover:text-white" />
                        <span>{isRtl ? 'رفع صورة غلاف' : 'UPLOAD COVER'}</span>
                      </button>

                      <input
                        type="text"
                        value={form.cover || ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, cover: e.target.value }))}
                        placeholder="/images/... or URL"
                        className="flex-1 bg-white border border-[#E7E2D8] px-2.5 py-1.5 text-xs text-charcoal focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-stone-500">
                      {isRtl ? 'يفضل استخدام صورة أفقية بنسبة 16:9 أو 16:10 بدقة عالية.' : 'Recommended: 16:9 or 16:10 landscape high-resolution architectural photograph.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Images Upload Section */}
              <div className="p-4 bg-[#FAF6EE] border border-[#E7E2D8] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'معرض صور المشروع (Gallery Assets)' : 'PROJECT GALLERY ASSETS'}
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={galleryInputRef}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) handleGalleryUpload(e.target.files);
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={uploadingGallery}
                    className="px-3 py-1 bg-white hover:bg-stone-100 border border-[#E7E2D8] text-xs font-medium text-charcoal flex items-center space-x-1 rtl:space-x-reverse transition-colors"
                  >
                    <Plus className="w-3 h-3 text-gold" />
                    <span>{isRtl ? 'إضافة صور للمعرض' : 'ADD GALLERY IMAGES'}</span>
                  </button>
                </div>

                {Array.isArray(form.gallery) && form.gallery.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {form.gallery.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-square bg-stone-200 border border-[#E7E2D8] group overflow-hidden">
                        <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-500 italic">
                    {isRtl ? 'لم تتم إضافة صور للمعرض بعد.' : 'No gallery images added yet.'}
                  </p>
                )}
              </div>

              {/* Display Position in Public Page (Featured vs Related Subproject) */}
              <div className="p-4 bg-[#FAF6EE] border border-[#E7E2D8] space-y-3">
                <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                  {isRtl ? 'مكان عرض المشروع في صفحة المشاريع العامة (/projects) *' : 'DISPLAY POSITION ON /PROJECTS PAGE *'}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setForm((prev) => ({ ...prev, is_featured: false, featured: false }))}
                    className={`p-3 border flex items-start gap-2.5 cursor-pointer transition-all rounded-xs ${
                      !form.is_featured
                        ? 'border-gold bg-white shadow-xs ring-1 ring-gold/40'
                        : 'border-[#E7E2D8] bg-white/60 hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="display_position"
                      checked={!Boolean(form.is_featured)}
                      onChange={() => setForm((prev) => ({ ...prev, is_featured: false, featured: false }))}
                      className="mt-0.5 text-gold focus:ring-gold"
                    />
                    <div className="space-y-0.5 text-start">
                      <div className="text-xs font-bold text-charcoal">
                        {isRtl ? 'المشاريع المرتبطة (القائمة الجانبية على اليسار)' : 'Related Subproject (Left Column)'}
                      </div>
                      <div className="text-[10px] text-stone-500 leading-normal">
                        {isRtl
                          ? 'يضاف بجانب المشاريع الأخرى لنفس التخصص (مثل فندق الريفييرا ومطعم أوليف في قسم التصميم الداخلي).'
                          : 'Appears in the left column alongside existing projects of this category.'}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setForm((prev) => ({ ...prev, is_featured: true, featured: true }))}
                    className={`p-3 border flex items-start gap-2.5 cursor-pointer transition-all rounded-xs ${
                      Boolean(form.is_featured)
                        ? 'border-gold bg-white shadow-xs ring-1 ring-gold/40'
                        : 'border-[#E7E2D8] bg-white/60 hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="display_position"
                      checked={Boolean(form.is_featured)}
                      onChange={() => setForm((prev) => ({ ...prev, is_featured: true, featured: true }))}
                      className="mt-0.5 text-gold focus:ring-gold"
                    />
                    <div className="space-y-0.5 text-start">
                      <div className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                        <span>{isRtl ? 'مشروع رئيسي مميز (Featured في المنتصف)' : 'Featured Primary Project (Center)'}</span>
                        <Star className="w-3 h-3 text-gold fill-gold" />
                      </div>
                      <div className="text-[10px] text-stone-500 leading-normal">
                        {isRtl
                          ? 'يظهر كالمشروع الرئيسي الكبير في منتصف قسم التخصص بصورة عريضة وتفاصيل كاملة.'
                          : 'Appears as the large prominent hero project in the center of the discipline section.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-[#E7E2D8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E7E2D8] hover:border-stone-400 bg-white text-xs font-medium text-stone-600 transition-colors"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs"
                >
                  {saving
                    ? (isRtl ? 'جاري الحفظ...' : 'SAVING...')
                    : editingId
                    ? (isRtl ? 'حفظ التعديلات' : 'SAVE CHANGES')
                    : (isRtl ? 'نشر المشروع' : 'PUBLISH PROJECT')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
