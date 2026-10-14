
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MotionConfig } from 'framer-motion';
import { animateViewTransition } from './utils/animations';
import Sidebar from './components/layout/Sidebar';
import GlobalHeader from './components/layout/GlobalHeader';
import CommonActionsModal from './components/modals/CommonActionsModal';
import LogoutConfirmModal from './components/modals/LogoutConfirmModal';
import NewCompanyPromptModal from './components/modals/NewCompanyPromptModal';
import Toast, { createToast } from './components/common/Toast';
import { ErrorBoundary } from './components/common/StateViews';

// Views
import DashboardView from './views/DashboardView';
import SalesHeadView from './views/SalesHeadView';
import SalesExecutiveView from './views/SalesExecutiveView';
import LeadsView from './views/LeadsView';
import AccountsView from './views/AccountsView';
import ActivitiesView from './views/ActivitiesView';
import ContactsView from './views/ContactsView';
import MasterDataView from './views/MasterDataView';
import IntegrationsView from './views/IntegrationsView';
import HeatmapView from './views/HeatmapView';
import SocialAnalyticsView from './views/SocialAnalyticsView';
import LoginView from './views/LoginView';

// Dedicated Full-Page Detail Views with Interactive Breadcrumb Navigation
import LeadDetailView from './views/LeadDetailView';
import AccountDetailView from './views/AccountDetailView';
import ProfileView from './views/ProfileView';

// Initial Mock Data
import {
  INITIAL_LEADS,
  INITIAL_ACCOUNTS,
  INITIAL_ACTIVITIES,
  INITIAL_CONTACTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_EMAIL_TEMPLATES,
  INITIAL_SALES_HEADS,
  INITIAL_SALES_EXECUTIVES
} from './data/mockData';
import { STORAGE_KEYS } from './constants/storageKeys';
import usePersistedState from './hooks/usePersistedState';
import { installEscapeToCloseOverlays } from './hooks/useDialog';
import { migrateStoredData, loadSession, saveSession, clearSession } from './utils/storage';
import { canAccessModule, getHomeModule, getRole, ROLE } from './utils/roles';
import { ACTION, can, SAVE_ACTION_PERMISSION, actionForLeadUpdate, scopeLeadsForUser, scopeExecutivesForUser, scopeActivitiesForUser } from './utils/permissions';
import { findAccountByCompany, createGeneratedAccount } from './utils/accountUtils';
import { applyStageChange } from './utils/pipelineUtils';
import { getTodayISO } from './utils/dateUtils';
import { validate, ACTION_RULES, findDuplicateLead } from './utils/validation';
import { DEFAULT_INTEGRATIONS, hydrateIntegrations, getConnector, buildIntakeLead, sampleSubmission } from './utils/leadIntake';

const DATA_VERSION = 'v5.0_sales_executive_assigned_leads';
const DEFAULT_SERVICE = 'TechGy CRM Enterprise Suite';

migrateStoredData(DATA_VERSION);

// Mock leads whose follow-up stays pinned to "today" until the user reschedules them
const TODAY_ANCHORED_FOLLOWUPS = { 'LD-201': '15:30', 'LD-203': '16:30', 'LD-206': '17:00', 'LD-207': '18:00' };

const hydrateLeads = (stored) => {
  const list = stored.length > 0 ? stored : INITIAL_LEADS;
  const existingIds = new Set(list.map(l => l.id));
  const missing = INITIAL_LEADS.filter(l => !existingIds.has(l.id));
  return [...list, ...missing].map(l => ({ ...l, serviceProviding: l.serviceProviding || DEFAULT_SERVICE }));
};

const hydrateAccounts = (stored) =>
  stored.map(a => ({ ...a, serviceProviding: a.serviceProviding || DEFAULT_SERVICE }));

// `?view=login` / `?view=forgot` always opens the auth screen
const getInitialUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const view = new URLSearchParams(window.location.search).get('view');
    return view === 'login' || view === 'forgot' ? null : loadSession();
  } catch {
    return loadSession();
  }
};

const generateUniqueId = (prefix) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
};
const timeNow = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const nowStamp = () => `${getTodayISO()} ${timeNow()}`;

export default function App() {
  // Session — only a validated, stored user counts as signed in
  const [currentUser, setCurrentUser] = useState(getInitialUser);
  const isAuthenticated = Boolean(currentUser);

  // Navigation & Collapsible Sidebar State (Role-Based Initial Module)
  const [activeModule, setActiveModule] = useState(() => getHomeModule(currentUser));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Global Header Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('This Month');
  const [selectedOwnerFilter, setSelectedOwnerFilter] = useState('All Owners');

  // Relational Data State (persisted to localStorage, mock data as fallback)
  const [leads, setLeads] = usePersistedState(STORAGE_KEYS.LEADS, INITIAL_LEADS, hydrateLeads);
  const [accounts, setAccounts] = usePersistedState(STORAGE_KEYS.ACCOUNTS, INITIAL_ACCOUNTS, hydrateAccounts);
  const [activities, setActivities] = usePersistedState(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  const [contacts, setContacts] = usePersistedState(STORAGE_KEYS.CONTACTS, INITIAL_CONTACTS);
  const [notifications, setNotifications] = usePersistedState(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  const [emailTemplates, setEmailTemplates] = usePersistedState(STORAGE_KEYS.EMAIL_TEMPLATES, INITIAL_EMAIL_TEMPLATES);
  const [integrations, setIntegrations] = usePersistedState(STORAGE_KEYS.INTEGRATIONS, DEFAULT_INTEGRATIONS, hydrateIntegrations);
  const [salesHeads] = usePersistedState(STORAGE_KEYS.SALES_HEADS, INITIAL_SALES_HEADS);
  const [salesExecutives, setSalesExecutives] = usePersistedState(STORAGE_KEYS.SALES_EXECUTIVES, INITIAL_SALES_EXECUTIVES);
  const [toast, setToast] = useState(null);

  // Escape closes the top-most simple overlay (dialogs using useDialog handle it themselves)
  useEffect(() => installEscapeToCloseOverlays(), []);

  // Auto-dismiss toast pop-up notification after 5 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Recompute overdue and dueToday status at runtime
  useEffect(() => {
    const checkOverdueLeads = () => {
      const now = new Date();
      const todayStr = getTodayISO();
      setLeads(prevLeads => {
        let hasChanged = false;
        const updated = prevLeads.map(lead => {
          if (!lead.nextFollowup) return lead;

          const anchoredTime = !lead.customFollowupSet && TODAY_ANCHORED_FOLLOWUPS[lead.id];
          const nextFollowup = anchoredTime ? `${todayStr} ${anchoredTime}` : lead.nextFollowup;

          const followupTs = new Date(nextFollowup.replace(' ', 'T')).getTime();
          if (isNaN(followupTs)) return lead;

          const isToday = nextFollowup.startsWith(todayStr);
          const isOverdue = !isToday && followupTs < now.getTime() && lead.status !== 'Converted' && lead.status !== 'Lost';

          if (lead.isOverdue !== isOverdue || lead.dueToday !== isToday || lead.nextFollowup !== nextFollowup) {
            hasChanged = true;
            return { ...lead, nextFollowup, isOverdue, dueToday: isToday };
          }
          return lead;
        });
        return hasChanged ? updated : prevLeads;
      });
    };

    checkOverdueLeads();
    const timer = setInterval(checkOverdueLeads, 60000);
    return () => clearInterval(timer);
  }, [setLeads]);

  // Dedicated Full Page Selection States (Replaces side drawers)
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [fromDashboard, setFromDashboard] = useState(false);
  const [leadNavSource, setLeadNavSource] = useState('leads');
  const [accountInitialTab, setAccountInitialTab] = useState('Leads');

  // Create & Action Modal State (unified for atomic updates and predictable flow)
  const initialCreateModalState = {
    isOpen: false,
    initialType: 'createLead',
    targetLead: null,
    targetAccount: null,
    bulkLeadIds: [],
    bulkCallback: null,
    lockType: false
  };
  const [createModal, setCreateModal] = useState(initialCreateModalState);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [newCompanyPrompt, setNewCompanyPrompt] = useState(null);

  // Interactive View Filter State
  const [leadsSourceFilter, setLeadsSourceFilter] = useState('');
  const [leadsOverdueOnly, setLeadsOverdueOnly] = useState(false);
  const [activitiesInitialTab, setActivitiesInitialTab] = useState('All');

  // Fall back to the role's landing module if the requested one isn't permitted
  const moduleId = canAccessModule(currentUser, activeModule) ? activeModule : getHomeModule(currentUser);

  // Leads this user may see (admins: all, heads: their team's, executives: their own)
  const visibleLeads = useMemo(
    () => scopeLeadsForUser(leads, currentUser, salesExecutives),
    [leads, currentUser, salesExecutives]
  );
  const visibleActivities = useMemo(
    () => scopeActivitiesForUser(activities, currentUser, visibleLeads),
    [activities, currentUser, visibleLeads]
  );

  const triggerToast = (payload, descOrType) => setToast(createToast(payload, descOrType));

  /**
   * Permission gate for every mutation. Checks the role permission and that each
   * stored lead touched is visible to the user. Leads that only exist as dashboard
   * previews (not in `leads`) have nothing to protect and pass the scope check.
   */
  const allow = (action, leadIds = []) => {
    const visibleIds = new Set(visibleLeads.map(l => l.id));
    const storedIds = new Set(leads.map(l => l.id));
    const inScope = leadIds.every(id => visibleIds.has(id) || !storedIds.has(id));
    if (can(currentUser, action) && inScope) return true;
    triggerToast({ title: 'Not allowed', description: 'Your role doesn’t have permission for this action.', type: 'warning' });
    return false;
  };

  // State setters handed to views, wrapped so they can only run with permission
  const guardedSetter = (action, setter) => (value) => {
    if (allow(action)) setter(value);
  };

  const pushNotification = (title, message, category = 'Lead', targetModule = 'leads') => {
    const safeTitle = typeof title === 'string' ? title.trim().slice(0, 120) : 'Notification';
    const safeMessage = typeof message === 'string' ? message.trim().slice(0, 500) : '';
    const safeCategory = ['Lead', 'Account', 'Activity', 'Contact', 'Overdue', 'System'].includes(category) ? category : 'Lead';
    const safeModule = ['dashboard', 'leads', 'accounts', 'activities', 'contacts', 'salesHead', 'salesExecutive', 'masterData', 'integrations'].includes(targetModule) ? targetModule : 'leads';

    const newNotif = {
      id: generateUniqueId('NOTIF'),
      title: safeTitle,
      message: safeMessage,
      timestamp: 'Just now',
      category: safeCategory,
      isRead: false,
      priority: 'Normal',
      targetModule: safeModule
    };
    setNotifications(prev => [newNotif, ...prev]);
    triggerToast(`${safeTitle}: ${safeMessage}`);
  };

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  /**
   * Close any detail page / profile and show a top-level module.
   * `viaDashboard` sets the "back to dashboard" origin; omit it to keep the current one.
   */
  const goToModule = (mod, viaDashboard) => {
    setSelectedLead(null);
    setSelectedAccount(null);
    setIsProfileActive(false);
    if (viaDashboard !== undefined) setFromDashboard(viaDashboard);
    setActiveModule(mod);
  };

  const openLead = (lead, source) => {
    setLeadNavSource(source);
    setSelectedAccount(null);
    setIsProfileActive(false);
    setSelectedLead(lead);
  };

  const openAccount = (account, source, initialTab = 'Leads') => {
    setLeadNavSource(source);
    setAccountInitialTab(initialTab);
    setSelectedLead(null);
    setIsProfileActive(false);
    setSelectedAccount(account);
  };

  const handleOpenProfile = () => {
    setSelectedLead(null);
    setSelectedAccount(null);
    setIsProfileActive(true);
    setFromDashboard(false);
  };

  const handleBackToDashboard = () => {
    setFromDashboard(false);
    setActiveModule('dashboard');
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    triggerToast('All notifications marked as read');
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    triggerToast('All notifications cleared');
  };

  const handleSelectNotification = (notif) => {
    goToModule(notif.targetModule || activeModule, false);
  };

  const handleLoginSuccess = (user) => {
    saveSession(user);
    setCurrentUser(user);
    goToModule(getHomeModule(user), false);
    triggerToast(`Welcome, ${user.name}! Connected to TechGy Link.`);
  };

  const handleConfirmLogout = () => {
    clearSession();
    setIsLogoutModalOpen(false);
    setCurrentUser(null);
    goToModule('dashboard', false);
  };

  const handleNavigateToLeads = (source = '', overdue = false) => {
    if (source === 'OVERDUE') {
      setLeadsOverdueOnly(true);
      setLeadsSourceFilter('');
    } else {
      setLeadsSourceFilter(source);
      setLeadsOverdueOnly(overdue);
    }
    goToModule('leads', true);
  };

  const handleNavigateToActivities = (tab = 'Follow-up') => {
    setActivitiesInitialTab(tab);
    goToModule('activities', true);
  };

  const handleSelectModule = (mod) => {
    setActivitiesInitialTab('All');
    goToModule(mod, false);
  };

  // Universal Search Result Navigation Handler
  const handleSelectSearchResult = (category, item) => {
    setFromDashboard(false);
    if (category === 'lead') {
      openLead(item, 'leads');
      setActiveModule('leads');
    } else if (category === 'account') {
      openAccount(findAccountByCompany(accounts, item.companyName) || item, 'accounts');
      setActiveModule('accounts');
    } else if (category === 'contact') {
      const parentAcc = findAccountByCompany(accounts, item.company);
      if (parentAcc) {
        openAccount(parentAcc, 'contacts', 'Contacts');
      } else {
        setSelectedLead(null);
        setSelectedAccount(null);
        setIsProfileActive(false);
      }
      setActiveModule('contacts');
    } else if (category === 'activity') {
      goToModule('activities');
    }
  };

  // Matches a free-text name from the activities list to a lead, falling back to an account
  const handleSelectActivityTarget = (name) => {
    const q = (name || '').toLowerCase();
    const lead = leads.find(l => {
      const leadName = l.leadName.toLowerCase();
      return leadName === q || leadName.includes(q) || q.includes(leadName);
    });
    if (lead) {
      openLead(lead, 'activities');
      return;
    }
    const acc = findAccountByCompany(accounts, name);
    if (acc) openAccount(acc, 'activities');
  };

  // ---------------------------------------------------------------------------
  // Lead & Account mutations
  // ---------------------------------------------------------------------------

  /** Apply `update` to each lead in `ids`, keeping the open detail page in sync. */
  const updateLeads = (ids, update) => {
    const idSet = new Set(ids);
    const apply = (lead) => (idSet.has(lead.id) ? update(lead) : lead);
    setLeads(prev => prev.map(apply));
    setSelectedLead(prev => (prev ? apply(prev) : prev));
  };

  const addActivities = (...items) => setActivities(prev => [...items, ...prev]);

  const stageUpdater = (newStage) => (lead) => applyStageChange(lead, newStage, currentUser?.name);

  // Calls happen outside the portal; 'call' opens the Log Call form so they land in call history
  const handleQuickAction = (actionType, lead) => {
    setSelectedLead(lead);
    openCreateModal(actionType, { targetLead: lead });
  };

  const handleUpdateLeadStage = (leadId, newStage) => {
    if (!allow(ACTION.LEAD_STATUS, [leadId])) return;
    updateLeads([leadId], stageUpdater(newStage));
    triggerToast({
      title: 'Lead Stage Updated',
      description: `Lead moved to "${newStage}" stage.`,
      type: 'success'
    });
    pushNotification('Lead Stage Updated', `Lead status updated to ${newStage}`, 'Lead', 'leads');
  };

  const handleUpdateLead = (leadId, updatedFields) => {
    const current = leads.find(l => l.id === leadId) || (selectedLead?.id === leadId ? selectedLead : null);
    const action = actionForLeadUpdate(updatedFields, current);
    if (!allow(action, [leadId])) return;

    // Sales Heads may only assign within their own team, with themselves as head
    if (action === ACTION.LEAD_ASSIGN && getRole(currentUser) === ROLE.HEAD) {
      const assignee = updatedFields.salesExecutive || updatedFields.assignedSalesExecutive;
      const team = scopeExecutivesForUser(salesExecutives, currentUser);
      const foreignExec = assignee && assignee !== 'Unassigned' && !team.some(se => se.name === assignee);
      const foreignHead = updatedFields.salesHead && updatedFields.salesHead !== current?.salesHead
        && updatedFields.salesHead !== currentUser.name;
      if (foreignExec || foreignHead) {
        triggerToast({ title: 'Not allowed', description: 'You can only assign leads within your own team.', type: 'warning' });
        return;
      }
    }

    const leadName = updatedFields.leadName || current?.leadName || 'Lead';
    updateLeads([leadId], lead => ({ ...lead, ...updatedFields }));
    triggerToast({
      title: 'Lead Details Updated',
      description: `Details for "${leadName}" saved successfully.`,
      type: 'success'
    });
    pushNotification('Lead Details Updated', `Updated information for lead "${leadName}"`, 'Lead', 'leads');
  };

  const handleDeleteLead = (leadId) => {
    if (!allow(ACTION.LEAD_DELETE, [leadId])) return;
    setLeads(prev => prev.filter(l => l.id !== leadId));
    setSelectedLead(prev => (prev?.id === leadId ? null : prev));
  };

  const handleUpdateAccount = (accountId, updatedFields) => {
    if (!allow(ACTION.ACCOUNT_EDIT)) return;
    setAccounts(prev => prev.map(acc => acc.id === accountId ? { ...acc, ...updatedFields } : acc));
    setSelectedAccount(prev => (prev?.id === accountId ? { ...prev, ...updatedFields } : prev));
    triggerToast({
      title: 'Company Profile Updated',
      description: 'The company details have been successfully saved.',
      type: 'success'
    });
  };

  const handleSelectAccountByCompany = (companyInput, source = 'accounts', initialTab = 'Leads') => {
    const companyName = typeof companyInput === 'string'
      ? companyInput
      : (companyInput?.company || companyInput?.companyName || companyInput?.accountName);
    if (!companyName) return;

    let fullAcc = findAccountByCompany(accounts, companyName);
    if (!fullAcc) {
      fullAcc = createGeneratedAccount(companyName, {
        accountOwner: currentUser?.name || 'Rahul Verma',
        industry: companyName.includes('Energy') ? 'Renewable Energy & CleanTech' :
                  companyName.includes('Retail') ? 'Retail & Consumer Goods' :
                  companyName.includes('Tech') ? 'Cloud Infrastructure & DevOps' : 'Enterprise Technology',
        location: 'Mumbai HQ, India',
        estimatedAccountValue: '₹1,50,00,000'
      });
      setAccounts(prev => [fullAcc, ...prev]);
    }

    openAccount(fullAcc, source, initialTab);
    setActiveModule('accounts');
  };

  // ---------------------------------------------------------------------------
  // Lead connectors (Meta, Google Ads, LinkedIn, webhook)
  // ---------------------------------------------------------------------------

  const handleUpdateIntegration = (connectorId, patch) => {
    if (!allow(ACTION.INTEGRATIONS_MANAGE)) return;
    setIntegrations(prev => ({ ...prev, [connectorId]: { ...prev[connectorId], ...patch } }));
    triggerToast({ title: 'Connector settings saved', description: `${getConnector(connectorId)?.name} routing and field mapping updated.`, type: 'success' });
  };

  const bumpIntegrationStats = (connectorId, patch) =>
    setIntegrations(prev => ({ ...prev, [connectorId]: { ...prev[connectorId], stats: { ...prev[connectorId].stats, ...patch(prev[connectorId].stats) } } }));

  /**
   * Run one submission through the intake pipeline (utils/leadIntake). The
   * Integrations page uses it for test leads; the backend webhooks will call
   * the same pipeline for real submissions.
   */
  const handleIngestLead = (connectorId, { payload, meta }) => {
    if (!allow(ACTION.INTEGRATIONS_MANAGE)) return;
    const connector = getConnector(connectorId);
    const result = buildIntakeLead({ connectorId, settings: integrations[connectorId], payload, meta, leads, salesExecutives });

    if (result.error) {
      triggerToast({ title: `${connector.name}: lead rejected`, description: result.error, type: 'error' });
      return;
    }
    if (result.skipped) {
      bumpIntegrationStats(connectorId, st => ({ skipped: st.skipped + 1 }));
      triggerToast({ title: 'Duplicate skipped', description: `Matches existing lead “${result.duplicate.leadName}” (${result.duplicate.id}).`, type: 'info' });
      return;
    }

    const { lead } = result;
    setLeads(prev => [lead, ...prev]);
    if (lead.company !== 'Not provided' && !accounts.some(a => a.companyName.toLowerCase() === lead.company.toLowerCase())) {
      setAccounts(prev => [createGeneratedAccount(lead.company, { accountOwner: lead.salesHead || 'Unassigned' }), ...prev]);
    }
    bumpIntegrationStats(connectorId, st => ({ received: st.received + 1, lastReceivedAt: lead.intake.receivedAt }));
    pushNotification(
      `New lead from ${connector.name}`,
      `${lead.leadName}${lead.salesExecutive ? ` assigned to ${lead.salesExecutive}` : ' is waiting in the Unassigned queue'}`,
      'Lead',
      'leads'
    );
  };

  const handleSendTestLead = (connectorId) => handleIngestLead(connectorId, sampleSubmission(connectorId));

  const handleSelectContactAccount = (acc) => {
    const companyName = typeof acc === 'string' ? acc : (acc.company || acc.companyName);
    const fullAcc = findAccountByCompany(accounts, companyName) || (companyName && createGeneratedAccount(companyName, {
      industry: 'Enterprise Software',
      companySize: '500-1000 employees',
      location: 'Mumbai HQ, India',
      estimatedAccountValue: '₹1,80,00,000',
      leadsCount: 2,
      contactsCount: 4
    }));
    if (fullAcc) openAccount(fullAcc, 'contacts');
  };

  // Common Action Save Handler
  const handleSaveAction = (type, formData, leadOverride = null) => {
    if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
      triggerToast({ title: 'Invalid Submission', description: 'Form payload is invalid.', type: 'warning' });
      return;
    }
    if (Object.prototype.hasOwnProperty.call(formData, '__proto__') || Object.prototype.hasOwnProperty.call(formData, 'constructor')) {
      triggerToast({ title: 'Invalid Submission', description: 'Security error in payload.', type: 'error' });
      return;
    }

    const isLeadScoped = ['addNote', 'assignOwner', 'changeStatus', 'scheduleFollowup', 'call', 'email', 'sms'].includes(type);
    const targetLead = leadOverride
      || leads.find(l => l.id === formData.targetLeadId)
      || createModal.targetLead
      || selectedLead;

    if (isLeadScoped && !targetLead) {
      triggerToast({ title: 'No Lead Selected', description: 'Please select a target lead before continuing.', type: 'warning' });
      return;
    }

    const targetIds = formData.bulkLeadIds || (targetLead ? [targetLead.id] : []);
    const count = targetIds.length;

    // Unknown action types map to no permission and are refused (fail closed)
    if (!allow(SAVE_ACTION_PERMISSION[type], isLeadScoped ? targetIds : [])) return;

    // Same rules the form shows inline — re-checked here for every entry point
    const problems = Object.values(validate(formData, ACTION_RULES[type] || {}));
    if (problems.length > 0) {
      triggerToast({ title: 'Check the details', description: problems[0], type: 'warning' });
      return;
    }
    if (type === 'createLead') {
      const dup = findDuplicateLead(leads, formData);
      if (dup) {
        triggerToast({ title: 'Duplicate lead', description: `“${dup.leadName}” (${dup.id}) already uses this email or phone.`, type: 'warning' });
        return;
      }
    }
    if (type === 'createContact' && formData.email
      && contacts.some(c => (c.email || '').toLowerCase() === formData.email.trim().toLowerCase())) {
      triggerToast({ title: 'Duplicate contact', description: 'A contact with this email already exists.', type: 'warning' });
      return;
    }

    switch (type) {
      case 'createAccount': {
        const compName = formData.companyName || formData.company || 'Enterprise Client';
        if (accounts.some(a => a.companyName.toLowerCase() === compName.toLowerCase())) {
          triggerToast(`Company account "${compName}" already exists`, 'info');
          return;
        }
        const newAcc = createGeneratedAccount(compName, {
          accountOwner: formData.owner || currentUser?.name,
          industry: formData.industry || 'Technology & IT Services',
          serviceProviding: formData.serviceProviding || DEFAULT_SERVICE,
          companySize: formData.companySize || '51-200 employees',
          website: formData.website || `https://www.${compName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          location: formData.location || 'Mumbai, Maharashtra',
          estimatedAccountValue: formData.estimatedAccountValue || '₹50,00,000',
          primaryContact: formData.primaryContact || formData.leadName || 'Corporate Officer',
          tier: formData.tier || 'Strategic Enterprise',
          status: 'Active',
          notes: formData.notes || ''
        });
        setAccounts(prev => [newAcc, ...prev]);
        pushNotification('New Company Account Created', `Company account "${compName}" registered in CRM`, 'Account', 'accounts');
        triggerToast(`Company account "${compName}" created`, 'success');
        break;
      }

      case 'createLead': {
        const dueDateVal = formData.dueDate || getTodayISO();
        const followupTs = new Date(`${dueDateVal}T10:00`).getTime();
        const isDueToday = dueDateVal.startsWith(getTodayISO());
        const newLead = {
          id: generateUniqueId('LD'),
          leadName: formData.leadName,
          phoneNumber: formData.phone || '+91 98765 00000',
          emailId: formData.email || 'lead@example.co.in',
          company: formData.company,
          designation: formData.designation || 'Manager',
          serviceProviding: formData.serviceProviding || DEFAULT_SERVICE,
          leadSource: formData.leadSource || 'Website',
          status: formData.status || 'New',
          leadOwner: formData.owner || currentUser?.name || 'Unassigned',
          priority: formData.priority || 'Medium',
          createdDate: getTodayISO(),
          lastActivity: 'New lead record created in CRM',
          nextFollowup: `${dueDateVal} 10:00`,
          dueToday: isDueToday,
          isOverdue: !isDueToday && !isNaN(followupTs) && followupTs < Date.now(),
          notes: formData.notes || '',
          nextAction: formData.notes || ''
        };
        setLeads(prev => [newLead, ...prev]);
        pushNotification('New Lead Created', `Lead "${formData.leadName}" created for ${formData.company}`, 'Lead', 'leads');
        triggerToast(`Lead "${formData.leadName}" created`, 'success');

        // Ensure an account exists for the lead's company
        if (!accounts.some(a => a.companyName.toLowerCase() === formData.company.toLowerCase())) {
          const newAcc = createGeneratedAccount(formData.company, {
            accountOwner: formData.owner || currentUser?.name,
            serviceProviding: formData.serviceProviding || DEFAULT_SERVICE
          });
          setAccounts(prev => [newAcc, ...prev]);
          setNewCompanyPrompt({ companyName: formData.company, account: newAcc });
        }
        break;
      }

      case 'addNote': {
        const noteText = formData.notes || 'Note added to lead record';
        updateLeads([targetLead.id], l => ({
          ...l,
          notes: `${l.notes || ''}\n• ${noteText}`,
          lastActivity: `Note added: ${noteText.slice(0, 35)}...`
        }));
        pushNotification('Note Added', `Added note to lead ${targetLead.leadName}`, 'Lead', 'leads');
        triggerToast(`Note added to ${targetLead.leadName}`, 'success');
        break;
      }

      case 'assignOwner': {
        const newOwner = formData.owner || currentUser?.name || 'Unassigned';
        updateLeads(targetIds, l => ({ ...l, leadOwner: newOwner }));
        const msg = count > 1 ? `Assigned ${count} leads to ${newOwner}` : `Assigned ${targetLead?.leadName || 'lead'} to ${newOwner}`;
        pushNotification('Owner Reassigned', msg, 'Lead', 'leads');
        triggerToast(msg, 'success');
        break;
      }

      case 'changeStatus': {
        const newStatus = formData.status || 'Contacted';
        updateLeads(targetIds, stageUpdater(newStatus));
        const msg = count > 1 ? `Updated stage to "${newStatus}" for ${count} leads` : `Status for ${targetLead?.leadName || 'lead'} changed to "${newStatus}"`;
        pushNotification('Status Updated', msg, 'Lead', 'leads');
        triggerToast(msg, 'success');
        break;
      }

      case 'scheduleFollowup': {
        const dateFormatted = formData.dueDate ? formData.dueDate.replace('T', ' ') : `${getTodayISO()} 11:00`;
        const isDueToday = formData.dueDate ? formData.dueDate.startsWith(getTodayISO()) : true;
        const followupTs = new Date(dateFormatted.replace(' ', 'T')).getTime();
        const isOverdue = !isDueToday && !isNaN(followupTs) && followupTs < Date.now();
        const nextAction = formData.nextAction || 'Follow-up scheduled';

        updateLeads([targetLead.id], l => ({
          ...l,
          nextFollowup: dateFormatted,
          nextAction,
          dueToday: isDueToday,
          isOverdue,
          customFollowupSet: true
        }));
        addActivities({
          id: generateUniqueId('ACT'),
          type: 'Follow-up',
          date: dateFormatted,
          owner: targetLead.leadOwner || currentUser?.name || 'Unassigned',
          company: targetLead.company,
          lead: targetLead.leadName,
          status: 'Scheduled',
          notes: nextAction,
          dueToday: isDueToday,
          isOverdue
        });
        pushNotification('Follow-up Scheduled', `Scheduled follow-up for ${targetLead.leadName} on ${dateFormatted}`, 'Activity', 'activities');
        triggerToast(`Follow-up scheduled for ${targetLead.leadName}`, 'success');
        break;
      }

      case 'call': {
        const outcome = formData.outcome || 'Connected - Positive';
        const duration = formData.duration || '15 mins';
        addActivities({
          id: generateUniqueId('ACT'),
          type: 'Call',
          title: `Call: ${outcome}`,
          date: nowStamp(),
          duration,
          owner: targetLead.leadOwner || currentUser?.name || 'Unassigned',
          company: targetLead.company,
          lead: targetLead.leadName,
          outcome,
          notes: formData.notes || 'Call completed with lead',
          status: 'Completed',
          isOverdue: false
        });
        updateLeads([targetLead.id], l => ({ ...l, lastActivity: `Call logged: ${outcome} (${duration})` }));
        pushNotification('Call Logged', `Logged call with ${targetLead.leadName} (${outcome})`, 'Activity', 'activities');
        triggerToast(`Call recorded for ${targetLead.leadName}`, 'success');
        break;
      }

      case 'email': {
        const subject = formData.subject || 'CRM Solution Follow-up';
        const idSet = new Set(targetIds);
        const recipients = leads.filter(l => idSet.has(l.id));
        const date = nowStamp();
        addActivities(...(recipients.length > 0 ? recipients : [targetLead]).map((tl, index) => ({
          id: `${generateUniqueId('ACT')}-${index}`,
          type: 'Email',
          subject,
          date,
          owner: tl.leadOwner || currentUser?.name || 'Unassigned',
          company: tl.company,
          lead: tl.leadName,
          notes: formData.notes || 'Sent email communication to lead',
          cc: formData.cc || '',
          status: 'Completed',
          isOverdue: false
        })));
        updateLeads(targetIds, l => ({ ...l, lastActivity: `Email sent: ${subject}` }));
        const msg = count > 1 ? `Email "${subject}" sent to ${count} leads` : `Sent email "${subject}" to ${targetLead?.leadName || 'lead'}`;
        pushNotification('Email Recorded', msg, 'Activity', 'activities');
        triggerToast(msg, 'success');
        break;
      }

      case 'sms': {
        const smsNotes = formData.notes || 'WhatsApp communication sent';
        addActivities({
          id: generateUniqueId('ACT'),
          type: 'SMS / WhatsApp',
          targetLeadId: targetLead.id,
          leadId: targetLead.id,
          title: 'WhatsApp Message',
          subject: 'WhatsApp Message',
          date: nowStamp(),
          owner: targetLead.leadOwner || currentUser?.name || 'Unassigned',
          company: targetLead.company,
          lead: targetLead.leadName,
          notes: smsNotes,
          shortPreview: smsNotes,
          status: 'Delivered',
          isOverdue: false
        });
        updateLeads([targetLead.id], l => ({ ...l, lastActivity: 'WhatsApp message sent' }));
        pushNotification('WhatsApp Logged', `WhatsApp message recorded for ${targetLead.leadName}`, 'Activity', 'activities');
        triggerToast(`WhatsApp message logged for ${targetLead.leadName}`, 'success');
        break;
      }

      case 'createActivity': {
        const newAct = {
          id: generateUniqueId('ACT'),
          title: formData.nextAction || formData.notes || 'Engagement Activity',
          type: formData.activityType || formData.status || 'Meeting',
          company: formData.company || targetLead?.company || 'Reliance Cloud Solutions',
          contactPerson: formData.leadName || targetLead?.leadName || 'Contact',
          date: formData.dueDate || getTodayISO(),
          time: '14:30',
          status: 'Scheduled',
          owner: formData.owner || currentUser?.name || 'Unassigned',
          notes: formData.notes || 'Activity logged in CRM.'
        };
        addActivities(newAct);
        pushNotification('New Activity Scheduled', `Activity scheduled for ${newAct.company}`, 'Activity', 'activities');
        triggerToast(`Activity scheduled for ${newAct.company}`, 'success');
        break;
      }

      case 'createContact': {
        const newCont = {
          id: generateUniqueId('CONT'),
          name: formData.leadName || 'New Contact',
          designation: formData.designation || 'Director',
          company: formData.company || targetLead?.company || 'Enterprise Account',
          email: formData.email || 'contact@example.co.in',
          phone: formData.phone || '+91 98765 00000',
          owner: formData.owner || currentUser?.name || 'Unassigned'
        };
        setContacts(prev => [newCont, ...prev]);
        pushNotification('New Contact Added', `Added ${newCont.name} to directory`, 'Contact', 'contacts');
        triggerToast(`Contact added: ${newCont.name}`, 'success');
        break;
      }

      default:
        break;
    }
  };

  // ---------------------------------------------------------------------------
  // Modal plumbing
  // ---------------------------------------------------------------------------

  const openCreateModal = (
    type = 'createLead',
    {
      targetLead = null,
      targetAccount = null,
      bulkIds = [],
      onComplete = null,
      lockType = false
    } = {}
  ) => {
    setCreateModal({
      isOpen: true,
      initialType: type,
      targetLead,
      targetAccount,
      bulkLeadIds: bulkIds || [],
      bulkCallback: typeof onComplete === 'function' ? onComplete : null,
      lockType
    });
  };

  const closeCreateModal = () => {
    setCreateModal(initialCreateModalState);
  };

  // Unique key per page so the GSAP entrance transition runs on every navigation
  const currentViewKey = isProfileActive
    ? 'profile'
    : selectedLead
      ? `lead-${selectedLead.id}`
      : selectedAccount
        ? `account-${selectedAccount.id}`
        : moduleId;

  const contentRef = useRef(null);
  useEffect(() => {
    if (contentRef.current) {
      animateViewTransition(contentRef.current);
    }
  }, [currentViewKey]);

  // Unauthenticated view screen
  if (!isAuthenticated) {
    return (
      <MotionConfig reducedMotion="user">
        <LoginView onLoginSuccess={handleLoginSuccess} />
      </MotionConfig>
    );
  }

  const leadDetailNav = {
    onNavigateToActivities: () => goToModule('activities'),
    onNavigateToContacts: () => goToModule('contacts'),
    onNavigateHome: () => goToModule('dashboard'),
    navigationSource: leadNavSource,
    fromDashboard
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="app-container">
        <a href="#main-content" className="skip-link">Skip to main content</a>

        {/* 1. Fixed Left Sidebar */}
        <Sidebar
          activeModule={moduleId}
          setActiveModule={handleSelectModule}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onOpenProfile={handleOpenProfile}
          currentUser={currentUser}
          overdueCount={leads.filter(l => l.isOverdue).length}
          tasksCount={visibleActivities.filter(a => a.status === 'Scheduled' || a.status === 'Pending' || a.dueToday).length}
        />

        {/* Main App Section */}
        <div className={`main-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {/* 2. Global Header with Live Universal Search */}
          <GlobalHeader
            activeModule={moduleId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDateFilter={selectedDateFilter}
            setSelectedDateFilter={setSelectedDateFilter}
            selectedOwnerFilter={selectedOwnerFilter}
            setSelectedOwnerFilter={setSelectedOwnerFilter}
            setMobileOpen={setMobileOpen}
            onOpenCreateModal={(type = (
              moduleId === 'accounts' ? 'createAccount' :
              moduleId === 'contacts' ? 'createContact' :
              moduleId === 'activities' ? 'createActivity' : 'createLead'
            )) => openCreateModal(type, { targetAccount: selectedAccount })}
            canCreate={can(currentUser, ACTION.LEAD_CREATE)}
            leads={visibleLeads}
            accounts={accounts}
            contacts={contacts}
            activities={visibleActivities}
            onSelectSearchResult={handleSelectSearchResult}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAllNotifications}
            onSelectNotification={handleSelectNotification}
            onOpenProfile={handleOpenProfile}
            onLogout={() => setIsLogoutModalOpen(true)}
          />

          {/* 3. Main Page Content with GSAP Transition */}
          <main id="main-content" tabIndex={-1} className="content-body" key={currentViewKey} ref={contentRef}>
            <ErrorBoundary>
            {isProfileActive ? (
              <ProfileView
                currentUser={currentUser}
                onBack={() => setIsProfileActive(false)}
                onNavigateHome={() => goToModule('dashboard')}
                leads={leads}
                accounts={accounts}
                onSelectLead={(lead) => openLead(lead, leadNavSource)}
                onSelectAccount={(acc) => {
                  openAccount(acc, leadNavSource, accountInitialTab);
                  setActiveModule('accounts');
                }}
                onLogout={() => setIsLogoutModalOpen(true)}
              />
            ) : selectedLead ? (
              <LeadDetailView
                {...leadDetailNav}
                lead={selectedLead}
                activities={activities}
                onBack={() => setSelectedLead(null)}
                onQuickAction={handleQuickAction}
                onSaveAction={handleSaveAction}
                onNavigateToAccount={(companyName) => handleSelectAccountByCompany(companyName, 'leads', 'Leads')}
                onUpdateLeadStage={handleUpdateLeadStage}
                onUpdateLead={handleUpdateLead}
                canEditLead={can(currentUser, ACTION.LEAD_EDIT)}
                accounts={accounts}
              />
            ) : selectedAccount ? (
              <AccountDetailView
                {...leadDetailNav}
                account={selectedAccount}
                initialTab={accountInitialTab}
                onBack={() => setSelectedAccount(null)}
                leads={leads}
                activities={activities}
                contacts={contacts}
                onUpdateAccount={handleUpdateAccount}
                canEditAccount={can(currentUser, ACTION.ACCOUNT_EDIT)}
                canCreateLead={can(currentUser, ACTION.LEAD_CREATE)}
                onSelectLead={(l) => {
                  openLead(l, 'leads');
                  setActiveModule('leads');
                }}
                onOpenCreateModal={(type, acc = null) => openCreateModal(type, { targetAccount: acc || selectedAccount })}
                onNavigateToLeads={() => goToModule('leads')}
              />
            ) : (
              <>
                {moduleId === 'dashboard' && (
                  <DashboardView
                    leads={leads}
                    accounts={accounts}
                    activities={activities}
                    salesHeads={salesHeads}
                    salesExecutives={salesExecutives}
                    onNavigateToLeads={handleNavigateToLeads}
                    onNavigateToAccounts={() => goToModule('accounts', true)}
                    onNavigateToActivities={handleNavigateToActivities}
                    onSelectLead={(lead) => openLead(lead, 'dashboard')}
                    onSelectAccount={(comp) => handleSelectAccountByCompany(comp, 'dashboard', 'Leads')}
                    searchQuery={searchQuery}
                    selectedDateFilter={selectedDateFilter}
                    selectedOwnerFilter={selectedOwnerFilter}
                  />
                )}

                {moduleId === 'salesHead' && (
                  <SalesHeadView
                    salesHeads={salesHeads}
                    salesExecutives={salesExecutives}
                    onUpdateSalesExecutives={guardedSetter(ACTION.TEAM_MANAGE, setSalesExecutives)}
                    onTriggerToast={triggerToast}
                    onNavigateToLead={(lead) => openLead(lead, 'salesHead')}
                    currentUser={currentUser}
                  />
                )}

                {moduleId === 'salesExecutive' && (
                  <SalesExecutiveView
                    salesExecutives={salesExecutives}
                    salesHeads={salesHeads}
                    onUpdateSalesExecutives={guardedSetter(ACTION.TEAM_MANAGE, setSalesExecutives)}
                    onTriggerToast={triggerToast}
                    onNavigateToLead={(lead) => openLead(lead, 'salesExecutive')}
                    currentUser={currentUser}
                  />
                )}

                {moduleId === 'leads' && (
                  <LeadsView
                    leads={leads}
                    salesHeads={salesHeads}
                    salesExecutives={salesExecutives}
                    currentUser={currentUser}
                    onUpdateLead={handleUpdateLead}
                    onDeleteLead={handleDeleteLead}
                    onTriggerToast={triggerToast}
                    onSelectLead={(lead) => openLead(lead, 'leads')}
                    onOpenCreateModal={(type = 'createLead', targetLead = null, bulkIds = [], onComplete = null, lockType = true) =>
                      openCreateModal(type, { targetLead, bulkIds, onComplete, lockType })}
                    searchQuery={searchQuery}
                    selectedDateFilter={selectedDateFilter}
                    selectedOwnerFilter={selectedOwnerFilter}
                    sourceFilter={leadsSourceFilter}
                    overdueOnlyFilter={leadsOverdueOnly}
                    onClearFilters={() => {
                      setLeadsSourceFilter('');
                      setLeadsOverdueOnly(false);
                    }}
                    fromDashboard={fromDashboard}
                    onBackToDashboard={handleBackToDashboard}
                  />
                )}

                {moduleId === 'accounts' && (
                  <AccountsView
                    accounts={accounts}
                    onSelectAccount={(acc) => openAccount(acc, 'accounts')}
                    searchQuery={searchQuery}
                    selectedDateFilter={selectedDateFilter}
                    selectedOwnerFilter={selectedOwnerFilter}
                    fromDashboard={fromDashboard}
                    onBackToDashboard={handleBackToDashboard}
                  />
                )}

                {moduleId === 'activities' && (
                  <ActivitiesView
                    activities={visibleActivities}
                    searchQuery={searchQuery}
                    selectedDateFilter={selectedDateFilter}
                    fromDashboard={fromDashboard}
                    onBackToDashboard={handleBackToDashboard}
                    initialTab={activitiesInitialTab}
                    onSelectLead={handleSelectActivityTarget}
                    onSelectAccount={(companyName) => {
                      const acc = findAccountByCompany(accounts, companyName);
                      if (acc) openAccount(acc, 'activities');
                    }}
                  />
                )}

                {moduleId === 'contacts' && (
                  <ContactsView
                    contacts={contacts}
                    onSelectAccount={handleSelectContactAccount}
                    searchQuery={searchQuery}
                    selectedDateFilter={selectedDateFilter}
                    selectedOwnerFilter={selectedOwnerFilter}
                  />
                )}

                {moduleId === 'masterData' && (
                  <MasterDataView
                    searchQuery={searchQuery}
                    fromDashboard={fromDashboard}
                    onBackToDashboard={handleBackToDashboard}
                    onTriggerToast={triggerToast}
                    emailTemplates={emailTemplates}
                    onUpdateEmailTemplates={guardedSetter(ACTION.MASTER_DATA_MANAGE, setEmailTemplates)}
                  />
                )}

                {moduleId === 'heatmap' && (
                  <HeatmapView
                    onSelectLead={(lead) => openLead(lead, 'leads')}
                  />
                )}

                {moduleId === 'social' && (
                  <SocialAnalyticsView
                    onSelectLead={(lead) => openLead(lead, 'leads')}
                  />
                )}

                {moduleId === 'integrations' && (
                  <IntegrationsView
                    integrations={integrations}
                    leads={leads}
                    salesHeads={salesHeads}
                    salesExecutives={salesExecutives}
                    onUpdateIntegration={handleUpdateIntegration}
                    onSendTestLead={handleSendTestLead}
                    onSelectLead={(lead) => openLead(lead, 'leads')}
                    initialTab="connectors"
                  />
                )}
              </>
            )}
            </ErrorBoundary>
          </main>
        </div>

        {/* Common Create Modal */}
        <CommonActionsModal
          isOpen={createModal.isOpen}
          onClose={closeCreateModal}
          onSave={(type, data) => {
            handleSaveAction(type, data);
            if (typeof createModal.bulkCallback === 'function') {
              createModal.bulkCallback();
            }
            closeCreateModal();
          }}
          initialType={createModal.initialType}
          lockType={createModal.lockType}
          selectedLead={createModal.targetLead || selectedLead}
          selectedAccount={createModal.targetAccount || selectedAccount}
          bulkLeadIds={createModal.bulkLeadIds}
          leads={visibleLeads}
          accounts={accounts}
          currentUser={currentUser}
          emailTemplates={emailTemplates}
        />

        {/* Logout Confirmation Pop-up Modal with Smooth Animation */}
        <LogoutConfirmModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleConfirmLogout}
          user={currentUser}
        />

        {/* New Company Details Prompt Modal */}
        <NewCompanyPromptModal
          isOpen={Boolean(newCompanyPrompt)}
          companyName={newCompanyPrompt?.companyName || ''}
          onClose={() => setNewCompanyPrompt(null)}
          onConfirm={() => {
            const targetAcc = newCompanyPrompt?.account;
            setNewCompanyPrompt(null);
            if (targetAcc) {
              openAccount(targetAcc, 'leads');
              setActiveModule('accounts');
            }
          }}
        />

        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </div>
    </MotionConfig>
  );
}
