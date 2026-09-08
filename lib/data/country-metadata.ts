/**
 * Comprehensive bilingual metadata and Google Maps verified coordinates
 * for interactive cartography and territorial hover tooltips.
 */

export interface TerritoryInfo {
  id?: string
  iso?: string
  nameEn: string
  nameAr: string
  coordinates: string
  lat: number
  lng: number
  isViwanHub?: boolean
  hubType?: 'hq' | 'regional' | 'heritage'
  hubCityEn?: string
  hubCityAr?: string
  projectsCount?: number
  scopeEn?: string
  scopeAr?: string
}

export const VIWAN_HUBS: Record<string, TerritoryInfo> = {
  egypt: {
    id: 'egypt',
    iso: '818',
    nameEn: 'Egypt',
    nameAr: 'مصر',
    coordinates: '30.0444° N, 31.2357° E',
    lat: 30.0444,
    lng: 31.2357,
    isViwanHub: true,
    hubType: 'hq',
    hubCityEn: 'Cairo & New Cairo',
    hubCityAr: 'القاهرة والقاهرة الجديدة',
    projectsCount: 28,
    scopeEn: 'Main Engineering & Architecture Headquarters',
    scopeAr: 'المقر الرئيسي للاستشارات الهندسية والتصميم المعماري',
  },
  saudi: {
    id: 'saudi',
    iso: '682',
    nameEn: 'Saudi Arabia',
    nameAr: 'المملكة العربية السعودية',
    coordinates: '24.7136° N, 46.6753° E',
    lat: 24.7136,
    lng: 46.6753,
    isViwanHub: true,
    hubType: 'regional',
    hubCityEn: 'Riyadh & Diriyah',
    hubCityAr: 'الرياض والدرعية',
    projectsCount: 14,
    scopeEn: 'Regional Office & Luxury Residential Compounds',
    scopeAr: 'المكتب الإقليمي وعمارة القصور والقصور النجدية المعاصرة',
  },
  syria: {
    id: 'syria',
    iso: '760',
    nameEn: 'Syria',
    nameAr: 'سوريا',
    coordinates: '33.5138° N, 36.2765° E',
    lat: 33.5138,
    lng: 36.2765,
    isViwanHub: true,
    hubType: 'heritage',
    hubCityEn: 'Damascus & Latakia',
    hubCityAr: 'دمشق واللاذقية',
    projectsCount: 6,
    scopeEn: 'Architectural Heritage Restorations & Stone Craftsmanship',
    scopeAr: 'مشاريع التراث المعماري وحرفية الحجر والقصور الخاصة',
  },
}

export const COUNTRY_LOOKUP: Record<string, { nameAr: string; nameEn: string; coordinates: string }> = {
  // Middle East & North Africa (MENA)
  '818': { nameAr: 'جمهورية مصر العربية', nameEn: 'Egypt', coordinates: '26.8206° N, 30.8025° E' },
  '682': { nameAr: 'المملكة العربية السعودية', nameEn: 'Saudi Arabia', coordinates: '23.8859° N, 45.0792° E' },
  '760': { nameAr: 'الجمهورية العربية السورية', nameEn: 'Syria', coordinates: '34.8021° N, 38.9968° E' },
  '784': { nameAr: 'الإمارات العربية المتحدة', nameEn: 'United Arab Emirates', coordinates: '23.4241° N, 53.8478° E' },
  '634': { nameAr: 'دولة قطر', nameEn: 'Qatar', coordinates: '25.3548° N, 51.1839° E' },
  '414': { nameAr: 'دولة الكويت', nameEn: 'Kuwait', coordinates: '29.3117° N, 47.4818° E' },
  '048': { nameAr: 'مملكة البحرين', nameEn: 'Bahrain', coordinates: '26.0667° N, 50.5577° E' },
  '512': { nameAr: 'سلطنة عمان', nameEn: 'Oman', coordinates: '21.4735° N, 55.9754° E' },
  '400': { nameAr: 'المملكة الأردنية الهاشمية', nameEn: 'Jordan', coordinates: '30.5852° N, 36.2384° E' },
  '422': { nameAr: 'الجمهورية اللبنانية', nameEn: 'Lebanon', coordinates: '33.8547° N, 35.8623° E' },
  '368': { nameAr: 'جمهورية العراق', nameEn: 'Iraq', coordinates: '33.2232° N, 43.6793° E' },
  '887': { nameAr: 'الجمهورية اليمنية', nameEn: 'Yemen', coordinates: '15.5527° N, 48.5164° E' },
  '434': { nameAr: 'دولة ليبيا', nameEn: 'Libya', coordinates: '26.3351° N, 17.2283° E' },
  '788': { nameAr: 'الجمهورية التونسية', nameEn: 'Tunisia', coordinates: '33.8869° N, 9.5375° E' },
  '012': { nameAr: 'الجمهورية الجزائرية', nameEn: 'Algeria', coordinates: '28.0339° N, 1.6596° E' },
  '504': { nameAr: 'المملكة المغربية', nameEn: 'Morocco', coordinates: '31.7917° N, 7.0926° W' },
  '729': { nameAr: 'جمهورية السودان', nameEn: 'Sudan', coordinates: '12.8628° N, 30.2176° E' },
  '732': { nameAr: 'الصحراء الغربية', nameEn: 'W. Sahara', coordinates: '24.2155° N, 12.8858° W' },
  '478': { nameAr: 'موريتانيا', nameEn: 'Mauritania', coordinates: '21.0079° N, 10.9408° W' },
  '792': { nameAr: 'الجمهورية التركية', nameEn: 'Turkey', coordinates: '38.9637° N, 35.2433° E' },
  '364': { nameAr: 'الجمهورية الإسلامية الإيرانية', nameEn: 'Iran', coordinates: '32.4279° N, 53.6880° E' },

  // Europe
  '826': { nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom', coordinates: '55.3781° N, 3.4360° W' },
  '250': { nameAr: 'فرنسا', nameEn: 'France', coordinates: '46.2276° N, 2.2137° E' },
  '276': { nameAr: 'ألمانيا', nameEn: 'Germany', coordinates: '51.1657° N, 10.4515° E' },
  '380': { nameAr: 'إيطاليا', nameEn: 'Italy', coordinates: '41.8719° N, 12.5674° E' },
  '724': { nameAr: 'إسبانيا', nameEn: 'Spain', coordinates: '40.4637° N, 3.7492° W' },
  '300': { nameAr: 'اليونان', nameEn: 'Greece', coordinates: '39.0742° N, 21.8243° E' },
  '196': { nameAr: 'قبرص', nameEn: 'Cyprus', coordinates: '35.1264° N, 33.4299° E' },
  '756': { nameAr: 'سويسرا', nameEn: 'Switzerland', coordinates: '46.8182° N, 8.2275° E' },
  '040': { nameAr: 'النمسا', nameEn: 'Austria', coordinates: '47.5162° N, 14.5501° E' },
  '528': { nameAr: 'هولندا', nameEn: 'Netherlands', coordinates: '52.1326° N, 5.2913° E' },
  '056': { nameAr: 'بلجيكا', nameEn: 'Belgium', coordinates: '50.5039° N, 4.4699° E' },
  '620': { nameAr: 'البرتغال', nameEn: 'Portugal', coordinates: '39.3999° N, 8.2245° W' },
  '752': { nameAr: 'السويد', nameEn: 'Sweden', coordinates: '60.1282° N, 18.6435° E' },
  '578': { nameAr: 'النرويج', nameEn: 'Norway', coordinates: '60.4720° N, 8.4689° E' },
  '246': { nameAr: 'فنلندا', nameEn: 'Finland', coordinates: '61.9241° N, 25.7482° E' },
  '643': { nameAr: 'روسيا الاتحادية', nameEn: 'Russia', coordinates: '61.5240° N, 105.3188° E' },

  // Americas
  '840': { nameAr: 'الولايات المتحدة الأمريكية', nameEn: 'United States', coordinates: '37.0902° N, 95.7129° W' },
  '124': { nameAr: 'كندا', nameEn: 'Canada', coordinates: '56.1304° N, 106.3468° W' },
  '484': { nameAr: 'المكسيك', nameEn: 'Mexico', coordinates: '23.6345° N, 102.5528° W' },
  '076': { nameAr: 'البرازيل', nameEn: 'Brazil', coordinates: '14.2350° S, 51.9253° W' },
  '032': { nameAr: 'الأرجنتين', nameEn: 'Argentina', coordinates: '38.4161° S, 63.6167° W' },

  // Asia & Oceania
  '156': { nameAr: 'جمهورية الصين الشعبية', nameEn: 'China', coordinates: '35.8617° N, 104.1954° E' },
  '356': { nameAr: 'جمهورية الهند', nameEn: 'India', coordinates: '20.5937° N, 78.9629° E' },
  '392': { nameAr: 'اليابان', nameEn: 'Japan', coordinates: '36.2048° N, 138.2529° E' },
  '410': { nameAr: 'كوريا الجنوبية', nameEn: 'South Korea', coordinates: '35.9078° N, 127.7669° E' },
  '360': { nameAr: 'إندونيسيا', nameEn: 'Indonesia', coordinates: '0.7893° S, 113.9213° E' },
  '458': { nameAr: 'ماليزيا', nameEn: 'Malaysia', coordinates: '4.2105° N, 101.9758° E' },
  '702': { nameAr: 'سنغافورة', nameEn: 'Singapore', coordinates: '1.3521° N, 103.8198° E' },
  '036': { nameAr: 'أستراليا', nameEn: 'Australia', coordinates: '25.2744° S, 133.7751° E' },
  '554': { nameAr: 'نيوزيلندا', nameEn: 'New Zealand', coordinates: '40.9006° S, 174.8860° E' },
  '710': { nameAr: 'جنوب أفريقيا', nameEn: 'South Africa', coordinates: '30.5595° S, 22.9375° E' },
  '566': { nameAr: 'نيجيريا', nameEn: 'Nigeria', coordinates: '9.0820° N, 8.6753° E' },
  '404': { nameAr: 'كينيا', nameEn: 'Kenya', coordinates: '0.0236° S, 37.9062° E' },
  '834': { nameAr: 'تنزانيا', nameEn: 'Tanzania', coordinates: '6.3690° S, 34.8888° E' },
  '398': { nameAr: 'كازاخستان', nameEn: 'Kazakhstan', coordinates: '48.0196° N, 66.9237° E' },
  '860': { nameAr: 'أوزبكستان', nameEn: 'Uzbekistan', coordinates: '41.3775° N, 64.5853° E' },
  '586': { nameAr: 'باكستان', nameEn: 'Pakistan', coordinates: '30.3753° N, 69.3451° E' },
}

/**
 * Resolves territory metadata for any given country path item
 */
export function resolveTerritoryInfo(country: { id: string; name: string }): TerritoryInfo {
  // Check if it's Egypt, Saudi, or Syria
  if (country.id === '818' || country.name.toLowerCase().includes('egypt')) {
    return VIWAN_HUBS.egypt
  }
  if (country.id === '682' || country.name.toLowerCase().includes('saudi')) {
    return VIWAN_HUBS.saudi
  }
  if (country.id === '760' || country.name.toLowerCase().includes('syria')) {
    return VIWAN_HUBS.syria
  }

  // Lookup in database
  const info = COUNTRY_LOOKUP[country.id]
  if (info) {
    return {
      id: country.id,
      iso: country.id,
      nameEn: info.nameEn || country.name,
      nameAr: info.nameAr,
      coordinates: info.coordinates,
      lat: 0,
      lng: 0,
      isViwanHub: false,
    }
  }

  // Fallback for any other country
  return {
    id: country.id,
    iso: country.id,
    nameEn: country.name,
    nameAr: country.name,
    coordinates: 'Global Regional Coordinate',
    lat: 0,
    lng: 0,
    isViwanHub: false,
  }
}
