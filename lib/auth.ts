import { AdminUser } from './admin-types';

// In-Memory Access Token Storage (Immune to XSS attacks targeting localStorage)
let inMemoryAccessToken: string | null = null;
let inMemoryCurrentUser: AdminUser | null = null;

export const AuthService = {
  // Set in-memory token
  setAccessToken: (token: string | null) => {
    inMemoryAccessToken = token;
  },

  getAccessToken: (): string | null => {
    return inMemoryAccessToken;
  },

  // 1. Login with Server-Side Dual-Key Rate Limiting & Refresh Token Rotation
  login: async (
    email: string,
    pass: string,
    locale?: string
  ): Promise<{ success: boolean; token?: string; user?: AdminUser; error?: string; code?: string; retryAfter?: number }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, locale }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          code: data.code || 'INVALID_CREDENTIALS',
          error: data.error || 'Authentication failed',
          retryAfter: data.retryAfter,
        };
      }

      inMemoryAccessToken = data.token;
      inMemoryCurrentUser = data.user;

      if (typeof window !== 'undefined') {
        const sessionData = {
          user: data.user,
          expiresAt: Date.now() + 15 * 60 * 1000,
        };
        sessionStorage.setItem('viwan_active_session', JSON.stringify(sessionData));
      }

      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    } catch (err: any) {
      return {
        success: false,
        error: 'Network or server error during authentication.',
      };
    }
  },

  // 2. Silent Token Refresh
  refreshToken: async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        inMemoryAccessToken = data.token;
        return true;
      }
      inMemoryAccessToken = null;
      inMemoryCurrentUser = null;
      return false;
    } catch {
      return false;
    }
  },

  // 3. Current User Context
  getCurrentUser: (): AdminUser | null => {
    if (inMemoryCurrentUser) return inMemoryCurrentUser;
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem('viwan_active_session');
      if (raw) {
        try {
          const session = JSON.parse(raw);
          if (session?.user) return session.user;
        } catch {}
      }
      const rawLocal = localStorage.getItem('viwan_admin_session');
      if (rawLocal) {
        try {
          const session = JSON.parse(rawLocal);
          if (session?.user) return session.user;
          if (session?.name) return session;
        } catch {}
      }
    }
    return null;
  },

  // 4. Secure Logout: Revokes Token Family on Server
  logout: async () => {
    inMemoryAccessToken = null;
    inMemoryCurrentUser = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('viwan_active_session');
      localStorage.removeItem('viwan_admin_session');
    }
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
  },

  isAuthenticated: (): boolean => {
    return !!AuthService.getCurrentUser();
  },

  // Authenticated Fetch Wrapper with Automatic Token Refresh on 401
  authFetch: async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    let token = AuthService.getAccessToken();
    const headers = new Headers(init?.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let response = await fetch(input, { ...init, headers });

    // If 401 Unauthorized, attempt silent token refresh once
    if (response.status === 401) {
      const refreshed = await AuthService.refreshToken();
      if (refreshed) {
        token = AuthService.getAccessToken();
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        response = await fetch(input, { ...init, headers });
      }
    }

    return response;
  },
};
