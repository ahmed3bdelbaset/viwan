'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataStore } from '@/lib/store';
import { Project } from '@/lib/types';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import {
  Search,
  Plus,
  ArrowRight,
  Edit2,
  Trash2,
  Eye,
  Star,
  X,
  LayoutGrid,
  List,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Building2,
  Maximize2,
  FileText,
  Sparkles,
  Globe2,
  Sliders,
  Printer,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ImageUploader, MultiImageGalleryUploader } from '@/components/ui/ImageUploader';
import { FocalPointPicker } from '@/components/ui/FocalPointPicker';
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider';
import { ProjectMonographPrint } from '@/components/ui/ProjectMonographPrint';
import { LifecycleStage } from '@/lib/admin-types';

export const LIFECYCLE_STAGES: { id: LifecycleStage; label_en: string; label_ar: string; step: number }[] = [
  { id: 'concept', label_en: 'Concept Design', label_ar: 'المفهوم والرؤية الأولية', step: 1 },
  { id: 'schematic', label_en: 'Schematic Design', label_ar: 'التصميم الابتدائي', step: 2 },
  { id: 'development', label_en: 'Design Development', label_ar: 'التطوير المعماري', step: 3 },
  { id: 'bim_coordination', label_en: 'BIM Coordination', label_ar: 'تنسيق الـ BIM الإنشائي', step: 4 },
  { id: 'approvals', label_en: 'Authority Approvals', label_ar: 'الاعتمادات والتراخيص', step: 5 },
  { id: 'tender', label_en: 'Tendering & Bidding', label_ar: 'وثائق الطرح والمناقصات', step: 6 },
  { id: 'procurement', label_en: 'Procurement & Awards', label_ar: 'الترسية والتعاقدات', step: 7 },
  { id: 'supervision', label_en: 'Site Supervision', label_ar: 'الإشراف الميداني', step: 8 },
  { id: 'handover', label_en: 'Handover & Commissioning', label_ar: 'التسليم والتشغيل', step: 9 },
];

const LOCATION_PRESETS = [
  { label: 'الرياض (KAFD)', label_en: 'Riyadh (KAFD)', loc_ar: 'مركز الملك عبد الله المالي، الرياض', loc_en: 'KAFD, Riyadh, Saudi Arabia', country_ar: 'السعودية', country_en: 'KSA', lat: 24.7677, lng: 46.6384 },
  { label: 'القاهرة (الزمالك)', label_en: 'Cairo (Zamalek)', loc_ar: 'حي الزمالك، القاهرة', loc_en: 'Zamalek, Cairo, Egypt', country_ar: 'مصر', country_en: 'Egypt', lat: 30.0617, lng: 31.2198 },
  { label: 'دبي (وسط المدينة)', label_en: 'Dubai (Downtown)', loc_ar: 'وسط مدينة دبي، الإمارات', loc_en: 'Downtown Dubai, UAE', country_ar: 'الإمارات', country_en: 'UAE', lat: 25.1972, lng: 55.2744 },
  { label: 'جدة (الكورنيش)', label_en: 'Jeddah (Corniche)', loc_ar: 'كورنيش جدة الشمالي', loc_en: 'North Corniche, Jeddah, KSA', country_ar: 'السعودية', country_en: 'KSA', lat: 21.5433, lng: 39.1728 },
  { label: 'الساحل الشمالي', label_en: 'North Coast', loc_ar: 'رأس الحكمة، الساحل الشمالي', loc_en: 'Ras El Hekma, North Coast, Egypt', country_ar: 'مصر', country_en: 'Egypt', lat: 31.1167, lng: 27.8500 },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);

  const { t, isRtl, locale } = useAdminLang();

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Custom Delete Confirm Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: ''
  });

  // World-Class Feature States
  const [monographProject, setMonographProject] = useState<Project | null>(null);
  const [showBeforeAfterModal, setShowBeforeAfterModal] = useState(false);
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<string | null>(null);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  const [formData, setFormData] = useState<Partial<Project>>({
    code: '',
    slug: '',
    title_en: '',
    title_ar: '',
    subtitle_en: '',
    subtitle_ar: '',
    sector_en: 'Residential',
    sector_ar: 'القطاع السكني',
    services_en: ['Architecture'],
    services_ar: ['الاستشارات المعمارية'],
    location_en: 'Riyadh, Saudi Arabia',
    location_ar: 'الرياض، المملكة العربية السعودية',
    country_en: 'KSA',
    country_ar: 'السعودية',
    client_en: '',
    client_ar: '',
    year: 2024,
    area_sqm: '25,000 m²',
    status: 'completed',
    publish_status: 'Published',
    is_featured: false,
    cover_image: '',
    gallery_images: [],
    vision_en: '',
    vision_ar: '',
    details_en: '',
    details_ar: '',
    lat: 24.7677,
    lng: 46.6384,
    display_order: 1,
    lifecycle_stage: 'supervision',
    focal_point: { x: 50, y: 50 },
    as_built_image: ''
  });

  // Check for unsaved draft in localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const draft = localStorage.getItem('viwan_project_form_draft');
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          if (parsed && (parsed.title_en || parsed.title_ar || parsed.code)) {
            setHasSavedDraft(true);
          }
        } catch {}
      }
    }
  }, []);

  // Debounced auto-save draft while modal is open
  useEffect(() => {
    if (!isModalOpen) return;
    const timer = setTimeout(() => {
      if (formData.title_en || formData.title_ar || formData.code || formData.cover_image) {
        localStorage.setItem('viwan_project_form_draft', JSON.stringify(formData));
        const timeStr = new Date().toLocaleTimeString(isRtl ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
        setLastAutoSaveTime(timeStr);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [formData, isModalOpen, isRtl]);

  const handleRestoreDraft = () => {
    const draft = localStorage.getItem('viwan_project_form_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData(parsed);
        setHasSavedDraft(false);
      } catch {}
    }
  };

  const handleClearDraft = () => {
    localStorage.removeItem('viwan_project_form_draft');
    setHasSavedDraft(false);
    setLastAutoSaveTime(null);
  };

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const json = await res.json();
      if (json.success && Array.isArray(json.projects)) {
        setProjects(json.projects);
        if (typeof window !== 'undefined') {
          localStorage.setItem('viwan_projects', JSON.stringify(json.projects));
        }
        return;
      }
    } catch (e) {
      console.error('Error fetching admin projects:', e);
    }
    setProjects(DataStore.getProjects());
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    const nextNum = projects.length + 1;
    const formattedIndex = String(nextNum).padStart(2, '0');
    setFormData({
      id: `prj-${Date.now()}`,
      code: `PRJ-2026-${formattedIndex}`,
      slug: '',
      index: formattedIndex,
      title_en: '',
      title_ar: '',
      name: '',
      nameAr: '',
      subtitle_en: '',
      subtitle_ar: '',
      tagline: '',
      taglineAr: '',
      heading: '',
      headingAr: '',
      description: '',
      descriptionAr: '',
      philosophy: '',
      philosophyAr: '',
      sector_en: 'Residential',
      sector_ar: 'القطاع السكني',
      type: 'Private Residence',
      category: 'Private Residence',
      disciplines: ['Architecture', 'Interior Design'],
      services_en: ['Architecture', 'Interior Design'],
      services_ar: ['الاستشارات المعمارية', 'التصميم الداخلي'],
      scope: ['Architecture Design', 'Interior Design', 'Technical Documentation'],
      location_en: 'New Cairo, Egypt',
      location_ar: 'القاهرة الجديدة، مصر',
      location: 'New Cairo',
      country_en: 'Egypt',
      country_ar: 'مصر',
      country: 'Egypt',
      client_en: 'Private Client',
      client_ar: 'عميل خاص',
      year: 2026,
      area_sqm: '1,200 m²',
      status: 'completed',
      publish_status: 'Published',
      is_featured: false,
      featured: false,
      cover_image: '/images/project-private-residence.png',
      cover: '/images/project-private-residence.png',
      interior: '/images/interior-living-marble.jpg',
      cinematic: '/images/hero-villa.png',
      gallery: [],
      gallery_images: [],
      vision_en: '',
      vision_ar: '',
      details_en: '',
      details_ar: '',
      lat: 30.0131,
      lng: 31.4913,
      display_order: nextNum,
      lifecycle_stage: 'supervision',
      focal_point: { x: 50, y: 50 },
      as_built_image: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prj: Project) => {
    setEditingProject(prj);
    const resolvedTitleEn = prj.title_en || prj.name || prj.title || '';
    const resolvedTitleAr = prj.title_ar || prj.nameAr || prj.titleAr || resolvedTitleEn;
    const resolvedCover = prj.cover_image || prj.cover || prj.coverImage || '/images/project-private-residence.png';
    const resolvedInterior = prj.interior || '/images/interior-living-marble.jpg';
    const resolvedCinematic = prj.cinematic || resolvedCover;
    const resolvedTagline = prj.tagline || prj.subtitle_en || '';
    const resolvedTaglineAr = prj.taglineAr || prj.subtitle_ar || '';
    const resolvedHeading = prj.heading || '';
    const resolvedHeadingAr = prj.headingAr || '';
    const resolvedDesc = prj.description || prj.details_en || '';
    const resolvedDescAr = prj.descriptionAr || prj.details_ar || '';
    const resolvedPhil = prj.philosophy || prj.vision_en || '';
    const resolvedPhilAr = prj.philosophyAr || prj.vision_ar || '';
    const resolvedDisciplines = Array.isArray(prj.disciplines) && prj.disciplines.length > 0 
      ? prj.disciplines 
      : (prj.services_en || ['Architecture']);
    const resolvedScope = Array.isArray(prj.scope) ? prj.scope : ['Concept Design', 'BIM Coordination'];

    let resolvedGallery = Array.isArray(prj.gallery) && prj.gallery.length > 0 ? prj.gallery : [];
    if (resolvedGallery.length === 0 && Array.isArray(prj.gallery_images) && prj.gallery_images.length > 0) {
      resolvedGallery = prj.gallery_images.map((img: string) => ({
        src: img,
        caption: 'Project View',
        category: 'Architecture' as const,
      }));
    }

    setFormData({
      ...prj,
      name: resolvedTitleEn,
      title: resolvedTitleEn,
      title_en: resolvedTitleEn,
      nameAr: resolvedTitleAr,
      title_ar: resolvedTitleAr,
      titleAr: resolvedTitleAr,
      cover: resolvedCover,
      cover_image: resolvedCover,
      coverImage: resolvedCover,
      interior: resolvedInterior,
      cinematic: resolvedCinematic,
      tagline: resolvedTagline,
      subtitle_en: resolvedTagline,
      subtitle_ar: resolvedTaglineAr,
      taglineAr: resolvedTaglineAr,
      heading: resolvedHeading,
      headingAr: resolvedHeadingAr,
      description: resolvedDesc,
      descriptionAr: resolvedDescAr,
      details_en: resolvedDesc,
      details_ar: resolvedDescAr,
      philosophy: resolvedPhil,
      vision_en: resolvedPhil,
      vision_ar: resolvedPhilAr,
      disciplines: resolvedDisciplines,
      services_en: resolvedDisciplines as string[],
      scope: resolvedScope,
      gallery: resolvedGallery,
      gallery_images: resolvedGallery.map(g => g.src),
      is_featured: Boolean(prj.is_featured || prj.featured || prj.publish_status === 'Featured'),
      featured: Boolean(prj.is_featured || prj.featured || prj.publish_status === 'Featured'),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDeleteProject = async () => {
    if (deleteModal.id) {
      const target = projects.find((p) => p.id === deleteModal.id || p.slug === deleteModal.id);
      const slugToDelete = target?.slug || deleteModal.id;
      try {
        await fetch(`/api/admin/projects?slug=${encodeURIComponent(slugToDelete)}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Delete error:', err);
      }
      DataStore.deleteProject(slugToDelete);
      await loadProjects();
      setDeleteModal({ isOpen: false, id: '', title: '' });
    }
  };

  const handleToggleFeatured = async (prj: Project) => {
    const isNowFeatured = !(prj.is_featured || prj.featured);
    try {
      await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: prj.slug,
          is_featured: isNowFeatured,
          featured: isNowFeatured,
          publish_status: isNowFeatured ? 'Featured' : 'Published',
        }),
      });
      await loadProjects();
    } catch (e) {
      console.error('Toggle featured error:', e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const titleEn = formData.title_en || formData.name || formData.title;
    if (!titleEn) {
      alert(isRtl ? 'يرجى إدخال اسم المشروع بالإنجليزي' : 'Please enter project title');
      return;
    }

    const titleAr = formData.title_ar || formData.nameAr || titleEn;
    const coverImg = formData.cover || formData.cover_image || '/images/project-private-residence.png';
    const interiorImg = formData.interior || '/images/interior-living-marble.jpg';
    const cinematicImg = formData.cinematic || coverImg;
    const isFeat = formData.publish_status === 'Featured' || Boolean(formData.is_featured || formData.featured);
    const nextDisciplines = Array.isArray(formData.disciplines) && formData.disciplines.length > 0 
      ? formData.disciplines 
      : (formData.services_en || ['Architecture']);
    const nextScope = Array.isArray(formData.scope) && formData.scope.length > 0 
      ? formData.scope 
      : ['Concept Design', 'BIM Coordination'];
    const nextGallery = Array.isArray(formData.gallery) ? formData.gallery : [];

    const prjToSave: Project = {
      ...formData,
      id: formData.id || `prj-${Date.now()}`,
      code: formData.code || `PRJ-2026-${String(projects.length + 1).padStart(2, '0')}`,
      slug: formData.slug || titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: titleEn,
      title: titleEn,
      title_en: titleEn,
      nameAr: titleAr,
      title_ar: titleAr,
      titleAr: titleAr,
      tagline: formData.tagline || formData.subtitle_en || '',
      subtitle_en: formData.subtitle_en || formData.tagline || '',
      subtitle_ar: formData.subtitle_ar || formData.taglineAr || '',
      taglineAr: formData.taglineAr || formData.subtitle_ar || '',
      heading: formData.heading || '',
      headingAr: formData.headingAr || '',
      description: formData.description || formData.details_en || '',
      descriptionAr: formData.descriptionAr || formData.details_ar || '',
      details_en: formData.details_en || formData.description || '',
      details_ar: formData.details_ar || formData.descriptionAr || '',
      philosophy: formData.philosophy || formData.vision_en || '',
      vision_en: formData.vision_en || formData.philosophy || '',
      vision_ar: formData.vision_ar || formData.philosophyAr || '',
      sector_en: formData.sector_en || formData.type || 'Residential',
      sector_ar: formData.sector_ar || 'سكني',
      type: formData.type || formData.sector_en || 'Private Residence',
      category: formData.category || formData.type || formData.sector_en || 'Private Residence',
      disciplines: nextDisciplines,
      services_en: nextDisciplines as string[],
      services_ar: formData.services_ar || ['الاستشارات المعمارية'],
      scope: nextScope,
      location: formData.location || formData.location_en || 'Cairo',
      location_en: formData.location_en || formData.location || 'Cairo',
      location_ar: formData.location_ar || 'القاهرة',
      country: formData.country || formData.country_en || 'Egypt',
      country_en: formData.country_en || formData.country || 'Egypt',
      country_ar: formData.country_ar || 'مصر',
      client_en: formData.client_en || 'Private Client',
      client_ar: formData.client_ar || 'عميل خاص',
      year: formData.year || 2026,
      area_sqm: formData.area_sqm || '1,200 m²',
      status: formData.status || 'completed',
      publish_status: isFeat ? 'Featured' : (formData.publish_status || 'Published'),
      is_featured: isFeat,
      featured: isFeat,
      cover: coverImg,
      cover_image: coverImg,
      coverImage: coverImg,
      interior: interiorImg,
      cinematic: cinematicImg,
      gallery: nextGallery,
      gallery_images: nextGallery.length > 0 ? nextGallery.map((g: any) => typeof g === 'string' ? g : g.src) : [coverImg],
      lat: Number(formData.lat) || 30.0444,
      lng: Number(formData.lng) || 31.2357,
      display_order: Number(formData.display_order) || 1,
      lifecycle_stage: formData.lifecycle_stage || 'supervision',
      focal_point: formData.focal_point || { x: 50, y: 50 },
      as_built_image: formData.as_built_image || ''
    };

    try {
      const isEdit = Boolean(editingProject);
      const res = await fetch('/api/admin/projects', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prjToSave),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save project');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      alert(isRtl ? 'حدث خطأ أثناء الحفظ في قاعدة البيانات' : 'Error saving project to database: ' + err.message);
      return;
    }

    DataStore.saveProject(prjToSave);
    handleClearDraft();
    await loadProjects();
    setIsModalOpen(false);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSector = sectorFilter === 'ALL' || (p.sector_en && p.sector_en.toLowerCase() === sectorFilter.toLowerCase()) || (p.type && p.type.toLowerCase() === sectorFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || (p.publish_status && p.publish_status.toLowerCase() === statusFilter.toLowerCase());
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query ||
      (p.title_en && p.title_en.toLowerCase().includes(query)) ||
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.title_ar && p.title_ar.toLowerCase().includes(query)) ||
      (p.nameAr && p.nameAr.toLowerCase().includes(query)) ||
      (p.code && p.code.toLowerCase().includes(query)) ||
      (p.location_en && p.location_en.toLowerCase().includes(query));
    return matchesSector && matchesStatus && matchesQuery;
  });

  const pageSize = 12;
  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-8">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E2D8]">
        <div>
          <h1 className="font-cinzel text-2xl text-charcoal font-normal uppercase tracking-wide">
            {t.projects.title}
          </h1>
          <p className="text-xs text-stone-text font-light mt-0.5">
            {t.projects.subtitle}
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
              placeholder={t.projects.searchPlaceholder}
              className={`w-full bg-white border border-[#E7E2D8] focus:border-gold text-xs text-charcoal ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 outline-none`}
            />
          </div>

          {/* Add Project Button */}
          <button
            onClick={handleOpenAdd}
            className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse shrink-0 group shadow-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 text-gold group-hover:text-white" />
            <span>{t.projects.addNew}</span>
          </button>
        </div>
      </div>

      {/* 2. FILTER & VIEW MODE BAR */}
      <div className="bg-white border border-[#E7E2D8] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Sector Filter */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-[10px] uppercase font-semibold text-stone-dark tracking-wider">
              {t.projects.filterSector}
            </span>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="bg-[#FAF6EE] border border-[#E7E2D8] text-xs text-charcoal px-3 py-1.5 outline-none focus:border-gold"
            >
              <option value="ALL">{t.projects.all}</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Master Planning">Master Planning</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-[10px] uppercase font-semibold text-stone-dark tracking-wider">
              {t.projects.filterStatus}
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FAF6EE] border border-[#E7E2D8] text-xs text-charcoal px-3 py-1.5 outline-none focus:border-gold"
            >
              <option value="ALL">{t.projects.all}</option>
              <option value="Featured">Featured</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        {/* View Toggle (Table / Grid) */}
        <div className="flex items-center space-x-1 border border-[#E7E2D8] p-0.5 bg-[#FAF6EE]">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 transition-colors ${
              viewMode === 'table' ? 'bg-white text-gold shadow-xs' : 'text-stone-400 hover:text-charcoal'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 transition-colors ${
              viewMode === 'grid' ? 'bg-white text-gold shadow-xs' : 'text-stone-400 hover:text-charcoal'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. PROJECTS LIST (TABLE / MOBILE CARDS) */}
      {viewMode === 'table' ? (
        <>
          {/* Mobile Cards View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {paginatedProjects.length === 0 ? (
              <div className="bg-white border border-[#E7E2D8] p-8 text-center text-xs text-stone-500">
                {isRtl ? 'لا توجد مشاريع مطابقة للبحث' : 'No projects found'}
              </div>
            ) : (
              paginatedProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-[#E7E2D8] p-4 space-y-3.5 shadow-sm hover:border-gold/60 transition-colors"
                >
                  {/* Top Row: Cover + Code + Title + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0">
                      <div className="w-14 h-14 bg-stone-200 border border-[#E7E2D8] overflow-hidden shrink-0 shadow-sm relative">
                        <img
                          src={project.cover || project.cover_image || project.coverImage || '/images/project-private-residence.png'}
                          alt={project.title_en || project.name || 'Project'}
                          className="w-full h-full object-cover"
                        />
                        {(project.is_featured || project.featured) && (
                          <div className="absolute top-1 right-1 bg-gold text-charcoal p-0.5 shadow-sm">
                            <Star className="w-2.5 h-2.5 fill-charcoal" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
                          {project.code || `PRJ-${project.index || '01'}`}
                        </div>
                        <h3 className="font-cinzel text-xs font-bold text-charcoal uppercase truncate">
                          {isRtl ? (project.title_ar || project.nameAr || project.title_en || project.name) : (project.title_en || project.name)}
                        </h3>
                        <p className="text-[10px] text-stone-500 truncate mt-0.5">
                          {project.type || (isRtl ? project.sector_ar : project.sector_en)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 border shrink-0 ${
                        project.publish_status === 'Featured' || project.is_featured || project.featured
                          ? 'bg-gold/10 text-charcoal border-gold'
                          : project.publish_status === 'Published'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-stone-100 text-stone-500 border-stone-300'
                      }`}
                    >
                      {project.is_featured || project.featured ? (isRtl ? 'مميز' : 'Featured') : project.publish_status}
                    </span>
                  </div>

                  {/* Middle: Location & Stage */}
                  <div className="pt-2 border-t border-[#E7E2D8]/60 flex items-center justify-between text-xs text-stone-600">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse text-[11px] truncate">
                      <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span className="truncate">{isRtl ? (project.location_ar || project.location) : (project.location_en || project.location)}</span>
                    </div>
                    {project.lifecycle_stage && (
                      <div className="text-[9px] font-mono text-gold bg-[#121212] px-2 py-0.5 border border-stone-800 uppercase tracking-wider">
                        {LIFECYCLE_STAGES.find((s) => s.id === project.lifecycle_stage)?.step}. {isRtl ? LIFECYCLE_STAGES.find((s) => s.id === project.lifecycle_stage)?.label_ar : LIFECYCLE_STAGES.find((s) => s.id === project.lifecycle_stage)?.label_en}
                      </div>
                    )}
                  </div>

                  {/* Bottom: Action Buttons */}
                  <div className="pt-2 border-t border-[#E7E2D8]/60 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleFeatured(project)}
                      className={`px-2.5 py-1.5 border border-[#E7E2D8] text-[10px] font-mono flex items-center space-x-1.5 rtl:space-x-reverse transition-colors ${
                        project.is_featured || project.featured ? 'bg-gold/15 text-charcoal border-gold' : 'bg-[#FAF6EE] text-stone-600 hover:border-gold'
                      }`}
                      title={isRtl ? 'تمييز على الصفحة الرئيسية' : 'Toggle Featured'}
                    >
                      <Star className={`w-3.5 h-3.5 ${project.is_featured || project.featured ? 'text-gold fill-gold' : 'text-stone-400'}`} />
                      <span>{project.is_featured || project.featured ? (isRtl ? 'مميز' : 'Featured') : (isRtl ? 'تمييز' : 'Feature')}</span>
                    </button>

                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="p-2 bg-[#FAF6EE] hover:bg-gold hover:text-white text-charcoal border border-[#E7E2D8] transition-colors"
                        title={t.projects.view}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(project)}
                        className="p-2 bg-[#FAF6EE] hover:bg-gold hover:text-white text-charcoal border border-[#E7E2D8] transition-colors"
                        title={t.projects.edit}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, isRtl ? project.title_ar : project.title_en)}
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

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border border-[#E7E2D8] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead>
                  <tr className="border-b border-[#E7E2D8] text-[10px] tracking-widest uppercase text-stone-500 font-semibold bg-[#FAF6EE]/50">
                    <th className="py-4 px-6">{t.projects.tableDetails}</th>
                    <th className="py-4 px-6">{t.projects.tableSector}</th>
                    <th className="py-4 px-6">{t.projects.tableLocation}</th>
                    <th className="py-4 px-6">{t.projects.tableStatus}</th>
                    <th className="py-4 px-6 text-right rtl:text-left">{t.projects.tableActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E2D8]">
                {paginatedProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-[#FAF6EE]/40 transition-colors group">
                    {/* Cover & Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="w-14 h-14 bg-stone-200 border border-[#E7E2D8] overflow-hidden shrink-0 shadow-sm relative">
                          <img
                            src={project.cover || project.cover_image || project.coverImage || '/images/project-private-residence.png'}
                            alt={project.title_en || project.name || 'Project'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            style={{
                              objectPosition: project.focal_point
                                ? `${project.focal_point.x}% ${project.focal_point.y}%`
                                : 'center',
                            }}
                          />
                          {(project.is_featured || project.featured) && (
                            <div className="absolute top-1 right-1 bg-gold text-charcoal p-0.5 shadow-sm">
                              <Star className="w-2.5 h-2.5 fill-charcoal" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
                            {project.code || `PRJ-${project.index || '01'}`}
                          </div>
                          <div className="font-cinzel text-xs font-semibold text-charcoal uppercase group-hover:text-gold transition-colors">
                            {isRtl ? (project.title_ar || project.nameAr || project.title_en || project.name) : (project.title_en || project.name)}
                          </div>
                          <div className="text-[10px] text-stone-text font-light truncate max-w-xs">
                            {isRtl ? (project.subtitle_ar || project.taglineAr || project.tagline) : (project.subtitle_en || project.tagline || project.heading)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-charcoal">{project.type || (isRtl ? project.sector_ar : project.sector_en)}</div>
                      <div className="text-[10px] text-stone-text font-light truncate max-w-xs">
                        {(project.disciplines || project.services_en || []).join(' • ')}
                      </div>
                    </td>

                    {/* Location & Coordinates */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse text-charcoal font-medium">
                        <MapPin className="w-3 h-3 text-gold" />
                        <span>{isRtl ? (project.location_ar || project.location) : (project.location_en || project.location)}</span>
                      </div>
                      <div className="text-[10px] font-mono text-stone-400 mt-0.5">
                        {project.lat?.toFixed(4)}, {project.lng?.toFixed(4)}
                      </div>
                    </td>

                    {/* Publish Status & Lifecycle Stage */}
                    <td className="py-4 px-6 space-y-1">
                      <div>
                        <span
                          className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 border inline-block ${
                            project.publish_status === 'Featured' || project.is_featured || project.featured
                              ? 'bg-gold/10 text-charcoal border-gold'
                              : project.publish_status === 'Published'
                              ? 'bg-stone-100 text-charcoal border-stone-300'
                              : 'bg-stone-100 text-stone-500 border-dashed border-stone-300'
                          }`}
                        >
                          {project.is_featured || project.featured ? (isRtl ? 'مميز' : 'Featured') : project.publish_status}
                        </span>
                      </div>
                      {project.lifecycle_stage && (
                        <div className="text-[9px] font-mono text-stone-500 uppercase tracking-wider flex items-center space-x-1 rtl:space-x-reverse">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                          <span className="truncate">
                            {LIFECYCLE_STAGES.find((s) => s.id === project.lifecycle_stage)?.step}.{' '}
                            {isRtl
                              ? LIFECYCLE_STAGES.find((s) => s.id === project.lifecycle_stage)?.label_ar
                              : LIFECYCLE_STAGES.find((s) => s.id === project.lifecycle_stage)?.label_en}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right rtl:text-left">
                      <div className="flex items-center justify-end rtl:justify-start space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleToggleFeatured(project)}
                          className={`p-1.5 transition-colors ${project.is_featured || project.featured ? 'text-gold fill-gold' : 'text-stone-400 hover:text-gold'}`}
                          title={isRtl ? 'تمييز على الصفحة الرئيسية' : 'Toggle Featured on Homepage'}
                        >
                          <Star className={`w-4 h-4 ${project.is_featured || project.featured ? 'fill-gold text-gold' : ''}`} />
                        </button>
                        <button
                          onClick={() => setMonographProject(project)}
                          className="p-1.5 text-stone-400 hover:text-gold transition-colors"
                          title={isRtl ? 'تصدير وثيقة مونوغراف فاخرة (Client Monograph PDF)' : 'Export Client Monograph PDF'}
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          className="p-1.5 text-stone-400 hover:text-charcoal transition-colors"
                          title={t.projects.view}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 text-stone-400 hover:text-gold transition-colors"
                          title={t.projects.edit}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, isRtl ? project.title_ar : project.title_en)}
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

          {/* Pagination */}
          <div className="p-4 border-t border-[#E7E2D8] flex items-center justify-between text-xs text-stone-500 bg-[#FAF6EE]/30">
            <div>
              {isRtl
                ? `عرض ${(currentPage - 1) * pageSize + 1} إلى ${Math.min(currentPage * pageSize, filteredProjects.length)} من أصل ${filteredProjects.length} مشروع`
                : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, filteredProjects.length)} of ${filteredProjects.length} projects`}
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 border border-[#E7E2D8] disabled:opacity-30 hover:border-gold transition-colors"
              >
                {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              <span className="font-mono text-xs text-charcoal font-semibold px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 border border-[#E7E2D8] disabled:opacity-30 hover:border-gold transition-colors"
              >
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        </>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-[#E7E2D8] overflow-hidden hover:border-gold transition-all duration-300 group flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="aspect-[16/10] bg-stone-200 overflow-hidden relative border-b border-[#E7E2D8]">
                  <img
                    src={project.cover || project.cover_image || project.coverImage || '/images/project-private-residence.png'}
                    alt={project.title_en || project.name || 'Project'}
                    style={
                      project.focal_point
                        ? { objectPosition: `${project.focal_point.x}% ${project.focal_point.y}%` }
                        : undefined
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-charcoal/90 text-gold font-mono text-[10px] px-2 py-0.5">
                    {project.code || `PRJ-${project.index || '01'}`}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5 rtl:space-x-reverse">
                    <span
                      className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 border ${
                        project.publish_status === 'Featured' || project.is_featured || project.featured
                          ? 'bg-gold text-charcoal border-gold font-bold'
                          : 'bg-black/75 text-white border-stone-600'
                      }`}
                    >
                      {project.is_featured || project.featured ? (isRtl ? 'مميز' : 'Featured') : project.publish_status}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <div className="text-[10px] text-gold uppercase tracking-wider font-semibold">
                      {project.type || (isRtl ? project.sector_ar : project.sector_en)}
                    </div>
                    <h3 className="font-cinzel text-sm font-semibold text-charcoal uppercase group-hover:text-gold transition-colors">
                      {isRtl ? (project.title_ar || project.nameAr || project.title_en || project.name) : (project.title_en || project.name)}
                    </h3>
                  </div>
                  <div className="text-xs text-stone-500 flex items-center space-x-1 rtl:space-x-reverse">
                    <MapPin className="w-3 h-3 text-gold" />
                    <span>{isRtl ? (project.location_ar || project.location) : (project.location_en || project.location)}</span>
                  </div>
                  {project.lifecycle_stage && (
                    <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider flex items-center space-x-1.5 rtl:space-x-reverse pt-2 border-t border-stone-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      <span className="truncate">
                        {LIFECYCLE_STAGES.find((s) => s.id === project.lifecycle_stage)?.step}.{' '}
                        {isRtl
                          ? LIFECYCLE_STAGES.find((s) => s.id === project.lifecycle_stage)?.label_ar
                          : LIFECYCLE_STAGES.find((s) => s.id === project.lifecycle_stage)?.label_en}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-[#E7E2D8] bg-[#FAF6EE]/50 flex items-center justify-between">
                <Link
                  href={`/projects/${project.slug}`}
                  target="_blank"
                  className="text-[11px] font-semibold text-gold hover:underline flex items-center space-x-1 rtl:space-x-reverse uppercase"
                >
                  <span>{isRtl ? 'معاينة المشروع' : 'View On Site'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => handleToggleFeatured(project)}
                    className={`p-1 transition-colors ${project.is_featured || project.featured ? 'text-gold fill-gold' : 'text-stone-400 hover:text-gold'}`}
                    title={isRtl ? 'تمييز على الصفحة الرئيسية' : 'Toggle Featured on Homepage'}
                  >
                    <Star className={`w-3.5 h-3.5 ${project.is_featured || project.featured ? 'fill-gold text-gold' : ''}`} />
                  </button>
                  <button
                    onClick={() => setMonographProject(project)}
                    className="p-1 text-stone-400 hover:text-gold transition-colors"
                    title={isRtl ? 'تصدير وثيقة مونوغراف فاخرة (Client Monograph PDF)' : 'Export Client Monograph PDF'}
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="p-1 text-stone-400 hover:text-gold"
                    title={t.projects.edit}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id, isRtl ? project.title_ar : project.title_en)}
                    className="p-1 text-stone-400 hover:text-red-600"
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
      {/* 4. ADD / EDIT ARCHITECTURAL PROJECT MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#FAF6EE] max-w-3xl w-full my-auto max-h-[88vh] overflow-y-auto border border-[#E7E2D8] p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} p-2 text-stone-500 hover:text-charcoal`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-cinzel text-xl font-semibold text-charcoal uppercase">
                  {editingProject ? t.projects.editModalTitle : t.projects.addModalTitle}
                </h2>
                {lastAutoSaveTime && (
                  <div className="text-[10px] font-mono text-stone-500 flex items-center space-x-1.5 rtl:space-x-reverse bg-white px-2.5 py-1 border border-[#E7E2D8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{isRtl ? `حفظ تلقائي ${lastAutoSaveTime}` : `Auto-saved at ${lastAutoSaveTime}`}</span>
                  </div>
                )}
              </div>

              {/* Smart Auto-Draft Recovery Banner */}
              {hasSavedDraft && !editingProject && (
                <div className="p-3 bg-gold/10 border border-gold/40 flex items-center justify-between text-xs text-charcoal shadow-2xs">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RotateCcw className="w-4 h-4 text-gold shrink-0" />
                    <span>
                      {isRtl
                        ? 'توجد مسودة غير محفوظة لمشروع سابق محفوظة محلياً. هل تود استرجاعها؟'
                        : 'An unsaved local draft from a previous session was detected. Would you like to restore it?'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse shrink-0">
                    <button
                      type="button"
                      onClick={handleRestoreDraft}
                      className="px-2.5 py-1 bg-charcoal text-white text-[11px] font-medium hover:bg-gold transition-colors"
                    >
                      {isRtl ? 'استعادة المسودة' : 'Restore Draft'}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearDraft}
                      className="px-2.5 py-1 border border-stone-300 text-stone-500 text-[11px] hover:text-charcoal hover:border-charcoal transition-colors"
                    >
                      {isRtl ? 'تجاهل' : 'Discard'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* SECTION 1: IDENTITY & TITLES */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-gold text-xs font-semibold uppercase tracking-wider pb-1 border-b border-[#E7E2D8]">
                  <Building2 className="w-4 h-4 text-gold" />
                  <span>{isRtl ? '1. بيانات وهوية المشروع والتصنيف' : '1. PROJECT IDENTITY & CLASSIFICATION'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.code}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code || ''}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="PRJ-2026-01"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal font-mono outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.slug}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="private-residence-01"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal font-mono outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {isRtl ? 'رقم الترتيب (Index)' : 'INDEX'}
                    </label>
                    <input
                      type="text"
                      value={formData.index || ''}
                      onChange={(e) => setFormData({ ...formData, index: e.target.value })}
                      placeholder="01"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal font-mono outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.titleEn}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title_en || formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value, name: e.target.value, title: e.target.value })}
                      placeholder="Private Residence 01"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.titleAr}
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formData.title_ar || formData.nameAr || ''}
                      onChange={(e) => setFormData({ ...formData, title_ar: e.target.value, nameAr: e.target.value, titleAr: e.target.value })}
                      placeholder="إقامة خاصة 01"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {isRtl ? 'نوع المشروع (Type / Category)' : 'PROJECT TYPE / CATEGORY'}
                    </label>
                    <select
                      value={formData.type || formData.sector_en || 'Private Residence'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value, category: e.target.value, sector_en: e.target.value })}
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold font-medium"
                    >
                      <option value="Private Residence">Private Residence (إقامة خاصة)</option>
                      <option value="Private Villa">Private Villa (فيلا خاصة)</option>
                      <option value="Apartment">Apartment (شقة فاخرة)</option>
                      <option value="Commercial">Commercial (تجاري وإداري)</option>
                      <option value="Luxury Living">Luxury Living (سكن فاخر / ضيافة)</option>
                      <option value="Hospitality">Hospitality (فندقة ومنتجعات)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.statusLabel}
                    </label>
                    <select
                      value={formData.status || 'completed'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    >
                      <option value="completed">{isRtl ? 'مكتمل ومنفذ' : 'Completed'}</option>
                      <option value="ongoing">{isRtl ? 'قيد التنفيذ والإنشاء' : 'Ongoing / Under Construction'}</option>
                      <option value="concept">{isRtl ? 'مفهوم ورؤية تصميمية' : 'Concept / Design Phase'}</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.publishStatusLabel}
                    </label>
                    <select
                      value={formData.publish_status || 'Published'}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        const isFeat = val === 'Featured';
                        setFormData({ ...formData, publish_status: val, is_featured: isFeat, featured: isFeat });
                      }}
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    >
                      <option value="Published">{t.projects.published}</option>
                      <option value="Featured">{t.projects.featured} ★</option>
                      <option value="Draft">{t.projects.draft}</option>
                    </select>
                  </div>
                </div>

                {/* Featured on Homepage Toggle */}
                <div className="p-3 bg-gold/10 border border-gold/30 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
                    <Star className={`w-4 h-4 ${formData.is_featured || formData.featured ? 'fill-gold text-gold' : 'text-stone-400'}`} />
                    <div>
                      <div className="text-xs font-semibold text-charcoal">
                        {isRtl ? 'المشروع مميز في الصفحة الرئيسية (Featured on Homepage)' : 'Featured on Homepage Showcase'}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {isRtl ? 'يظهر في قسم الأعمال المختارة والشاشات السينمائية الرئيسية للموقع' : 'Appears prominently in Selected Projects & Hero Monograph'}
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.is_featured || formData.featured)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData({
                          ...formData,
                          is_featured: checked,
                          featured: checked,
                          publish_status: checked ? 'Featured' : 'Published',
                        });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>

                {/* Disciplines Selection */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                    {isRtl ? 'التخصصات الهندسية للمشروع (Disciplines)' : 'DISCIPLINES'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Architecture', 'Interior Design', 'Landscape', 'Engineering'].map((disc) => {
                      const isSelected = Array.isArray(formData.disciplines) && formData.disciplines.includes(disc);
                      return (
                        <button
                          key={disc}
                          type="button"
                          onClick={() => {
                            const cur = Array.isArray(formData.disciplines) ? [...formData.disciplines] : [];
                            const next = isSelected ? cur.filter((d) => d !== disc) : [...cur, disc];
                            setFormData({ ...formData, disciplines: next, services_en: next as string[] });
                          }}
                          className={`px-3 py-1.5 text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                            isSelected ? 'bg-gold/20 border-gold text-charcoal font-semibold shadow-2xs' : 'bg-white border-[#E7E2D8] text-stone-600 hover:border-gold'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-gold" />}
                          <span>{disc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scope of Work */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                    {isRtl ? 'نطاق العمل والخدمات (Scope of Work - مفصولة بفواصل)' : 'SCOPE OF WORK (COMMA SEPARATED)'}
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(formData.scope) ? formData.scope.join(', ') : (formData.scope || '')}
                    onChange={(e) => {
                      const items = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      setFormData({ ...formData, scope: items });
                    }}
                    placeholder="Architecture Design, Interior Design, Landscape Design, Technical Documentation, BIM Coordination"
                    className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* SECTION 2: GEOGRAPHIC LOCATION & COORDINATES */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-[#E7E2D8]">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-gold text-xs font-semibold uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span>{isRtl ? '2. الموقع الجغرافي والبلد' : '2. GEOGRAPHIC LOCATION & COUNTRY'}</span>
                  </div>
                </div>

                {/* Location Presets Fast Picker */}
                <div className="bg-[#F8F3E9] p-3.5 border border-[#E7E2D8] space-y-2">
                  <div className="text-[10px] uppercase font-semibold text-stone-600 flex items-center space-x-1.5 rtl:space-x-reverse">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    <span>{isRtl ? 'أو اختر موقع مدينة جاهز بضغطة زر واحدة:' : 'FAST CITY PRESETS:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {LOCATION_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            location: preset.label_en,
                            location_ar: preset.loc_ar,
                            location_en: preset.loc_en,
                            country: preset.country_en,
                            country_ar: preset.country_ar,
                            country_en: preset.country_en,
                            lat: preset.lat,
                            lng: preset.lng
                          });
                        }}
                        className="px-3 py-1.5 bg-white border border-[#E7E2D8] hover:border-gold text-[11px] font-medium text-charcoal transition-colors flex items-center space-x-1.5 rtl:space-x-reverse shadow-2xs"
                      >
                        <MapPin className="w-3 h-3 text-gold" />
                        <span>{isRtl ? preset.label : preset.label_en}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.locationEn}
                    </label>
                    <input
                      type="text"
                      value={formData.location_en || formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location_en: e.target.value, location: e.target.value })}
                      placeholder="e.g. New Cairo, Egypt"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.locationAr}
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formData.location_ar || ''}
                      onChange={(e) => setFormData({ ...formData, location_ar: e.target.value })}
                      placeholder="مثال: القاهرة الجديدة، مصر"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {isRtl ? 'الدولة (Country)' : 'COUNTRY'}
                    </label>
                    <input
                      type="text"
                      value={formData.country_en || formData.country || ''}
                      onChange={(e) => setFormData({ ...formData, country_en: e.target.value, country: e.target.value })}
                      placeholder="Egypt / KSA / UAE"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.year}
                    </label>
                    <input
                      type="number"
                      value={formData.year || 2026}
                      onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                      placeholder="2026"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal font-mono outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.area}
                    </label>
                    <input
                      type="text"
                      value={formData.area_sqm || ''}
                      onChange={(e) => setFormData({ ...formData, area_sqm: e.target.value })}
                      placeholder="1,850 m²"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: ARCHITECTURAL STORY & NARRATIVE */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-gold text-xs font-semibold uppercase tracking-wider pb-1 border-b border-[#E7E2D8]">
                  <FileText className="w-4 h-4 text-gold" />
                  <span>{isRtl ? '3. السرد المعماري والرؤية والفلسفة' : '3. ARCHITECTURAL STORY, NARRATIVE & PHILOSOPHY'}</span>
                </div>

                {/* Tagline / Subtitle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {isRtl ? 'العبارة المميزة (Tagline EN)' : 'TAGLINE (EN)'}
                    </label>
                    <input
                      type="text"
                      value={formData.tagline || formData.subtitle_en || ''}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value, subtitle_en: e.target.value })}
                      placeholder="A home in harmony with its surroundings."
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {isRtl ? 'العبارة المميزة (Tagline AR)' : 'TAGLINE (AR)'}
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formData.taglineAr || formData.subtitle_ar || ''}
                      onChange={(e) => setFormData({ ...formData, taglineAr: e.target.value, subtitle_ar: e.target.value })}
                      placeholder="منزل متناغم مع محيطه الطبيعي."
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Heading */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {isRtl ? 'العنوان التحريري (Headline EN)' : 'HEADLINE (EN)'}
                    </label>
                    <input
                      type="text"
                      value={formData.heading || ''}
                      onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                      placeholder="A refined balance of architecture and nature."
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {isRtl ? 'العنوان التحريري (Headline AR)' : 'HEADLINE (AR)'}
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formData.headingAr || ''}
                      onChange={(e) => setFormData({ ...formData, headingAr: e.target.value })}
                      placeholder="توازن دقيق بين روعة العمارة وجمال الطبيعة."
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {isRtl ? 'الوصف المعماري التفصيلي (Description EN)' : 'ARCHITECTURAL DESCRIPTION (EN)'}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description || formData.details_en || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value, details_en: e.target.value })}
                      placeholder="This private residence was designed as a serene retreat..."
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold resize-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {isRtl ? 'الوصف المعماري التفصيلي (Description AR)' : 'ARCHITECTURAL DESCRIPTION (AR)'}
                    </label>
                    <textarea
                      rows={4}
                      dir="rtl"
                      value={formData.descriptionAr || formData.details_ar || ''}
                      onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value, details_ar: e.target.value })}
                      placeholder="صُممت هذه الإقامة الخاصة كملاذ هادئ حيث تلتقي العمارة الحديثة بالأجواء الدافئة..."
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Philosophy */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {isRtl ? 'الفلسفة المعمارية (Philosophy EN)' : 'DESIGN PHILOSOPHY (EN)'}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.philosophy || formData.vision_en || ''}
                      onChange={(e) => setFormData({ ...formData, philosophy: e.target.value, vision_en: e.target.value })}
                      placeholder="A dialogue between modern living and natural serenity..."
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {isRtl ? 'الفلسفة المعمارية (Philosophy AR)' : 'DESIGN PHILOSOPHY (AR)'}
                    </label>
                    <textarea
                      rows={2}
                      dir="rtl"
                      value={formData.philosophyAr || formData.vision_ar || ''}
                      onChange={(e) => setFormData({ ...formData, philosophyAr: e.target.value, vision_ar: e.target.value })}
                      placeholder="حوار هندسي بين متطلبات المعيشة العصرية والسكينة الطبيعية..."
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: MEDIA & COMPREHENSIVE GALLERY */}
              <div className="space-y-5 pt-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-gold text-xs font-semibold uppercase tracking-wider pb-1 border-b border-[#E7E2D8]">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>{isRtl ? '4. صور المشروع الفاخرة والمعرض الكامل' : '4. MEDIA, VISUAL ASSETS & GALLERY'}</span>
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <ImageUploader
                    label={isRtl ? 'الغلاف الرئيسي للمشروع (Main Cover Image)' : 'Main Project Cover Image'}
                    value={formData.cover || formData.cover_image || ''}
                    onChange={(val) => setFormData({ ...formData, cover: val, cover_image: val, coverImage: val })}
                    isRtl={isRtl}
                  />

                  {(formData.cover || formData.cover_image) && (
                    <FocalPointPicker
                      imageUrl={formData.cover || formData.cover_image || ''}
                      value={formData.focal_point || { x: 50, y: 50 }}
                      onChange={(fp) => setFormData({ ...formData, focal_point: fp })}
                      isRtl={isRtl}
                    />
                  )}
                </div>

                {/* Interior Feature Image */}
                <div className="pt-2 border-t border-[#E7E2D8]">
                  <ImageUploader
                    label={isRtl ? 'الصورة الداخلية المميزة (Interior Feature Image)' : 'Interior Feature Image'}
                    value={formData.interior || ''}
                    onChange={(val) => setFormData({ ...formData, interior: val })}
                    isRtl={isRtl}
                  />
                </div>

                {/* Cinematic Panoramic Image */}
                <div className="pt-2 border-t border-[#E7E2D8]">
                  <ImageUploader
                    label={isRtl ? 'صورة البانوراما السينمائية (Cinematic Panoramic Image)' : 'Cinematic Panoramic Hero Image'}
                    value={formData.cinematic || ''}
                    onChange={(val) => setFormData({ ...formData, cinematic: val })}
                    isRtl={isRtl}
                  />
                </div>

                {/* As-Built Reality (3D vs Reality) */}
                <div className="pt-2 border-t border-[#E7E2D8] space-y-3">
                  <ImageUploader
                    label={isRtl ? 'صورة الواقع بعد التنفيذ (As-Built Reality) [لمقارنة الريندر بالواقع]' : 'As-Built Reality Photo (For 3D vs Reality Comparison)'}
                    value={formData.as_built_image || ''}
                    onChange={(val) => setFormData({ ...formData, as_built_image: val })}
                    isRtl={isRtl}
                  />

                  {formData.cover_image && formData.as_built_image && (
                    <button
                      type="button"
                      onClick={() => setShowBeforeAfterModal(true)}
                      className="w-full py-2.5 px-4 bg-white border border-gold text-charcoal hover:bg-gold/10 text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 rtl:space-x-reverse transition-colors shadow-2xs"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-gold" />
                      <span>{isRtl ? 'معاينة شريحة المقارنة التفاعلية (3D Render vs Reality)' : 'Preview Interactive 3D vs Reality Slider'}</span>
                    </button>
                  )}
                </div>

                {/* Categorized Gallery Section */}
                <div className="pt-3 border-t border-[#E7E2D8] space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-[#E7E2D8]">
                    <div>
                      <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                        {isRtl ? 'معرض صور المشروع الكامل (Categorized Project Gallery)' : 'FULL PROJECT GALLERY (CATEGORIZED & CAPTIONED)'}
                      </label>
                      <span className="text-[10px] text-stone-500">
                        {isRtl ? 'صور العمارة، الديكورات، اللاندسكيب، والتفاصيل المعمارية' : 'Architecture, Interiors, Landscape & Details'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentGal = Array.isArray(formData.gallery) ? [...formData.gallery] : [];
                        currentGal.push({
                          src: '/images/hero-villa.png',
                          caption: 'Architectural Perspective',
                          category: 'Architecture' as const,
                        });
                        setFormData({
                          ...formData,
                          gallery: currentGal,
                          gallery_images: currentGal.map((g) => g.src),
                        });
                      }}
                      className="px-3 py-1.5 bg-charcoal text-white hover:bg-gold text-[11px] font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'إضافة صورة للمعرض' : 'Add Photo to Gallery'}</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto p-2 bg-white border border-[#E7E2D8]">
                    {(!formData.gallery || formData.gallery.length === 0) ? (
                      <div className="text-center py-8 text-xs text-stone-400">
                        {isRtl ? 'لا توجد صور إضافية في المعرض حالياً. اضغط "إضافة صورة للمعرض" لإضافة صور للمشروع.' : 'No gallery photos added yet. Click "Add Photo to Gallery".'}
                      </div>
                    ) : (
                      formData.gallery.map((item, idx) => (
                        <div key={idx} className="p-3 bg-[#FAF6EE] border border-[#E7E2D8] flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                          {item.src ? (
                            <div className="w-16 h-12 relative overflow-hidden bg-stone-200 border border-[#E7E2D8] shrink-0">
                              <img src={item.src} alt={item.caption || 'Gallery photo'} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-12 bg-stone-200 border border-[#E7E2D8] flex items-center justify-center text-[9px] text-stone-400 shrink-0 font-mono">
                              NO IMG
                            </div>
                          )}
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full text-xs">
                            <input
                              type="text"
                              value={item.src}
                              placeholder="/images/... or https://..."
                              onChange={(e) => {
                                const nextGal = [...(formData.gallery || [])];
                                nextGal[idx] = { ...nextGal[idx], src: e.target.value };
                                setFormData({
                                  ...formData,
                                  gallery: nextGal,
                                  gallery_images: nextGal.map((g) => g.src),
                                });
                              }}
                              className="bg-white border border-[#E7E2D8] p-1.5 text-xs text-charcoal outline-none focus:border-gold font-mono"
                            />
                            <select
                              value={item.category || 'Architecture'}
                              onChange={(e) => {
                                const nextGal = [...(formData.gallery || [])];
                                nextGal[idx] = { ...nextGal[idx], category: e.target.value as any };
                                setFormData({ ...formData, gallery: nextGal });
                              }}
                              className="bg-white border border-[#E7E2D8] p-1.5 text-xs text-charcoal outline-none focus:border-gold"
                            >
                              <option value="Architecture">Architecture (عمارة)</option>
                              <option value="Interiors">Interiors (تصميم داخلي)</option>
                              <option value="Landscape">Landscape (لاندسكيب)</option>
                              <option value="Details">Details (تفاصيل)</option>
                            </select>
                            <input
                              type="text"
                              value={item.caption || ''}
                              placeholder={isRtl ? 'وصف / كابشن الصورة' : 'Caption (e.g. Living Area)'}
                              onChange={(e) => {
                                const nextGal = [...(formData.gallery || [])];
                                nextGal[idx] = { ...nextGal[idx], caption: e.target.value };
                                setFormData({ ...formData, gallery: nextGal });
                              }}
                              className="bg-white border border-[#E7E2D8] p-1.5 text-xs text-charcoal outline-none focus:border-gold"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const nextGal = (formData.gallery || []).filter((_, i) => i !== idx);
                              setFormData({
                                ...formData,
                                gallery: nextGal,
                                gallery_images: nextGal.map((g) => g.src),
                              });
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors shrink-0"
                            title={isRtl ? 'حذف الصورة' : 'Delete image'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7E2D8] flex items-center justify-end space-x-3 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-[#E7E2D8] text-xs text-stone-dark hover:text-charcoal uppercase font-medium"
                >
                  {t.projects.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-widest uppercase px-7 py-2.5 transition-colors"
                >
                  {t.projects.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3D vs Reality Comparison Modal */}
      {showBeforeAfterModal && formData.cover_image && formData.as_built_image && (
        <div className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF6EE] max-w-4xl w-full border border-[#E7E2D8] p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowBeforeAfterModal(false)}
              className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 text-stone-500 hover:text-charcoal`}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-cinzel text-base font-semibold text-charcoal uppercase">
              {isRtl ? 'مقارنة الريندر المعماري بالواقع المنفذ' : '3D Computational Render vs As-Built Reality'}
            </h3>
            <BeforeAfterSlider
              beforeImage={formData.cover_image}
              afterImage={formData.as_built_image}
              beforeLabel={isRtl ? 'التصميم ثلاثي الأبعاد' : '3D Render / BIM'}
              afterLabel={isRtl ? 'الواقع المنفذ' : 'As-Built Reality'}
            />
          </div>
        </div>
      )}

      {/* Luxury Client Monograph Dossier PDF Export */}
      {monographProject && (
        <ProjectMonographPrint
          project={monographProject}
          isRtl={isRtl}
          locale={locale}
          onClose={() => setMonographProject(null)}
        />
      )}

      {/* Custom Luxury Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={t.projects.deleteTitle}
        message={t.projects.deleteMessage}
        confirmLabel={t.projects.delete}
        cancelLabel={t.projects.cancel}
        isDestructive={true}
        onConfirm={confirmDeleteProject}
        onCancel={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
      />
    </div>
  );
}
