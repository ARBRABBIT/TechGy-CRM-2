/**
 * Centralized Storage Keys
 * Keeps all localStorage keys in one predictable place.
 */

export const STORAGE_KEYS = {
  DATA_VERSION: 'techgy_data_version',
  CURRENT_VERSION_TAG: 'v4.0_clean_modules',
  
  // Core Entities
  LEADS: 'techgy_leads',
  ACCOUNTS: 'techgy_accounts',
  ACTIVITIES: 'techgy_activities',
  CONTACTS: 'techgy_contacts',
  NOTIFICATIONS: 'techgy_notifications',
  
  // Master Data & Config
  MASTER_DATA: 'techgy_master_data_v13',
  EMAIL_TEMPLATES: 'techgy_email_templates',
  
  // User Session
  AUTHENTICATED: 'techgy_authenticated',
  CURRENT_USER: 'techgy_current_user',
  AUTH_TOKEN: 'techgy_auth_token'
};
