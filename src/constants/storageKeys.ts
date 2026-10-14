/**
 * Centralized Storage Keys
 * Keeps all localStorage keys in one predictable place.
 */

export const STORAGE_KEYS = {
  DATA_VERSION: 'techgy_data_version',

  // Core Entities
  LEADS: 'techgy_leads',
  ACCOUNTS: 'techgy_accounts',
  ACTIVITIES: 'techgy_activities',
  CONTACTS: 'techgy_contacts',
  NOTIFICATIONS: 'techgy_notifications',
  SALES_HEADS: 'techgy_sales_heads',
  SALES_EXECUTIVES: 'techgy_sales_executives',

  // Master Data & Config
  MASTER_DATA: 'techgy_master_data_v13',
  EMAIL_TEMPLATES: 'techgy_email_templates',
  INTEGRATIONS: 'techgy_integrations',
  SOCIAL_ACCOUNTS: 'techgy_social_accounts',

  // User Session
  CURRENT_USER: 'techgy_user',
  AUTHENTICATED: 'techgy_authenticated', // legacy flag, cleared on logout
  AUTH_TOKEN: 'techgy_auth_token'
};
