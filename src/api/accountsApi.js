import apiClient from './client';
import { ENDPOINTS } from '../constants/apiConfig';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { INITIAL_ACCOUNTS } from '../data/mockData';

function getLocalAccounts() {
  if (typeof window === 'undefined') return INITIAL_ACCOUNTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return data ? JSON.parse(data) : INITIAL_ACCOUNTS;
  } catch {
    return INITIAL_ACCOUNTS;
  }
}

function saveLocalAccounts(accounts) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  } catch {}
}

export const accountsApi = {
  /**
   * Fetch all accounts
   */
  async getAccounts() {
    try {
      return await apiClient.get(ENDPOINTS.ACCOUNTS.LIST);
    } catch {
      return getLocalAccounts();
    }
  },

  /**
   * Fetch single account by ID
   */
  async getAccountById(id) {
    try {
      return await apiClient.get(ENDPOINTS.ACCOUNTS.DETAIL(id));
    } catch {
      const accounts = getLocalAccounts();
      return accounts.find(a => a.id === id) || null;
    }
  },

  /**
   * Create an account
   */
  async createAccount(accountData) {
    try {
      return await apiClient.post(ENDPOINTS.ACCOUNTS.LIST, accountData);
    } catch {
      const accounts = getLocalAccounts();
      const newAccount = {
        ...accountData,
        id: accountData.id || `ACC-${String(accounts.length + 1).padStart(3, '0')}`
      };
      const updated = [newAccount, ...accounts];
      saveLocalAccounts(updated);
      return newAccount;
    }
  },

  /**
   * Update an account
   */
  async updateAccount(id, updates) {
    try {
      return await apiClient.patch(ENDPOINTS.ACCOUNTS.DETAIL(id), updates);
    } catch {
      const accounts = getLocalAccounts();
      const index = accounts.findIndex(a => a.id === id);
      if (index === -1) throw new Error(`Account ${id} not found`);
      const updated = { ...accounts[index], ...updates };
      accounts[index] = updated;
      saveLocalAccounts(accounts);
      return updated;
    }
  }
};

export default accountsApi;
