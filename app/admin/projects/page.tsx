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
  Sliders
} from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ImageUploader, MultiImageGalleryUploader } from '@/components/ui/ImageUploader';

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
    display_order: 1
  });

  const loadProjects = () => {
    setProjects(DataStore.getProjects());
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    const nextNum = projects.length + 1;
    setFormData({
      id: `prj-${Date.now()}`,
      code: `PRJ-2024-${nextNum < 10 ? '0' + nextNum : nextNum}`,
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
      year: new Date().getFullYear(),
      area_sqm: '',
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
      display_order: nextNum
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prj: Project) => {
    setEditingProject(prj);
    setFormData({ ...prj });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDeleteProject = () => {
    if (deleteModal.id) {
      DataStore.deleteProject(deleteModal.id);
      loadProjects();
      setDeleteModal({ isOpen: false, id: '', title: '' });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_en) {
      alert(isRtl ? 'يرجى إدخال اسم المشروع بالإنجليزي' : 'Please enter project title');
      return;
    }

    const prjToSave: Project = {
      id: formData.id || `prj-${Date.now()}`,
      code: formData.code || 'PRJ-2024-NEW',
      slug: formData.slug || formData.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title_en: formData.title_en,
      title_ar: formData.title_ar || formData.title_en,
      subtitle_en: formData.subtitle_en || '',
      subtitle_ar: formData.subtitle_ar || '',
      sector_en: formData.sector_en || 'Residential',
      sector_ar: formData.sector_ar || 'سكني',
      services_en: formData.services_en || ['Architecture'],
      services_ar: formData.services_ar || ['الاستشارات المعمارية'],
      location_en: formData.location_en || 'Riyadh, Saudi Arabia',
      location_ar: formData.location_ar || 'الرياض، المملكة العربية السعودية',
      country_en: formData.country_en || 'KSA',
      country_ar: formData.country_ar || 'السعودية',
      client_en: formData.client_en || 'Client',
      client_ar: formData.client_ar || 'العميل',
      year: Number(formData.year) || 2024,
      area_sqm: formData.area_sqm || '20,000 m²',
      status: formData.status || 'completed',
      publish_status: formData.publish_status || 'Published',
      is_featured: formData.publish_status === 'Featured' || !!formData.is_featured,
      cover_image: formData.cover_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
      gallery_images: formData.gallery_images && formData.gallery_images.length > 0 ? formData.gallery_images : [formData.cover_image || ''],
      vision_en: formData.vision_en || '',
      vision_ar: formData.vision_ar || '',
      details_en: formData.details_en || '',
      details_ar: formData.details_ar || '',
      lat: Number(formData.lat) || 24.7677,
      lng: Number(formData.lng) || 46.6384,
      display_order: formData.display_order || 1
    };

    DataStore.saveProject(prjToSave);
    loadProjects();
    setIsModalOpen(false);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSector = sectorFilter === 'ALL' || p.sector_en.toLowerCase() === sectorFilter.toLowerCase();
    const matchesStatus = statusFilter === 'ALL' || p.publish_status.toLowerCase() === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query ||
      p.title_en.toLowerCase().includes(query) ||
      p.title_ar.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query) ||
      p.location_en.toLowerCase().includes(query);
    return matchesSector && matchesStatus && matchesQuery;
  });

  const pageSize = 4;
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
                          src={project.cover_image}
                          alt={project.title_en}
                          className="w-full h-full object-cover"
                        />
                        {project.is_featured && (
                          <div className="absolute top-1 right-1 bg-gold text-charcoal p-0.5 shadow-sm">
                            <Star className="w-2.5 h-2.5 fill-charcoal" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
                          {project.code}
                        </div>
                        <h3 className="font-cinzel text-xs font-bold text-charcoal uppercase truncate">
                          {isRtl ? project.title_ar : project.title_en}
                        </h3>
                        <p className="text-[10px] text-stone-500 truncate mt-0.5">
                          {isRtl ? project.sector_ar : project.sector_en}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 border shrink-0 ${
                        project.publish_status === 'Featured'
                          ? 'bg-gold/10 text-charcoal border-gold'
                          : project.publish_status === 'Published'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-stone-100 text-stone-500 border-stone-300'
                      }`}
                    >
                      {project.publish_status}
                    </span>
                  </div>

                  {/* Middle: Location */}
                  <div className="pt-2 border-t border-[#E7E2D8]/60 flex items-center justify-between text-xs text-stone-600">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse text-[11px] truncate">
                      <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span className="truncate">{isRtl ? project.location_ar : project.location_en}</span>
                    </div>
                    <div className="text-[10px] font-mono text-stone-400">
                      {project.year}
                    </div>
                  </div>

                  {/* Bottom: Action Buttons */}
                  <div className="pt-2 border-t border-[#E7E2D8]/60 flex items-center justify-end space-x-2 rtl:space-x-reverse">
                    <Link
                      href={`/${locale}/projects/${project.slug}`}
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
                            src={project.cover_image}
                            alt={project.title_en}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {project.is_featured && (
                            <div className="absolute top-1 right-1 bg-gold text-charcoal p-0.5 shadow-sm">
                              <Star className="w-2.5 h-2.5 fill-charcoal" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
                            {project.code}
                          </div>
                          <div className="font-cinzel text-xs font-semibold text-charcoal uppercase group-hover:text-gold transition-colors">
                            {isRtl ? project.title_ar : project.title_en}
                          </div>
                          <div className="text-[10px] text-stone-text font-light truncate max-w-xs">
                            {isRtl ? project.subtitle_ar : project.subtitle_en}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-charcoal">{isRtl ? project.sector_ar : project.sector_en}</div>
                      <div className="text-[10px] text-stone-text font-light truncate max-w-xs">
                        {isRtl ? project.services_ar.join(' • ') : project.services_en.join(' • ')}
                      </div>
                    </td>

                    {/* Location & Coordinates */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse text-charcoal font-medium">
                        <MapPin className="w-3 h-3 text-gold" />
                        <span>{isRtl ? project.location_ar : project.location_en}</span>
                      </div>
                      <div className="text-[10px] font-mono text-stone-400 mt-0.5">
                        {project.lat?.toFixed(4)}, {project.lng?.toFixed(4)}
                      </div>
                    </td>

                    {/* Publish Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 border ${
                          project.publish_status === 'Featured'
                            ? 'bg-gold/10 text-charcoal border-gold'
                            : project.publish_status === 'Published'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-stone-100 text-stone-500 border-stone-300'
                        }`}
                      >
                        {project.publish_status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right rtl:text-left">
                      <div className="flex items-center justify-end rtl:justify-start space-x-2 rtl:space-x-reverse">
                        <Link
                          href={`/${locale}/projects/${project.slug}`}
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
                    src={project.cover_image}
                    alt={project.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-charcoal/90 text-gold font-mono text-[10px] px-2 py-0.5">
                    {project.code}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5 rtl:space-x-reverse">
                    <span
                      className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 border ${
                        project.publish_status === 'Featured'
                          ? 'bg-gold text-charcoal border-gold font-bold'
                          : 'bg-black/75 text-white border-stone-600'
                      }`}
                    >
                      {project.publish_status}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <div className="text-[10px] text-gold uppercase tracking-wider font-semibold">
                      {isRtl ? project.sector_ar : project.sector_en}
                    </div>
                    <h3 className="font-cinzel text-sm font-semibold text-charcoal uppercase group-hover:text-gold transition-colors">
                      {isRtl ? project.title_ar : project.title_en}
                    </h3>
                  </div>
                  <div className="text-xs text-stone-500 flex items-center space-x-1 rtl:space-x-reverse">
                    <MapPin className="w-3 h-3 text-gold" />
                    <span>{isRtl ? project.location_ar : project.location_en}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-[#E7E2D8] bg-[#FAF6EE]/50 flex items-center justify-between">
                <Link
                  href={`/${locale}/projects/${project.slug}`}
                  target="_blank"
                  className="text-[11px] font-semibold text-gold hover:underline flex items-center space-x-1 rtl:space-x-reverse uppercase"
                >
                  <span>{isRtl ? 'معاينة الحالة' : 'View Study'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
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

            <div className="space-y-1">
              <h2 className="font-cinzel text-xl font-semibold text-charcoal uppercase">
                {editingProject ? t.projects.editModalTitle : t.projects.addModalTitle}
              </h2>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* SECTION 1: IDENTITY & TITLES */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-gold text-xs font-semibold uppercase tracking-wider pb-1 border-b border-[#E7E2D8]">
                  <Building2 className="w-4 h-4 text-gold" />
                  <span>{isRtl ? '1. بيانات وهوية المشروع' : '1. PROJECT IDENTITY & CLASSIFICATION'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.code}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code || ''}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="PRJ-2024-001"
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
                      placeholder="specialized-hospital"
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
                      value={formData.title_en || ''}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      placeholder="Specialized Hospital"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.titleAr}
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formData.title_ar || ''}
                      onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                      placeholder="المستشفى التخصصي"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.sector}
                    </label>
                    <input
                      type="text"
                      value={formData.sector_en || ''}
                      onChange={(e) => setFormData({ ...formData, sector_en: e.target.value })}
                      placeholder="Healthcare / Residential / Commercial"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
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
                      onChange={(e) => setFormData({ ...formData, publish_status: e.target.value as any })}
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    >
                      <option value="Published">{t.projects.published}</option>
                      <option value="Featured">{t.projects.featured}</option>
                      <option value="Draft">{t.projects.draft}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: GEOGRAPHIC LOCATION & COORDINATES (MANUAL + PRESETS) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-[#E7E2D8]">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-gold text-xs font-semibold uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-gold" />
                    <span>{isRtl ? '2. الموقع الجغرافي والإحداثيات (إدخال يدوي واختيار سريع)' : '2. GEOGRAPHIC LOCATION & COORDINATES (MANUAL ENTRY & PRESETS)'}</span>
                  </div>
                </div>

                {/* Location Presets Fast Picker */}
                <div className="bg-[#F8F3E9] p-3.5 border border-[#E7E2D8] space-y-2">
                  <div className="text-[10px] uppercase font-semibold text-stone-600 flex items-center space-x-1.5 rtl:space-x-reverse">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    <span>{isRtl ? 'أو اختر موقع مدينة جاهز بضغطة زر واحدة:' : 'OR SELECT FAST CITY PRESET WITH ONE CLICK:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {LOCATION_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            location_ar: preset.loc_ar,
                            location_en: preset.loc_en,
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

                {/* Manual Text Location Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.locationEn}
                    </label>
                    <input
                      type="text"
                      value={formData.location_en || ''}
                      onChange={(e) => setFormData({ ...formData, location_en: e.target.value })}
                      placeholder="e.g. King Abdullah Financial District, Riyadh"
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
                      placeholder="مثال: مركز الملك عبد الله المالي، الرياض"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Manual GPS Coordinates (Lat / Lng) & Country */}
                <div className="p-3.5 bg-white border border-[#E7E2D8] space-y-3">
                  <div className="text-[10px] uppercase font-semibold text-charcoal flex items-center space-x-1.5 rtl:space-x-reverse">
                    <Globe2 className="w-3.5 h-3.5 text-gold" />
                    <span>{isRtl ? 'إدخال الإحداثيات الجغرافية يدوياً (GPS Coordinates):' : 'MANUAL GPS LATITUDE & LONGITUDE INPUT:'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                        {isRtl ? 'الدولة (Country)' : 'COUNTRY'}
                      </label>
                      <input
                        type="text"
                        value={formData.country_en || ''}
                        onChange={(e) => setFormData({ ...formData, country_en: e.target.value, country_ar: e.target.value === 'KSA' ? 'السعودية' : e.target.value === 'Egypt' ? 'مصر' : e.target.value })}
                        placeholder="KSA / Egypt / UAE"
                        className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block font-mono">
                        {isRtl ? 'خط العرض (Latitude)' : 'LATITUDE'}
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.lat ?? 24.7136}
                        onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                        placeholder="24.7677"
                        className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal font-mono font-semibold outline-none focus:border-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block font-mono">
                        {isRtl ? 'خط الطول (Longitude)' : 'LONGITUDE'}
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.lng ?? 46.6753}
                        onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                        placeholder="46.6384"
                        className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal font-mono font-semibold outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: CLIENT & SPECIFICATIONS */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-gold text-xs font-semibold uppercase tracking-wider pb-1 border-b border-[#E7E2D8]">
                  <Maximize2 className="w-4 h-4 text-gold" />
                  <span>{isRtl ? '3. بيانات العميل والمواصفات الفنية' : '3. CLIENT & PROJECT SPECIFICATIONS'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.clientEn}
                    </label>
                    <input
                      type="text"
                      value={formData.client_en || ''}
                      onChange={(e) => setFormData({ ...formData, client_en: e.target.value })}
                      placeholder="Ministry of Health / Private Client"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.clientAr}
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formData.client_ar || ''}
                      onChange={(e) => setFormData({ ...formData, client_ar: e.target.value })}
                      placeholder="وزارة الصحة / عميل خاص"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.year}
                    </label>
                    <input
                      type="number"
                      value={formData.year || 2024}
                      onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                      placeholder="2024"
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
                      placeholder="32,000 m²"
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: MEDIA & GALLERY */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-gold text-xs font-semibold uppercase tracking-wider pb-1 border-b border-[#E7E2D8]">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>{isRtl ? '4. الصور ومعرض المشروع' : '4. MEDIA & GALLERY ASSETS'}</span>
                </div>

                <ImageUploader
                  label={t.projects.coverImage}
                  value={formData.cover_image || ''}
                  onChange={(val) => setFormData({ ...formData, cover_image: val })}
                  isRtl={isRtl}
                />

                <MultiImageGalleryUploader
                  label={t.projects.galleryImages}
                  images={formData.gallery_images || []}
                  onChange={(imgs) => setFormData({ ...formData, gallery_images: imgs })}
                  isRtl={isRtl}
                />
              </div>

              {/* SECTION 5: ARCHITECTURAL VISION & NARRATIVE */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-gold text-xs font-semibold uppercase tracking-wider pb-1 border-b border-[#E7E2D8]">
                  <FileText className="w-4 h-4 text-gold" />
                  <span>{isRtl ? '5. الرؤية والفلسفة المعمارية' : '5. ARCHITECTURAL VISION & NARRATIVE'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.visionEn}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.vision_en || ''}
                      onChange={(e) => setFormData({ ...formData, vision_en: e.target.value })}
                      placeholder="Architectural design philosophy and sustainable solutions..."
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold tracking-wider uppercase text-charcoal block">
                      {t.projects.visionAr}
                    </label>
                    <textarea
                      rows={3}
                      dir="rtl"
                      value={formData.vision_ar || ''}
                      onChange={(e) => setFormData({ ...formData, vision_ar: e.target.value })}
                      placeholder="فلسفة التصميم المعماري والحلول البيئية والهندسية المبتكرة..."
                      className="w-full bg-white border border-[#E7E2D8] p-2.5 text-xs text-charcoal outline-none focus:border-gold resize-none"
                    />
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
