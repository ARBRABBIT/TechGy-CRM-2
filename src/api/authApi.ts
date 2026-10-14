import apiClient from './client';
import { ENDPOINTS } from '../constants/apiConfig';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const authApi = {
  /**
   * Log in user
   */
  async login(credentials) {
    try {
      const result = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
      if (result?.token && typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, result.token);
      }
      return result;
    } catch {
      // Mock login success
      const user = {
        name: 'Alex Morgan',
        role: 'Senior Enterprise AE',
        email: credentials.email || 'alex.morgan@techgy.internal',
        avatar: 'AM',
        phone: '+91 98765 43210'
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.AUTHENTICATED, JSON.stringify(true));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      }
      return { user, token: 'mock-jwt-token-12345' };
    }
  },

  /**
   * Log out user
   */
  async logout() {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT, {});
    } catch {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.setItem(STORAGE_KEYS.AUTHENTICATED, JSON.stringify(false));
    }
    return { success: true };
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    try {
      return await apiClient.get(ENDPOINTS.AUTH.PROFILE);
    } catch {
      if (typeof window === 'undefined') return null;
      try {
        const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
      } catch {
        return null;
      }
    }
  }
};

export default authApi;
