import { describe, it, expect } from 'vitest';
import { loadSession, saveSession, clearSession, readJSON } from './storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

describe('session storage', () => {
  it('round-trips a valid user and stores only name, email and role', () => {
    saveSession({ name: 'Rahul Verma', email: 'rahul@techgy.com', role: 'Sales Executive', token: 'secret' });
    expect(loadSession()).toEqual({ name: 'Rahul Verma', email: 'rahul@techgy.com', role: 'Sales Executive' });
  });

  it('rejects tampered or malformed sessions', () => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ name: 'X', email: 'x@x.com', role: 'Owner' }));
    expect(loadSession()).toBeNull();
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, '{not json');
    expect(loadSession()).toBeNull();
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ role: 'Sales Admin' }));
    expect(loadSession()).toBeNull();
  });

  it('clears the session on logout', () => {
    saveSession({ name: 'A', email: 'a@b.co', role: 'admin' });
    clearSession();
    expect(loadSession()).toBeNull();
  });

  it('falls back when stored data has the wrong shape', () => {
    localStorage.setItem('k', JSON.stringify({ not: 'a list' }));
    expect(readJSON('k', [])).toEqual([]);
  });
});
