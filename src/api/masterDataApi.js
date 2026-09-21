import apiClient from './client';
import { ENDPOINTS } from '../constants/apiConfig';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { INITIAL_MASTER_DATA } from '../views/MasterDataView';

function getLocalMasterData() {
  if (typeof window === 'undefined') return INITIAL_MASTER_DATA;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MASTER_DATA);
    return data ? JSON.parse(data) : INITIAL_MASTER_DATA;
  } catch {
    return INITIAL_MASTER_DATA;
  }
}

function saveLocalMasterData(masterData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MASTER_DATA, JSON.stringify(masterData));
  } catch {}
}

export const masterDataApi = {
  async getMasterData() {
    try {
      return await apiClient.get(ENDPOINTS.MASTER_DATA.LIST);
    } catch {
      return getLocalMasterData();
    }
  },

  async addRecord(category, record) {
    try {
      return await apiClient.post(ENDPOINTS.MASTER_DATA.CATEGORY(category), record);
    } catch {
      const data = getLocalMasterData();
      const list = data[category] || [];
      const updatedList = [...list, record];
      const updated = { ...data, [category]: updatedList };
      saveLocalMasterData(updated);
      return record;
    }
  },

  async updateRecord(category, id, updates) {
    try {
      return await apiClient.patch(`${ENDPOINTS.MASTER_DATA.CATEGORY(category)}/${id}`, updates);
    } catch {
      const data = getLocalMasterData();
      const list = data[category] || [];
      const updatedList = list.map(item => item.id === id ? { ...item, ...updates } : item);
      const updated = { ...data, [category]: updatedList };
      saveLocalMasterData(updated);
      return updates;
    }
  }
};

export default masterDataApi;
