'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext'
import { useViwanModal } from '@/components/ui/ViwanModalProvider'
import {
  Briefcase,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  Check,
  X,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react'
import { Job, JOBS as INITIAL_JOBS } from '@/lib/jobs'

export default function AdminJobsPage() {
  const { isRtl } = useAdminLang()
  const { showConfirm, showNotification, showError } = useViwanModal()

  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Form State
  const [form, setForm] = useState({
    slug: '',
    title: '',
    titleAr: '',
    experience: '3–5 Years Experience',
    experienceAr: 'خبرة من 3 إلى 5 سنوات',
    location: 'Cairo, Egypt',
    locationAr: 'القاهرة، مصر',
    type: 'Full Time',
    typeAr: 'دوام كامل',
    role: '',
    roleAr: '',
    responsibilitiesText: '',
    responsibilitiesArText: '',
    requirementsText: '',
    requirementsArText: '',
    softwareText: 'Revit, AutoCAD, 3ds Max',
  })

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/jobs')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.jobs)) {
          setJobs(data.jobs)
        }
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const openCreateModal = () => {
    setEditingSlug(null)
    setForm({
      slug: '',
      title: '',
      titleAr: '',
      experience: '3–5 Years Experience',
      experienceAr: 'خبرة من 3 إلى 5 سنوات',
      location: 'Cairo, Egypt',
      locationAr: 'القاهرة، مصر',
      type: 'Full Time',
      typeAr: 'دوام كامل',
      role: '',
      roleAr: '',
      responsibilitiesText: '',
      responsibilitiesArText: '',
      requirementsText: '',
      requirementsArText: '',
      softwareText: 'Revit, AutoCAD, 3ds Max',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (job: Job) => {
    setEditingSlug(job.slug)
    setForm({
      slug: job.slug,
      title: job.title,
      titleAr: job.titleAr,
      experience: job.experience,
      experienceAr: job.experienceAr,
      location: job.location,
      locationAr: job.locationAr,
      type: job.type,
      typeAr: job.typeAr,
      role: job.role,
      roleAr: job.roleAr,
      responsibilitiesText: (job.responsibilities || []).join('\n'),
      responsibilitiesArText: (job.responsibilitiesAr || []).join('\n'),
      requirementsText: (job.requirements || []).join('\n'),
      requirementsArText: (job.requirementsAr || []).join('\n'),
      softwareText: (job.software || []).join(', '),
    })
    setIsModalOpen(true)
  }

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.titleAr.trim()) {
      showError(isRtl ? 'يرجى كتابة المسمى الوظيفي بالعربية والإنجليزية' : 'Job titles in EN and AR are required')
      return
    }

    try {
      setSaving(true)
      const payload = {
        title: form.title.trim(),
        titleAr: form.titleAr.trim(),
        slug: form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        experience: form.experience.trim(),
        experienceAr: form.experienceAr.trim(),
        location: form.location.trim(),
        locationAr: form.locationAr.trim(),
        type: form.type.trim(),
        typeAr: form.typeAr.trim(),
        role: form.role.trim(),
        roleAr: form.roleAr.trim(),
        responsibilities: form.responsibilitiesText.split('\n').map((s) => s.trim()).filter(Boolean),
        responsibilitiesAr: form.responsibilitiesArText.split('\n').map((s) => s.trim()).filter(Boolean),
        requirements: form.requirementsText.split('\n').map((s) => s.trim()).filter(Boolean),
        requirementsAr: form.requirementsArText.split('\n').map((s) => s.trim()).filter(Boolean),
        software: form.softwareText.split(/[,،]/).map((s) => s.trim()).filter(Boolean),
      }

      if (editingSlug) {
        // Update
        const res = await fetch('/api/admin/jobs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: editingSlug, updatedJob: payload }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to update job')
        showNotification(isRtl ? 'تم تحديث بيانات الوظيفة بنجاح' : 'Job updated successfully')
      } else {
        // Create
        const res = await fetch('/api/admin/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to add job')
        showNotification(isRtl ? 'تمت إضافة الوظيفة الجديدة ونشرها على الموقع' : 'New job created and published')
      }

      setIsModalOpen(false)
      fetchJobs()
    } catch (err: any) {
      showError(err.message || 'Error saving job')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteJob = (job: Job) => {
    showConfirm(
      isRtl
        ? `هل أنت متأكد من رغبتك في حذف وظيفة "${job.titleAr}" نهائياً من الموقع؟`
        : `Are you sure you want to permanently delete "${job.title}"?`,
      async () => {
        try {
          const res = await fetch(`/api/admin/jobs?slug=${encodeURIComponent(job.slug)}`, {
            method: 'DELETE',
          })
          if (res.ok) {
            showNotification(isRtl ? 'تم حذف الوظيفة بنجاح' : 'Job deleted successfully')
            fetchJobs()
          } else {
            const data = await res.json()
            showError(data.error || 'Failed to delete')
          }
        } catch (err: any) {
          showError(err.message || 'Error deleting job')
        }
      },
      isRtl ? 'تأكيد الحذف' : 'Confirm Delete'
    )
  }

  // Filter jobs by search
  const filteredJobs = jobs.filter((j) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      j.title.toLowerCase().includes(q) ||
      j.titleAr.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.locationAr.toLowerCase().includes(q) ||
      j.experience.toLowerCase().includes(q) ||
      j.role.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D8] pb-6">
        <div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <h1 className="font-cinzel text-2xl sm:text-3xl text-charcoal font-semibold tracking-wider">
              {isRtl ? 'إدارة الوظائف والكفاءات المعمارية' : 'CAREERS & ROLES'}
            </h1>
            <span className="text-xs font-mono bg-charcoal text-gold px-2.5 py-0.5 font-bold">
              {jobs.length} {isRtl ? 'وظيفة نشطة' : 'Active Roles'}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 font-light">
            {isRtl
              ? 'إضافة وتعديل وحذف الشواغر المعمارية المعروضة على الموقع للتقديم المباشر.'
              : 'Create, update, and manage open architectural vacancies displayed on the public careers page.'}
          </p>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link
            href="/jobs"
            target="_blank"
            className="border border-[#E7E2D8] bg-white hover:border-gold px-3.5 py-2 text-xs text-charcoal flex items-center space-x-1.5 rtl:space-x-reverse transition-colors shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            <span>{isRtl ? 'معاينة صفحة الوظائف' : 'View Public Jobs'}</span>
          </Link>

          <button
            type="button"
            onClick={openCreateModal}
            className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-wider uppercase px-4 py-2 transition-all flex items-center space-x-2 rtl:space-x-reverse shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>{isRtl ? 'إضافة وظيفة جديدة +' : 'Add New Role +'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#E7E2D8] p-3 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400 ms-1 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isRtl ? 'ابحث باسم الوظيفة أو الموقع أو مستوى الخبرة...' : 'Search by role title, location, or experience...'}
          className="w-full bg-transparent text-xs text-charcoal placeholder:text-stone-400 outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-stone-400 hover:text-charcoal me-1 text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="p-12 text-center text-xs font-cinzel text-stone-400 uppercase tracking-widest">
          {isRtl ? 'جاري تحميل الوظائف...' : 'Loading Open Vacancies...'}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white border border-[#E7E2D8] p-12 text-center space-y-3">
          <Briefcase className="w-8 h-8 text-stone-300 mx-auto" />
          <p className="text-sm text-charcoal font-medium">
            {isRtl ? 'لا توجد وظائف مطابقة للبحث' : 'No matching roles found'}
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="text-xs text-gold underline cursor-pointer hover:text-charcoal"
          >
            {isRtl ? 'إضافة أول وظيفة الآن' : 'Create the first role now'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => (
            <div
              key={job.slug}
              className="bg-white border border-[#E7E2D8] hover:border-gold/60 p-6 flex flex-col justify-between gap-5 shadow-xs transition-all duration-200 group"
            >
              {/* Top Details */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold block">
                      {job.typeAr || job.type}
                    </span>
                    <h3 className="font-cinzel text-base font-semibold text-charcoal group-hover:text-gold transition-colors mt-0.5">
                      {isRtl ? job.titleAr : job.title}
                    </h3>
                    <span className="text-[11px] text-stone-400 font-sans block">
                      {isRtl ? job.title : job.titleAr}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#FAF6EE] border border-[#E7E2D8] text-stone-600 shrink-0">
                    {job.experienceAr || job.experience}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stone-500 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>{isRtl ? job.locationAr : job.location}</span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-light">
                  {isRtl ? job.roleAr : job.role}
                </p>

                {/* Software tags */}
                {Array.isArray(job.software) && job.software.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.software.map((sw, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-2xs font-mono"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#E7E2D8] flex items-center justify-between">
                <div className="text-[10px] text-stone-400 font-mono">
                  {job.responsibilities?.length || 0} {isRtl ? 'مهام' : 'tasks'} · {job.requirements?.length || 0} {isRtl ? 'شروط' : 'reqs'}
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <button
                    type="button"
                    onClick={() => openEditModal(job)}
                    className="p-1.5 border border-[#E7E2D8] hover:border-gold text-stone-600 hover:text-gold transition-colors cursor-pointer"
                    title={isRtl ? 'تعديل الوظيفة' : 'Edit role'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteJob(job)}
                    className="p-1.5 border border-[#E7E2D8] hover:border-red-400 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                    title={isRtl ? 'حذف الوظيفة' : 'Delete role'}
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
      {/* ADD / EDIT JOB MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E2D8] max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#E7E2D8] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
                  {editingSlug ? (isRtl ? 'تعديل فرصة وظيفية' : 'EDIT ARCHITECTURAL ROLE') : (isRtl ? 'إضافة شاغر وظيفي جديد' : 'ADD NEW VACANCY')}
                </span>
                <h2 className="font-cinzel text-xl text-charcoal font-semibold mt-1">
                  {form.titleAr || form.title || (isRtl ? 'وظيفة جديدة' : 'New Role')}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-charcoal transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveJob} className="space-y-5">
              {/* Row 1: Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'المسمى الوظيفي (بالإنجليزية) *' : 'JOB TITLE (ENGLISH) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => {
                      const val = e.target.value
                      setForm((prev) => ({
                        ...prev,
                        title: val,
                        slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      }))
                    }}
                    placeholder="e.g. Senior BIM Architect"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'المسمى الوظيفي (بالعربية) *' : 'JOB TITLE (ARABIC) *'}
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={form.titleAr}
                    onChange={(e) => setForm((prev) => ({ ...prev, titleAr: e.target.value }))}
                    placeholder="مثال: مهندس BIM وتنسيق معماري"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold font-cairo"
                  />
                </div>
              </div>

              {/* Row 2: Slug & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'الرابط الفريد (Slug)' : 'URL SLUG'}
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="e.g. senior-bim-architect"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal font-mono focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'نوع الدوام' : 'EMPLOYMENT TYPE'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={form.type}
                      onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                      placeholder="Full Time"
                      className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                    />
                    <input
                      type="text"
                      dir="rtl"
                      value={form.typeAr}
                      onChange={(e) => setForm((prev) => ({ ...prev, typeAr: e.target.value }))}
                      placeholder="دوام كامل"
                      className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Experience & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'سنوات الخبرة (EN / AR)' : 'EXPERIENCE LEVEL (EN / AR)'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={form.experience}
                      onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))}
                      placeholder="3–6 Years"
                      className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                    />
                    <input
                      type="text"
                      dir="rtl"
                      value={form.experienceAr}
                      onChange={(e) => setForm((prev) => ({ ...prev, experienceAr: e.target.value }))}
                      placeholder="خبرة من 3 إلى 6 سنوات"
                      className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'مقر العمل (EN / AR)' : 'LOCATION (EN / AR)'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Cairo, Egypt"
                      className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                    />
                    <input
                      type="text"
                      dir="rtl"
                      value={form.locationAr}
                      onChange={(e) => setForm((prev) => ({ ...prev, locationAr: e.target.value }))}
                      placeholder="القاهرة، مصر"
                      className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Role Overview (EN & AR) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'نبذة عن الدور (EN)' : 'ROLE OVERVIEW (ENGLISH)'}
                  </label>
                  <textarea
                    rows={3}
                    value={form.role}
                    onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                    placeholder="Brief architectural role description..."
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'نبذة عن الدور (AR)' : 'ROLE OVERVIEW (ARABIC)'}
                  </label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={form.roleAr}
                    onChange={(e) => setForm((prev) => ({ ...prev, roleAr: e.target.value }))}
                    placeholder="نبذة موجزة عن المسؤوليات المعمارية..."
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold font-cairo"
                  />
                </div>
              </div>

              {/* Row 5: Responsibilities (Line by line) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'المهام والمسؤوليات (EN - كل سطر مهمة)' : 'RESPONSIBILITIES (EN - 1 PER LINE)'}
                  </label>
                  <textarea
                    rows={4}
                    value={form.responsibilitiesText}
                    onChange={(e) => setForm((prev) => ({ ...prev, responsibilitiesText: e.target.value }))}
                    placeholder="Lead massing design&#10;Coordinate Revit BIM packages&#10;Site architectural review"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'المهام والمسؤوليات (AR - كل سطر مهمة)' : 'RESPONSIBILITIES (AR - 1 PER LINE)'}
                  </label>
                  <textarea
                    rows={4}
                    dir="rtl"
                    value={form.responsibilitiesArText}
                    onChange={(e) => setForm((prev) => ({ ...prev, responsibilitiesArText: e.target.value }))}
                    placeholder="قيادة التوزيع الفراغي وتصميم الواجهات&#10;إعداد المخططات التنفيذية بدقة عالية&#10;المتابعة الميدانية لضمان مطابقة التصميم"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold font-cairo"
                  />
                </div>
              </div>

              {/* Row 6: Requirements (Line by line) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'المتطلبات والشروط (EN - كل سطر شرط)' : 'REQUIREMENTS (EN - 1 PER LINE)'}
                  </label>
                  <textarea
                    rows={4}
                    value={form.requirementsText}
                    onChange={(e) => setForm((prev) => ({ ...prev, requirementsText: e.target.value }))}
                    placeholder="Bachelor's Degree in Architecture&#10;3+ years studio experience&#10;Proficiency in Revit and Rhino"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {isRtl ? 'المتطلبات والشروط (AR - كل سطر شرط)' : 'REQUIREMENTS (AR - 1 PER LINE)'}
                  </label>
                  <textarea
                    rows={4}
                    dir="rtl"
                    value={form.requirementsArText}
                    onChange={(e) => setForm((prev) => ({ ...prev, requirementsArText: e.target.value }))}
                    placeholder="بكالوريوس في الهندسة المعمارية&#10;خبرة 3+ سنوات في استوديوهات التصميم&#10;إتقان برامج Revit و Rhino"
                    className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold font-cairo"
                  />
                </div>
              </div>

              {/* Row 7: Software Tools */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                  {isRtl ? 'البرامج والأدوات المطلوبة (مفصولة بفاصلة)' : 'SOFTWARE & TOOLS (COMMA SEPARATED)'}
                </label>
                <input
                  type="text"
                  value={form.softwareText}
                  onChange={(e) => setForm((prev) => ({ ...prev, softwareText: e.target.value }))}
                  placeholder="Revit, AutoCAD, Rhino, 3ds Max, Adobe Suite"
                  className="w-full bg-[#FAF6EE] border border-[#E7E2D8] p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold font-mono"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-[#E7E2D8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-[#E7E2D8] text-xs text-stone-600 hover:text-charcoal transition-colors cursor-pointer"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-wider uppercase px-6 py-2.5 transition-all shadow-sm flex items-center space-x-2 rtl:space-x-reverse cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-gold" />
                  <span>{saving ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ ونشر الوظيفة' : 'Save & Publish')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
