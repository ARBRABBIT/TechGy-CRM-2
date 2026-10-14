import apiClient from './client';
import { ENDPOINTS } from '../constants/apiConfig';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { INITIAL_LEADS } from '../data/mockData';

function getLocalLeads() {
  if (typeof window === 'undefined') return INITIAL_LEADS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEADS);
    return data ? JSON.parse(data) : INITIAL_LEADS;
  } catch {
    return INITIAL_LEADS;
  }
}

function saveLocalLeads(leads) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  } catch {}
}

export const leadsApi = {
  /**
   * Fetch all leads
   */
  async getLeads() {
    try {
      return await apiClient.get(ENDPOINTS.LEADS.LIST);
    } catch {
      return getLocalLeads();
    }
  },

  /**
   * Fetch single lead by ID
   */
  async getLeadById(id) {
    try {
      return await apiClient.get(ENDPOINTS.LEADS.DETAIL(id));
    } catch {
      const leads = getLocalLeads();
      return leads.find(l => l.id === id) || null;
    }
  },

  /**
   * Create a new lead
   */
  async createLead(leadData) {
    try {
      return await apiClient.post(ENDPOINTS.LEADS.LIST, leadData);
    } catch {
      const leads = getLocalLeads();
      const newLead = {
        ...leadData,
        id: leadData.id || `LD-${String(leads.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString()
      };
      const updated = [newLead, ...leads];
      saveLocalLeads(updated);
      return newLead;
    }
  },

  /**
   * Update an existing lead
   */
  async updateLead(id, updates) {
    try {
      return await apiClient.patch(ENDPOINTS.LEADS.DETAIL(id), updates);
    } catch {
      const leads = getLocalLeads();
      const index = leads.findIndex(l => l.id === id);
      if (index === -1) throw new Error(`Lead ${id} not found`);
      const updated = { ...leads[index], ...updates };
      leads[index] = updated;
      saveLocalLeads(leads);
      return updated;
    }
  },

  /**
   * Update lead pipeline stage
   */
  async updateStage(id, stageName, extra = {}) {
    try {
      return await apiClient.post(ENDPOINTS.LEADS.UPDATE_STAGE(id), { stage: stageName, ...extra });
    } catch {
      return this.updateLead(id, { stage: stageName, ...extra });
    }
  },

  /**
   * Log a call session against a lead
   */
  async logCall(id, callRecord) {
    try {
      return await apiClient.post(ENDPOINTS.LEADS.CALLS(id), callRecord);
    } catch {
      const lead = await this.getLeadById(id);
      if (!lead) throw new Error(`Lead ${id} not found`);
      const calls = lead.callHistory || [];
      const updatedCalls = [callRecord, ...calls];
      return this.updateLead(id, { callHistory: updatedCalls });
    }
  },

  /**
   * Append a chat message to a lead conversation
   */
  async sendChatMessage(id, chatMessage) {
    try {
      return await apiClient.post(ENDPOINTS.LEADS.CHATS(id), chatMessage);
    } catch {
      const lead = await this.getLeadById(id);
      if (!lead) throw new Error(`Lead ${id} not found`);
      const chats = lead.chatHistory || [];
      const updatedChats = [...chats, chatMessage];
      return this.updateLead(id, { chatHistory: updatedChats });
    }
  }
};

export default leadsApi;
