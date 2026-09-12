'use client'

import React, { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

export interface Country {
  code: string
  dial: string
  flag: string
  nameAr: string
  nameEn: string
}

export const COUNTRIES: Country[] = [
  // Primary Arab Countries (Priority)
  { code: 'EG', dial: '+20', flag: '🇪🇬', nameAr: 'مصر', nameEn: 'Egypt' },
  { code: 'SA', dial: '+966', flag: '🇸🇦', nameAr: 'المملكة العربية السعودية', nameEn: 'Saudi Arabia' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', nameAr: 'الإمارات العربية المتحدة', nameEn: 'United Arab Emirates' },
  { code: 'SY', dial: '+963', flag: '🇸🇾', nameAr: 'سوريا', nameEn: 'Syria' },
  { code: 'KW', dial: '+965', flag: '🇰🇼', nameAr: 'الكويت', nameEn: 'Kuwait' },
  { code: 'QA', dial: '+974', flag: '🇶🇦', nameAr: 'قطر', nameEn: 'Qatar' },
  { code: 'BH', dial: '+973', flag: '🇧🇭', nameAr: 'البحرين', nameEn: 'Bahrain' },
  { code: 'OM', dial: '+968', flag: '🇴🇲', nameAr: 'سلطنة عمان', nameEn: 'Oman' },
  { code: 'JO', dial: '+962', flag: '🇯🇴', nameAr: 'الأردن', nameEn: 'Jordan' },
  { code: 'LB', dial: '+961', flag: '🇱🇧', nameAr: 'لبنان', nameEn: 'Lebanon' },
  { code: 'IQ', dial: '+964', flag: '🇮🇶', nameAr: 'العراق', nameEn: 'Iraq' },
  { code: 'LY', dial: '+218', flag: '🇱🇾', nameAr: 'ليبيا', nameEn: 'Libya' },
  { code: 'PS', dial: '+970', flag: '🇵🇸', nameAr: 'فلسطين', nameEn: 'Palestine' },
  { code: 'SD', dial: '+249', flag: '🇸🇩', nameAr: 'السودان', nameEn: 'Sudan' },
  { code: 'YE', dial: '+967', flag: '🇾🇪', nameAr: 'اليمن', nameEn: 'Yemen' },
  { code: 'MA', dial: '+212', flag: '🇲🇦', nameAr: 'المغرب', nameEn: 'Morocco' },
  { code: 'TN', dial: '+216', flag: '🇹🇳', nameAr: 'تونس', nameEn: 'Tunisia' },
  { code: 'DZ', dial: '+213', flag: '🇩🇿', nameAr: 'الجزائر', nameEn: 'Algeria' },

  // Key International Countries
  { code: 'US', dial: '+1', flag: '🇺🇸', nameAr: 'الولايات المتحدة الأمريكية', nameEn: 'United States' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom' },
  { code: 'TR', dial: '+90', flag: '🇹🇷', nameAr: 'تركيا', nameEn: 'Turkey' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', nameAr: 'ألمانيا', nameEn: 'Germany' },
  { code: 'FR', dial: '+33', flag: '🇫🇷', nameAr: 'فرنسا', nameEn: 'France' },
  { code: 'IT', dial: '+39', flag: '🇮🇹', nameAr: 'إيطاليا', nameEn: 'Italy' },
  { code: 'ES', dial: '+34', flag: '🇪🇸', nameAr: 'إسبانيا', nameEn: 'Spain' },
  { code: 'CH', dial: '+41', flag: '🇨🇭', nameAr: 'سويسرا', nameEn: 'Switzerland' },
  { code: 'CA', dial: '+1', flag: '🇨🇦', nameAr: 'كندا', nameEn: 'Canada' },
  { code: 'AU', dial: '+61', flag: '🇦🇺', nameAr: 'أستراليا', nameEn: 'Australia' },
  { code: 'CN', dial: '+86', flag: '🇨🇳', nameAr: 'الصين', nameEn: 'China' },
  { code: 'RU', dial: '+7', flag: '🇷🇺', nameAr: 'روسيا', nameEn: 'Russia' },
  { code: 'IN', dial: '+91', flag: '🇮🇳', nameAr: 'الهند', nameEn: 'India' },
  { code: 'JP', dial: '+81', flag: '🇯🇵', nameAr: 'اليابان', nameEn: 'Japan' },
  { code: 'SG', dial: '+65', flag: '🇸🇬', nameAr: 'سنغافورة', nameEn: 'Singapore' },
  { code: 'MY', dial: '+60', flag: '🇲🇾', nameAr: 'ماليزيا', nameEn: 'Malaysia' },
]

export interface PhoneInputProps {
  id?: string
  name?: string
  value: string
  onChange: (fullNumber: string) => void
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
  defaultCountryCode?: string
}

import { getInitialVisitorCountry, detectVisitorCountry } from '@/lib/geo'

export function PhoneInput({
  id,
  name,
  value = '',
  onChange,
  required = false,
  disabled = false,
  placeholder,
  className = '',
  defaultCountryCode = 'EG',
}: PhoneInputProps) {
  const autoId = useId()
  const inputId = id || autoId

  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    const geoCode = typeof window !== 'undefined' ? getInitialVisitorCountry() : defaultCountryCode
    return (
      COUNTRIES.find((c) => c.code.toUpperCase() === geoCode.toUpperCase()) ||
      COUNTRIES.find((c) => c.code.toUpperCase() === defaultCountryCode.toUpperCase()) ||
      COUNTRIES[0]
    )
  })
  const [localNumber, setLocalNumber] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Listen to external country change events (e.g. from Geo detection)
  useEffect(() => {
    const handleCountryChanged = (e: any) => {
      const code = e?.detail
      if (!value && code) {
        const found = COUNTRIES.find((c) => c.code.toUpperCase() === code.toUpperCase())
        if (found) setSelectedCountry(found)
      }
    }
    window.addEventListener('viwan_country_changed', handleCountryChanged)
    return () => window.removeEventListener('viwan_country_changed', handleCountryChanged)
  }, [value])

  // Parse existing value if it starts with known country dial code
  useEffect(() => {
    if (!value) {
      setLocalNumber('')
      // Auto-detect visitor's country (Qatar, Saudi, Egypt, etc.) when empty
      detectVisitorCountry().then((countryCode) => {
        if (!value && countryCode) {
          const detected = COUNTRIES.find((c) => c.code.toUpperCase() === countryCode.toUpperCase())
          if (detected) {
            setSelectedCountry(detected)
          }
        }
      })
      return
    }

    const trimmed = value.trim()
    // Check if trimmed value starts with any country dial code
    const matchingCountry = COUNTRIES.find((c) => trimmed.startsWith(c.dial))
    if (matchingCountry) {
      setSelectedCountry(matchingCountry)
      const remainder = trimmed.slice(matchingCountry.dial.length).trim()
      setLocalNumber(remainder)
    } else {
      // It's just a local number
      setLocalNumber(trimmed)
    }
  }, [value])

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Focus search input when dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Dynamic placeholder based on selected country
  const resolvedPlaceholder = placeholder || (
    selectedCountry.code === 'QA' ? '3300 0000' :
    selectedCountry.code === 'SA' ? '50 123 4567' :
    selectedCountry.code === 'AE' ? '50 123 4567' :
    selectedCountry.code === 'KW' ? '9000 0000' :
    '100 000 0000'
  )

  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter((country) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    const cleanDial = country.dial.replace('+', '')
    return (
      country.nameAr.toLowerCase().includes(q) ||
      country.nameEn.toLowerCase().includes(q) ||
      country.dial.includes(q) ||
      cleanDial.includes(q) ||
      country.code.toLowerCase().includes(q)
    )
  })

  // Handle local number change
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value
    setLocalNumber(rawVal)
    const trimmed = rawVal.trim()
    if (!trimmed) {
      onChange('')
    } else {
      // Strip leading zero if present for correct international formatting
      const cleanNumber = trimmed.startsWith('0') ? trimmed.replace(/^0+/, '') : trimmed
      onChange(`${selectedCountry.dial} ${cleanNumber}`)
    }
  }

  // Handle country select
  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country)
    setIsOpen(false)
    setSearchQuery('')
    const trimmed = localNumber.trim()
    if (trimmed) {
      const cleanNumber = trimmed.startsWith('0') ? trimmed.replace(/^0+/, '') : trimmed
      onChange(`${country.dial} ${cleanNumber}`)
    }
  }

  return (
    <div ref={containerRef} className={`relative flex items-stretch w-full ${className}`}>
      {/* Hidden input for standard form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={localNumber.trim() ? `${selectedCountry.dial} ${localNumber.trim()}` : ''}
        />
      )}

      {/* Country Selector Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 px-3 py-3.5 bg-white dark:bg-[#181614] border border-stone/40 border-e-0 text-charcoal dark:text-ivory hover:bg-stone/10 transition-colors shrink-0 text-xs font-mono select-none rounded-s-xs cursor-pointer"
        title={`${selectedCountry.nameAr} (${selectedCountry.dial})`}
      >
        <span className="text-base leading-none" role="img" aria-label={selectedCountry.nameEn}>
          {selectedCountry.flag}
        </span>
        <span className="font-semibold text-xs tracking-tight" dir="ltr">
          {selectedCountry.dial}
        </span>
        <ChevronDown
          className={`size-3 text-stone/80 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-gold' : ''
          }`}
        />
      </button>

      {/* Local Phone Number Input */}
      <input
        id={inputId}
        type="tel"
        autoComplete="tel-national"
        dir="ltr"
        required={required}
        disabled={disabled}
        placeholder={resolvedPlaceholder}
        value={localNumber}
        onChange={handleNumberChange}
        className="w-full bg-white dark:bg-[#181614] border border-stone/40 p-3.5 text-sm font-sans text-charcoal dark:text-ivory placeholder:text-stone/70 focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors rounded-e-xs shadow-2xs text-start"
      />

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 start-0 top-full mt-1.5 w-72 sm:w-80 bg-white dark:bg-[#1A1815] border border-stone/40 shadow-xl rounded-xs overflow-hidden animate-fade-in text-charcoal dark:text-ivory"
        >
          {/* Search Header */}
          <div className="p-2.5 border-b border-stone/30 bg-[#FAF7F2] dark:bg-[#141311]">
            <div className="relative flex items-center">
              <Search className="absolute start-2.5 size-3.5 text-stone/80 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن دولة أو رمز..."
                className="w-full bg-white dark:bg-[#1E1C19] border border-stone/40 py-1.5 ps-8 pe-7 text-xs text-charcoal dark:text-ivory placeholder:text-stone/70 focus:outline-none focus:border-gold rounded-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute end-2 text-stone hover:text-charcoal dark:hover:text-ivory"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* Country Items List */}
          <div className="max-h-60 overflow-y-auto py-1 divide-y divide-stone/15">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                لا توجد نتائج مطابقة
              </div>
            ) : (
              filteredCountries.map((country) => {
                const isSelected = country.code === selectedCountry.code
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelectCountry(country)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-start hover:bg-stone/10 dark:hover:bg-stone/20 transition-colors cursor-pointer ${
                      isSelected ? 'bg-gold/10 font-semibold text-gold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-base leading-none shrink-0">{country.flag}</span>
                      <span className="truncate">{country.nameAr}</span>
                      <span className="text-[10px] text-muted-foreground truncate hidden sm:inline">
                        ({country.nameEn})
                      </span>
                    </div>
                    <span className="font-mono text-xs text-stone-500 dark:text-stone-400 shrink-0 ps-2" dir="ltr">
                      {country.dial}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
