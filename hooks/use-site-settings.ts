'use client'

import { useState, useEffect, useMemo } from 'react'
import { CONTACT } from '@/lib/site'
import { DataStore } from '@/lib/store'
import { CompanyInfo, ContactPhone } from '@/lib/types'

export function formatWhatsAppUrl(input?: string): string {
  if (!input) return CONTACT.whatsapp
  const trimmed = input.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  const digits = trimmed.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : CONTACT.whatsapp
}

export function formatPhoneTel(input?: string): string {
  if (!input) return ''
  return input.replace(/[^\d+]/g, '')
}

export interface LiveContactInfo {
  phone: string
  phoneCairo: string
  phoneRiyadh: string
  phones: ContactPhone[]
  email: string
  emails: { label_en: string; label_ar: string; email: string }[]
  whatsapp: string
  instagram: string
  facebook: string
  linkedin: string
  youtube: string
  behance: string
  city: string
  footerSummaryEn: string
  footerSummaryAr: string
}

export function useSiteSettings() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('viwan_company_info')
        if (stored) {
          return JSON.parse(stored)
        }
      } catch (e) {}
    }
    return DataStore.getCompanyInfo()
  })

  useEffect(() => {
    // Initial fetch from server to get persistent DB state
    fetch('/api/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.companyInfo) {
          setCompanyInfo(json.companyInfo)
          localStorage.setItem('viwan_company_info', JSON.stringify(json.companyInfo))
        } else if (json.settings) {
          setCompanyInfo((prev) => ({
            ...prev,
            social: {
              ...prev.social,
              facebook: json.settings.facebook || prev.social?.facebook,
              instagram: json.settings.instagram || prev.social?.instagram,
              linkedin: json.settings.linkedin || prev.social?.linkedin,
              whatsapp: json.settings.whatsapp || prev.social?.whatsapp,
              youtube: json.settings.youtube || prev.social?.youtube,
            },
          }))
        }
      })
      .catch(() => {})

    // Real-time listener for local updates dispatched from admin
    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setCompanyInfo(e.detail)
      } else {
        setCompanyInfo(DataStore.getCompanyInfo())
      }
    }

    window.addEventListener('viwan_settings_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('viwan_settings_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const contact = useMemo<LiveContactInfo>(() => {
    const phones =
      companyInfo.phones && companyInfo.phones.length > 0
        ? companyInfo.phones
        : [
            {
              id: 'p-cairo',
              label_en: 'Cairo Studio',
              label_ar: 'استوديو القاهرة',
              number: CONTACT.phone,
              is_whatsapp: false,
            },
          ]

    const phoneCairo =
      phones.find(
        (p) =>
          p.label_en?.toLowerCase().includes('cairo') ||
          p.label_ar?.includes('القاهرة')
      )?.number ||
      phones[0]?.number ||
      CONTACT.phone

    const phoneRiyadh =
      phones.find(
        (p) =>
          p.label_en?.toLowerCase().includes('riyadh') ||
          p.label_ar?.includes('الرياض')
      )?.number ||
      phones[1]?.number ||
      ''

    const generalEmail =
      companyInfo.emails?.find(
        (e) =>
          e.label_en?.toLowerCase().includes('general') ||
          e.label_ar?.includes('عام')
      )?.email ||
      companyInfo.emails?.[0]?.email ||
      CONTACT.email

    const rawWhatsapp =
      companyInfo.social?.whatsapp ||
      phones.find((p) => p.is_whatsapp)?.number ||
      CONTACT.whatsapp

    return {
      phone: phones[0]?.number || CONTACT.phone,
      phoneCairo,
      phoneRiyadh,
      phones,
      email: generalEmail,
      emails: companyInfo.emails || [],
      whatsapp: formatWhatsAppUrl(rawWhatsapp),
      instagram: companyInfo.social?.instagram || CONTACT.instagram,
      facebook: companyInfo.social?.facebook || CONTACT.facebook,
      linkedin: companyInfo.social?.linkedin || CONTACT.linkedin,
      youtube: companyInfo.social?.youtube || CONTACT.youtube,
      behance: companyInfo.social?.behance || CONTACT.behance,
      city: CONTACT.city,
      footerSummaryEn: companyInfo.footer_summary_en || '',
      footerSummaryAr: companyInfo.footer_summary_ar || '',
    }
  }, [companyInfo])

  return {
    companyInfo,
    contact,
  }
}
