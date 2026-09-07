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

  // Sync Projects from SQLite Server DB
  fetch('/api/projects')
    .then((res) => res.json())
    .then((json) => {
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        inMemoryProjects = json.data;
        localStorage.setItem('viwan_projects', JSON.stringify(json.data));
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
      if (json.success && json.data) {
        inMemoryCompanyInfo = json.data;
        localStorage.setItem('viwan_company_info', JSON.stringify(json.data));
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
          return JSON.parse(stored);
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
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    let updated: Project[];
    if (existingIndex >= 0) {
      updated = [...projects];
      updated[existingIndex] = project;
    } else {
      updated = [project, ...projects];
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_projects', JSON.stringify(updated));
      // Save permanently to SQLite physical database
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      }).catch((e) => console.error('Error saving to DB:', e));
    }
    inMemoryProjects = updated;
    return project;
  },

  deleteProject: (id: string): boolean => {
    const projects = DataStore.getProjects();
    const updated = projects.filter((p) => p.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_projects', JSON.stringify(updated));
      // Delete permanently from SQLite physical database
      fetch(`/api/projects/${id}`, {
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_company_info', JSON.stringify(info));
      // Save permanently to SQLite physical database
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      }).catch((e) => console.error('Error saving to DB:', e));
    }
    inMemoryCompanyInfo = { ...info };
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
      updated = [service, ...list];
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_services', JSON.stringify(updated));
      // Save permanently to SQLite physical database
      fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
      }).catch((e) => console.error('Error saving to DB:', e));
    }
    inMemoryServices = updated;
    return service;
  },

  deleteService: (id: string): boolean => {
    const list = DataStore.getServices();
    const updated = list.filter((s) => s.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('viwan_services', JSON.stringify(updated));
      // Delete permanently from SQLite physical database
      fetch(`/api/services/${id}`, {
        method: 'DELETE'
      }).catch((e) => console.error('Error deleting from DB:', e));
    }
    inMemoryServices = updated;
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
