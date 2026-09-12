import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animateViewTransition } from './utils/animations';
import Sidebar from './components/Sidebar';
import GlobalHeader from './components/GlobalHeader';
import CommonActionsModal from './components/CommonActionsModal';
import LogoutConfirmModal from './components/LogoutConfirmModal';
import NewCompanyPromptModal from './components/NewCompanyPromptModal';
import CallSessionModal from './components/CallSessionModal';

// Views
import DashboardView from './views/DashboardView';
import LeadsView from './views/LeadsView';
import AccountsView from './views/AccountsView';
import OpportunitiesView from './views/OpportunitiesView';
import ActivitiesView from './views/ActivitiesView';
import ProposalsView from './views/ProposalsView';
import ContactsView from './views/ContactsView';
import MasterDataView from './views/MasterDataView';
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
  INITIAL_OPPORTUNITIES,
  INITIAL_PROPOSALS,
  INITIAL_CONTACTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_EMAIL_TEMPLATES
} from './data/mockData';
import { LuCircleCheck, LuX, LuTriangleAlert, LuCircleAlert, LuInfo } from 'react-icons/lu';
import { getInitialStageHistory } from './utils/pipelineUtils';
import { getTodayISO, getFutureISO } from './utils/dateUtils';

const DATA_VERSION = 'v3.9_filter_fixes';

// Clean atomic migration on DATA_VERSION change
if (typeof window !== 'undefined') {
  try {
    const currentVer = localStorage.getItem('techgy_data_version');
    if (currentVer !== DATA_VERSION) {
      const keysToRemove = [
        'techgy_leads', 'techgy_accounts', 'techgy_opportunities',
        'techgy_activities', 'techgy_proposals', 'techgy_contacts',
        'techgy_notifications'
      ];
      keysToRemove.forEach(k => localStorage.removeItem(k));
      localStorage.setItem('techgy_data_version', DATA_VERSION);
    }
  } catch {}
}

function loadFromStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(`techgy_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`techgy_${key}`, JSON.stringify(data));
  } catch { }
}

function createGeneratedAccount(companyName, overrides = {}) {
  const comp = companyName || 'Enterprise Account';
  return {
    id: `ACC-GEN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    companyName: comp,
    industry: overrides.industry !== undefined ? overrides.industry : '',
    companySize: overrides.companySize !== undefined ? overrides.companySize : '',
    website: overrides.website !== undefined ? overrides.website : '',
    location: overrides.location !== undefined ? overrides.location : '',
    accountOwner: overrides.accountOwner || 'Unassigned',
    estimatedAccountValue: overrides.estimatedAccountValue !== undefined ? overrides.estimatedAccountValue : '',
    leadsCount: overrides.leadsCount !== undefined ? overrides.leadsCount : 1,
    contactsCount: overrides.contactsCount !== undefined ? overrides.contactsCount : 0,
    oppsCount: overrides.oppsCount !== undefined ? overrides.oppsCount : 0,
    proposalsCount: overrides.proposalsCount !== undefined ? overrides.proposalsCount : 0,
    ...overrides
  };
}

export default function App() {
  // Authentication State (Default to logged in on refresh; support ?view=forgot or ?view=login)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('view');
      if (param === 'forgot' || param === 'login') return false;
    }
    const saved = localStorage.getItem('techgy_authenticated');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('techgy_user');
    return saved ? JSON.parse(saved) : { role: 'Sales Admin', email: 'admin@techgy.com', name: 'System Administrator' };
  });

  // Navigation & Collapsible Sidebar State
  const [activeModule, setActiveModule] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Global Header Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('This Month');
  const [selectedOwnerFilter, setSelectedOwnerFilter] = useState('All Owners');

  // Relational Data State (Hydrated from localStorage with mock fallback)
  const [leads, setLeads] = useState(() => loadFromStorage('leads', INITIAL_LEADS));
  const [accounts, setAccounts] = useState(() => loadFromStorage('accounts', INITIAL_ACCOUNTS));
  const [activities, setActivities] = useState(() => loadFromStorage('activities', INITIAL_ACTIVITIES));
  const [opportunities, setOpportunities] = useState(() => loadFromStorage('opportunities', INITIAL_OPPORTUNITIES));
  const [proposals, setProposals] = useState(() => loadFromStorage('proposals', INITIAL_PROPOSALS));
  const [contacts, setContacts] = useState(() => loadFromStorage('contacts', INITIAL_CONTACTS));
  const [notifications, setNotifications] = useState(() => loadFromStorage('notifications', INITIAL_NOTIFICATIONS));
  const [emailTemplates, setEmailTemplates] = useState(() => loadFromStorage('email_templates', INITIAL_EMAIL_TEMPLATES));
  const [toastMessage, setToastMessage] = useState(null);

  // Automatically synchronize state changes to localStorage
  useEffect(() => { saveToStorage('leads', leads); }, [leads]);
  useEffect(() => { saveToStorage('accounts', accounts); }, [accounts]);
  useEffect(() => { saveToStorage('activities', activities); }, [activities]);
  useEffect(() => { saveToStorage('opportunities', opportunities); }, [opportunities]);
  useEffect(() => { saveToStorage('proposals', proposals); }, [proposals]);
  useEffect(() => { saveToStorage('contacts', contacts); }, [contacts]);
  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);
  useEffect(() => { saveToStorage('email_templates', emailTemplates); }, [emailTemplates]);

  // Auto-dismiss toast pop-up notification after 5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const opportunitiesRef = useRef(opportunities);
  useEffect(() => {
    opportunitiesRef.current = opportunities;
  }, [opportunities]);

  // Recompute overdue and dueToday status at runtime
  useEffect(() => {
    const checkOverdueLeads = () => {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      setLeads(prevLeads => {
        let hasChanged = false;
        const updated = prevLeads.map(lead => {
          if (!lead.nextFollowup) return lead;

          let nextFollowup = lead.nextFollowup;
          // Keep default designated 'Today' mock leads anchored to the current calendar day
          if (lead.id === 'LD-201' && !lead.customFollowupSet) {
            nextFollowup = `${todayStr} 15:30`;
          } else if (lead.id === 'LD-203' && !lead.customFollowupSet) {
            nextFollowup = `${todayStr} 16:30`;
          } else if (lead.id === 'LD-206' && !lead.customFollowupSet) {
            nextFollowup = `${todayStr} 17:00`;
          } else if (lead.id === 'LD-207' && !lead.customFollowupSet) {
            nextFollowup = `${todayStr} 18:00`;
          }

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
  }, []);

  // Dedicated Full Page Selection States (Replaces side drawers)
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [fromDashboard, setFromDashboard] = useState(false);
  const [leadNavSource, setLeadNavSource] = useState('leads');
  const [accountInitialTab, setAccountInitialTab] = useState('Leads');

  // Create & Logout Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalInitialType, setModalInitialType] = useState('createLead');
  const [modalBulkLeadIds, setModalBulkLeadIds] = useState([]);
  const [modalTargetLead, setModalTargetLead] = useState(null);
  const [modalTargetAccount, setModalTargetAccount] = useState(null);
  const [modalBulkCallback, setModalBulkCallback] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [newCompanyPrompt, setNewCompanyPrompt] = useState(null);

  // Interactive Voice Calling Session State
  const [callSession, setCallSession] = useState(null);
  // { lead, status: 'confirming' | 'ringing' | 'connected', isMinimized, durationSeconds, isMuted, isOnHold, notes }

  // Interactive View Filter State
  const [leadsSourceFilter, setLeadsSourceFilter] = useState('');
  const [leadsOverdueOnly, setLeadsOverdueOnly] = useState(false);
  const [activitiesInitialTab, setActivitiesInitialTab] = useState('All');

  const handleOpenProfile = () => {
    setSelectedLead(null);
    setSelectedAccount(null);
    setIsProfileActive(true);
    setFromDashboard(false);
  };

  const triggerToast = (payload, descOrType = '') => {
    let title = '';
    let description = '';
    let type = 'success';

    if (typeof payload === 'object' && payload !== null) {
      title = payload.title || '';
      description = payload.description || '';
      type = payload.type || 'success';
    } else if (typeof payload === 'string') {
      if (['success', 'warning', 'error', 'info'].includes(descOrType)) {
        type = descOrType;
        title = payload;
        description = '';
      } else if (descOrType) {
        title = payload;
        description = descOrType;
      } else if (payload.includes(': ')) {
        const [t, ...rest] = payload.split(': ');
        title = t;
        description = rest.join(': ');
      } else {
        title = payload;
      }
    }
    setToastMessage({ title, description, type });
  };

  const pushNotification = (title, message, category = 'Lead', targetModule = 'leads') => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      category,
      isRead: false,
      priority: 'Normal',
      targetModule
    };
    setNotifications(prev => [newNotif, ...prev]);
    triggerToast(`${title}: ${message}`);
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
    setSelectedLead(null);
    setSelectedAccount(null);
    setIsProfileActive(false);
    setFromDashboard(false);
    if (notif.targetModule) {
      setActiveModule(notif.targetModule);
    }
  };

  // Cross-Navigation Handlers (Dashboard Interactions & Session Management)
  const handleRequestLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.setItem('techgy_authenticated', JSON.stringify(false));
    localStorage.removeItem('techgy_user');
    setSelectedLead(null);
    setSelectedAccount(null);
    setIsProfileActive(false);
    setActiveModule('dashboard');
    triggerToast('Logged out of TechGy Link', 'Session ended safely');
  };
  const handleNavigateToLeads = (source = '', overdue = false) => {
    setSelectedLead(null);
    setSelectedAccount(null);
    setIsProfileActive(false);
    setFromDashboard(true);
    if (source === 'OVERDUE') {
      setLeadsOverdueOnly(true);
      setLeadsSourceFilter('');
    } else {
      setLeadsSourceFilter(source);
      setLeadsOverdueOnly(overdue);
    }
    setActiveModule('leads');
  };

  const handleNavigateToAccounts = () => {
    setSelectedLead(null);
    setSelectedAccount(null);
    setIsProfileActive(false);
    setFromDashboard(true);
    setActiveModule('accounts');
  };

  const handleNavigateToActivities = (tab = 'Follow-up') => {
    setSelectedLead(null);
    setSelectedAccount(null);
    setIsProfileActive(false);
    setFromDashboard(true);
    setActivitiesInitialTab(tab);
    setActiveModule('activities');
  };

  const handleSelectModule = (mod) => {
    setSelectedLead(null);
    setSelectedAccount(null);
    setIsProfileActive(false);
    setFromDashboard(false);
    setActivitiesInitialTab('All');
    setActiveModule(mod);
  };

  // Universal Search Result Navigation Handler
  const handleSelectSearchResult = (category, item) => {
    setIsProfileActive(false);
    setFromDashboard(false);
    if (category === 'lead') {
      setLeadNavSource('leads');
      setSelectedAccount(null);
      setSelectedLead(item);
      setActiveModule('leads');
    } else if (category === 'account') {
      setLeadNavSource('accounts');
      setAccountInitialTab('Leads');
      setSelectedLead(null);
      const fullAcc = accounts.find(a => a.companyName.toLowerCase() === item.companyName.toLowerCase()) || item;
      setSelectedAccount(fullAcc);
      setActiveModule('accounts');
    } else if (category === 'opportunity') {
      setSelectedLead(null);
      setSelectedAccount(null);
      setActiveModule('opportunities');
    } else if (category === 'proposal') {
      setSelectedLead(null);
      setSelectedAccount(null);
      setActiveModule('proposals');
    } else if (category === 'contact') {
      setSelectedLead(null);
      const parentAcc = accounts.find(a => a.companyName.toLowerCase() === item.company.toLowerCase());
      if (parentAcc) {
        setLeadNavSource('contacts');
        setAccountInitialTab('Contacts');
        setSelectedAccount(parentAcc);
      }
      setActiveModule('contacts');
    } else if (category === 'activity') {
      setSelectedLead(null);
      setSelectedAccount(null);
      setActiveModule('activities');
    }
  };

  // Voice Calling Flow Handlers
  const handleInitiateCall = (targetLead) => {
    if (!targetLead) return;
    setCallSession({
      lead: targetLead,
      status: 'confirming',
      isMinimized: false,
      durationSeconds: 0,
      isMuted: false,
      isOnHold: false,
      notes: ''
    });
  };

  const handleConfirmCall = () => {
    setCallSession(prev => prev ? { ...prev, status: 'ringing' } : null);
  };

  const handleCancelCallConfirmation = () => {
    setCallSession(null);
  };

  const handleSimulatePickup = () => {
    setCallSession(prev => prev ? { ...prev, status: 'connected', durationSeconds: 0 } : null);
  };

  const handleToggleCallMinimize = () => {
    setCallSession(prev => prev ? { ...prev, isMinimized: !prev.isMinimized } : null);
  };

  const handleToggleCallMute = () => {
    setCallSession(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null);
  };

  const handleToggleCallHold = () => {
    setCallSession(prev => prev ? { ...prev, isOnHold: !prev.isOnHold } : null);
  };

  const handleUpdateCallNotes = (notes) => {
    setCallSession(prev => prev ? { ...prev, notes } : null);
  };

  const handleEndCall = () => {
    if (!callSession || !callSession.lead) {
      setCallSession(null);
      return;
    }

    const { lead, durationSeconds, notes } = callSession;
    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    const formattedDuration = `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;

    // Save call to CRM activities
    handleSaveAction('call', {
      notes: notes || `Voice call completed (${formattedDuration}). Discussed requirements.`,
      outcome: durationSeconds > 0 ? 'Connected - Discussion' : 'Attempted / No Answer',
      duration: formattedDuration,
      targetLeadId: lead.id
    });

    setCallSession(null);
  };

  // Ringing auto-pickup & live duration timer
  useEffect(() => {
    let timer = null;
    let pickupTimer = null;

    if (callSession?.status === 'ringing') {
      pickupTimer = setTimeout(() => {
        setCallSession(prev => prev ? { ...prev, status: 'connected', durationSeconds: 0 } : null);
      }, 2600);
    }

    if (callSession?.status === 'connected' && !callSession.isOnHold) {
      timer = setInterval(() => {
        setCallSession(prev => prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (pickupTimer) clearTimeout(pickupTimer);
    };
  }, [callSession?.status, callSession?.isOnHold]);

  // Quick Action Handler
  const handleQuickAction = (actionType, lead) => {
    if (actionType === 'convertOpportunity') {
      const newOpp = {
        id: `OPP-${Date.now()}`,
        accountName: lead.company,
        opportunityName: `${lead.company} CRM Expansion Opportunity`,
        score: 75,
        visualLevel: 'Medium',
        estimatedValue: '₹1,20,00,000',
        probability: '60%',
        expectedClosureDate: getFutureISO(30),
        createdDate: getTodayISO(),
        currentStage: 'Qualified',
        owner: lead.leadOwner
      };
      setOpportunities([newOpp, ...opportunities]);
      pushNotification('Opportunity Converted', `Lead "${lead.leadName}" (${lead.company}) converted to Opportunity!`, 'Opportunity', 'opportunities');
      setSelectedLead(null);
      setActiveModule('opportunities');
    } else if (actionType === 'call') {
      handleInitiateCall(lead);
    } else {
      setModalInitialType(actionType);
      setSelectedLead(lead);
      setIsCreateModalOpen(true);
    }
  };

  const handleUpdateLeadStage = (leadId, newStage) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const updateLeadWithHistory = (l) => {
      const fromStage = l.status || 'New';
      if (fromStage === newStage) return l;

      const existingHistory = Array.isArray(l.stageHistory) && l.stageHistory.length > 0
        ? [...l.stageHistory]
        : getInitialStageHistory(l);

      const newHistoryItem = {
        id: `STG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'stage_change',
        fromStage,
        toStage: newStage,
        title: `Lead status changed ${fromStage} → ${newStage}`,
        timestamp: now.toISOString(),
        date: formattedDate,
        updatedBy: currentUser?.name || l.leadOwner || 'Rajesh Sharma',
        notes: `Pipeline stage transitioned from "${fromStage}" to "${newStage}".`
      };
      return {
        ...l,
        status: newStage,
        stageHistory: [...existingHistory, newHistoryItem]
      };
    };

    setLeads(prev => prev.map(l => l.id === leadId ? updateLeadWithHistory(l) : l));
    setSelectedLead(prev => prev && prev.id === leadId ? updateLeadWithHistory(prev) : prev);
    triggerToast({
      title: 'Lead Stage Updated',
      description: `Lead moved to "${newStage}" stage.`,
      type: 'success'
    });
    pushNotification('Lead Stage Updated', `Lead status updated to ${newStage}`, 'Lead', 'leads');
  };

  const handleUpdateLead = (leadId, updatedFields) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, ...updatedFields };
      }
      return l;
    }));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, ...updatedFields }));
    }
    triggerToast({
      title: 'Lead Details Updated',
      description: `Details for "${updatedFields.leadName || selectedLead?.leadName || 'Lead'}" saved successfully.`,
      type: 'success'
    });
    pushNotification('Lead Details Updated', `Updated information for lead "${updatedFields.leadName || selectedLead?.leadName}"`, 'Lead', 'leads');
  };

  const handleUpdateAccount = (accountId, updatedFields) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return { ...acc, ...updatedFields };
      }
      return acc;
    }));
    if (selectedAccount && selectedAccount.id === accountId) {
      setSelectedAccount(prev => ({ ...prev, ...updatedFields }));
    }
    triggerToast({
      title: 'Company Profile Updated',
      description: 'The company details have been successfully saved.',
      type: 'success'
    });
  };

  // Navigate directly to Account (Company) full page detail view
  const handleSelectAccountByCompany = (companyInput, source = 'opportunities', initialTab = 'Opportunities') => {
    const companyName = typeof companyInput === 'string' ? companyInput : (companyInput?.company || companyInput?.companyName || companyInput?.accountName);
    if (!companyName) return;

    let fullAcc = accounts.find(a =>
      a.companyName.toLowerCase() === companyName.toLowerCase() ||
      a.companyName.toLowerCase().includes(companyName.toLowerCase()) ||
      companyName.toLowerCase().includes(a.companyName.toLowerCase())
    );

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

    if (fullAcc) {
      setLeadNavSource(source);
      setAccountInitialTab(initialTab);
      setSelectedLead(null);
      setSelectedAccount(fullAcc);
      setIsProfileActive(false);
      setActiveModule('accounts');
    }
  };

  const handleNavigateToCompanyAccount = (companyName) => {
    handleSelectAccountByCompany(companyName, 'leads', 'Leads');
  };

  // Common Action Save Handler
  const handleSaveAction = (type, formData) => {
    const isLeadScoped = ['addNote', 'assignOwner', 'changeStatus', 'scheduleFollowup', 'call', 'email', 'sms'].includes(type);
    const targetLead = modalTargetLead || selectedLead || leads.find(l => l.id === formData.targetLeadId);

    if (isLeadScoped && !targetLead) {
      triggerToast({ title: 'No Lead Selected', description: 'Please select a target lead before continuing.', type: 'warning' });
      return;
    }

    if (type === 'createOpportunity') {
      const closeDateFormatted = formData.closeDate || getFutureISO(30);
      const oppTitle = formData.opportunityName || `${formData.company || 'Enterprise'} Opportunity`;
      const compName = formData.company || 'Enterprise Client';
      const probVal = formData.probability ? (formData.probability.includes('%') ? formData.probability : `${formData.probability}%`) : '60%';

      const newOppObj = {
        id: `OPP-${Date.now()}`,
        opportunityName: oppTitle,
        accountName: compName,
        estimatedValue: formData.estimatedValue || '₹50.00 Lakh',
        currentStage: formData.currentStage || 'Qualified',
        probability: probVal,
        expectedClosureDate: closeDateFormatted,
        createdDate: getTodayISO(),
        owner: formData.owner || currentUser?.name || 'Unassigned',
        score: 80,
        visualLevel: 'High'
      };

      setOpportunities([newOppObj, ...opportunities]);
      pushNotification('New Opportunity Created', `Opportunity "${oppTitle}" created for ${compName}`, 'Opportunity', 'opportunities');
      triggerToast(`Opportunity "${oppTitle}" created`, 'success');

      // Ensure Account exists or increment its opp count
      const existingAcc = accounts.find(a => a.companyName.toLowerCase() === compName.toLowerCase());
      if (!existingAcc) {
        const newAcc = createGeneratedAccount(compName, {
          accountOwner: formData.owner || currentUser?.name || 'Unassigned',
          estimatedAccountValue: formData.estimatedValue || '₹1,00,00,000',
          oppsCount: 1
        });
        setAccounts([newAcc, ...accounts]);
      } else {
        setAccounts(accounts.map(a => a.id === existingAcc.id ? { ...a, oppsCount: (a.oppsCount || 0) + 1 } : a));
      }
    } else if (type === 'createAccount') {
      const compName = formData.companyName || formData.company || 'Enterprise Client';
      const existingAcc = accounts.find(a => a.companyName.toLowerCase() === compName.toLowerCase());
      if (existingAcc) {
        triggerToast(`Company account "${compName}" already exists`, 'info');
        return;
      }
      const newAcc = createGeneratedAccount(compName, {
        accountOwner: formData.owner || currentUser?.name || 'Unassigned',
        industry: formData.industry || 'Technology & IT Services',
        companySize: formData.companySize || '51-200 employees',
        website: formData.website || `https://www.${compName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        location: formData.location || 'Mumbai, Maharashtra',
        estimatedAccountValue: formData.estimatedAccountValue || '₹50,00,000',
        primaryContact: formData.primaryContact || formData.leadName || 'Corporate Officer',
        tier: formData.tier || 'Strategic Enterprise',
        status: 'Active',
        notes: formData.notes || ''
      });
      setAccounts([newAcc, ...accounts]);
      pushNotification('New Company Account Created', `Company account "${compName}" registered in CRM`, 'Account', 'accounts');
      triggerToast(`Company account "${compName}" created`, 'success');
    } else if (type === 'createLead') {
      const dueDateVal = formData.dueDate || getTodayISO();
      const followupTs = new Date(`${dueDateVal} 10:00`.replace(' ', 'T')).getTime();
      const isDueToday = dueDateVal.startsWith(getTodayISO());
      const isDueOverdue = !isDueToday && !isNaN(followupTs) && followupTs < Date.now();
      const newLeadObj = {
        id: `LD-${Date.now()}`,
        leadName: formData.leadName,
        phoneNumber: formData.phone || '+91 98765 00000',
        emailId: formData.email || 'lead@example.co.in',
        company: formData.company,
        designation: formData.designation || 'Manager',
        leadSource: formData.leadSource || 'Website',
        status: formData.status || 'New',
        leadOwner: formData.owner || currentUser?.name || 'Unassigned',
        priority: formData.priority || 'Medium',
        createdDate: getTodayISO(),
        lastActivity: 'New lead record created in CRM',
        nextFollowup: `${dueDateVal} 10:00`,
        dueToday: isDueToday,
        isOverdue: isDueOverdue,
        notes: formData.notes || '',
        nextAction: formData.notes || ''
      };
      setLeads([newLeadObj, ...leads]);
      pushNotification('New Lead Created', `Lead "${formData.leadName}" created for ${formData.company}`, 'Lead', 'leads');
      triggerToast(`Lead "${formData.leadName}" created`, 'success');

      // Ensure Account exists
      const existingAcc = accounts.find(a => a.companyName.toLowerCase() === formData.company.toLowerCase());
      if (!existingAcc) {
        const newAcc = createGeneratedAccount(formData.company, {
          accountOwner: formData.owner || currentUser?.name || 'Unassigned',
          leadsCount: 1,
          industry: '',
          companySize: '',
          website: '',
          location: '',
          estimatedAccountValue: ''
        });
        setAccounts([newAcc, ...accounts]);
        setNewCompanyPrompt({ companyName: formData.company, account: newAcc });
      }
    } else if (type === 'addNote') {
      const noteText = formData.notes || 'Note added to lead record';
      const updatedNotes = `${targetLead.notes || ''}\n• ${noteText}`;
      const lastAct = `Note added: ${noteText.slice(0, 35)}...`;
      const updatedLeads = leads.map(l => l.id === targetLead.id ? { ...l, notes: updatedNotes, lastActivity: lastAct } : l);
      setLeads(updatedLeads);
      if (selectedLead && selectedLead.id === targetLead.id) {
        setSelectedLead({ ...selectedLead, notes: updatedNotes, lastActivity: lastAct });
      }
      pushNotification('Note Added', `Added note to lead ${targetLead.leadName}`, 'Lead', 'leads');
      triggerToast(`Note added to ${targetLead.leadName}`, 'success');
    } else if (type === 'assignOwner') {
      const newOwner = formData.owner || currentUser?.name || 'Unassigned';
      const targetIds = formData.bulkLeadIds || (targetLead ? [targetLead.id] : []);
      const targetIdSet = new Set(targetIds);
      const updatedLeads = leads.map(l => targetIdSet.has(l.id) ? { ...l, leadOwner: newOwner } : l);
      setLeads(updatedLeads);
      if (selectedLead && targetIdSet.has(selectedLead.id)) {
        setSelectedLead({ ...selectedLead, leadOwner: newOwner });
      }
      const count = targetIds.length;
      const msg = count > 1 ? `Assigned ${count} leads to ${newOwner}` : `Assigned ${targetLead?.leadName || 'lead'} to ${newOwner}`;
      pushNotification('Owner Reassigned', msg, 'Lead', 'leads');
      triggerToast(msg, 'success');
    } else if (type === 'changeStatus') {
      const newStatus = formData.status || 'Contacted';
      const targetIds = formData.bulkLeadIds || (targetLead ? [targetLead.id] : []);
      const targetIdSet = new Set(targetIds);

      const now = new Date();
      const formattedDate = `${now.toISOString().split('T')[0]} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const applyStatusWithHistory = (l) => {
        const fromStage = l.status || 'New';
        if (fromStage === newStatus) return l;
        const existingHistory = Array.isArray(l.stageHistory) && l.stageHistory.length > 0
          ? [...l.stageHistory]
          : getInitialStageHistory(l);

        const newHistoryItem = {
          id: `STG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: 'stage_change',
          fromStage,
          toStage: newStatus,
          title: `Lead status changed ${fromStage} → ${newStatus}`,
          timestamp: now.toISOString(),
          date: formattedDate,
          updatedBy: currentUser?.name || l.leadOwner || 'Rajesh Sharma',
          notes: `Pipeline stage transitioned from "${fromStage}" to "${newStatus}".`
        };
        return {
          ...l,
          status: newStatus,
          stageHistory: [...existingHistory, newHistoryItem]
        };
      };

      const updatedLeads = leads.map(l => targetIdSet.has(l.id) ? applyStatusWithHistory(l) : l);
      setLeads(updatedLeads);
      if (selectedLead && targetIdSet.has(selectedLead.id)) {
        setSelectedLead(applyStatusWithHistory(selectedLead));
      }
      const count = targetIds.length;
      const msg = count > 1 ? `Updated stage to "${newStatus}" for ${count} leads` : `Status for ${targetLead?.leadName || 'lead'} changed to "${newStatus}"`;
      pushNotification('Status Updated', msg, 'Lead', 'leads');
      triggerToast(msg, 'success');
    } else if (type === 'scheduleFollowup') {
      const dateFormatted = formData.dueDate ? formData.dueDate.replace('T', ' ') : `${getTodayISO()} 11:00`;
      const isDueToday = formData.dueDate ? formData.dueDate.startsWith(getTodayISO()) : true;
      const parsedFollowupDate = new Date(dateFormatted.replace(' ', 'T')).getTime();
      const isFollowupOverdue = !isDueToday && !isNaN(parsedFollowupDate) && parsedFollowupDate < Date.now();
      const nextActionText = formData.nextAction || 'Follow-up scheduled';

      const updatedLeads = leads.map(l => l.id === targetLead.id ? {
        ...l,
        nextFollowup: dateFormatted,
        nextAction: nextActionText,
        dueToday: isDueToday,
        isOverdue: isFollowupOverdue,
        customFollowupSet: true
      } : l);
      setLeads(updatedLeads);
      if (selectedLead && selectedLead.id === targetLead.id) {
        setSelectedLead({
          ...selectedLead,
          nextFollowup: dateFormatted,
          nextAction: nextActionText,
          dueToday: isDueToday,
          isOverdue: isFollowupOverdue,
          customFollowupSet: true
        });
      }

      const newAct = {
        id: `ACT-${Date.now()}`,
        type: 'Follow-up',
        date: dateFormatted,
        owner: targetLead.leadOwner || currentUser?.name || 'Unassigned',
        company: targetLead.company,
        lead: targetLead.leadName,
        status: 'Scheduled',
        notes: nextActionText,
        dueToday: isDueToday,
        isOverdue: isFollowupOverdue
      };
      setActivities([newAct, ...activities]);
      pushNotification('Follow-up Scheduled', `Scheduled follow-up for ${targetLead.leadName} on ${dateFormatted}`, 'Activity', 'activities');
      triggerToast(`Follow-up scheduled for ${targetLead.leadName}`, 'success');
    } else if (type === 'call') {
      const callNotes = formData.notes || 'Call completed with lead';
      const outcome = formData.outcome || 'Connected - Positive';
      const duration = formData.duration || '15 mins';

      const newAct = {
        id: `ACT-${Date.now()}`,
        type: 'Call',
        title: `Call: ${outcome}`,
        date: `${getTodayISO()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        duration,
        owner: targetLead.leadOwner || currentUser?.name || 'Unassigned',
        company: targetLead.company,
        lead: targetLead.leadName,
        outcome,
        notes: callNotes,
        status: 'Completed',
        isOverdue: false
      };
      setActivities([newAct, ...activities]);

      const lastAct = `Call logged: ${outcome} (${duration})`;
      const updatedLeads = leads.map(l => l.id === targetLead.id ? { ...l, lastActivity: lastAct } : l);
      setLeads(updatedLeads);
      if (selectedLead && selectedLead.id === targetLead.id) {
        setSelectedLead({ ...selectedLead, lastActivity: lastAct });
      }

      pushNotification('Call Logged', `Logged call with ${targetLead.leadName} (${outcome})`, 'Activity', 'activities');
      triggerToast(`Call recorded for ${targetLead.leadName}`, 'success');
    } else if (type === 'email') {
      const emailSubject = formData.subject || 'CRM Solution Follow-up';
      const emailNotes = formData.notes || 'Sent email communication to lead';
      const targetIds = formData.bulkLeadIds || (targetLead ? [targetLead.id] : []);
      const targetIdSet = new Set(targetIds);
      const targetLeadsList = leads.filter(l => targetIdSet.has(l.id));

      const newActivities = (targetLeadsList.length > 0 ? targetLeadsList : (targetLead ? [targetLead] : [])).map((tl, index) => ({
        id: `ACT-${Date.now()}-${index}`,
        type: 'Email',
        subject: emailSubject,
        date: `${getTodayISO()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        owner: tl.leadOwner || currentUser?.name || 'Unassigned',
        company: tl.company,
        lead: tl.leadName,
        notes: emailNotes,
        cc: formData.cc || '',
        status: 'Completed',
        isOverdue: false
      }));
      setActivities([...newActivities, ...activities]);

      const lastAct = `Email sent: ${emailSubject}`;
      const updatedLeads = leads.map(l => targetIdSet.has(l.id) ? { ...l, lastActivity: lastAct } : l);
      setLeads(updatedLeads);
      if (selectedLead && targetIdSet.has(selectedLead.id)) {
        setSelectedLead({ ...selectedLead, lastActivity: lastAct });
      }

      const count = targetIds.length;
      const msg = count > 1 ? `Email "${emailSubject}" sent to ${count} leads` : `Sent email "${emailSubject}" to ${targetLead?.leadName || 'lead'}`;
      pushNotification('Email Recorded', msg, 'Activity', 'activities');
      triggerToast(msg, 'success');
    } else if (type === 'sms') {
      const smsNotes = formData.notes || 'WhatsApp communication sent';

      const newAct = {
        id: `ACT-${Date.now()}`,
        type: 'SMS / WhatsApp',
        targetLeadId: targetLead.id,
        leadId: targetLead.id,
        title: 'WhatsApp Message',
        subject: 'WhatsApp Message',
        date: `${getTodayISO()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        owner: targetLead.leadOwner || currentUser?.name || 'Unassigned',
        company: targetLead.company,
        lead: targetLead.leadName,
        notes: smsNotes,
        shortPreview: smsNotes,
        status: 'Delivered',
        isOverdue: false
      };
      setActivities([newAct, ...activities]);

      const lastAct = 'WhatsApp message sent';
      const updatedLeads = leads.map(l => l.id === targetLead.id ? { ...l, lastActivity: lastAct } : l);
      setLeads(updatedLeads);
      if (selectedLead && selectedLead.id === targetLead.id) {
        setSelectedLead({ ...selectedLead, lastActivity: lastAct });
      }

      pushNotification('WhatsApp Logged', `WhatsApp message recorded for ${targetLead.leadName}`, 'Activity', 'activities');
      triggerToast(`WhatsApp message logged for ${targetLead.leadName}`, 'success');
    } else if (type === 'createActivity') {
      const newAct = {
        id: `ACT-${Date.now()}`,
        title: formData.nextAction || formData.notes || 'Engagement Activity',
        type: formData.activityType || formData.status || 'Meeting',
        company: formData.company || (targetLead ? targetLead.company : 'Reliance Cloud Solutions'),
        contactPerson: formData.leadName || (targetLead ? targetLead.leadName : 'Contact'),
        date: formData.dueDate || getTodayISO(),
        time: '14:30',
        status: 'Scheduled',
        owner: formData.owner || currentUser?.name || 'Unassigned',
        notes: formData.notes || 'Activity logged in CRM.'
      };
      setActivities([newAct, ...activities]);
      pushNotification('New Activity Scheduled', `Activity scheduled for ${newAct.company}`, 'Activity', 'activities');
      triggerToast(`Activity scheduled for ${newAct.company}`, 'success');
    } else if (type === 'createProposal') {
      const newProp = {
        id: `PROP-${Date.now()}`,
        title: formData.opportunityName || `${formData.company || 'Enterprise'} Solution Proposal`,
        company: formData.company || 'Enterprise Account',
        contactPerson: formData.leadName || (targetLead ? targetLead.leadName : 'Procurement Lead'),
        amount: formData.estimatedValue || '₹45,00,000',
        status: 'Draft',
        submissionDate: getTodayISO(),
        validUntil: formData.closeDate || getFutureISO(45),
        owner: formData.owner || currentUser?.name || 'Unassigned'
      };
      setProposals([newProp, ...proposals]);
      pushNotification('New Proposal Drafted', `Proposal drafted for ${newProp.company}`, 'Proposal', 'proposals');
      triggerToast(`Proposal drafted for ${newProp.company}`, 'success');
    } else if (type === 'createContact') {
      const newCont = {
        id: `CONT-${Date.now()}`,
        name: formData.leadName || 'New Contact',
        designation: formData.designation || 'Director',
        company: formData.company || (targetLead ? targetLead.company : 'Enterprise Account'),
        email: formData.email || 'contact@example.co.in',
        phone: formData.phone || '+91 98765 00000',
        owner: formData.owner || currentUser?.name || 'Unassigned'
      };
      setContacts([newCont, ...contacts]);
      pushNotification('New Contact Added', `Added ${newCont.name} to directory`, 'Contact', 'contacts');
      triggerToast(`Contact added: ${newCont.name}`, 'success');
    }
  };

  // Generate unique view key to trigger smooth CSS/GSAP page transition on every page change
  const currentViewKey = isProfileActive
    ? 'profile'
    : selectedLead
      ? `lead-${selectedLead.id}`
      : selectedAccount
        ? `account-${selectedAccount.id}`
        : activeModule;

  const contentRef = useRef(null);
  useEffect(() => {
    if (contentRef.current) {
      animateViewTransition(contentRef.current);
    }
  }, [currentViewKey]);

  // Unauthenticated view screen
  if (!isAuthenticated) {
    return (
      <LoginView
        onLoginSuccess={(user) => {
          setIsAuthenticated(true);
          setCurrentUser(user);
          localStorage.setItem('techgy_authenticated', JSON.stringify(true));
          localStorage.setItem('techgy_user', JSON.stringify(user));
          setToastMessage(`Welcome, ${user.name}! Connected to TechGy Link.`);
        }}
      />
    );
  }

  return (
    <div className="app-container">
      {/* 1. Fixed Left Sidebar */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={handleSelectModule}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenProfile={handleOpenProfile}
        currentUser={currentUser}
        overdueCount={leads.filter(l => l.isOverdue).length}
        tasksCount={activities.filter(a => a.status === 'Scheduled' || a.status === 'Pending' || a.dueToday).length}
      />

      {/* Main App Section */}
      <div className={`main-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* 2. Global Header with Live Universal Search */}
        <GlobalHeader
          activeModule={activeModule}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
          selectedOwnerFilter={selectedOwnerFilter}
          setSelectedOwnerFilter={setSelectedOwnerFilter}
          setMobileOpen={setMobileOpen}
          onOpenCreateModal={(type = (
            activeModule === 'accounts' ? 'createAccount' :
            activeModule === 'opportunities' ? 'createOpportunity' :
            activeModule === 'contacts' ? 'createContact' :
            activeModule === 'activities' ? 'createActivity' :
            activeModule === 'proposals' ? 'createProposal' : 'createLead'
          )) => {
            setModalInitialType(type);
            setModalTargetAccount(selectedAccount);
            setIsCreateModalOpen(true);
          }}
          leads={leads}
          accounts={accounts}
          opportunities={opportunities}
          proposals={proposals}
          contacts={contacts}
          activities={activities}
          onSelectSearchResult={handleSelectSearchResult}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAllNotifications}
          onSelectNotification={handleSelectNotification}
          onOpenProfile={handleOpenProfile}
          onLogout={handleRequestLogout}
        />

        {/* 3. Main Page Content with GSAP Transition */}
        <main className="content-body" key={currentViewKey} ref={contentRef}>
          {/* User Profile View */}
          {isProfileActive ? (
            <ProfileView
              currentUser={currentUser}
              onBack={() => setIsProfileActive(false)}
              onNavigateHome={() => {
                setIsProfileActive(false);
                setActiveModule('dashboard');
              }}
              leads={leads}
              accounts={accounts}
              opportunities={opportunities}
              onSelectLead={(lead) => {
                setIsProfileActive(false);
                setSelectedLead(lead);
              }}
              onSelectAccount={(acc) => {
                setIsProfileActive(false);
                setSelectedAccount(acc);
                setActiveModule('accounts');
              }}
              onLogout={handleRequestLogout}
            />
          ) : selectedLead ? (
            <LeadDetailView
              lead={selectedLead}
              activities={activities}
              onBack={() => setSelectedLead(null)}
              onNavigateHome={() => {
                setSelectedLead(null);
                setSelectedAccount(null);
                setActiveModule('dashboard');
              }}
              onQuickAction={handleQuickAction}
              onSaveAction={handleSaveAction}
              onNavigateToAccount={handleNavigateToCompanyAccount}
              navigationSource={leadNavSource}
              fromDashboard={fromDashboard}
              onNavigateToActivities={() => {
                setSelectedLead(null);
                setSelectedAccount(null);
                setActiveModule('activities');
              }}
              onNavigateToProposals={() => {
                setSelectedLead(null);
                setSelectedAccount(null);
                setActiveModule('proposals');
              }}
              onNavigateToContacts={() => {
                setSelectedLead(null);
                setSelectedAccount(null);
                setActiveModule('contacts');
              }}
              onNavigateToOpportunities={() => {
                setSelectedLead(null);
                setSelectedAccount(null);
                setActiveModule('opportunities');
              }}
              onUpdateLeadStage={handleUpdateLeadStage}
              onUpdateLead={handleUpdateLead}
              accounts={accounts}
            />
          ) : selectedAccount ? (
            /* Full Page Account Detail View with Breadcrumb Navigation */
            <AccountDetailView
              account={selectedAccount}
              initialTab={accountInitialTab}
              onBack={() => setSelectedAccount(null)}
              onNavigateHome={() => {
                setSelectedLead(null);
                setSelectedAccount(null);
                setActiveModule('dashboard');
              }}
              leads={leads}
              activities={activities}
              contacts={contacts}
              opportunities={opportunities}
              proposals={proposals}
              onUpdateAccount={handleUpdateAccount}
              onSelectLead={(l) => {
                setLeadNavSource('leads');
                setSelectedAccount(null);
                setSelectedLead(l);
                setActiveModule('leads');
              }}
              onOpenCreateModal={(type, acc = null) => {
                setModalInitialType(type);
                setModalTargetAccount(acc || selectedAccount);
                setIsCreateModalOpen(true);
              }}
              navigationSource={leadNavSource}
              fromDashboard={fromDashboard}
              onNavigateToActivities={() => {
                setSelectedLead(null);
                setSelectedAccount(null);
                setActiveModule('activities');
              }}
              onNavigateToProposals={() => {
                setSelectedLead(null);
                setSelectedAccount(null);
                setActiveModule('proposals');
              }}
              onNavigateToContacts={() => {
                setSelectedLead(null);
                setSelectedAccount(null);
                setActiveModule('contacts');
              }}
              onNavigateToOpportunities={() => {
                setSelectedLead(null);
                setSelectedAccount(null);
                setActiveModule('opportunities');
              }}
              onNavigateToLeads={() => {
                setSelectedLead(null);
                setSelectedAccount(null);
                setActiveModule('leads');
              }}
            />
          ) : (
            /* Main Dashboard & Standard Section Modules */
            <>
              {activeModule === 'dashboard' && (
                <DashboardView
                  leads={leads}
                  accounts={accounts}
                  activities={activities}
                  onNavigateToLeads={handleNavigateToLeads}
                  onNavigateToAccounts={handleNavigateToAccounts}
                  onNavigateToActivities={handleNavigateToActivities}
                  onSelectLead={(lead) => {
                    setLeadNavSource('dashboard');
                    setSelectedAccount(null);
                    setSelectedLead(lead);
                  }}
                  onSelectAccount={(comp) => handleSelectAccountByCompany(comp, 'dashboard', 'Leads')}
                  searchQuery={searchQuery}
                  selectedDateFilter={selectedDateFilter}
                  selectedOwnerFilter={selectedOwnerFilter}
                />
              )}

              {activeModule === 'leads' && (
                <LeadsView
                  leads={leads}
                  onSelectLead={(lead) => {
                    setLeadNavSource('leads');
                    setSelectedAccount(null);
                    setSelectedLead(lead);
                  }}
                  onSelectAccount={(comp) => handleSelectAccountByCompany(comp, 'leads', 'Leads')}
                  onOpenCreateModal={(type = 'createLead', targetLead = null, bulkIds = [], onComplete = null) => {
                    if (type === 'call' && targetLead) {
                      handleInitiateCall(targetLead);
                      return;
                    }
                    setModalInitialType(type);
                    setModalBulkLeadIds(bulkIds || []);
                    setModalTargetLead(targetLead);
                    setModalBulkCallback(() => onComplete);
                    setIsCreateModalOpen(true);
                  }}
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
                  onBackToDashboard={() => {
                    setFromDashboard(false);
                    setActiveModule('dashboard');
                  }}
                />
              )}

              {activeModule === 'accounts' && (
                <AccountsView
                  accounts={accounts}
                  onSelectAccount={(acc) => {
                    setLeadNavSource('accounts');
                    setAccountInitialTab('Leads');
                    setSelectedAccount(acc);
                  }}
                  searchQuery={searchQuery}
                  selectedDateFilter={selectedDateFilter}
                  selectedOwnerFilter={selectedOwnerFilter}
                  fromDashboard={fromDashboard}
                  onBackToDashboard={() => {
                    setFromDashboard(false);
                    setActiveModule('dashboard');
                  }}
                />
              )}

              {activeModule === 'opportunities' && (
                <OpportunitiesView
                  opportunities={opportunities}
                  onUpdateOpportunityStage={(oppId, newStage) => {
                    const targetOpp = opportunitiesRef.current.find(o => o.id === oppId);
                    if (targetOpp) {
                      pushNotification('Stage Updated', `Moved "${targetOpp.opportunityName}" to ${newStage}`, 'Opportunity', 'opportunities');
                    }
                    setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, currentStage: newStage } : o));
                  }}
                  onSelectAccount={(comp) => handleSelectAccountByCompany(comp, 'opportunities', 'Opportunities')}
                  searchQuery={searchQuery}
                  selectedDateFilter={selectedDateFilter}
                  selectedOwnerFilter={selectedOwnerFilter}
                  onOpenCreateModal={(type = 'createOpportunity') => {
                    setModalInitialType(type);
                    setIsCreateModalOpen(true);
                  }}
                  onTriggerToast={triggerToast}
                />
              )}

              {activeModule === 'activities' && (
                <ActivitiesView
                  activities={activities}
                  searchQuery={searchQuery}
                  selectedDateFilter={selectedDateFilter}
                  fromDashboard={fromDashboard}
                  onBackToDashboard={() => {
                    setFromDashboard(false);
                    setActiveModule('dashboard');
                  }}
                  initialTab={activitiesInitialTab}
                  onSelectLead={(leadName) => {
                    const matched = leads.find(l => l.leadName.toLowerCase() === leadName.toLowerCase() || l.leadName.toLowerCase().includes(leadName.toLowerCase()) || leadName.toLowerCase().includes(l.leadName.toLowerCase()));
                    if (matched) {
                      setLeadNavSource('activities');
                      setSelectedAccount(null);
                      setSelectedLead(matched);
                    } else {
                      const matchedAcc = accounts.find(a => a.companyName.toLowerCase() === leadName.toLowerCase() || a.companyName.toLowerCase().includes(leadName.toLowerCase()) || leadName.toLowerCase().includes(a.companyName.toLowerCase()));
                      if (matchedAcc) {
                        setLeadNavSource('activities');
                        setSelectedLead(null);
                        setSelectedAccount(matchedAcc);
                      }
                    }
                  }}
                  onSelectAccount={(companyName) => {
                    const matchedAcc = accounts.find(a => a.companyName.toLowerCase() === companyName.toLowerCase() || a.companyName.toLowerCase().includes(companyName.toLowerCase()) || companyName.toLowerCase().includes(a.companyName.toLowerCase()));
                    if (matchedAcc) {
                      setLeadNavSource('activities');
                      setSelectedLead(null);
                      setSelectedAccount(matchedAcc);
                    }
                  }}
                />
              )}

              {activeModule === 'proposals' && (
                <ProposalsView
                  proposals={proposals}
                  searchQuery={searchQuery}
                  selectedDateFilter={selectedDateFilter}
                  onSelectAccount={(companyName) => {
                    let fullAcc = accounts.find(a =>
                      a.companyName === companyName ||
                      a.companyName.toLowerCase().includes((companyName || '').toLowerCase()) ||
                      (companyName || '').toLowerCase().includes(a.companyName.toLowerCase())
                    );

                    if (!fullAcc && companyName) {
                      fullAcc = createGeneratedAccount(companyName, {
                        companySize: '500-1000 employees',
                        location: 'Mumbai HQ, India',
                        estimatedAccountValue: '₹1,80,00,000',
                        leadsCount: 1,
                        contactsCount: 1,
                        oppsCount: 1,
                        proposalsCount: 1
                      });
                    }

                    if (fullAcc) {
                      setLeadNavSource('proposals');
                      setAccountInitialTab('Proposals');
                      setSelectedAccount(fullAcc);
                    }
                  }}
                />
              )}

              {activeModule === 'contacts' && (
                <ContactsView
                  contacts={contacts}
                  onSelectAccount={(acc) => {
                    const companyName = typeof acc === 'string' ? acc : (acc.company || acc.companyName);
                    let fullAcc = accounts.find(a =>
                      a.companyName === companyName ||
                      a.companyName.toLowerCase().includes((companyName || '').toLowerCase()) ||
                      (companyName || '').toLowerCase().includes(a.companyName.toLowerCase())
                    );

                    if (!fullAcc && companyName) {
                      fullAcc = createGeneratedAccount(companyName, {
                        industry: 'Enterprise Software',
                        companySize: '500-1000 employees',
                        location: 'Mumbai HQ, India',
                        estimatedAccountValue: '₹1,80,00,000',
                        leadsCount: 2,
                        contactsCount: 4,
                        oppsCount: 1,
                        proposalsCount: 1
                      });
                    }

                    if (fullAcc) {
                      setLeadNavSource('contacts');
                      setAccountInitialTab('Leads');
                      setSelectedAccount(fullAcc);
                    }
                  }}
                  searchQuery={searchQuery}
                  selectedDateFilter={selectedDateFilter}
                  selectedOwnerFilter={selectedOwnerFilter}
                />
              )}

              {activeModule === 'masterData' && (
                <MasterDataView
                  searchQuery={searchQuery}
                  fromDashboard={fromDashboard}
                  onBackToDashboard={() => {
                    setFromDashboard(false);
                    setActiveModule('dashboard');
                  }}
                  onTriggerToast={triggerToast}
                  emailTemplates={emailTemplates}
                  onUpdateEmailTemplates={setEmailTemplates}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Common Create Modal */}
      <CommonActionsModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setModalBulkLeadIds([]);
          setModalTargetLead(null);
          setModalTargetAccount(null);
          setModalBulkCallback(null);
        }}
        onSave={(type, data) => {
          handleSaveAction(type, data);
          if (modalBulkCallback) {
            modalBulkCallback();
            setModalBulkCallback(null);
          }
          setModalBulkLeadIds([]);
          setModalTargetLead(null);
          setModalTargetAccount(null);
        }}
        initialType={modalInitialType}
        selectedLead={modalTargetLead || selectedLead}
        selectedAccount={modalTargetAccount || selectedAccount}
        bulkLeadIds={modalBulkLeadIds}
        leads={leads}
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
            setSelectedLead(null);
            setSelectedAccount(targetAcc);
            setLeadNavSource('leads');
            setActiveModule('accounts');
          }
        }}
      />

      {/* Interactive Voice Calling Modal & Minimized Floating Right-Docked Bar */}
      <AnimatePresence>
        {callSession && (
          <CallSessionModal
            callSession={callSession}
            onConfirmCall={handleConfirmCall}
            onCancelConfirm={handleCancelCallConfirmation}
            onSimulatePickup={handleSimulatePickup}
            onToggleMinimize={handleToggleCallMinimize}
            onToggleMute={handleToggleCallMute}
            onToggleHold={handleToggleCallHold}
            onUpdateNotes={handleUpdateCallNotes}
            onEndCall={handleEndCall}
          />
        )}
      </AnimatePresence>

      {/* Toast Banner Container with Smooth Pop-Up Animation */}
      <div className="toast-container" aria-live="polite" role="region">
        <AnimatePresence mode="wait">
          {toastMessage && (
            <motion.div
              key={typeof toastMessage === 'object' ? `${toastMessage.title}-${toastMessage.description || ''}-${toastMessage.type || 'success'}` : toastMessage}
              className={`toast-banner ${typeof toastMessage === 'object' ? (toastMessage.type || 'success') : 'success'}`}
              initial={{ opacity: 0, y: 35, scale: 0.92, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.95,
                filter: 'blur(3px)',
                transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
              }}
              transition={{
                type: 'spring',
                damping: 24,
                stiffness: 280,
                mass: 0.7
              }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
            >
              <div className="toast-icon-wrap">
                {typeof toastMessage === 'object' && toastMessage.type === 'warning' ? (
                  <LuTriangleAlert size={18} />
                ) : typeof toastMessage === 'object' && toastMessage.type === 'error' ? (
                  <LuCircleAlert size={18} />
                ) : typeof toastMessage === 'object' && toastMessage.type === 'info' ? (
                  <LuInfo size={18} />
                ) : (
                  <LuCircleCheck size={18} />
                )}
              </div>
              <div className="toast-content">
                {typeof toastMessage === 'object' ? (
                  <>
                    <div className="toast-title">{toastMessage.title}</div>
                    {toastMessage.description && !['success', 'warning', 'error', 'info'].includes(toastMessage.description) && (
                      <div className="toast-desc">{toastMessage.description}</div>
                    )}
                  </>
                ) : (
                  <div className="toast-title">{toastMessage}</div>
                )}
              </div>
              <button
                type="button"
                className="toast-dismiss-btn"
                onClick={() => setToastMessage(null)}
                title="Dismiss"
                aria-label="Dismiss notification"
              >
                <LuX size={15} />
              </button>
              <div className="toast-progress-bar" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
