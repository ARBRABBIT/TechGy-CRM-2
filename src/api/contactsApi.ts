import apiClient from './client';
import { ENDPOINTS } from '../constants/apiConfig';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { INITIAL_CONTACTS } from '../data/mockData';

function getLocalContacts() {
  if (typeof window === 'undefined') return INITIAL_CONTACTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return data ? JSON.parse(data) : INITIAL_CONTACTS;
  } catch {
    return INITIAL_CONTACTS;
  }
}

function saveLocalContacts(contacts) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  } catch {}
}

export const contactsApi = {
  async getContacts() {
    try {
      return await apiClient.get(ENDPOINTS.CONTACTS.LIST);
    } catch {
      return getLocalContacts();
    }
  },

  async createContact(contactData) {
    try {
      return await apiClient.post(ENDPOINTS.CONTACTS.LIST, contactData);
    } catch {
      const contacts = getLocalContacts();
      const newContact = {
        ...contactData,
        id: contactData.id || `CON-${String(contacts.length + 1).padStart(3, '0')}`
      };
      const updated = [newContact, ...contacts];
      saveLocalContacts(updated);
      return newContact;
    }
  }
};

export default contactsApi;
