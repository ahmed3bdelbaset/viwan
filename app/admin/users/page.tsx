'use client';

import React, { useState, useEffect } from 'react';
import { DataStore } from '@/lib/store';
import { AdminUser } from '@/lib/types';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ViwanMark } from '@/components/ui/Icons';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Shield,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Sparkles
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isCustomRole, setIsCustomRole] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: '',
    name: ''
  });

  const { t, isRtl } = useAdminLang();

  const [formData, setFormData] = useState<Partial<AdminUser>>({
    name: '',
    name_ar: '',
    email: '',
    password: '',
    role: 'Senior Project Architect',
    role_ar: 'مهندس مشاريع أول',
    phone: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    status: 'Active'
  });

  const loadUsers = () => {
    setUsers(DataStore.getAdminUsers());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsCustomRole(false);
    setFormData({
      id: `usr-${Date.now()}`,
      name: '',
      name_ar: '',
      email: '',
      password: 'password123',
      role: 'Chief Architect',
      role_ar: 'كبير المعماريين',
      phone: '+20 100 000 0000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({ ...user });
    const standardRoles = ['Super Admin', 'Chief Architect', 'Senior Project Architect', 'Lead Designer', 'Editor'];
    setIsCustomRole(!standardRoles.includes(user.role));
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const confirmDeleteUser = () => {
    if (deleteModal.id) {
      DataStore.deleteAdminUser(deleteModal.id);
      loadUsers();
      setDeleteModal({ isOpen: false, id: '', name: '' });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert(isRtl ? 'يرجى إدخال اسم المسؤول والبريد الإلكتروني' : 'Please provide name and email');
      return;
    }

    const userToSave: AdminUser = {
      id: formData.id || `usr-${Date.now()}`,
      name: formData.name,
      name_ar: formData.name_ar || formData.name,
      email: formData.email,
      password: formData.password || 'admin123',
      role: (formData.role as any) || 'Chief Architect',
      role_ar: formData.role_ar || (formData.role === 'Super Admin' ? 'المدير العام' : 'معماري رئيسي'),
      phone: formData.phone || '',
      avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      status: formData.status || 'Active',
      createdAt: formData.createdAt || new Date().toISOString().split('T')[0],
      lastLogin: formData.lastLogin || 'Never'
    };

    DataStore.saveAdminUser(userToSave);
    loadUsers();
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query ||
      u.name.toLowerCase().includes(query) ||
      u.name_ar.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.phone.toLowerCase().includes(query);
    return matchesRole && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* ========================================================================= */}
      {/* 1. HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E2D8]">
        <div>
          <h1 className="font-cinzel text-2xl text-charcoal uppercase tracking-wide">
            {t.users.title}
          </h1>
          <p className="text-xs text-stone-text font-light mt-0.5">
            {t.users.subtitle}
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
              placeholder={t.users.searchPlaceholder}
              className={`w-full bg-white border border-[#E7E2D8] focus:border-gold text-xs text-charcoal ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 outline-none`}
            />
          </div>

          {/* Add Admin Button */}
          <button
            onClick={handleOpenAdd}
            className="bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse shrink-0 group shadow-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 text-gold group-hover:text-white" />
            <span>{t.users.addNew}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ADMIN USERS: MOBILE CARDS LAYOUT (Full Screen, No Horizontal Scroll) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredUsers.length === 0 ? (
          <div className="bg-white border border-[#E7E2D8] p-8 text-center text-xs text-stone-500">
            {isRtl ? 'لا يوجد أعضاء مطابقين للبحث' : 'No team members found'}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-[#E7E2D8] p-4 space-y-3 shadow-sm hover:border-gold/60 transition-colors"
            >
              {/* Top Row: Avatar + Name + Role + Status Badge */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0">
                  <div className="w-11 h-11 bg-stone-200 border border-gold/40 overflow-hidden shrink-0 shadow-sm">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-cinzel text-xs font-bold text-charcoal uppercase truncate">
                      {isRtl ? user.name_ar || user.name : user.name}
                    </h3>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse mt-0.5 text-gold text-[11px] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{isRtl ? user.role_ar || user.role : user.role}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 border shrink-0 ${
                    user.status === 'Active'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-stone-100 text-stone-500 border-stone-300'
                  }`}
                >
                  {user.status === 'Active' ? t.users.active : t.users.inactive}
                </span>
              </div>

              {/* Middle Info: Email & Phone (Clear Full-Width Rows) */}
              <div className="pt-2 border-t border-[#E7E2D8]/60 space-y-1.5">
                <a
                  href={`mailto:${user.email}`}
                  className="text-stone-600 hover:text-gold transition-colors flex items-center space-x-2 rtl:space-x-reverse text-[11px] truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span className="truncate">{user.email}</span>
                </a>
                <a
                  href={`tel:${user.phone}`}
                  dir="ltr"
                  className="text-stone-600 hover:text-gold transition-colors flex items-center space-x-2 rtl:space-x-reverse text-[11px]"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{user.phone}</span>
                </a>
              </div>

              {/* Bottom Row: Last Active + Action Buttons */}
              <div className="pt-2 border-t border-[#E7E2D8]/60 flex items-center justify-between text-[10px] text-stone-400">
                <div className="truncate">
                  <span>{t.users.tableLastLogin}: </span>
                  <span className="font-mono text-stone-600">{user.lastLogin || 'Never'}</span>
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse shrink-0">
                  <button
                    onClick={() => handleOpenEdit(user)}
                    className="p-2 bg-[#FAF6EE] hover:bg-gold hover:text-white text-charcoal border border-[#E7E2D8] transition-colors"
                    title={t.projects.edit}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, isRtl ? user.name_ar : user.name)}
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
      {/* 2. ADMIN USERS: DESKTOP TABLE LAYOUT (Hidden on Mobile) */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-white border border-[#E7E2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead>
              <tr className="border-b border-[#E7E2D8] text-[10px] tracking-widest uppercase text-stone-500 font-semibold bg-[#FAF6EE]/50">
                <th className="py-4 px-6">{t.users.tableUser}</th>
                <th className="py-4 px-6">{t.users.tableRole}</th>
                <th className="py-4 px-6">{t.users.tablePhone}</th>
                <th className="py-4 px-6">{t.users.tableStatus}</th>
                <th className="py-4 px-6">{t.users.tableLastLogin}</th>
                <th className="py-4 px-6 text-right rtl:text-left">{t.users.tableActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D8]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#FAF6EE]/40 transition-colors group">
                  {/* Avatar & Name & Email */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                      <div className="w-11 h-11 bg-stone-200 border border-[#E7E2D8] overflow-hidden shrink-0 shadow-sm relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-cinzel text-xs font-semibold text-charcoal uppercase group-hover:text-gold transition-colors">
                          {isRtl ? user.name_ar || user.name : user.name}
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono mt-0.5 flex items-center space-x-1 rtl:space-x-reverse">
                          <Mail className="w-3 h-3 text-gold" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                      <span className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
                        {isRtl ? user.role_ar || user.role : user.role}
                      </span>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="py-4 px-6">
                    <div className="font-mono text-stone-dark text-[11px] flex items-center space-x-1 rtl:space-x-reverse">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span dir="ltr">{user.phone}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span
                      className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 border ${
                        user.status === 'Active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-stone-100 text-stone-500 border-stone-300'
                      }`}
                    >
                      {user.status === 'Active' ? t.users.active : t.users.inactive}
                    </span>
                  </td>

                  {/* Last Active */}
                  <td className="py-4 px-6 text-stone-500 font-mono text-[11px]">
                    {user.lastLogin || 'Never'}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right rtl:text-left">
                    <div className="flex items-center justify-end rtl:justify-start space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1.5 text-stone-400 hover:text-gold transition-colors"
                        title={t.projects.edit}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, isRtl ? user.name_ar : user.name)}
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
      {/* 3. ADD / EDIT ADMIN USER MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[99999] bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#181716]/95 backdrop-blur-2xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-white max-w-2xl w-full my-auto max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative rounded-[32px] sm:rounded-[36px] custom-scrollbar animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle Viwan Watermark behind content */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.05]">
              <ViwanMark className="w-72 h-72 text-white" isDark={true} />
            </div>

            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gold/10 border border-gold/30">
                  <Users className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold px-2.5 py-0.5 rounded-full bg-gold/10 inline-block mb-1">
                    {editingUser ? (isRtl ? 'تعديل بيانات المسؤول' : 'EDIT TEAM MEMBER') : (isRtl ? 'مسؤول جديد' : 'NEW TEAM MEMBER')}
                  </span>
                  <h2 className="font-cinzel text-xl text-white font-medium">
                    {editingUser ? t.users.editModalTitle : t.users.addModalTitle}
                  </h2>
                  <p className="text-xs text-stone-300 font-light mt-0.5">
                    {t.users.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 relative z-10">
              {/* Photo Upload (Device File Upload + Live Preview) */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <ImageUploader
                  label={t.users.avatar}
                  value={formData.avatar || ''}
                  onChange={(val) => setFormData({ ...formData, avatar: val })}
                  isRtl={isRtl}
                />
              </div>

              {/* Full Name Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {t.users.nameEn} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Eng. Sarah Mansour"
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {t.users.nameAr} *
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={formData.name_ar || ''}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    placeholder="م. سارة منصور"
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-cairo"
                  />
                </div>
              </div>

              {/* Email & Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {t.users.email} *
                  </label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="architect@viwan.com"
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal font-mono outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {t.users.password} *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      dir="ltr"
                      value={formData.password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal font-mono outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-charcoal cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Phone & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                    {t.users.phone}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966 50 000 0000"
                    className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal font-mono outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                      {t.users.role}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomRole(!isCustomRole)}
                      className="text-[11px] text-gold hover:underline font-semibold flex items-center space-x-1 rtl:space-x-reverse cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-gold" />
                      <span>
                        {isCustomRole
                          ? (isRtl ? 'اختيار من القائمة' : 'Select from Presets')
                          : (isRtl ? 'تحديد مسمى مخصص' : 'Custom Role')}
                      </span>
                    </button>
                  </div>

                  {isCustomRole ? (
                    <div className="space-y-2 bg-white/80 dark:bg-black/20 p-3.5 border border-gold/40 rounded-xl">
                      <div>
                        <label className="text-[10px] uppercase font-semibold text-stone-500 block mb-1">
                          {isRtl ? 'المسمى الوظيفي بالعربية' : 'CUSTOM ROLE (AR)'}
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={formData.role_ar || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              role_ar: e.target.value,
                              role: (formData.role || e.target.value) as any,
                            })
                          }
                          placeholder="مثال: مهندس واجهات / مدير فرع الرياض"
                          className="w-full bg-white border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-semibold text-stone-500 block mb-1">
                          {isRtl ? 'المسمى الوظيفي بالإنجليزية' : 'CUSTOM ROLE (EN)'}
                        </label>
                        <input
                          type="text"
                          value={formData.role || ''}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                          placeholder="e.g. Façade Engineering Lead"
                          className="w-full bg-white border border-[#E7E2D8] rounded-lg p-2.5 text-xs text-charcoal outline-none focus:border-gold"
                        />
                      </div>
                    </div>
                  ) : (
                    <select
                      value={formData.role || 'Chief Architect'}
                      onChange={(e) => {
                        const selectedRole = e.target.value;
                        if (selectedRole === 'CUSTOM') {
                          setIsCustomRole(true);
                          return;
                        }
                        const roleArabicMap: Record<string, string> = {
                          'Super Admin': 'المدير العام (Super Admin)',
                          'Chief Architect': 'كبير المعماريين',
                          'Senior Project Architect': 'مهندس مشاريع أول',
                          'Lead Designer': 'رئيس قسم التصميم',
                          'Editor': 'محرر محتوى',
                        };
                        setFormData({
                          ...formData,
                          role: selectedRole as any,
                          role_ar: roleArabicMap[selectedRole] || selectedRole,
                        });
                      }}
                      className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer"
                    >
                      <option value="Super Admin">{t.users.roleSuperAdmin}</option>
                      <option value="Chief Architect">{t.users.roleChiefArchitect}</option>
                      <option value="Senior Project Architect">{t.users.roleSeniorArchitect}</option>
                      <option value="Lead Designer">{t.users.roleLeadDesigner}</option>
                      <option value="Editor">{t.users.roleEditor}</option>
                      <option value="CUSTOM">
                        {isRtl ? 'تحديد مسمى وظيفي مخصص يدوياً...' : 'Custom Role / Manual Entry...'}
                      </option>
                    </select>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
                  {t.users.status}
                </label>
                <select
                  value={formData.status || 'Active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-white/80 dark:bg-black/20 border border-[#E7E2D8] rounded-xl p-3 text-xs text-charcoal outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all cursor-pointer"
                >
                  <option value="Active">{t.users.active}</option>
                  <option value="Inactive">{t.users.inactive}</option>
                </select>
              </div>

              {/* Modal Actions Footer - Centered */}
              <div className="flex items-center justify-center gap-3 pt-6 border-t border-white/10 relative z-10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 border border-white/20 bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white text-xs sm:text-sm font-medium tracking-wider rounded-full transition-all cursor-pointer min-w-[110px]"
                >
                  {t.users.cancel}
                </button>
                <button
                  type="submit"
                  className="px-9 py-3 bg-gradient-to-r from-[#967448] to-[#b38e5d] hover:brightness-110 text-white text-xs sm:text-sm font-semibold tracking-wider rounded-full transition-all shadow-lg shadow-gold/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-w-[140px]"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{editingUser ? (isRtl ? 'حفظ التعديلات' : 'Save Changes') : (isRtl ? 'إضافة المسؤول' : 'Create User')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Luxury Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={t.users.deleteTitle}
        message={t.users.deleteMessage}
        confirmLabel={t.projects.delete}
        cancelLabel={t.projects.cancel}
        isDestructive={true}
        onConfirm={confirmDeleteUser}
        onCancel={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
      />
    </div>
  );
}
