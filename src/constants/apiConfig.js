/**
 * API Configuration Constants
 * 
 * To connect to a live backend:
 * 1. Create a `.env.local` file in the project root.
 * 2. Set NEXT_PUBLIC_API_URL=https://api.yourdomain.com/v1 (or your local port: http://localhost:5000/api)
 * 3. Set NEXT_PUBLIC_USE_MOCK=false to disable mock/localStorage fallback.
 */

export const API_BASE_URL = 
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || 
  'http://localhost:5000/api';

export const USE_MOCK_FALLBACK = 
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_USE_MOCK !== 'false');

export const API_TIMEOUT_MS = 15000;

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh'
  },
  // Core CRM Entities
  LEADS: {
    LIST: '/leads',
    DETAIL: (id) => `/leads/${id}`,
    UPDATE_STAGE: (id) => `/leads/${id}/stage`,
    CALLS: (id) => `/leads/${id}/calls`,
    NOTES: (id) => `/leads/${id}/notes`,
    CHATS: (id) => `/leads/${id}/chats`
  },
  ACCOUNTS: {
    LIST: '/accounts',
    DETAIL: (id) => `/accounts/${id}`
  },
  CONTACTS: {
    LIST: '/contacts',
    DETAIL: (id) => `/contacts/${id}`
  },
  ACTIVITIES: {
    LIST: '/activities',
    LOG: '/activities'
  },
  MASTER_DATA: {
    LIST: '/master-data',
    CATEGORY: (category) => `/master-data/${category}`
  }
};
