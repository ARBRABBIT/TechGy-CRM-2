/**
 * Domain types for the TechGy Link CRM.
 * Every record the app stores, passes between views or sends to the API is described here.
 */

// ---------------------------------------------------------------------------
// Users & roles
// ---------------------------------------------------------------------------

export type RoleKey = 'admin' | 'head' | 'executive';

export interface User {
  name: string;
  email: string;
  /** Free-form role label from login/storage ('Sales Admin', 'head', ...); normalise with getRole() */
  role: string;
}

export type ModuleId =
  | 'dashboard'
  | 'salesHead'
  | 'salesExecutive'
  | 'leads'
  | 'accounts'
  | 'contacts'
  | 'activities'
  | 'masterData'
  | 'integrations'
  | 'heatmap'
  | 'social';

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export interface StageHistoryEntry {
  id: string;
  type: 'initial_creation' | 'stage_change';
  fromStage: string | null;
  toStage: string;
  title: string;
  timestamp: string;
  date: string;
  updatedBy: string;
  notes: string;
}

export interface LeadIntakeInfo {
  connectorId: string;
  receivedAt: string;
  campaign: string;
  adSet: string;
  form: string;
  isTest: boolean;
}

export interface Lead {
  id: string;
  leadName: string;
  phoneNumber?: string;
  emailId?: string;
  company: string;
  designation?: string;
  dob?: string;
  income?: string;
  serviceProviding?: string;
  project?: string;
  enquiries?: number;
  leadSource?: string;
  /** Legacy alias of leadSource on some records */
  source?: string;
  status?: string;
  priority?: string;
  createdDate?: string;
  creationDate?: string;
  lastActivity?: string;
  nextFollowup?: string;
  nextAction?: string;
  dueToday?: boolean;
  isOverdue?: boolean;
  customFollowupSet?: boolean;
  notes?: string;
  // Ownership & assignment
  leadOwner?: string;
  salesHead?: string;
  reportingSalesHead?: string;
  salesExecutive?: string;
  assignedSalesExecutive?: string;
  executive?: string;
  // Junk queue
  isJunk?: boolean;
  junkReason?: string | null;
  // History
  stageHistory?: StageHistoryEntry[];
  callHistory?: unknown[];
  chatHistory?: unknown[];
  // Connector intake
  intake?: LeadIntakeInfo;
  possibleDuplicateOf?: string;
}

// ---------------------------------------------------------------------------
// Accounts, contacts, activities, notifications
// ---------------------------------------------------------------------------

export interface Account {
  id: string;
  companyName: string;
  industry?: string;
  serviceProviding?: string;
  companySize?: string;
  website?: string;
  location?: string;
  accountOwner?: string;
  estimatedAccountValue?: string;
  leadsCount?: number;
  contactsCount?: number;
  createdDate?: string;
  primaryContact?: string;
  tier?: string;
  status?: string;
  notes?: string;
  /** Legacy alias used by some navigation payloads */
  company?: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  designation?: string;
  phone?: string;
  email?: string;
  location?: string;
  leadSource?: string;
  owner?: string;
  relationshipStatus?: string;
  lastContacted?: string;
}

export interface Activity {
  id: string;
  type: string;
  title?: string;
  date?: string;
  time?: string;
  dueTime?: string;
  duration?: string;
  owner?: string;
  company?: string;
  lead?: string;
  leadId?: string;
  targetLeadId?: string;
  contactPerson?: string;
  outcome?: string;
  subject?: string;
  summary?: string;
  shortPreview?: string;
  notes?: string;
  status?: string;
  priority?: string;
  reminder?: string;
  attendees?: string;
  meetingNotes?: string;
  nextAction?: string;
  cc?: string;
  isOverdue?: boolean;
  dueToday?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: string;
  isRead: boolean;
  priority?: string;
  targetModule?: ModuleId;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category?: string;
  subject: string;
  body: string;
  cc?: string;
  code?: string;
  status?: string;
}

// ---------------------------------------------------------------------------
// Sales team
// ---------------------------------------------------------------------------

export interface AssignedLeadSummary {
  id: string;
  name: string;
  company: string;
  status: string;
  quality?: string;
  value?: string;
  nextFollowup?: string;
  phone?: string;
}

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  phone: string;
  formattedPhone: string;
  email: string;
  project: string;
  creationDate: string;
}

export interface SalesHead extends TeamMember {
  assignedSalesExecutivesCount?: number;
  assignedExecutives?: string[];
}

export interface SalesExecutive extends TeamMember {
  reportingSalesHead: string;
  assignedLeadsCount?: number;
  missedFollowupsCount?: number;
  avgDelayHours?: string;
  siteVisitsScheduled?: number;
  siteVisitsCompleted?: number;
  totalBookingsUnits?: number;
  totalBookingsValue?: string;
  assignedLeads?: AssignedLeadSummary[];
}

// ---------------------------------------------------------------------------
// UI feedback
// ---------------------------------------------------------------------------

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: ToastType;
}

export type ToastPayload = string | { title?: string; description?: string; type?: ToastType | string };

export type TriggerToast = (payload: ToastPayload, descOrType?: string) => void;
