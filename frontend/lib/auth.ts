// frontend/lib/auth.ts

export interface AuthUser {
  id:          string;
  email:       string;
  name:        string;
  role:        'applicant' | 'recruiter';
  companyName?: string;
}

const USER_KEY = 'rms_user';

/**
 * Save user to localStorage after successful login/register.
 * No token needed — user ID is passed as query param to the backend.
 */
export function saveSession(user: AuthUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

/** Read the current user from localStorage */
export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/** Clear session on logout */
export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
}

/** Check if user is logged in */
export function isAuthenticated(): boolean {
  return getUser() !== null;
}

/** Get the dashboard path based on role */
export function dashboardPath(role: AuthUser['role']): string {
  return role === 'recruiter'
    ? '/dashboard/recruiter'
    : '/dashboard/applicant';
}
