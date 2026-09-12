import { Project, InsightArticle, CompanyInfo, AdminUser, ExpertiseSector, ServiceItem } from './admin-types';
import { AuthService } from './auth';
import {
  INITIAL_PROJECTS,
  INITIAL_INSIGHTS,
  INITIAL_COMPANY_INFO,
  INITIAL_ADMIN_USERS,
  INITIAL_EXPERTISE_SECTORS,
  INITIAL_SERVICES
} from './data/seed';

let inMemoryProjects = [...INITIAL_PROJECTS];
let inMemoryInsights = [...INITIAL_INSIGHTS];
let inMemoryCompanyInfo = { ...INITIAL_COMPANY_INFO };
let inMemoryAdminUsers = [...INITIAL_ADMIN_USERS];
let inMemoryExpertiseSectors = [...INITIAL_EXPERTISE_SECTORS];
let inMemoryServices = [...INITIAL_SERVICES];

// Client-side initial background sync with physical database
let hasSyncedWithServer = false;

function syncWithServerDB() {
  if (typeof window === 'undefined' || hasSyncedWithServer) return;
  hasSyncedWithServer = true;

  // Sync Projects from Server DB
  fetch('/api/admin/projects')
    .then((res) => res.json())
    .then((json) => {
      const list = json.projects || json.data;
      if (Array.isArray(list) && list.length > 0) {
        inMemoryProjects = list;
        localStorage.setItem('viwan_projects', JSON.stringify(list));
      }
    })
    .catch(() => {});

  // Sync Insights from SQLite Server DB
  fetch('/api/insights')
    .then((res) => res.json())
    .then((json) => {
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        inMemoryInsights = json.data;
        localStorage.setItem('viwan_insights', JSON.stringify(json.data));
      }
    })
    .catch(() => {});

  // Sync Expertise Sectors from SQLite Server DB
  fetch('/api/expertise')
    .then((res) => res.json())
    .then((json) => {
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        inMemoryExpertiseSectors = json.data;
        localStorage.setItem('viwan_expertise_sectors', JSON.stringify(json.data));
      }
    })
    .catch(() => {});

  // Sync Services from SQLite Server DB
  fetch('/api/services')
    .then((res) => res.json())
    .then((json) => {
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        inMemoryServices = json.data;
        localStorage.setItem('viwan_services', JSON.stringify(json.data));
      }
    })
    .catch(() => {});

  // Sync Company Settings from SQLite Server DB
  fetch('/api/settings')
    .then((res) => res.json())
    .then((json) => {
      const data = json.companyInfo || json.data || (json.settings ? { ...INITIAL_COMPANY_INFO, ...json.settings } : null);
      if (data) {
        inMemoryCompanyInfo = {
          ...INITIAL_COMPANY_INFO,
          ...data,
          social: {
            ...INITIAL_COMPANY_INFO.social,
            ...(data.social || {}),
            ...(json.settings ? {
              facebook: json.settings.facebook || data.social?.facebook,
              instagram: json.settings.instagram || data.social?.instagram,
              linkedin: json.settings.linkedin || data.social?.linkedin,
              whatsapp: json.settings.whatsapp || data.social?.whatsapp,
              youtube: json.settings.youtube || data.social?.youtube,
            } : {})
          }
        };
        localStorage.setItem('viwan_company_info', JSON.stringify(inMemoryCompanyInfo));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('viwan_settings_updated', { detail: inMemoryCompanyInfo }));
        }
      }
    })
    .catch(() => {});
}

export const DataStore = {
  // PROJECTS
  getProjects: (): Project[] => {
    if (typeof window !== 'undefined') {
      syncWithServerDB();
      const stored = localStorage.getItem('viwan_projects');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Purge stale mock hospital projects from local storage
          const hasStaleMock = Array.isArray(parsed) && parsed.some(p => p.slug === 'specialized-hospital' || p.slug === 'oasis-residential-complex');
          if (!hasStaleMock && Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.error(e);
        }
      }
      localStorage.setItem('viwan_projects', JSON.stringify(inMemoryProjects));
    }
    return inMemoryProjects;
  },

  getProjectBySlug: (slug: string): Project | undefined => {
    const projects = DataStore.getProjects();
    return projects.find((p) => p.slug === slug || p.id === slug);
  },

  saveProject: (project: Project): Project => {
    const projects = DataStore.getProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id || p.slug === project.slug);
    let updated: Project[];
    const isEdit = existingIndex >= 0;
    if (isEdit) {
      updated = [...projects];
      updated[existingIndex] = { ...updated[existingIndex], ...project };
    } else {
      updated = [project, ...projects];
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_projects', JSON.stringify(updated));
      // Save permanently to Server DB
      fetch('/api/admin/projects', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      }).catch((e) => console.error('Error saving to DB:', e));
    }
    inMemoryProjects = updated;
    return project;
  },

  deleteProject: (id: string): boolean => {
    const projects = DataStore.getProjects();
    const target = projects.find(p => p.id === id || p.slug === id);
    const slugToDelete = target?.slug || id;
    const updated = projects.filter((p) => p.id !== id && p.slug !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_projects', JSON.stringify(updated));
      // Delete permanently from Server DB
      fetch(`/api/admin/projects?slug=${encodeURIComponent(slugToDelete)}`, {
        method: 'DELETE'
      }).catch((e) => console.error('Error deleting from DB:', e));
    }
    inMemoryProjects = updated;
    return true;
  },

  // INSIGHTS
  getInsights: (): InsightArticle[] => {
    if (typeof window !== 'undefined') {
      syncWithServerDB();
      const stored = localStorage.getItem('viwan_insights');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
      localStorage.setItem('viwan_insights', JSON.stringify(inMemoryInsights));
    }
    return inMemoryInsights;
  },

  getInsightBySlug: (slug: string): InsightArticle | undefined => {
    const insights = DataStore.getInsights();
    return insights.find((i) => i.slug === slug || i.id === slug);
  },

  saveInsight: (insight: InsightArticle): InsightArticle => {
    const insights = DataStore.getInsights();
    const existingIndex = insights.findIndex((i) => i.id === insight.id);
    let updated: InsightArticle[];
    if (existingIndex >= 0) {
      updated = [...insights];
      updated[existingIndex] = insight;
    } else {
      updated = [insight, ...insights];
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_insights', JSON.stringify(updated));
      // Save permanently to SQLite physical database
      fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(insight)
      }).catch((e) => console.error('Error saving to DB:', e));
    }
    inMemoryInsights = updated;
    return insight;
  },

  deleteInsight: (id: string): boolean => {
    const insights = DataStore.getInsights();
    const updated = insights.filter((i) => i.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_insights', JSON.stringify(updated));
      // Delete permanently from SQLite physical database
      fetch(`/api/insights/${id}`, {
        method: 'DELETE'
      }).catch((e) => console.error('Error deleting from DB:', e));
    }
    inMemoryInsights = updated;
    return true;
  },

  // COMPANY SETTINGS
  getCompanyInfo: (): CompanyInfo => {
    if (typeof window !== 'undefined') {
      syncWithServerDB();
      const stored = localStorage.getItem('viwan_company_info');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const merged: CompanyInfo = {
            ...INITIAL_COMPANY_INFO,
            ...parsed,
            social: {
              ...INITIAL_COMPANY_INFO.social,
              ...(parsed.social || {})
            },
            phones: (parsed.phones && parsed.phones.length > 0) ? parsed.phones : INITIAL_COMPANY_INFO.phones,
            emails: (parsed.emails && parsed.emails.length > 0) ? parsed.emails : INITIAL_COMPANY_INFO.emails,
            studios: (parsed.studios && parsed.studios.length > 0) ? parsed.studios : INITIAL_COMPANY_INFO.studios,
          };
          return merged;
        } catch (e) {
          console.error(e);
        }
      }
      localStorage.setItem('viwan_company_info', JSON.stringify(inMemoryCompanyInfo));
    }
    return inMemoryCompanyInfo;
  },

  saveCompanyInfo: (info: CompanyInfo): CompanyInfo => {
    inMemoryCompanyInfo = { ...info };
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_company_info', JSON.stringify(info));
      window.dispatchEvent(new CustomEvent('viwan_settings_updated', { detail: info }));

      // Save permanently to server DB
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyInfo: info })
      }).catch((e) => console.error('Error saving to DB:', e));

      fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyInfo: info })
      }).catch((e) => console.error('Error saving to admin settings:', e));
    }
    return inMemoryCompanyInfo;
  },

  // ADMIN USERS CRUD
  getAdminUsers: (): AdminUser[] => {
    if (typeof window !== 'undefined') {
      syncWithServerDB();
      const stored = localStorage.getItem('viwan_admin_users');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
      localStorage.setItem('viwan_admin_users', JSON.stringify(inMemoryAdminUsers));
    }
    return inMemoryAdminUsers;
  },

  saveAdminUser: (user: AdminUser): AdminUser => {
    const users = DataStore.getAdminUsers();
    const existingIndex = users.findIndex((u) => u.id === user.id);
    let updated: AdminUser[];
    if (existingIndex >= 0) {
      updated = [...users];
      updated[existingIndex] = user;
    } else {
      updated = [user, ...users];
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_admin_users', JSON.stringify(updated));
      // Save permanently to SQLite physical database
      AuthService.authFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }).catch((e) => console.error('Error saving to DB:', e));
    }
    inMemoryAdminUsers = updated;
    return user;
  },

  deleteAdminUser: (id: string): boolean => {
    const users = DataStore.getAdminUsers();
    const updated = users.filter((u) => u.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_admin_users', JSON.stringify(updated));
      // Delete permanently from SQLite physical database
      AuthService.authFetch(`/api/users/${id}`, {
        method: 'DELETE'
      }).catch((e) => console.error('Error deleting from DB:', e));
    }
    inMemoryAdminUsers = updated;
    return true;
  },

  // EXPERTISE SECTORS CRUD
  getExpertiseSectors: (): ExpertiseSector[] => {
    if (typeof window !== 'undefined') {
      syncWithServerDB();
      const stored = localStorage.getItem('viwan_expertise_sectors');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
      localStorage.setItem('viwan_expertise_sectors', JSON.stringify(inMemoryExpertiseSectors));
    }
    return inMemoryExpertiseSectors;
  },

  saveExpertiseSector: (sector: ExpertiseSector): ExpertiseSector => {
    const list = DataStore.getExpertiseSectors();
    const existingIndex = list.findIndex((s) => s.id === sector.id);
    let updated: ExpertiseSector[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = sector;
    } else {
      updated = [sector, ...list];
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_expertise_sectors', JSON.stringify(updated));
      // Save permanently to SQLite physical database
      fetch('/api/expertise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sector)
      }).catch((e) => console.error('Error saving to DB:', e));
    }
    inMemoryExpertiseSectors = updated;
    return sector;
  },

  deleteExpertiseSector: (id: string): boolean => {
    const list = DataStore.getExpertiseSectors();
    const updated = list.filter((s) => s.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_expertise_sectors', JSON.stringify(updated));
      // Delete permanently from SQLite physical database
      fetch(`/api/expertise/${id}`, {
        method: 'DELETE'
      }).catch((e) => console.error('Error deleting from DB:', e));
    }
    inMemoryExpertiseSectors = updated;
    return true;
  },

  // SERVICES CRUD
  getServices: (): ServiceItem[] => {
    if (typeof window !== 'undefined') {
      syncWithServerDB();
      const stored = localStorage.getItem('viwan_services');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
      localStorage.setItem('viwan_services', JSON.stringify(inMemoryServices));
    }
    return inMemoryServices;
  },

  saveService: (service: ServiceItem): ServiceItem => {
    const list = DataStore.getServices();
    const existingIndex = list.findIndex((s) => s.id === service.id);
    let updated: ServiceItem[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = service;
    } else {
      updated = [...list, service];
    }
    updated.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    inMemoryServices = updated;

    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_services', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('viwan_services_updated', { detail: updated }));

      const token = AuthService.getToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      fetch('/api/services', {
        method: 'POST',
        headers,
        body: JSON.stringify(service)
      }).catch((e) => console.error('Error saving to DB:', e));
    }
    return service;
  },

  deleteService: (id: string): boolean => {
    const list = DataStore.getServices();
    const updated = list.filter((s) => s.id !== id);
    inMemoryServices = updated;

    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_services', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('viwan_services_updated', { detail: updated }));

      const token = AuthService.getToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      fetch(`/api/services/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers
      }).catch((e) => console.error('Error deleting from DB:', e));
    }
    return true;
  },

  resetDefaults: () => {
    inMemoryProjects = [...INITIAL_PROJECTS];
    inMemoryInsights = [...INITIAL_INSIGHTS];
    inMemoryCompanyInfo = { ...INITIAL_COMPANY_INFO };
    inMemoryAdminUsers = [...INITIAL_ADMIN_USERS];
    inMemoryExpertiseSectors = [...INITIAL_EXPERTISE_SECTORS];
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_projects', JSON.stringify(inMemoryProjects));
      localStorage.setItem('viwan_insights', JSON.stringify(inMemoryInsights));
      localStorage.setItem('viwan_company_info', JSON.stringify(inMemoryCompanyInfo));
      localStorage.setItem('viwan_admin_users', JSON.stringify(inMemoryAdminUsers));
      localStorage.setItem('viwan_expertise_sectors', JSON.stringify(inMemoryExpertiseSectors));
    }
  }
};
