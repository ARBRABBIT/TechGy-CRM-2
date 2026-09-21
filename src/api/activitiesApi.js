import apiClient from './client';
import { ENDPOINTS } from '../constants/apiConfig';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { INITIAL_ACTIVITIES } from '../data/mockData';

function getLocalActivities() {
  if (typeof window === 'undefined') return INITIAL_ACTIVITIES;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : INITIAL_ACTIVITIES;
  } catch {
    return INITIAL_ACTIVITIES;
  }
}

function saveLocalActivities(activities) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch {}
}

export const activitiesApi = {
  async getActivities() {
    try {
      return await apiClient.get(ENDPOINTS.ACTIVITIES.LIST);
    } catch {
      return getLocalActivities();
    }
  },

  async logActivity(activityData) {
    try {
      return await apiClient.post(ENDPOINTS.ACTIVITIES.LOG, activityData);
    } catch {
      const activities = getLocalActivities();
      const newAct = {
        ...activityData,
        id: activityData.id || `ACT-${String(activities.length + 1).padStart(3, '0')}`,
        timestamp: activityData.timestamp || new Date().toISOString()
      };
      const updated = [newAct, ...activities];
      saveLocalActivities(updated);
      return newAct;
    }
  }
};

export default activitiesApi;
