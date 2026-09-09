'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import { useViwanModal } from '@/components/ui/ViwanModalProvider';
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl } from '@/lib/youtube';
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
  Eye,
  Film,
  ArrowUp,
  ArrowDown,
  Play
} from 'lucide-react';

export interface AdminYouTubeVideo {
  id: string;
  titleEn: string;
  titleAr: string;
  youtubeUrl: string;
  videoId: string;
  categoryEn?: string;
  categoryAr?: string;
  thumbnailUrl?: string;
  order: number;
  createdAt: string;
}

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
  heading?: string;
  headingAr?: string;
  description?: string;
  descriptionAr?: string;
  philosophy?: string;
  philosophyAr?: string;
  vision_en?: string;
  vision_ar?: string;
  cover: string;
  gallery: string[];
  featured?: boolean;
  is_featured?: boolean;
  youtubeUrl?: string;
  youtubeId?: string;
  coordinates?: string;
  projectUrl?: string;
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

  // YouTube Videos Management State
  const [activeTab, setActiveTab] = useState<'projects' | 'videos'>('projects');
  const [videos, setVideos] = useState<AdminYouTubeVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [videoForm, setVideoForm] = useState({
    id: '',
    titleEn: '',
    titleAr: '',
    youtubeUrl: '',
    categoryEn: 'Architectural Tour',
    categoryAr: 'جولة معمارية',
  });
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [savingVideo, setSavingVideo] = useState(false);
  const [previewVideoModal, setPreviewVideoModal] = useState<AdminYouTubeVideo | null>(null);

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

  const fetchVideos = async () => {
    try {
      setLoadingVideos(true);
      const res = await fetch('/api/admin/videos');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.videos)) {
          setVideos(data.videos);
        }
      }
    } catch (err) {
      console.error('Failed to fetch videos:', err);
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchVideos();
  }, []);

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.youtubeUrl.trim()) {
      showError(isRtl ? 'يرجى لصق رابط فيديو يوتيوب' : 'Please paste a YouTube URL', isRtl ? 'تنبيه' : 'Alert');
      return;
    }
    const videoId = extractYouTubeId(videoForm.youtubeUrl);
    if (!videoId) {
      showError(isRtl ? 'الرابط غير صحيح. يرجى التأكد من أنه رابط يوتيوب صالح' : 'Invalid YouTube link. Please ensure it is a valid YouTube URL', isRtl ? 'تنبيه' : 'Alert');
      return;
    }

    try {
      setSavingVideo(true);
      if (editingVideoId) {
        const res = await fetch('/api/admin/videos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingVideoId,
            titleEn: videoForm.titleEn || videoForm.titleAr || 'Architectural Tour',
            titleAr: videoForm.titleAr || videoForm.titleEn || 'جولة معمارية',
            youtubeUrl: videoForm.youtubeUrl,
            categoryEn: videoForm.categoryEn || 'Architectural Tour',
            categoryAr: videoForm.categoryAr || 'جولة معمارية',
          }),
        });
        if (res.ok) {
          showNotification(isRtl ? 'تم تحديث بيانات الفيديو بنجاح' : 'Video updated successfully', isRtl ? 'تم الحفظ' : 'Saved');
          setEditingVideoId(null);
          setVideoForm({
            id: '',
            titleEn: '',
            titleAr: '',
            youtubeUrl: '',
            categoryEn: 'Architectural Tour',
            categoryAr: 'جولة معمارية',
          });
          fetchVideos();
        } else {
          showError(isRtl ? 'فشل حفظ التعديلات' : 'Failed to save changes');
        }
      } else {
        const res = await fetch('/api/admin/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titleEn: videoForm.titleEn || videoForm.titleAr || 'Architectural Tour',
            titleAr: videoForm.titleAr || videoForm.titleEn || 'جولة معمارية',
            youtubeUrl: videoForm.youtubeUrl,
            categoryEn: videoForm.categoryEn || 'Architectural Tour',
            categoryAr: videoForm.categoryAr || 'جولة معمارية',
          }),
        });
        if (res.ok) {
          showNotification(isRtl ? 'تمت إضافة الفيديو بنجاح وظهر في قسم المشاريع' : 'Video added successfully to projects showcase', isRtl ? 'تمت الإضافة' : 'Added');
          setVideoForm({
            id: '',
            titleEn: '',
            titleAr: '',
            youtubeUrl: '',
            categoryEn: 'Architectural Tour',
            categoryAr: 'جولة معمارية',
          });
          fetchVideos();
        } else {
          showError(isRtl ? 'فشل إضافة الفيديو' : 'Failed to add video');
        }
      }
    } catch (err) {
      console.error('Error saving video:', err);
      showError(isRtl ? 'حدث خطأ أثناء حفظ الفيديو' : 'An error occurred while saving the video');
    } finally {
      setSavingVideo(false);
    }
  };

  const handleEditVideo = (video: AdminYouTubeVideo) => {
    setEditingVideoId(video.id);
    setVideoForm({
      id: video.id,
      titleEn: video.titleEn,
      titleAr: video.titleAr,
      youtubeUrl: video.youtubeUrl,
      categoryEn: video.categoryEn || 'Architectural Tour',
      categoryAr: video.categoryAr || 'جولة معمارية',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditVideo = () => {
    setEditingVideoId(null);
    setVideoForm({
      id: '',
      titleEn: '',
      titleAr: '',
      youtubeUrl: '',
      categoryEn: 'Architectural Tour',
      categoryAr: 'جولة معمارية',
    });
  };

  const handleDeleteVideo = (video: AdminYouTubeVideo) => {
    showConfirm(
      isRtl ? 'هل أنت متأكد من حذف هذا الفيديو من معرض المشاريع؟' : 'Are you sure you want to remove this video from the showcase?',
      async () => {
        try {
          const res = await fetch(`/api/admin/videos?id=${video.id}`, { method: 'DELETE' });
          if (res.ok) {
            setVideos((prev) => prev.filter((v) => v.id !== video.id));
            showNotification(isRtl ? 'تم حذف الفيديو بنجاح' : 'Video deleted successfully', isRtl ? 'تم الحذف' : 'Deleted');
            if (editingVideoId === video.id) {
              handleCancelEditVideo();
            }
          }
        } catch (err) {
          console.error('Error deleting video:', err);
          showError(isRtl ? 'فشل حذف الفيديو' : 'Failed to delete video');
        }
      },
      isRtl ? 'تأكيد الحذف' : 'Confirm Delete',
      isRtl ? 'حذف' : 'Delete'
    );
  };

  const handleMoveVideo = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= videos.length) return;

    const reordered = [...videos];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const payload = reordered.map((v, idx) => ({ id: v.id, order: idx + 1 }));
    setVideos(reordered.map((v, idx) => ({ ...v, order: idx + 1 })));

    try {
      await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorder: payload }),
      });
      showNotification(isRtl ? 'تم تحديث ترتيب الفيديوهات بنجاح' : 'Videos reordered', isRtl ? 'الترتيب' : 'Order');
    } catch (err) {
      console.error('Failed to save reordered videos:', err);
    }
  };

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
      heading: 'A refined balance of architecture and nature.',
      headingAr: 'توازن دقيق بين روعة العمارة الحديثة وجمال الطبيعة.',
      description: 'A refined balance of modern architecture, timeless natural materials, and serene outdoor spaces.',
      descriptionAr: 'توازن دقيق بين روعة العمارة الحديثة والمواد الطبيعية والمساحات الخارجية الهادئة.',
      philosophy: 'Architecture shaped by light and proportion.',
      philosophyAr: 'حوار هندسي بين متطلبات المعيشة والسكينة الطبيعية.',
      cover: '/images/hero-villa.png',
      gallery: [],
      is_featured: false,
      youtubeUrl: '',
      coordinates: '30.0444° N, 31.2357° E',
      projectUrl: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: AdminProjectItem) => {
    setEditingId(project.id);
    setForm({
      ...project,
      title_en: project.title_en || project.title || project.name,
      title_ar: project.title_ar || project.nameAr || project.title,
      heading: project.heading || '',
      headingAr: project.headingAr || '',
      description: project.description || (project as any).details_en || '',
      descriptionAr: project.descriptionAr || (project as any).details_ar || '',
      philosophy: project.philosophy || (project as any).vision_en || '',
      philosophyAr: project.philosophyAr || (project as any).vision_ar || '',
      cover: project.cover || '/images/hero-villa.png',
      gallery: Array.isArray(project.gallery) 
        ? project.gallery.map((g: any) => typeof g === 'string' ? g : (g.src || '')) 
        : [],
      disciplines: Array.isArray(project.disciplines) && project.disciplines.length > 0 
        ? project.disciplines 
        : [project.category || 'Architecture'],
      is_featured: Boolean(project.is_featured || project.featured),
      youtubeUrl: project.youtubeUrl || '',
      coordinates: project.coordinates || (project.lat && project.lng ? `${project.lat}° N, ${project.lng}° E` : ''),
      projectUrl: project.projectUrl || '',
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
            onClick={() => {
              if (activeTab === 'projects') fetchProjects();
              else fetchVideos();
            }}
            className="p-2.5 border border-[#E7E2D8] bg-white hover:border-gold text-charcoal transition-colors shadow-xs"
            title={isRtl ? 'تحديث البيانات' : 'Refresh Data'}
          >
            <RefreshCw className={`w-4 h-4 text-gold ${(loading || loadingVideos) ? 'animate-spin' : ''}`} />
          </button>

          {activeTab === 'projects' ? (
            <button
              onClick={openCreateModal}
              className="bg-charcoal hover:bg-gold text-white px-4 py-2.5 text-xs font-medium tracking-wider uppercase flex items-center space-x-2 rtl:space-x-reverse transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 text-gold group-hover:text-white" />
              <span>{isRtl ? 'إضافة مشروع جديد' : 'ADD NEW PROJECT'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                handleCancelEditVideo();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-charcoal hover:bg-gold text-white px-4 py-2.5 text-xs font-medium tracking-wider uppercase flex items-center space-x-2 rtl:space-x-reverse transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 text-gold group-hover:text-white" />
              <span>{isRtl ? 'إضافة فيديو جديد' : 'ADD NEW VIDEO'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Section Switcher (Tabs) */}
      <div className="flex border-b border-[#E7E2D8] gap-3 sm:gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`pb-3.5 px-2 sm:px-4 text-xs font-cinzel tracking-wider uppercase transition-all relative flex items-center gap-2 cursor-pointer ${
            activeTab === 'projects'
              ? 'text-charcoal font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold'
              : 'text-stone-500 hover:text-charcoal'
          }`}
        >
          <FolderKanban className="w-4 h-4 text-gold" />
          <span>{isRtl ? 'محفظة وتفاصيل المشاريع' : 'PROJECTS MONOGRAPH'}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-200/60 rounded-xs text-stone-700 font-semibold">
            {projects.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('videos')}
          className={`pb-3.5 px-2 sm:px-4 text-xs font-cinzel tracking-wider uppercase transition-all relative flex items-center gap-2 cursor-pointer ${
            activeTab === 'videos'
              ? 'text-charcoal font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold'
              : 'text-stone-500 hover:text-charcoal'
          }`}
        >
          <Film className="w-4 h-4 text-gold" />
          <span>{isRtl ? 'جولات وفيديوهات اليوتيوب' : 'YOUTUBE SHOWCASE'}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-gold/20 text-charcoal rounded-xs font-semibold">
            {videos.length}
          </span>
        </button>
      </div>

      {activeTab === 'projects' ? (
        <>
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
        </>
      ) : (
        /* ========================================================================= */
        /* YOUTUBE VIDEOS SHOWCASE MANAGEMENT VIEW                                   */
        /* ========================================================================= */
        <div className="space-y-8">
          {/* Top Info Banner */}
          <div className="bg-[#FAF6EE] border border-[#E7E2D8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-charcoal text-gold rounded-xs">
                <Film className="size-4" />
              </div>
              <div>
                <h2 className="font-cinzel text-xs sm:text-sm font-bold text-charcoal uppercase">
                  {isRtl ? 'إدارة جولات وأفلام اليوتيوب (Zero Server Storage)' : 'YOUTUBE SHOWCASE MANAGEMENT (ZERO DISK STORAGE)'}
                </h2>
                <p className="text-[11px] text-stone-500">
                  {isRtl
                    ? 'أضف روابط يوتيوب فقط؛ يتم جلب الصور المصغرة والمشغل تلقائياً وعرضها في أسفل صفحة المشاريع العامة.'
                    : 'Paste YouTube URLs; thumbnails & embed players are generated on the fly with zero storage load on your server.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/projects#architectural-cinematography"
                target="_blank"
                className="px-3 py-1.5 bg-white border border-[#E7E2D8] hover:border-gold text-charcoal text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>{isRtl ? 'معاينة في صفحة المشاريع' : 'View on Public Page'}</span>
                <ExternalLink className="size-3 text-gold" />
              </Link>
            </div>
          </div>

          {/* Form Card: Add or Edit Video */}
          <div className="bg-white border border-[#E7E2D8] p-6 shadow-xs rounded-xs">
            <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-gold" />
                <h3 className="font-cinzel text-sm font-semibold text-charcoal tracking-wide uppercase">
                  {editingVideoId
                    ? (isRtl ? 'تعديل بيانات الفيديو' : 'EDIT YOUTUBE VIDEO')
                    : (isRtl ? 'إضافة فيديو جديد من YouTube' : 'ADD NEW YOUTUBE VIDEO')}
                </h3>
              </div>
              {editingVideoId && (
                <button
                  type="button"
                  onClick={handleCancelEditVideo}
                  className="text-xs text-stone-500 hover:text-charcoal px-3 py-1 border border-[#E7E2D8] bg-stone-50 cursor-pointer"
                >
                  {isRtl ? 'إلغاء التعديل' : 'Cancel Edit'}
                </button>
              )}
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-5">
              {/* YouTube Link Field with Instant Live Preview */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                  {isRtl ? 'رابط الفيديو من يوتيوب (YouTube URL) *' : 'YOUTUBE VIDEO LINK (URL) *'}
                </label>
                <input
                  type="url"
                  required
                  value={videoForm.youtubeUrl}
                  onChange={(e) => setVideoForm((prev) => ({ ...prev, youtubeUrl: e.target.value }))}
                  placeholder={
                    isRtl
                      ? 'الصق رابط الفيديو هنا، مثال: https://www.youtube.com/watch?v=aqz-KE-bpKQ أو https://youtu.be/...'
                      : 'Paste YouTube URL here, e.g. https://www.youtube.com/watch?v=aqz-KE-bpKQ or https://youtu.be/...'
                  }
                  className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-3 text-xs text-charcoal focus:outline-none focus:border-gold font-mono"
                />

                {/* Instant Live Thumbnail Preview */}
                {(() => {
                  const detectedId = extractYouTubeId(videoForm.youtubeUrl);
                  if (detectedId) {
                    return (
                      <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xs flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="relative w-36 aspect-video bg-stone-900 shrink-0 rounded-xs overflow-hidden shadow-xs border border-emerald-300">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://img.youtube.com/vi/${detectedId}/hqdefault.jpg`}
                            alt="YouTube Thumbnail Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="size-4 text-white fill-white" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <span>✓ {isRtl ? 'تم التعرف على الفيديو والصورة المصغرة بنجاح' : 'YouTube Video Verified'}</span>
                            <span className="font-mono text-[11px] bg-emerald-200/70 text-emerald-900 px-1.5 py-0.5 rounded-xs">
                              {detectedId}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600">
                            {isRtl
                              ? 'سيتم استيراد الصورة المصغرة بأعلى دقة تلقائياً، ويعمل المشغل داخل المنصة فور نقر الزائر.'
                              : 'Thumbnail will be rendered automatically in high resolution with inline modal playback.'}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <p className="text-[11px] text-stone-500">
                      {isRtl
                        ? 'يمكنك لصق رابط يوتيوب عادي، أو رابط مختصر youtu.be، أو رابط Shorts، أو معرف الفيديو المكون من 11 رمزاً.'
                        : 'Supports all YouTube links: standard watch URLs, short links (youtu.be), Shorts, or direct 11-char IDs.'}
                    </p>
                  );
                })()}
              </div>

              {/* Title Fields: Arabic & English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'عنوان الفيديو (باللغة العربية) *' : 'VIDEO TITLE (ARABIC) *'}
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={videoForm.titleAr}
                    onChange={(e) => setVideoForm((prev) => ({ ...prev, titleAr: e.target.value }))}
                    placeholder="مثال: جولة معمارية متكاملة في فيلا سكنية فاخرة"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold font-cairo"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'عنوان الفيديو (باللغة الإنجليزية)' : 'VIDEO TITLE (ENGLISH)'}
                  </label>
                  <input
                    type="text"
                    value={videoForm.titleEn}
                    onChange={(e) => setVideoForm((prev) => ({ ...prev, titleEn: e.target.value }))}
                    placeholder="e.g. Private Luxury Villa Architectural Walkthrough"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Category / Scope */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                  {isRtl ? 'تصنيف الجولة / نوع الفيديو' : 'VIDEO CATEGORY / SCOPE'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { en: 'Architectural Tour', ar: 'جولة معمارية' },
                    { en: 'Interior & Lighting', ar: 'التصميم الداخلي والإضاءة' },
                    { en: 'Landscape & Masterplanning', ar: 'اللاندسكيب والتخطيط' },
                    { en: 'Site Construction', ar: 'توثيق الموقع والإنشاءات' },
                  ].map((cat) => {
                    const isSelected =
                      videoForm.categoryEn === cat.en || videoForm.categoryAr === cat.ar;
                    return (
                      <button
                        key={cat.en}
                        type="button"
                        onClick={() =>
                          setVideoForm((prev) => ({
                            ...prev,
                            categoryEn: cat.en,
                            categoryAr: cat.ar,
                          }))
                        }
                        className={`p-2 text-center text-xs font-medium border transition-colors cursor-pointer rounded-xs ${
                          isSelected
                            ? 'bg-charcoal text-gold border-gold font-bold shadow-xs'
                            : 'bg-[#FAF6EE] border-[#E7E2D8] text-stone-600 hover:border-gold'
                        }`}
                      >
                        {isRtl ? cat.ar : cat.en}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E2D8]">
                {editingVideoId && (
                  <button
                    type="button"
                    onClick={handleCancelEditVideo}
                    className="px-4 py-2 border border-[#E7E2D8] hover:border-stone-400 bg-white text-xs font-medium text-stone-600 transition-colors cursor-pointer"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={savingVideo}
                  className="px-6 py-2.5 bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Film className="w-4 h-4 text-gold" />
                  <span>
                    {savingVideo
                      ? (isRtl ? 'جاري الحفظ...' : 'SAVING...')
                      : editingVideoId
                      ? (isRtl ? 'حفظ تعديلات الفيديو' : 'UPDATE VIDEO')
                      : (isRtl ? 'حفظ ونشر الفيديو في الموقع' : 'SAVE & PUBLISH VIDEO')}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Videos List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel text-base text-charcoal font-medium uppercase tracking-wider flex items-center gap-2">
                <span>{isRtl ? 'قائمة الفيديوهات المعروضة بالموقع' : 'PUBLISHED SHOWCASE VIDEOS'}</span>
                <span className="bg-charcoal text-gold text-[11px] font-mono px-2 py-0.5">
                  {videos.length}
                </span>
              </h3>

              <button
                type="button"
                onClick={fetchVideos}
                className="p-2 border border-[#E7E2D8] bg-white hover:border-gold text-charcoal transition-colors shadow-xs flex items-center gap-1.5 text-xs cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-gold ${loadingVideos ? 'animate-spin' : ''}`} />
                <span>{isRtl ? 'تحديث' : 'Refresh'}</span>
              </button>
            </div>

            {loadingVideos ? (
              <div className="py-16 text-center text-xs text-stone-500 font-cinzel tracking-widest uppercase bg-white border border-[#E7E2D8]">
                {isRtl ? 'جاري تحميل قائمة الفيديوهات...' : 'LOADING SHOWCASE VIDEOS...'}
              </div>
            ) : videos.length === 0 ? (
              <div className="py-16 text-center bg-white border border-[#E7E2D8] p-8">
                <Film className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="font-cinzel text-sm text-charcoal uppercase mb-1">
                  {isRtl ? 'لا توجد فيديوهات منشورة حالياً' : 'NO VIDEOS PUBLISHED YET'}
                </p>
                <p className="text-xs text-stone-500">
                  {isRtl
                    ? 'استخدم النموذج أعلاه للصق أول رابط فيديو من يوتيوب ليظهر في قسم المشاريع.'
                    : 'Use the form above to paste your first YouTube link to feature it in the portfolio.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {videos.map((vid, idx) => {
                  return (
                    <div
                      key={vid.id}
                      className="bg-white border border-[#E7E2D8] hover:border-gold/60 p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs group"
                    >
                      {/* Left: Reordering buttons + Thumbnail + Info */}
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        {/* Order Controls */}
                        <div className="flex flex-col items-center gap-1 shrink-0 bg-stone-50 p-1.5 border border-stone-200/80 rounded-xs">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveVideo(idx, 'up')}
                            className={`p-1 rounded-xs transition-colors ${
                              idx === 0
                                ? 'text-stone-300 cursor-not-allowed'
                                : 'text-charcoal hover:bg-gold hover:text-white cursor-pointer'
                            }`}
                            title={isRtl ? 'نقل للأعلى' : 'Move Up'}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          <span className="font-mono text-xs font-bold text-stone-700">
                            #{idx + 1}
                          </span>

                          <button
                            type="button"
                            disabled={idx === videos.length - 1}
                            onClick={() => handleMoveVideo(idx, 'down')}
                            className={`p-1 rounded-xs transition-colors ${
                              idx === videos.length - 1
                                ? 'text-stone-300 cursor-not-allowed'
                                : 'text-charcoal hover:bg-gold hover:text-white cursor-pointer'
                            }`}
                            title={isRtl ? 'نقل للأسفل' : 'Move Down'}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Thumbnail with Quick Play Trigger */}
                        <div
                          onClick={() => setPreviewVideoModal(vid)}
                          className="relative w-32 sm:w-40 aspect-video bg-stone-900 shrink-0 cursor-pointer overflow-hidden rounded-xs border border-stone-200 group/thumb shadow-xs"
                          title={isRtl ? 'انقر للمعاينة' : 'Click to preview'}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.videoId}/hqdefault.jpg`}
                            alt={vid.titleEn}
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="size-8 rounded-full bg-charcoal/80 text-gold flex items-center justify-center group-hover/thumb:scale-110 transition-transform shadow-md">
                              <Play className="size-3.5 fill-gold ms-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-100 text-stone-600 border border-stone-200 uppercase tracking-wider rounded-xs">
                              {isRtl ? vid.categoryAr || vid.categoryEn : vid.categoryEn || vid.categoryAr}
                            </span>
                            <span className="text-[10px] font-mono text-stone-400">
                              ID: {vid.videoId}
                            </span>
                          </div>

                          <h4 className="font-serif text-sm sm:text-base font-semibold text-charcoal truncate">
                            {isRtl ? vid.titleAr || vid.titleEn : vid.titleEn || vid.titleAr}
                          </h4>

                          {vid.titleAr && vid.titleEn && (
                            <p className="text-xs text-stone-500 truncate font-light">
                              {isRtl ? vid.titleEn : vid.titleAr}
                            </p>
                          )}

                          <a
                            href={vid.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-gold transition-colors font-mono"
                          >
                            <ExternalLink className="size-3" />
                            <span className="truncate max-w-xs">{vid.youtubeUrl}</span>
                          </a>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewVideoModal(vid)}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-charcoal text-xs font-medium transition-colors flex items-center gap-1 rounded-xs cursor-pointer"
                          title={isRtl ? 'تشغيل ومعاينة' : 'Preview video'}
                        >
                          <Play className="size-3 text-gold fill-gold" />
                          <span>{isRtl ? 'معاينة' : 'Preview'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditVideo(vid)}
                          className="px-3 py-1.5 border border-[#E7E2D8] hover:border-gold hover:text-gold bg-white text-xs font-medium text-charcoal transition-colors flex items-center gap-1 rounded-xs cursor-pointer"
                          title={isRtl ? 'تعديل بيانات الفيديو' : 'Edit video'}
                        >
                          <Edit2 className="size-3" />
                          <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(vid)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-xs cursor-pointer"
                          title={isRtl ? 'حذف الفيديو' : 'Delete video'}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Preview Lightbox Modal */}
          {previewVideoModal && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4"
              onClick={() => setPreviewVideoModal(null)}
            >
              <div
                className="bg-[#11110F] border border-stone-700 max-w-4xl w-full rounded-xs overflow-hidden shadow-2xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#161513]">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-gold" />
                    <h3 className="font-serif text-sm text-ivory truncate max-w-lg">
                      {isRtl
                        ? previewVideoModal.titleAr || previewVideoModal.titleEn
                        : previewVideoModal.titleEn || previewVideoModal.titleAr}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewVideoModal(null)}
                    className="p-1 text-ivory/60 hover:text-ivory cursor-pointer"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={getYouTubeEmbedUrl(previewVideoModal.videoId, true)}
                    title={previewVideoModal.titleEn}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT PROJECT MODAL (Frosted Glassmorphism + Rounded + Concise Guidance) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#FAF7F2]/95 dark:bg-[#161513]/95 backdrop-blur-2xl border border-white/70 dark:border-stone-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative rounded-[28px] sm:rounded-[36px] custom-scrollbar animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E7E2D8]/80 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold px-2.5 py-0.5 rounded-full bg-gold/10 inline-block mb-1">
                  {editingId ? (isRtl ? 'تعديل مشروع' : 'EDIT PROJECT') : (isRtl ? 'مشروع جديد' : 'NEW PROJECT')}
                </span>
                <h2 className="font-cinzel text-xl text-charcoal dark:text-ivory font-medium">
                  {form.title_en || form.title_ar || (isRtl ? 'بيانات المشروع' : 'Project Details')}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-stone-400 hover:text-charcoal dark:hover:text-ivory hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Close modal"
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
                    {isRtl ? 'اسم المشروع (EN) *' : 'PROJECT TITLE (EN) *'}
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
                    placeholder="e.g. Al-Noor Villa"
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'اسم المشروع (AR) *' : 'PROJECT TITLE (AR) *'}
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={form.title_ar || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, title_ar: e.target.value }))}
                    placeholder="مثال: فيلا النور"
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-cairo"
                  />
                </div>
              </div>

              {/* Row 2: The Disciplines */}
              <div className="space-y-3 p-4 sm:p-5 bg-white/60 dark:bg-black/20 backdrop-blur-xs border border-[#E7E2D8] rounded-2xl sm:rounded-3xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                      {isRtl ? 'التخصص المعماري للمشروع *' : 'PROJECT DISCIPLINE *'}
                    </label>
                    <p className="text-[11px] text-stone-500">
                      {isRtl ? 'حدد تخصصات المشروع والتصنيف الأساسي' : 'Select primary and related disciplines'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-semibold text-charcoal uppercase tracking-wider">{isRtl ? 'السنة:' : 'Year:'}</span>
                    <input
                      type="number"
                      value={form.year || 2026}
                      onChange={(e) => setForm((prev) => ({ ...prev, year: parseInt(e.target.value) || 2026 }))}
                      className="w-24 bg-white dark:bg-black/40 border border-[#E7E2D8] rounded-xl px-2.5 py-1.5 text-xs text-charcoal focus:outline-none focus:border-gold font-mono text-center"
                    />
                  </div>
                </div>

                {/* 5 Disciplines Interactive Cards (Multi-Select Enabled) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                  {DISCIPLINES_LIST.map((d) => {
                    const currentDisciplines = Array.isArray(form.disciplines) ? form.disciplines : [];
                    const isSelected = currentDisciplines.includes(d.id) || currentDisciplines.includes(d.slug) || form.category === d.id;
                    const isPrimary = form.category === d.id;

                    return (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => {
                          let updated: string[];
                          if (isSelected) {
                            updated = currentDisciplines.length > 1 
                              ? currentDisciplines.filter((x) => x !== d.id && x !== d.slug)
                              : currentDisciplines;
                          } else {
                            updated = [...currentDisciplines, d.id];
                          }
                          const newCat = updated.includes(form.category || '') ? form.category : updated[0];
                          setForm((prev) => ({
                            ...prev,
                            disciplines: updated,
                            category: newCat,
                          }));
                        }}
                        className={`p-3 text-start border transition-all flex flex-col justify-between gap-2 cursor-pointer rounded-xl ${
                          isSelected
                            ? 'border-gold bg-charcoal text-ivory ring-1 ring-gold shadow-xs'
                            : 'border-[#E7E2D8] bg-white/90 hover:border-gold/60 text-charcoal'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-gold' : 'text-stone-400'}`}>
                            {d.code}
                          </span>
                          {isSelected ? (
                            <span className="flex items-center gap-1">
                              {isPrimary && (
                                <span className="text-[8.5px] font-mono bg-gold text-charcoal px-1.5 py-0.5 rounded-full uppercase font-bold">
                                  {isRtl ? 'رئيسي' : 'PRIMARY'}
                                </span>
                              )}
                              <Check className="w-3.5 h-3.5 text-gold" />
                            </span>
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

                {/* Selected Disciplines pill & Primary selection */}
                <div className="p-3 bg-white/80 dark:bg-black/40 border border-[#E7E2D8] rounded-xl text-[11px] text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold shrink-0" />
                    <span>
                      {isRtl
                        ? `المحدد: ${(form.disciplines || []).map(d => DISCIPLINES_LIST.find(item => item.id === d)?.labelAr || d).join(' + ')}`
                        : `Selected: ${(form.disciplines || []).join(' + ')}`}
                    </span>
                  </div>
                  {Array.isArray(form.disciplines) && form.disciplines.length > 1 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-500">{isRtl ? 'الأساسي:' : 'Primary:'}</span>
                      <select
                        value={form.category || form.disciplines[0]}
                        onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                        className="bg-[#FAF6EE] border border-[#E7E2D8] rounded-lg px-2 py-1 text-xs text-charcoal focus:outline-none"
                      >
                        {form.disciplines.map((d) => (
                          <option key={d} value={d}>
                            {DISCIPLINES_LIST.find((item) => item.id === d)?.labelAr || d}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Location EN & AR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'الموقع (EN)' : 'LOCATION (EN)'}
                  </label>
                  <input
                    type="text"
                    value={form.location_en || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, location_en: e.target.value, location: e.target.value }))}
                    placeholder="e.g. New Cairo, Egypt"
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'الموقع (AR)' : 'LOCATION (AR)'}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={form.location_ar || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, location_ar: e.target.value }))}
                    placeholder="مثال: القاهرة الجديدة، مصر"
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-cairo"
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
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
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
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>
              </div>

              {/* Row 5: Subtitles / Taglines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'شعار المشروع (EN)' : 'SUBTITLE (EN)'}
                  </label>
                  <input
                    type="text"
                    value={form.subtitle_en || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, subtitle_en: e.target.value, tagline: e.target.value }))}
                    placeholder="A home in harmony with nature."
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'شعار المشروع (AR)' : 'SUBTITLE (AR)'}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={form.subtitle_ar || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, subtitle_ar: e.target.value }))}
                    placeholder="منزل متناغم مع المحيط الطبيعي"
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-cairo"
                  />
                </div>
              </div>

              {/* Row 6: Architectural Brief Headings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'عنوان الموجز المعماري (EN)' : 'BRIEF HEADING (EN)'}
                  </label>
                  <input
                    type="text"
                    value={form.heading || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, heading: e.target.value }))}
                    placeholder="A refined balance of architecture and nature."
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'عنوان الموجز المعماري (AR)' : 'BRIEF HEADING (AR)'}
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={form.headingAr || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, headingAr: e.target.value }))}
                    placeholder="توازن دقيق بين روعة العمارة وجمال الطبيعة"
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-cairo"
                  />
                </div>
              </div>

              {/* Row 7: Full Description / Narrative */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'الوصف المعماري (EN)' : 'DESCRIPTION (EN)'}
                  </label>
                  <textarea
                    rows={4}
                    value={form.description || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Spatial program, materials, and structural narrative..."
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-y"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'الوصف المعماري (AR)' : 'DESCRIPTION (AR)'}
                  </label>
                  <textarea
                    rows={4}
                    dir="rtl"
                    value={form.descriptionAr || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, descriptionAr: e.target.value }))}
                    placeholder="تفاصيل البرنامج الفراغي، خامات التشطيب، الكتل المعمارية..."
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-y font-cairo"
                  />
                </div>
              </div>

              {/* Row 8: Design Philosophy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'فلسفة التصميم (EN)' : 'DESIGN PHILOSOPHY (EN)'}
                  </label>
                  <textarea
                    rows={2}
                    value={form.philosophy || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, philosophy: e.target.value }))}
                    placeholder="Architecture shaped by light and proportion."
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-y"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'فلسفة التصميم (AR)' : 'DESIGN PHILOSOPHY (AR)'}
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={form.philosophyAr || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, philosophyAr: e.target.value }))}
                    placeholder="حوار هندسي بين متطلبات المعيشة والسكينة الطبيعية..."
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-y font-cairo"
                  />
                </div>
              </div>

              {/* Row 9: YouTube Video Tour (Optional) */}
              <div className="p-4 sm:p-5 bg-white/60 dark:bg-black/20 backdrop-blur-xs border border-[#E7E2D8] rounded-2xl sm:rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-gold" />
                    <span>{isRtl ? 'فيديو يوتيوب للمشروع (اختياري)' : 'YOUTUBE VIDEO (OPTIONAL)'}</span>
                  </label>
                  <span className="text-[10px] text-stone-500 font-mono">4K Cinema Stream</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="flex-1 w-full">
                    <input
                      type="url"
                      value={form.youtubeUrl || ''}
                      onChange={(e) => setForm((prev) => ({ ...prev, youtubeUrl: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                      className="w-full bg-white dark:bg-black/40 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold font-mono"
                    />
                  </div>

                  {form.youtubeUrl && extractYouTubeId(form.youtubeUrl) && (
                    <div className="flex items-center gap-2 border border-[#E7E2D8] bg-white dark:bg-black/50 p-1.5 rounded-xl shrink-0">
                      <img
                        src={getYouTubeThumbnail(extractYouTubeId(form.youtubeUrl)!)}
                        alt="YouTube Preview"
                        className="w-16 h-10 object-cover rounded-lg"
                      />
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium px-2">
                        {isRtl ? 'تم التحقق ✓' : 'Verified ✓'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 10: Coordinates & External Links (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span>{isRtl ? 'إحداثيات الموقع (اختياري)' : 'COORDINATES (OPTIONAL)'}</span>
                  </label>
                  <input
                    type="text"
                    value={form.coordinates || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, coordinates: e.target.value }))}
                    placeholder="30.0444, 31.2357"
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5 text-gold" />
                    <span>{isRtl ? 'رابط جولة 3D أو موقع (اختياري)' : '3D / EXTERNAL LINK (OPTIONAL)'}</span>
                  </label>
                  <input
                    type="url"
                    value={form.projectUrl || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, projectUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Cover Image Upload Section */}
              <div className="p-4 sm:p-5 bg-white/60 dark:bg-black/20 backdrop-blur-xs border border-[#E7E2D8] rounded-2xl sm:rounded-3xl space-y-3">
                <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                  {isRtl ? 'صورة الغلاف الرئيسية *' : 'COVER IMAGE *'}
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-32 h-20 bg-stone-200 border border-[#E7E2D8] rounded-xl overflow-hidden shrink-0 relative">
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
                        className="px-3.5 py-2 bg-charcoal hover:bg-gold text-white text-xs font-medium rounded-xl flex items-center space-x-1.5 rtl:space-x-reverse transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-gold group-hover:text-white" />
                        <span>{isRtl ? 'رفع صورة' : 'UPLOAD'}</span>
                      </button>

                      <input
                        type="text"
                        value={form.cover || ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, cover: e.target.value }))}
                        placeholder="/images/... or URL"
                        className="flex-1 bg-white dark:bg-black/40 border border-[#E7E2D8] rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Images Upload Section */}
              <div className="p-4 sm:p-5 bg-white/60 dark:bg-black/20 backdrop-blur-xs border border-[#E7E2D8] rounded-2xl sm:rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                      {isRtl ? 'معرض صور المشروع' : 'PROJECT GALLERY'}
                    </label>
                    <span className="text-[11px] text-stone-500">
                      {isRtl ? 'اللقطات واللوحات المعمارية' : 'Architectural visual plates'}
                    </span>
                  </div>

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
                    className="px-3.5 py-1.5 bg-white hover:bg-stone-100 border border-[#E7E2D8] rounded-xl text-xs font-medium text-charcoal flex items-center space-x-1.5 rtl:space-x-reverse transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold" />
                    <span>{isRtl ? 'إضافة صور' : 'ADD IMAGES'}</span>
                  </button>
                </div>

                {Array.isArray(form.gallery) && form.gallery.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                    {form.gallery.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-square bg-stone-200 border border-[#E7E2D8] rounded-xl group overflow-hidden">
                        <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-500 italic">
                    {isRtl ? 'لم تضف صوراً للمعرض بعد.' : 'No gallery images added yet.'}
                  </p>
                )}
              </div>

              {/* Display Position in Public Page */}
              <div className="p-4 sm:p-5 bg-white/60 dark:bg-black/20 backdrop-blur-xs border border-[#E7E2D8] rounded-2xl sm:rounded-3xl space-y-3">
                <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                  {isRtl ? 'موقع العرض في صفحة المشاريع (/projects) *' : 'DISPLAY POSITION ON /PROJECTS *'}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setForm((prev) => ({ ...prev, is_featured: false, featured: false }))}
                    className={`p-3.5 border flex items-start gap-2.5 cursor-pointer transition-all rounded-xl ${
                      !form.is_featured
                        ? 'border-gold bg-white shadow-xs ring-1 ring-gold/40'
                        : 'border-[#E7E2D8] bg-white/70 hover:border-stone-400'
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
                        {isRtl ? 'مشروع فرعي (القائمة الجانبية)' : 'Subproject (Side Column)'}
                      </div>
                      <div className="text-[10px] text-stone-500 leading-normal">
                        {isRtl ? 'يظهر ضمن قائمة المشاريع الإضافية للتخصص' : 'Shows in the discipline sidebar list'}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setForm((prev) => ({ ...prev, is_featured: true, featured: true }))}
                    className={`p-3.5 border flex items-start gap-2.5 cursor-pointer transition-all rounded-xl ${
                      Boolean(form.is_featured)
                        ? 'border-gold bg-white shadow-xs ring-1 ring-gold/40'
                        : 'border-[#E7E2D8] bg-white/70 hover:border-stone-400'
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
                        <span>{isRtl ? 'مشروع رئيسي مميز (Featured)' : 'Featured Hero Project'}</span>
                        <Star className="w-3 h-3 text-gold fill-gold" />
                      </div>
                      <div className="text-[10px] text-stone-500 leading-normal">
                        {isRtl ? 'يظهر كغلاف عريض وبارز في منتصف القسم' : 'Prominent center hero in discipline showcase'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-[#E7E2D8]/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-[#E7E2D8] hover:border-stone-400 bg-white dark:bg-black/30 text-xs font-medium text-stone-600 dark:text-stone-300 rounded-xl transition-colors"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-2.5 bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-all shadow-md active:scale-98"
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
