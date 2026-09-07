export interface Project {
  id: string;
  code: string;
  slug: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  sector_en: string;
  sector_ar: string;
  services_en: string[];
  services_ar: string[];
  location_en: string;
  location_ar: string;
  country_en: string;
  country_ar: string;
  client_en: string;
  client_ar: string;
  year: number;
  area_sqm: string;
  status: 'completed' | 'ongoing' | 'concept';
  publish_status: 'Published' | 'Featured' | 'Draft';
  is_featured: boolean;
  cover_image: string;
  gallery_images: string[];
  vision_en: string;
  vision_ar: string;
  details_en: string;
  details_ar: string;
  lat: number;
  lng: number;
  display_order: number;
}

export interface InsightArticle {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string;
  category_en: string;
  category_ar: string;
  category_slug: 'sustainability' | 'urban-design' | 'technology' | 'practice' | 'theory' | 'materiality';
  date: string;
  author_en: string;
  author_ar: string;
  read_time_en: string;
  read_time_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_en: string;
  content_ar: string;
  image: string;
  featured: boolean;
  quote?: {
    text_en: string;
    text_ar: string;
    author_en: string;
    author_ar: string;
  };
}

export interface ContactPhone {
  id: string;
  label_en: string;
  label_ar: string;
  number: string;
  is_whatsapp?: boolean;
}

export interface ContactEmail {
  id: string;
  label_en: string;
  label_ar: string;
  email: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  youtube?: string;
  linkedin?: string;
  behance?: string;
}

export interface CompanyInfo {
  name_en: string;
  name_ar: string;
  tagline_en: string;
  tagline_ar: string;
  hero_title_en: string;
  hero_title_ar: string;
  hero_subtitle_en: string;
  hero_subtitle_ar: string;
  about_summary_en: string;
  about_summary_ar: string;
  footer_summary_en: string;
  footer_summary_ar: string;
  phones: ContactPhone[];
  emails: ContactEmail[];
  social: SocialLinks;
  cairo_studio: {
    title_en: string;
    title_ar: string;
    address_en: string;
    address_ar: string;
    postal_code: string;
    phone: string;
    email: string;
    lat: number;
    lng: number;
  };
  riyadh_studio: {
    title_en: string;
    title_ar: string;
    address_en: string;
    address_ar: string;
    postal_code: string;
    phone: string;
    email: string;
    lat: number;
    lng: number;
  };
  stats: {
    years_experience: string;
    architects_count: string;
    projects_count: string;
    presence_en: string;
    presence_ar: string;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  name_ar: string;
  email: string;
  password?: string;
  role: 'Super Admin' | 'Chief Architect' | 'Senior Project Architect' | 'Lead Designer' | 'Editor';
  role_ar: string;
  phone: string;
  avatar: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface ExpertiseSector {
  id: string;
  name_en: string;
  name_ar: string;
  count: number;
  status: 'Active' | 'Inactive';
  description_en?: string;
  description_ar?: string;
  image?: string;
  display_order?: number;
}

export interface ServiceItem {
  id: string;
  code: string;
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
  status: 'Active' | 'Inactive';
  display_order?: number;
}
