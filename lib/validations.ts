import { z } from 'zod';
import { sanitizeInput } from './security';

/**
 * Custom pre-processor that trims strings and strips dangerous HTML/scripts
 */
const sanitizedString = (minLength = 0, maxLength = 500) =>
  z.preprocess(
    (val) => (typeof val === 'string' ? sanitizeInput(val.trim()) : val),
    z.string().min(minLength).max(maxLength)
  );

const optionalSanitizedString = (maxLength = 500) =>
  z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === '') return undefined;
      return typeof val === 'string' ? sanitizeInput(val.trim()) : val;
    },
    z.string().max(maxLength).optional()
  );

/**
 * 1. Contact Form Schema
 */
export const contactFormSchema = z.object({
  name: sanitizedString(2, 100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address format')
    .max(150),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s().-]{7,25}$/, 'Invalid phone number format')
    .max(25),
  company: optionalSanitizedString(120),
  projectLocation: optionalSanitizedString(150),
  projectType: optionalSanitizedString(100),
  projectSize: optionalSanitizedString(100),
  budget: optionalSanitizedString(100),
  stage: optionalSanitizedString(100),
  message: sanitizedString(5, 3000),
  _gotcha: z.string().optional(),
  _honey: z.string().optional(),
  _formLoadedAt: z.union([z.number(), z.string()]).optional(),
});

/**
 * 2. Consultation Booking Schema
 */
export const consultationFormSchema = z.object({
  name: sanitizedString(2, 100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address format')
    .max(150),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s().-]{7,25}$/, 'Invalid phone number format')
    .max(25),
  preferredDate: optionalSanitizedString(50),
  date: optionalSanitizedString(50),
  preferredTime: optionalSanitizedString(50),
  timeSlot: optionalSanitizedString(50),
  projectType: optionalSanitizedString(100),
  location: optionalSanitizedString(150),
  notes: optionalSanitizedString(2000),
  _gotcha: z.string().optional(),
  _honey: z.string().optional(),
  _formLoadedAt: z.union([z.number(), z.string()]).optional(),
});

/**
 * 3. Career Application Schema
 */
export const careerApplicationSchema = z.object({
  name: sanitizedString(2, 100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address format')
    .max(150),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s().-]{7,25}$/, 'Invalid phone number format')
    .max(25),
  jobId: optionalSanitizedString(80),
  position: optionalSanitizedString(150),
  experienceYears: optionalSanitizedString(50),
  portfolioUrl: z
    .preprocess(
      (val) => (val === '' || val === null || val === undefined ? undefined : val),
      z.string().url('Invalid portfolio URL').max(300).optional()
    ),
  coverLetter: optionalSanitizedString(3000),
});

/**
 * 4. Admin Authentication Login Schema
 */
export const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address format')
    .max(150),
  password: z.string().min(1, 'Password is required').max(200),
  locale: z.enum(['ar', 'en']).default('ar').optional(),
});

/**
 * 5. Architectural Service Schema
 */
export const serviceItemSchema = z.object({
  id: z.string().min(1).max(100),
  code: optionalSanitizedString(50),
  title_en: sanitizedString(2, 200),
  title_ar: sanitizedString(2, 200),
  tagline_en: optionalSanitizedString(300),
  tagline_ar: optionalSanitizedString(300),
  description_en: optionalSanitizedString(2500),
  description_ar: optionalSanitizedString(2500),
  image: optionalSanitizedString(500),
  bim_focus: optionalSanitizedString(300),
  display_order: z.number().int().min(0).max(1000).default(0).optional(),
  active: z.boolean().default(true).optional(),
  scope_en: z.array(z.string().max(200)).optional().default([]),
  scope_ar: z.array(z.string().max(200)).optional().default([]),
});

/**
 * 6. Architectural Project Schema
 */
export const projectItemSchema = z.object({
  id: optionalSanitizedString(100),
  code: optionalSanitizedString(50),
  slug: optionalSanitizedString(150),
  name: optionalSanitizedString(200),
  nameAr: optionalSanitizedString(200),
  title: optionalSanitizedString(200),
  title_en: optionalSanitizedString(200),
  title_ar: optionalSanitizedString(200),
  tagline: optionalSanitizedString(300),
  subtitle_en: optionalSanitizedString(300),
  subtitle_ar: optionalSanitizedString(300),
  heading: optionalSanitizedString(300),
  headingAr: optionalSanitizedString(300),
  description: optionalSanitizedString(4000),
  descriptionAr: optionalSanitizedString(4000),
  philosophy: optionalSanitizedString(2000),
  location: optionalSanitizedString(150),
  location_en: optionalSanitizedString(150),
  location_ar: optionalSanitizedString(150),
  country: optionalSanitizedString(100),
  year: z.union([z.number().int().min(1900).max(2100), z.string()]).optional(),
  type: optionalSanitizedString(100),
  category: optionalSanitizedString(100),
  cover: optionalSanitizedString(500),
  interior: optionalSanitizedString(500),
  featured: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  publish_status: z.enum(['Published', 'Draft', 'Archived', 'Featured']).optional(),
  status: optionalSanitizedString(50),
  disciplines: z.array(z.string().max(100)).optional(),
  gallery: z.array(z.any()).optional(),
  youtubeUrl: optionalSanitizedString(500),
  lat: z.union([z.number(), z.string()]).optional(),
  lng: z.union([z.number(), z.string()]).optional(),
});

/**
 * Safe parser helper returning clean error list or validated data
 */
export function validatePayload<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
  return { success: false, errors };
}
