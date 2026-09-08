'use client';

import React, { useState, useEffect } from 'react';
import { useAdminLang } from '@/lib/i18n/AdminLanguageContext';
import { useViwanModal } from '@/components/ui/ViwanModalProvider';
import {
  Mail,
  Calendar,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Trash2,
  ExternalLink,
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Eye,
  X
} from 'lucide-react';

interface ContactItem {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  projectLocation?: string;
  projectType?: string;
  projectSize?: string;
  budget?: string;
  stage?: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'replied';
}

interface ConsultationItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  projectType: string;
  location?: string;
  notes?: string;
  submittedAt: string;
  status: 'new' | 'confirmed' | 'completed';
}

export default function AdminInboxPage() {
  const { isRtl } = useAdminLang();
  const { showConfirm, showNotification } = useViwanModal();

  const [activeTab, setActiveTab] = useState<'all' | 'contacts' | 'consultations'>('all');
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<{ item: ContactItem | ConsultationItem; type: 'contact' | 'consultation' } | null>(null);

  const fetchInbox = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/inbox');
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts || []);
        setConsultations(data.consultations || []);
      }
    } catch (err) {
      console.error('Failed to load inbox:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const handleUpdateStatus = async (id: string, type: 'contact' | 'consultation', newStatus: string) => {
    try {
      const res = await fetch('/api/admin/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, status: newStatus }),
      });

      if (res.ok) {
        if (type === 'contact') {
          setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus as any } : c)));
        } else {
          setConsultations((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus as any } : c)));
        }
        if (selectedItem && selectedItem.item.id === id) {
          setSelectedItem({
            item: { ...selectedItem.item, status: newStatus as any },
            type: selectedItem.type,
          });
        }
        showNotification(
          isRtl ? 'تم تحديث حالة الرسالة بنجاح' : 'Status updated successfully',
          isRtl ? 'تحديث الحالة' : 'Status Update'
        );
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteItem = async (id: string, type: 'contact' | 'consultation') => {
    const confirmed = await showConfirm(
      isRtl ? 'هل أنت متأكد من حذف هذه الرسالة نهائياً من النظام؟' : 'Are you sure you want to permanently delete this submission?',
      isRtl ? 'تأكيد الحذف' : 'Confirm Delete'
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/inbox?id=${id}&type=${type}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if (type === 'contact') {
          setContacts((prev) => prev.filter((c) => c.id !== id));
        } else {
          setConsultations((prev) => prev.filter((c) => c.id !== id));
        }
        if (selectedItem?.item.id === id) {
          setSelectedItem(null);
        }
        showNotification(
          isRtl ? 'تم حذف العنصر بنجاح' : 'Item deleted successfully',
          isRtl ? 'تم الحذف' : 'Deleted'
        );
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  // Combine and filter list
  const combinedList = [
    ...contacts.map((c) => ({ ...c, _itemType: 'contact' as const })),
    ...consultations.map((c) => ({ ...c, _itemType: 'consultation' as const })),
  ].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const filteredItems = combinedList.filter((item) => {
    if (activeTab === 'contacts' && item._itemType !== 'contact') return false;
    if (activeTab === 'consultations' && item._itemType !== 'consultation') return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      item.phone?.toLowerCase().includes(query) ||
      (item as any).projectLocation?.toLowerCase().includes(query) ||
      (item as any).location?.toLowerCase().includes(query) ||
      (item as any).projectType?.toLowerCase().includes(query)
    );
  });

  const totalNew = contacts.filter((c) => c.status === 'new').length + consultations.filter((c) => c.status === 'new').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D8] pb-6">
        <div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <h1 className="font-cinzel text-2xl font-normal text-charcoal tracking-wide uppercase">
              {isRtl ? 'صندوق الوارد والرسائل' : 'INBOX & CONSULTATIONS'}
            </h1>
            {totalNew > 0 && (
              <span className="bg-gold text-charcoal text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {totalNew} {isRtl ? 'جديد' : 'NEW'}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-600 font-light mt-1">
            {isRtl
              ? 'متابعة استفسارات العملاء القادمة من صفحة تواصل معنا وحجوزات الاستشارات المعمارية (30 دقيقة).'
              : 'Manage incoming client inquiries from the contact form and 30-minute architectural consultation bookings.'}
          </p>
        </div>

        <button
          onClick={fetchInbox}
          className="inline-flex items-center space-x-2 rtl:space-x-reverse border border-[#E7E2D8] bg-white hover:border-gold px-4 py-2 text-xs text-charcoal transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gold ${loading ? 'animate-spin' : ''}`} />
          <span>{isRtl ? 'تحديث الوارد' : 'REFRESH'}</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs tracking-wider uppercase font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-charcoal text-white'
                : 'bg-white text-stone-600 border border-[#E7E2D8] hover:border-gold'
            }`}
          >
            {isRtl ? `الكل (${combinedList.length})` : `ALL (${combinedList.length})`}
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 text-xs tracking-wider uppercase font-medium transition-colors ${
              activeTab === 'contacts'
                ? 'bg-charcoal text-white'
                : 'bg-white text-stone-600 border border-[#E7E2D8] hover:border-gold'
            }`}
          >
            {isRtl ? `استفسارات التواصل (${contacts.length})` : `CONTACT INQUIRIES (${contacts.length})`}
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-4 py-2 text-xs tracking-wider uppercase font-medium transition-colors ${
              activeTab === 'consultations'
                ? 'bg-charcoal text-white'
                : 'bg-white text-stone-600 border border-[#E7E2D8] hover:border-gold'
            }`}
          >
            {isRtl ? `حجوزات الاستشارات (${consultations.length})` : `CONSULTATIONS (${consultations.length})`}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'بحث بالاسم، البريد، أو الموقع...' : 'Search by name, email, location...'}
            className="w-full bg-white border border-[#E7E2D8] pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 text-xs text-charcoal focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Items List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-500 font-cinzel tracking-widest uppercase">
          {isRtl ? 'جاري تحميل الرسائل والحجوزات...' : 'LOADING INCOMING MESSAGES...'}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#E7E2D8] p-8">
          <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <p className="font-cinzel text-sm text-charcoal uppercase">
            {isRtl ? 'لا توجد رسائل مطابقة حالياً' : 'NO MESSAGES FOUND'}
          </p>
          <p className="text-xs text-stone-500 mt-1">
            {isRtl ? 'ستظهر هنا كافة الاستفسارات وحجوزات الاستشارات المسجلة في المنصة.' : 'All incoming submissions will appear here automatically.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isContact = item._itemType === 'contact';
            const isNew = item.status === 'new';

            return (
              <div
                key={item.id}
                className={`bg-white border transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-gold/60 ${
                  isNew ? 'border-l-4 rtl:border-l rtl:border-r-4 border-l-gold rtl:border-r-gold border-[#E7E2D8]' : 'border-[#E7E2D8]'
                }`}
              >
                {/* Left info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 font-semibold ${
                        isContact ? 'bg-stone-100 text-stone-700' : 'bg-gold/15 text-charcoal border border-gold/30'
                      }`}
                    >
                      {isContact ? (isRtl ? 'استفسار تواصل' : 'CONTACT FORM') : (isRtl ? 'جلسة استشارة 30 دقيقة' : '30-MIN CONSULTATION')}
                    </span>

                    <span
                      className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-xs font-medium ${
                        isNew ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>

                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(item.submittedAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <h3 className="font-semibold text-sm text-charcoal">{item.name}</h3>
                    {(item as any).company && (
                      <span className="text-xs text-stone-500">({(item as any).company})</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 font-light">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      {item.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      {item.phone}
                    </span>
                    {((item as any).projectLocation || (item as any).location) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {(item as any).projectLocation || (item as any).location}
                      </span>
                    )}
                  </div>

                  {/* Summary preview */}
                  <p className="text-xs text-stone-700 line-clamp-1 italic pt-0.5">
                    "{(item as any).message || (item as any).notes || (item as any).projectType || 'No details provided'}"
                  </p>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2 rtl:space-x-reverse shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F3EDE3]">
                  <button
                    onClick={() => setSelectedItem({ item, type: item._itemType })}
                    className="border border-[#E7E2D8] hover:border-gold bg-[#FAF6EE] px-3 py-1.5 text-xs text-charcoal flex items-center space-x-1.5 rtl:space-x-reverse transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-gold" />
                    <span>{isRtl ? 'عرض التفاصيل' : 'VIEW'}</span>
                  </button>

                  {isNew ? (
                    <button
                      onClick={() => handleUpdateStatus(item.id, item._itemType, isContact ? 'replied' : 'confirmed')}
                      className="bg-charcoal hover:bg-gold text-white px-3 py-1.5 text-xs font-medium flex items-center space-x-1.5 rtl:space-x-reverse transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold hover:text-white" />
                      <span>{isRtl ? 'تحديد كمكتمل' : 'MARK DONE'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(item.id, item._itemType, 'new')}
                      className="border border-[#E7E2D8] hover:border-stone-400 px-2.5 py-1.5 text-xs text-stone-500 transition-colors"
                      title={isRtl ? 'إعادة تعيين كجديد' : 'Mark as new'}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteItem(item.id, item._itemType)}
                    className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                    title={isRtl ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E2D8] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E7E2D8] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
                  {selectedItem.type === 'contact' ? (isRtl ? 'تفاصيل استفسار تواصل' : 'CONTACT INQUIRY DETAILS') : (isRtl ? 'تفاصيل حجز الاستشارة المعمارية' : 'CONSULTATION BOOKING DETAILS')}
                </span>
                <h2 className="font-cinzel text-xl text-charcoal font-medium mt-1">
                  {selectedItem.item.name}
                </h2>
                <div className="text-xs text-stone-500 font-mono mt-0.5">
                  {new Date(selectedItem.item.submittedAt).toLocaleString(isRtl ? 'ar-EG' : 'en-US')}
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 text-stone-400 hover:text-charcoal transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#FAF6EE] p-4 border border-[#E7E2D8] space-y-1">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">{isRtl ? 'البريد الإلكتروني' : 'EMAIL ADDRESS'}</span>
                <a href={`mailto:${selectedItem.item.email}`} className="font-medium text-charcoal hover:text-gold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gold" />
                  {selectedItem.item.email}
                </a>
              </div>

              <div className="bg-[#FAF6EE] p-4 border border-[#E7E2D8] space-y-1">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">{isRtl ? 'رقم الهاتف / الواتساب' : 'PHONE NUMBER'}</span>
                <a href={`tel:${selectedItem.item.phone}`} className="font-medium text-charcoal hover:text-gold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gold" />
                  {selectedItem.item.phone}
                </a>
              </div>

              {((selectedItem.item as any).projectLocation || (selectedItem.item as any).location) && (
                <div className="bg-[#FAF6EE] p-4 border border-[#E7E2D8] space-y-1">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">{isRtl ? 'موقع المشروع' : 'PROJECT LOCATION'}</span>
                  <div className="font-medium text-charcoal flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    {(selectedItem.item as any).projectLocation || (selectedItem.item as any).location}
                  </div>
                </div>
              )}

              {(selectedItem.item as any).projectType && (
                <div className="bg-[#FAF6EE] p-4 border border-[#E7E2D8] space-y-1">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">{isRtl ? 'نوع المشروع' : 'PROJECT TYPE'}</span>
                  <div className="font-medium text-charcoal">{(selectedItem.item as any).projectType}</div>
                </div>
              )}

              {(selectedItem.item as any).budget && (
                <div className="bg-[#FAF6EE] p-4 border border-[#E7E2D8] space-y-1">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">{isRtl ? 'الميزانية التقديرية' : 'ESTIMATED BUDGET'}</span>
                  <div className="font-medium text-charcoal">{(selectedItem.item as any).budget}</div>
                </div>
              )}

              {(selectedItem.item as any).preferredDate && (
                <div className="bg-[#FAF6EE] p-4 border border-[#E7E2D8] space-y-1">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">{isRtl ? 'الموعد المفضل' : 'PREFERRED DATE & TIME'}</span>
                  <div className="font-medium text-charcoal flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    {(selectedItem.item as any).preferredDate} • {(selectedItem.item as any).preferredTime || ''}
                  </div>
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className="space-y-2">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                {selectedItem.type === 'contact' ? (isRtl ? 'نص الرسالة والاستفسار' : 'MESSAGE CONTENT') : (isRtl ? 'ملاحظات وتفاصيل الاستشارة' : 'CONSULTATION NOTES')}
              </span>
              <div className="p-4 bg-white border border-[#E7E2D8] text-xs text-charcoal leading-relaxed whitespace-pre-wrap">
                {(selectedItem.item as any).message || (selectedItem.item as any).notes || (isRtl ? 'لم يتم إدخال تفاصيل إضافية.' : 'No additional notes provided.')}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E7E2D8]">
              <button
                onClick={() => handleDeleteItem(selectedItem.item.id, selectedItem.type)}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isRtl ? 'حذف الرسالة' : 'Delete Submission'}</span>
              </button>

              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <a
                  href={`mailto:${selectedItem.item.email}?subject=VIWAN Studio Architecture Response`}
                  className="px-4 py-2 border border-[#E7E2D8] hover:border-gold bg-white text-xs font-medium text-charcoal flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-gold" />
                  <span>{isRtl ? 'مراسلة عبر البريد' : 'Reply via Email'}</span>
                </a>

                {selectedItem.item.status === 'new' ? (
                  <button
                    onClick={() => handleUpdateStatus(selectedItem.item.id, selectedItem.type, selectedItem.type === 'contact' ? 'replied' : 'confirmed')}
                    className="px-5 py-2 bg-charcoal hover:bg-gold text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                  >
                    {isRtl ? 'تحديد كمكتمل' : 'MARK COMPLETED'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(selectedItem.item.id, selectedItem.type, 'new')}
                    className="px-4 py-2 border border-stone-300 hover:border-stone-500 text-xs text-stone-600 transition-colors"
                  >
                    {isRtl ? 'إعادة كجديد' : 'Mark as New'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
