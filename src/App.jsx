import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animateViewTransition } from './utils/animations';
import Sidebar from './components/Sidebar';
import GlobalHeader from './components/GlobalHeader';
import CommonActionsModal from './components/CommonActionsModal';
import LogoutConfirmModal from './components/LogoutConfirmModal';

// Views
import DashboardView from './views/DashboardView';
import LeadsView from './views/LeadsView';
import AccountsView from './views/AccountsView';
import OpportunitiesView from './views/OpportunitiesView';
import ActivitiesView from './views/ActivitiesView';
import ProposalsView from './views/ProposalsView';
import ContactsView from './views/ContactsView';
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
  INITIAL_NOTIFICATIONS
} from './data/mockData';
import { LuCircleCheck, LuBell, LuX } from 'react-icons/lu';

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

  // Relational Data State
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [toastMessage, setToastMessage] = useState(null);

  // Auto-dismiss toast pop-up notification after 5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  const triggerToast = (payload, desc = '') => {
    if (typeof payload === 'object' && payload !== null) {
      setToastMessage(payload);
    } else if (typeof payload === 'string' && payload.includes(': ')) {
      const [title, ...rest] = payload.split(': ');
      setToastMessage({ title, description: rest.join(': ') });
    } else {
      setToastMessage({ title: payload, description: desc });
    }
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
        expectedClosureDate: '2026-09-28',
        createdDate: new Date().toISOString().split('T')[0],
        currentStage: 'Qualified',
        owner: lead.leadOwner
      };
      setOpportunities([newOpp, ...opportunities]);
      pushNotification('Opportunity Converted', `Lead "${lead.leadName}" (${lead.company}) converted to Opportunity!`, 'Opportunity', 'opportunities');
      setSelectedLead(null);
      setActiveModule('opportunities');
    } else {
      setModalInitialType(actionType === 'call' || actionType === 'email' || actionType === 'sms' ? 'addNote' : actionType);
      setIsCreateModalOpen(true);
    }
  };

  // Navigate directly from Lead to Account full page view
  const handleNavigateToCompanyAccount = (companyName) => {
    const parentAcc = accounts.find(a => a.companyName.toLowerCase() === companyName.toLowerCase());
    if (parentAcc) {
      setLeadNavSource('leads');
      setSelectedLead(null);
      setSelectedAccount(parentAcc);
      setIsProfileActive(false);
      setActiveModule('accounts');
    } else {
      alert(`Account record for "${companyName}" not found.`);
    }
  };

  // Common Action Save Handler
  const handleSaveAction = (type, formData) => {
    if (type === 'createOpportunity') {
      const closeDateFormatted = formData.closeDate || '2026-09-28';
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
        createdDate: new Date().toISOString().split('T')[0],
        owner: formData.owner || 'Rajesh Sharma',
        score: 80,
        visualLevel: 'High'
      };

      setOpportunities([newOppObj, ...opportunities]);
      pushNotification('New Opportunity Created', `Opportunity "${oppTitle}" created for ${compName}`, 'Opportunity', 'opportunities');

      // Ensure Account exists or increment its opp count
      const existingAcc = accounts.find(a => a.companyName.toLowerCase() === compName.toLowerCase());
      if (!existingAcc) {
        const newAcc = {
          id: `ACC-${Date.now()}`,
          companyName: compName,
          industry: 'Enterprise Technology',
          companySize: '100-500 employees',
          website: `www.${compName.toLowerCase().replace(/[^a-z]/g, '')}.co.in`,
          location: 'Mumbai, MH',
          accountOwner: formData.owner || 'Rajesh Sharma',
          estimatedAccountValue: formData.estimatedValue || '₹1,00,00,000',
          leadsCount: 0,
          contactsCount: 1,
          oppsCount: 1,
          proposalsCount: 0
        };
        setAccounts([newAcc, ...accounts]);
      } else {
        setAccounts(accounts.map(a => a.id === existingAcc.id ? { ...a, oppsCount: (a.oppsCount || 0) + 1 } : a));
      }
    } else if (type === 'createLead') {
      const newLeadObj = {
        id: `LD-${Date.now()}`,
        leadName: formData.leadName,
        phoneNumber: formData.phone || '+91 98765 00000',
        emailId: formData.email || 'lead@example.co.in',
        company: formData.company,
        designation: formData.designation || 'Manager',
        leadSource: formData.leadSource || 'Website',
        status: formData.status || 'New',
        leadOwner: formData.owner || 'Rajesh Sharma',
        priority: formData.priority || 'Medium',
        createdDate: new Date().toISOString().split('T')[0],
        lastActivity: 'New lead record created in CRM',
        nextFollowup: `${formData.dueDate} 10:00`,
        dueToday: true,
        isOverdue: false,
        notes: formData.notes || 'Created via Common Action workspace.',
        nextAction: formData.nextAction || 'Schedule introductory discovery call'
      };
      setLeads([newLeadObj, ...leads]);
      pushNotification('New Lead Created', `Lead "${formData.leadName}" created for ${formData.company}`, 'Lead', 'leads');

      // Ensure Account exists
      const existingAcc = accounts.find(a => a.companyName.toLowerCase() === formData.company.toLowerCase());
      if (!existingAcc) {
        const newAcc = {
          id: `ACC-${Date.now()}`,
          companyName: formData.company,
          industry: 'Enterprise Technology',
          companySize: '100-500 employees',
          website: `www.${formData.company.toLowerCase().replace(/[^a-z]/g, '')}.co.in`,
          location: 'Mumbai, MH',
          accountOwner: formData.owner || 'Rajesh Sharma',
          estimatedAccountValue: '₹1,00,00,000',
          leadsCount: 1,
          contactsCount: 1,
          oppsCount: 0,
          proposalsCount: 0
        };
        setAccounts([newAcc, ...accounts]);
      }
    } else if (type === 'addNote') {
      const noteText = formData.notes || 'Note added to lead record';
      const targetLead = selectedLead || leads[0];
      if (targetLead) {
        const updatedNotes = `${targetLead.notes || ''}\n• ${noteText}`;
        const updatedLeads = leads.map(l => l.id === targetLead.id ? { ...l, notes: updatedNotes } : l);
        setLeads(updatedLeads);
        if (selectedLead && selectedLead.id === targetLead.id) {
          setSelectedLead({ ...selectedLead, notes: updatedNotes });
        }
        pushNotification('Note Added', `Added note to lead ${targetLead.leadName}`, 'Lead', 'leads');
      }
    } else if (type === 'assignOwner' && selectedLead) {
      const updatedLeads = leads.map(l => l.id === selectedLead.id ? { ...l, leadOwner: formData.owner } : l);
      setLeads(updatedLeads);
      if (selectedLead) {
        setSelectedLead({ ...selectedLead, leadOwner: formData.owner });
      }
      pushNotification('Owner Reassigned', `Assigned ${selectedLead.leadName} to ${formData.owner}`, 'Lead', 'leads');
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
          onOpenCreateModal={(type = (activeModule === 'opportunities' ? 'createOpportunity' : 'createLead')) => {
            setModalInitialType(type);
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
              onBack={() => setSelectedLead(null)}
              onNavigateHome={() => {
                setSelectedLead(null);
                setSelectedAccount(null);
                setActiveModule('dashboard');
              }}
              onQuickAction={handleQuickAction}
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
              onSelectLead={(l) => {
                setLeadNavSource('leads');
                setSelectedAccount(null);
                setSelectedLead(l);
                setActiveModule('leads');
              }}
              onOpenCreateModal={(type) => {
                setModalInitialType(type);
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
                  onOpenCreateModal={() => {
                    setModalInitialType('createLead');
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
                    setOpportunities(prev => prev.map(o => o.id === oppId ? { ...o, currentStage: newStage } : o));
                    const targetOpp = opportunities.find(o => o.id === oppId);
                    if (targetOpp) {
                      pushNotification('Stage Updated', `Moved "${targetOpp.opportunityName}" to ${newStage}`, 'Opportunity', 'opportunities');
                    }
                  }}
                  onSelectAccount={(companyName) => {
                    const fullAcc = accounts.find(a => a.companyName.toLowerCase() === companyName.toLowerCase());
                    if (fullAcc) {
                      setLeadNavSource('opportunities');
                      setSelectedLead(null);
                      setSelectedAccount(fullAcc);
                      setActiveModule('accounts');
                    }
                  }}
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
                      fullAcc = {
                        id: `ACC-GEN-${Date.now()}`,
                        companyName: companyName,
                        industry: 'Enterprise Technology',
                        companySize: '500-1000 employees',
                        website: `www.${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
                        location: 'Mumbai HQ, India',
                        accountOwner: 'Rajesh Sharma',
                        estimatedAccountValue: '₹1,80,00,000',
                        leadsCount: 1,
                        contactsCount: 1,
                        oppsCount: 1,
                        proposalsCount: 1
                      };
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
                      fullAcc = {
                        id: `ACC-GEN-${Date.now()}`,
                        companyName: companyName,
                        industry: 'Enterprise Software',
                        companySize: '500-1000 employees',
                        website: `www.${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
                        location: 'Mumbai HQ, India',
                        accountOwner: 'Rajesh Sharma',
                        estimatedAccountValue: '₹1,80,00,000',
                        leadsCount: 2,
                        contactsCount: 4,
                        oppsCount: 1,
                        proposalsCount: 1
                      };
                    }

                    if (fullAcc) {
                      setLeadNavSource('contacts');
                      setAccountInitialTab('Leads');
                      setSelectedAccount(fullAcc);
                    }
                  }}
                  searchQuery={searchQuery}
                  selectedDateFilter={selectedDateFilter}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Common Create Modal */}
      <CommonActionsModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveAction}
        initialType={modalInitialType}
      />

      {/* Logout Confirmation Pop-up Modal with Smooth Animation */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        user={currentUser}
      />

      {/* Toast Banner Container with Smooth Pop-Up Animation */}
      <div className="toast-container" aria-live="polite" role="region">
        <AnimatePresence mode="wait">
          {toastMessage && (
            <motion.div
              key={typeof toastMessage === 'object' ? `${toastMessage.title}-${toastMessage.description || ''}` : toastMessage}
              className="toast-banner"
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
                <LuCircleCheck size={18} />
              </div>
              <div className="toast-content">
                {typeof toastMessage === 'object' ? (
                  <>
                    <div className="toast-title">{toastMessage.title}</div>
                    {toastMessage.description && (
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
