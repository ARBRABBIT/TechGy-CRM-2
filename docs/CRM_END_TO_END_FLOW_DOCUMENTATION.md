# TechGy Link — Complete End-to-End CRM System & User Interaction Flow Documentation

> **Document Version:** 4.0 Enterprise Reference  
> **Workspace:** TechGy Link — Internal Enterprise CRM  
> **Target Audience:** Engineering, Product, QA, Implementation, and Operations Teams  
> **Last Updated:** September 2026 (Live Runtime Validated)

---

## Table of Contents

1. [Architectural Overview & Global State Topology](#1-architectural-overview--global-state-topology)
2. [Global Application Shell & Navigation Flows](#2-global-application-shell--navigation-flows)
   - 2.1 [Collapsible Responsive Sidebar (`Sidebar.jsx`)](#21-collapsible-responsive-sidebar-sidebarjsx)
   - 2.2 [Universal Search Engine & Category Routing (`GlobalHeader.jsx`)](#22-universal-search-engine--category-routing-globalheaderjsx)
   - 2.3 [Custom Date Selector & Calendar Picker (`CustomDateSelector.jsx`)](#23-custom-date-selector--calendar-picker-customdateselectorjsx)
   - 2.4 [Global Owner Filter & Reactive Propagation](#24-global-owner-filter--reactive-propagation)
   - 2.5 [Apple-Grade Segmented Notifications Popover (`NotificationsPopover.jsx`)](#25-apple-grade-segmented-notifications-popover-notificationspopoverjsx)
   - 2.6 [Toast Notification & Progress Banner System](#26-toast-notification--progress-banner-system)
3. [Authentication & Session Management](#3-authentication--session-management)
   - 3.1 [Login & Multi-Role Switching (`LoginView.jsx`)](#31-login--multi-role-switching-loginviewjsx)
   - 3.2 [Forgot Password & Security Simulation](#32-forgot-password--security-simulation)
   - 3.3 [Safeguarded Session Termination (`LogoutConfirmModal.jsx`)](#33-safeguarded-session-termination-logoutconfirmmodaljsx)
4. [Executive Sales Dashboard Flow (`DashboardView.jsx`)](#4-executive-sales-dashboard-flow-dashboardviewjsx)
   - 4.1 [Revenue KPI Cards & Variance Analytics](#41-revenue-kpi-cards--variance-analytics)
   - 4.2 [Interactive Revenue Trend Line Chart & Toggles](#42-interactive-revenue-trend-line-chart--toggles)
   - 4.3 [Marketing Lead Acquisition Donut & Card-Level Filtering](#43-marketing-lead-acquisition-donut--card-level-filtering)
   - 4.4 [4 Relational KPI Counters with Deep-Link Navigation](#44-4-relational-kpi-counters-with-deep-link-navigation)
   - 4.5 [Follow-up Action List & Overdue Inspection](#45-follow-up-action-list--overdue-inspection)
5. [Leads Directory & Pipeline Flow (`LeadsView.jsx`)](#5-leads-directory--pipeline-flow-leadsviewjsx)
   - 5.1 [Multi-Field & Multi-Select Filter Bar](#51-multi-field--multi-select-filter-bar)
   - 5.2 [Batch Selection & Indeterminate State Engine](#52-batch-selection--indeterminate-state-engine)
   - 5.3 [Floating Bulk Actions CTA Bar](#53-floating-bulk-actions-cta-bar)
   - 5.4 [Interactive Leads Data Table & Row Click Traversal](#54-interactive-leads-data-table--row-click-traversal)
   - 5.5 [Pagination Controls & Boundary Handling](#55-pagination-controls--boundary-handling)
6. [Lead Dossier & Relational Sub-Systems (`LeadDetailView.jsx`)](#6-lead-dossier--relational-sub-systems-leaddetailviewjsx)
   - 6.1 [Multi-Source Breadcrumb Traversal](#61-multi-source-breadcrumb-traversal)
   - 6.2 [Interactive Lead Status Dropdown & Stage Safety (`StageConfirmModal.jsx`)](#62-interactive-lead-status-dropdown--stage-safety-stageconfirmmodaljsx)
   - 6.3 [Lead Contact Details Editor Modal](#63-lead-contact-details-editor-modal)
   - 6.4 [Notes & Logged Requirements Drawer](#64-notes--logged-requirements-drawer)
   - 6.5 [Tab 1: Pipeline Progress Stream (`LeadPipelineProgress.jsx`)](#65-tab-1-pipeline-progress-stream-leadpipelineprogressjsx)
   - 6.6 [Tab 2: Call History & Dialer Launcher (`LeadCallHistory.jsx`)](#66-tab-2-call-history--dialer-launcher-leadcallhistoryjsx)
   - 6.7 [Tab 3: WhatsApp & SMS Live Thread (`LeadChatHistory.jsx`)](#67-tab-3-whatsapp--sms-live-thread-leadchathistoryjsx)
   - 6.8 [Tab 4: Enquiries Log & Tracking](#68-tab-4-enquiries-log--tracking)
   - 6.9 [Tab 5: Scheduled Follow-ups & Due Date Milestones](#69-tab-5-scheduled-follow-ups--due-date-milestones)
   - 6.10 [Tab 6: Corporate Mail History & Gmail-Style Inspection Modal](#610-tab-6-corporate-mail-history--gmail-style-inspection-modal)
   - 6.11 [Tab 7: Raw Notes Timeline](#611-tab-7-raw-notes-timeline)
   - 6.12 [Activity Details Inspection Modal (Dual Layout Modes)](#612-activity-details-inspection-modal-dual-layout-modes)
7. [In-Browser VoIP Audio Calling Engine (`CallSessionModal.jsx`)](#7-in-browser-voip-audio-calling-engine-callsessionmodaljsx)
   - 7.1 [Web Audio API Dual-Frequency Synthesizer Engine](#71-web-audio-api-dual-frequency-synthesizer-engine)
   - 7.2 [Calling Lifecycle: Confirming → Ringing → Connected → Finished](#72-calling-lifecycle-confirming--ringing--connected--finished)
   - 7.3 [Call Controls: Mute, Hold, Live Notes, and Minimization](#73-call-controls-mute-hold-live-notes-and-minimization)
   - 7.4 [Call Termination & Automatic CRM Activity Injection](#74-call-termination--automatic-crm-activity-injection)
8. [Company Accounts Dossier Flow (`AccountsView.jsx` & `AccountDetailView.jsx`)](#8-company-accounts-dossier-flow-accountsviewjsx--accountdetailviewjsx)
   - 8.1 [Company Accounts Grid & Portfolio Valuation (`AccountsView.jsx`)](#81-company-accounts-grid--portfolio-valuation-accountsviewjsx)
   - 8.2 [Full-Page Account Dossier (`AccountDetailView.jsx`)](#82-full-page-account-dossier-accountdetailviewjsx)
   - 8.3 [Inline Profile Editor & Company Metadata Management](#83-inline-profile-editor--company-metadata-management)
   - 8.4 [Linked Leads Sub-Table & Account-Scoped Lead Creation](#84-linked-leads-sub-table--account-scoped-lead-creation)
   - 8.5 [New Company Auto-Discovery Modal (`NewCompanyPromptModal.jsx`)](#85-new-company-auto-discovery-modal-newcompanypromptmodaljsx)
9. [Opportunities Pipeline Flow (`OpportunitiesView.jsx`)](#9-opportunities-pipeline-flow-opportunitiesviewjsx)
   - 9.1 [View Switcher: List View vs Interactive Kanban Board](#91-view-switcher-list-view-vs-interactive-kanban-board)
   - 9.2 [Kanban Drag-and-Drop Stage Transitions](#92-kanban-drag-and-drop-stage-transitions)
   - 9.3 [List View Controls & Quick Action Communication Triggers](#93-list-view-controls--quick-action-communication-triggers)
   - 9.4 [Stage & Owner Drawer Filters](#94-stage--owner-drawer-filters)
   - 9.5 [Lead-to-Opportunity Conversion Flow (`ConvertConfirmModal.jsx`)](#95-lead-to-opportunity-conversion-flow-convertconfirmmodaljsx)
10. [Activities & Engagement Timeline (`ActivitiesView.jsx`)](#10-activities--engagement-timeline-activitiesviewjsx)
    - 10.1 [Segmented Activity Filtering Tabs](#101-segmented-activity-filtering-tabs)
    - 10.2 [Timeline Cards, Overdue Highlighting, and Traversal](#102-timeline-cards-overdue-highlighting-and-traversal)
11. [Commercial Proposals Directory (`ProposalsView.jsx`)](#11-commercial-proposals-directory-proposalsviewjsx)
    - 11.1 [Commercial Proposals Valuation Table](#111-commercial-proposals-valuation-table)
    - 11.2 [Account Cross-Navigation & Value Propagation](#112-account-cross-navigation--value-propagation)
12. [Enterprise Contacts Directory (`ContactsView.jsx`)](#12-enterprise-contacts-directory-contactsviewjsx)
    - 12.1 [Preset Classification Filters](#121-preset-classification-filters)
    - 12.2 [Relationship Status Tracking & Account Association](#122-relationship-status-tracking--account-association)
13. [Master Data Management Suite (`MasterDataView.jsx`)](#13-master-data-management-suite-masterdataviewjsx)
    - 13.1 [Products & Services Catalog](#131-products--services-catalog)
    - 13.2 [Lead Acquisition Sources & Cost-per-Lead Attribution](#132-lead-acquisition-sources--cost-per-lead-attribution)
    - 13.3 [Industry Sectors, Tiers & Margin Benchmarks](#133-industry-sectors-tiers--margin-benchmarks)
    - 13.4 [Pipeline Funnel Stages & SLA Breach Parameters](#134-pipeline-funnel-stages--sla-breach-parameters)
    - 13.5 [Corporate Email Templates & Dynamic Merge Tag Engine](#135-corporate-email-templates--dynamic-merge-tag-engine)
    - 13.6 [Sales Objections & Strategic Rebuttals](#136-sales-objections--strategic-rebuttals)
    - 13.7 [Lead Cadences & Escalation Timelines](#137-lead-cadences--escalation-timelines)
    - 13.8 [AI Lead Scoring & Intent Rule Matrix](#138-ai-lead-scoring--intent-rule-matrix)
14. [User Profile & Workspace Configuration (`ProfileView.jsx`)](#14-user-profile--workspace-configuration-profileviewjsx)
    - 14.1 [Hero Identity Dossier & Performance Metrics](#141-hero-identity-dossier--performance-metrics)
    - 14.2 [Contact Information & Bio Form](#142-contact-information--bio-form)
    - 14.3 [Security Preferences, 2FA & Notification Toggles](#143-security-preferences-2fa--notification-toggles)
15. [Universal Multi-Entity Modal Engine (`CommonActionsModal.jsx`)](#15-universal-multi-entity-modal-engine-commonactionsmodaljsx)
    - 15.1 [Entity Selector & Color-Coded Categories](#151-entity-selector--color-coded-categories)
    - 15.2 [Smart Company Autocomplete & Auto-Detection](#152-smart-company-autocomplete--auto-detection)
    - 15.3 [Detailed Flow: Creating a Lead](#153-detailed-flow-creating-a-lead)
    - 15.4 [Detailed Flow: Creating a Company Account](#154-detailed-flow-creating-a-company-account)
    - 15.5 [Detailed Flow: Creating an Opportunity](#155-detailed-flow-creating-an-opportunity)
    - 15.6 [Detailed Flow: Creating a Contact](#156-detailed-flow-creating-a-contact)
    - 15.7 [Detailed Flow: Scheduling an Activity / Task](#157-detailed-flow-scheduling-an-activity--task)
    - 15.8 [Detailed Flow: Drafting a Proposal](#158-detailed-flow-drafting-a-proposal)
    - 15.9 [Detailed Flow: Logging a Phone Call](#159-detailed-flow-logging-a-phone-call)
    - 15.10 [Detailed Flow: Composing & Sending Rich Corporate Emails](#1510-detailed-flow-composing--sending-rich-corporate-emails)
    - 15.11 [Detailed Flow: Logging WhatsApp / SMS Messages](#1511-detailed-flow-logging-whatsapp--sms-messages)
    - 15.12 [Detailed Flow: Bulk Assigning Owners](#1512-detailed-flow-bulk-assigning-owners)
    - 15.13 [Detailed Flow: Bulk Updating Pipeline Stages](#1513-detailed-flow-bulk-updating-pipeline-stages)
    - 15.14 [Detailed Flow: Adding Notes](#1514-detailed-flow-adding-notes)
    - 15.15 [Detailed Flow: Scheduling Follow-ups](#1515-detailed-flow-scheduling-follow-ups)
16. [Comprehensive Button Action & Relational Side-Effect Matrix](#16-comprehensive-button-action--relational-side-effect-matrix)

---

## 1. Architectural Overview & Global State Topology

TechGy Link is structured as a reactive, zero-latency single-page application built on Next.js 16 (App Router with Turbopack), React 19, Vanilla CSS design tokens, GSAP view transitions, and Framer Motion spring physics.

```
+----------------------------------------------------------------------------------------------------+
|                                              App.jsx                                               |
|                                       (Root State Orchestrator)                                    |
+----------------------------------------------------------------------------------------------------+
                                                  |
         +----------------------------------------+----------------------------------------+
         |                                        |                                        |
         v                                        v                                        v
+------------------+                    +--------------------+                   +--------------------+
|  Authentication  |                    | Relational Storage |                   | Global View State  |
| - isAuthenticated|                    | - leads            |                   | - activeModule     |
| - currentUser    |                    | - accounts         |                   | - selectedLead     |
| - LoginView      |                    | - opportunities    |                   | - selectedAccount  |
| - LogoutModal    |                    | - activities       |                   | - isProfileActive  |
+------------------+                    | - proposals        |                   | - fromDashboard    |
                                        | - contacts         |                   | - leadNavSource    |
                                        | - notifications    |                   +--------------------+
                                        | - emailTemplates   |
                                        +--------------------+
                                                  |
         +----------------------------------------+----------------------------------------+
         |                                        |                                        |
         v                                        v                                        v
+--------------------+                  +--------------------+                   +--------------------+
| Global Navigation  |                  | Active Workspace   |                   | Universal Modals   |
| - Sidebar          |                  | - DashboardView    |                   | - CommonActions    |
| - GlobalHeader     |                  | - LeadsView        |                   | - CallSessionModal |
| - UniversalSearch  |                  | - AccountsView     |                   | - StageConfirm     |
| - CustomDateFilter |                  | - OpportunitiesView|                   | - ConvertConfirm   |
| - OwnerFilter      |                  | - ActivitiesView   |                   | - NewCompanyPrompt |
| - Notifications    |                  | - ProposalsView    |                   | - Toast Banner     |
+--------------------+                  | - ContactsView     |                   +--------------------+
                                        | - MasterDataView   |
                                        | - LeadDetailView   |
                                        | - AccountDetailView|
                                        | - ProfileView      |
                                        +--------------------+
```

### Key Data Persistence & Version Migration
- **Data Version Tag:** `DATA_VERSION = 'v3.9_filter_fixes'`.
- **Atomic Migration:** Whenever `DATA_VERSION` increments, stale `localStorage` keys are evicted and freshly seeded from `src/data/mockData.js`.
- **Automatic Bidirectional Persistence:** Every mutation to `leads`, `accounts`, `opportunities`, `activities`, `proposals`, `contacts`, `notifications`, or `emailTemplates` immediately syncs via `saveToStorage()` to `localStorage`.
- **Runtime Overdue Poller:** A `setInterval` timer executes every 60,000 ms inside `App.jsx`, checking leads with `nextFollowup` against the real system clock. If a follow-up timestamp has passed and the lead is not `Converted` or `Lost`, it flags `isOverdue: true` and `dueToday: true/false` in state.

---

## 2. Global Application Shell & Navigation Flows

### 2.1 Collapsible Responsive Sidebar (`Sidebar.jsx`)

The sidebar is fixed on the left viewport boundary. It controls top-level workspace routing, displays real-time warning badges, and exposes the user profile dossier.

```
[Collapsed State]                               [Expanded State]
+--------------+                                +--------------------------------+
|  [Logo]      |  <-- Hover reveals PanelLeft   |  [Logo] TechGy Link            |
|--------------|                                |  Internal Workspace  [PanelLeft|
|  [Dashboard] |                                |--------------------------------|
|  [Leads] (3) |  <-- Overdue alert badge       |  [Dashboard] Dashboard         |
|  [Accounts]  |                                |  [Leads]     Leads    [3 Alert]|
|  [MasterData]|                                |  [Accounts]  Accounts          |
|              |                                |  [Master]    Master Data       |
|  (Clickable  |  <-- Click expands sidebar     |                                |
|   empty area)|                                |  (Clickable empty area)        |
|--------------|                                |--------------------------------|
|  [User Cir]  |  <-- Click opens Profile       |  [User] Rajesh Sharma          |
+--------------+                                |         Sales Administrator    |
                                                +--------------------------------+
```

#### What Happens When You Click:
1. **Brand Header Container (`.brand-container`):**
   - Resets any active detail view (`selectedLead = null`, `selectedAccount = null`, `isProfileActive = false`).
   - Sets `activeModule = 'dashboard'`.
   - Smoothly transitions the content viewport to `DashboardView`.
2. **Collapse/Expand Toggle Button (`LuPanelLeft`):**
   - Toggles `isSidebarCollapsed` state (`true` ↔ `false`).
   - The main container class switches between `.main-wrapper` and `.main-wrapper.sidebar-collapsed` (adjusting left margin smoothly from 260px to 76px).
   - In collapsed mode, hovering over the company vector logo gracefully cross-fades into the `LuPanelLeft` expansion icon.
3. **Empty Space Area (`.sidebar-empty-click-area`):**
   - Clicking the vacant vertical space below the menu icons toggles sidebar collapse/expand.
   - Hovering over this area previews the toggle icon at the top header.
4. **Navigation Menu Items (`Dashboard`, `Leads`, `Accounts`, `Master Data`):**
   - Resets detail selections (`selectedLead = null`, `selectedAccount = null`, `isProfileActive = false`).
   - Clears `fromDashboard` breadcrumb flag.
   - Sets `activeModule` to clicked module ID (`dashboard`, `leads`, `accounts`, `masterData`).
   - On mobile screens, automatically dismisses the mobile backdrop (`setMobileOpen(false)`).
5. **Sidebar Overdue Alert Badge on "Leads":**
   - Computes dynamically: `leads.filter(l => l.isOverdue).length`.
   - If count > 0, renders a crimson alert pill displaying `X Alert`.
6. **Bottom User Profile Card (`.sidebar-profile`):**
   - Clicking anywhere on the user avatar or name block invokes `handleOpenProfile()`.
   - Sets `isProfileActive = true`, clearing active detail dossiers.

---

### 2.2 Universal Search Engine & Category Routing (`GlobalHeader.jsx`)

The global search input executes a live cross-entity scan across 6 distinct CRM datasets simultaneously:

$$\text{Total Matches} = N_{\text{Leads}} + N_{\text{Accounts}} + N_{\text{Opps}} + N_{\text{Proposals}} + N_{\text{Contacts}} + N_{\text{Activities}}$$

```
[Universal Search Input] ---> Typed: "Reliance"
  |
  +---> Matches in Leads (2)         ==> Shows Lead Name, Designation, Status
  +---> Matches in Accounts (1)      ==> Shows Company Name, Industry, Est. Worth
  +---> Matches in Opportunities (2) ==> Shows Opp Name, Current Stage, Deal Value
  +---> Matches in Proposals (1)     ==> Shows Proposal ID, Opportunity, Status
  +---> Matches in Contacts (3)      ==> Shows Contact Name, Phone, Role
  +---> Matches in Activities (4)    ==> Shows Activity Type, Subject, Date
```

#### What Happens When You Click a Search Result Item:
1. **Lead Item Clicked:**
   - Universal search dropdown closes; search input resets.
   - `selectedAccount` set to `null`; `isProfileActive` set to `false`.
   - `leadNavSource` set to `'leads'`.
   - `selectedLead` set to clicked lead object.
   - `activeModule` set to `'leads'`.
   - Content container instantly mounts `LeadDetailView`.
2. **Account / Company Item Clicked:**
   - Dropdown closes; search input resets.
   - `selectedLead` set to `null`; `isProfileActive` set to `false`.
   - `leadNavSource` set to `'accounts'`.
   - `accountInitialTab` set to `'Leads'`.
   - `selectedAccount` set to full account record.
   - `activeModule` set to `'accounts'`.
   - Content container instantly mounts `AccountDetailView`.
3. **Opportunity Item Clicked:**
   - Closes dropdown; navigates to `OpportunitiesView` (`activeModule = 'opportunities'`).
4. **Proposal Item Clicked:**
   - Closes dropdown; navigates to `ProposalsView` (`activeModule = 'proposals'`).
5. **Contact Item Clicked:**
   - Resolves parent company name.
   - If parent company exists in accounts, sets `selectedAccount` with `accountInitialTab = 'Contacts'`.
   - Sets `activeModule = 'contacts'`.
6. **Activity Item Clicked:**
   - Closes dropdown; navigates to `ActivitiesView` (`activeModule = 'activities'`).
7. **Clear Search Button (`LuX`):**
   - Clicking the 'X' button inside the search field immediately empties `searchQuery`, closing the overlay dropdown.

---

### 2.3 Custom Date Selector & Calendar Picker (`CustomDateSelector.jsx`)

A custom Apple-style interactive date filter dropdown positioned in the top global header.

```
+---------------------------------------------------------------------+
| [Calendar Icon]  This Month                          [Chevron Down] |
+---------------------------------------------------------------------+
                                  |
                                  v
+---------------------------------------------------------------------+
| Presets:                                                            |
| (•) This Month   ( ) This Quarter   ( ) FY 2026-27                  |
| ( ) Last 7 Days  ( ) Last 30 Days   ( ) All Time                    |
|---------------------------------------------------------------------|
| Interactive Calendar:                [<] September 2026 [>]         |
| Su  Mo  Tu  We  Th  Fr  Sa                                          |
|         01  02  03  04  05    <-- [01 Start Date Selected]          |
| 06  07  08  09  10  11  12    <-- Range Highlighting (01 to 15)     |
| 13  14  15  16  17  18  19    <-- [15 End Date Selected]            |
| 20  21  22  23  24  25  26                                          |
| 27  28  29  30                                                      |
|---------------------------------------------------------------------|
| [Reset to This Month]                         [Apply Custom Range]  |
+---------------------------------------------------------------------+
```

#### What Happens When You Click:
1. **Selector Trigger Button:** Opens/closes the floating calendar dropdown modal.
2. **Preset Item ("This Month", "This Quarter", "FY 2026-27", "Last 7 Days", "Last 30 Days", "All Time"):**
   - Immediately assigns `selectedDateFilter = presetName`.
   - Automatically closes the dropdown.
   - Broadcasts the new boundary to every view. In `DashboardView`, presets automatically update the revenue toggle ("This Month" → 'Monthly', "This Quarter" → 'Quarterly', "FY" → 'FY').
3. **Calendar Month Navigation (`<` / `>`):** Shifts `viewMonth` and `viewYear` backwards or forwards by 1 month without closing the dropdown.
4. **Calendar Day Click (`handleDayClick`):**
   - **Click 1:** If in start mode or range already complete, assigns `startDateStr = clickedDate`, clears `endDateStr`, and switches mode to `pickingMode = 'end'`.
   - **Click 2:** If clicked date is earlier than start date, replaces start date. Otherwise, assigns `endDateStr = clickedDate` and completes the range.
5. **"Apply Custom Range" Button:**
   - Compiles `{ type: 'custom', startDate, endDate, label: 'DD MMM – DD MMM' }`.
   - Sets `selectedDateFilter` to this custom object.
   - Closes the dropdown. All lists, dashboards, and tables filter by exact calendar day span.
6. **"Reset" Button (`LuRotateCcw`):**
   - Reverts `selectedDateFilter` back to default `'This Month'`.
   - Resets calendar cursor to current month and closes dropdown.

---

### 2.4 Global Owner Filter & Reactive Propagation

Located adjacent to the date selector in `GlobalHeader.jsx`.

- **Options:** `All Owners`, `Rajesh Sharma`, `Priya Patel`, `Vikram Malhotra`, `Neha Gupta`, `Rahul Verma`.
- **Selecting an option:** Calls `setSelectedOwnerFilter(e.target.value)`.
- **Downstream Effect:**
  - `DashboardView`: Filters revenue action items, marketing donut attribution, and KPI counters.
  - `LeadsView`: Automatically isolates leads owned by the selected sales rep.
  - `AccountsView`: Filters enterprise company accounts assigned to that owner.
  - `OpportunitiesView`: Isolates pipeline deals managed by that rep.

---

### 2.5 Apple-Grade Segmented Notifications Popover (`NotificationsPopover.jsx`)

Triggered by the bell icon in `GlobalHeader.jsx`. Displays real-time alerts for overdue follow-ups, converted opportunities, new leads, and stage advances.

```
+-------------------------------------------------------------------+
| [Bell] Notifications           [3 new]        [Mark Read]  [X]    |
|-------------------------------------------------------------------|
| [   All   ] [  Unread (3)  ] [   Overdue   ] [     Updates     ]  |
|-------------------------------------------------------------------|
| [!] Lead Overdue                                     Just now     |
|     Follow-up with Priya Sharma (Tata Tech) is overdue!           |
|-------------------------------------------------------------------|
| [✓] Opportunity Converted                            5 mins ago   |
|     Reliance Industries converted to Qualified stage (₹1.20 Cr)   |
|-------------------------------------------------------------------|
| [+] New Lead Created                                 1 hour ago   |
|     Aarav Mehta registered from Inbound Website enquiry           |
+-------------------------------------------------------------------+
```

#### What Happens When You Click:
1. **Bell Icon Button:** Toggles the popover open/closed. Unread count badge updates dynamically.
2. **Segmented Tabs (`All`, `Unread`, `Overdue`, `Updates`):**
   - The Framer Motion active pill slides smoothly behind the active tab.
   - Filters the displayed array by category and read status.
   - GSAP animates entry of newly filtered cards (`opacity: 0, y: 8` → `1, 0`).
3. **"Mark Read" Pill Button:**
   - Sets `isRead: true` for every notification.
   - Decrements unread badge to 0.
   - Triggers desktop toast: *"All notifications marked as read"*.
4. **Notification Card Click (`onNotificationClick`):**
   - Calls `handleMarkAsRead(notif.id)`.
   - Closes the notification popover.
   - Inspects `notif.targetModule`:
     - If `'leads'`: Navigates to Leads directory.
     - If `'opportunities'`: Navigates to Opportunities pipeline.
     - If `'accounts'`: Navigates to Company Accounts directory.
     - If `'activities'`: Navigates to Activities timeline.

---

### 2.6 Toast Notification & Progress Banner System

Mounted at the bottom-right of the screen in `App.jsx`. Driven by `toastMessage` state.

- **Auto-Dismiss:** Automatically clears after exactly 5,000 ms via an active `setTimeout`.
- **Visual Variations:**
  - `success`: Deep Navy/Emerald icon (`LuCircleCheck`), positive border.
  - `warning`: Amber icon (`LuTriangleAlert`), warning badge.
  - `error`: Crimson icon (`LuCircleAlert`), red progress bar.
  - `info`: Blue icon (`LuInfo`).
- **Dismiss Button (`LuX`):** Clicking dismiss immediately cancels the active timer and plays an exit animation (`opacity: 0, scale: 0.95, y: 20`).
- **CSS Progress Bar:** An animated progress line at the base of the card visualizes the remaining time before dismissal.

---

## 3. Authentication & Session Management

### 3.1 Login & Multi-Role Switching (`LoginView.jsx`)

Authentication is gated at the root level in `App.jsx`. If `isAuthenticated === false`, all internal modules unmount and `LoginView` renders.

```
                               +-----------------------------+
                               |     TechGy Link Header      |
                               +-----------------------------+
                               |  Enterprise Login Card      |
                               |                             |
[Sales Admin] [Sales Rep] ---> |  Role: [Sales Admin       ] |
[Sales Manager]                |  User: admin@techgy.com     |
                               |  Password: [••••••••] [Eye] |
                               |                             |
                               |  [     Sign In Button    ]  |
                               |                             |
                               |  [Forgot your password?]    |
                               +-----------------------------+
```

#### What Happens When You Click:
1. **Role Selectors (`Sales Admin`, `Sales Rep`, `Sales Manager`):**
   - Automatically populates the default email (`admin@techgy.com`, `rajesh@techgy.com`, `manager@techgy.com`).
   - Updates the descriptive role helper text below the title.
2. **Show/Hide Password Icon (`LuEye` / `LuEyeOff`):**
   - Toggles password field type between `'password'` and `'text'`.
3. **"Sign In" Submit Button (`handleLoginSubmit`):**
   - Validates password length (must be $\ge 4$ characters). If invalid, displays error banner.
   - Enters `isSubmitting = true` (button shows *"Signing in..."*).
   - After 500 ms simulation:
     - Stores session in `localStorage`: `techgy_authenticated = "true"`, `techgy_user = JSON.stringify(user)`.
     - Invokes `setIsAuthenticated(true)`.
     - Sets `currentUser` to selected role credentials.
     - Dispatches welcome toast: *"Welcome, {user.name}! Connected to TechGy Link."*
     - Viewport cross-fades into `DashboardView`.
4. **"Forgot your password?" Link:**
   - Switches internal state `viewMode = 'forgot'`.

---

### 3.2 Forgot Password & Security Simulation

1. **Email Input Field:** Accepts corporate email address.
2. **"Send password" Button (`handleForgotSubmit`):**
   - Shows loading state *"Sending password..."*.
   - After 500 ms, flips to success card with a green `LuCircleCheck` badge.
   - Displays confirmation: *"We have dispatched a temporary password to {resetEmail}."*
3. **"Back to Login" Button:**
   - Resets `viewMode = 'login'` and `resetEmailSent = false`.

---

### 3.3 Safeguarded Session Termination (`LogoutConfirmModal.jsx`)

When a user initiates logout (from header or profile), the app does **not** instantly terminate the session; it presents an Apple-style confirmation modal with keyboard shortcuts.

#### What Happens When You Click:
1. **"Cancel" Button or Modal Backdrop:** Closes modal; user remains securely logged in.
2. **"Yes, Log Out" Button (`handleConfirmLogout`):**
   - Closes `LogoutConfirmModal`.
   - Clears `techgy_authenticated` and `techgy_user` from `localStorage`.
   - Sets `isAuthenticated = false` and `currentUser = null`.
   - Resets all active selection states (`selectedLead = null`, `selectedAccount = null`, `activeModule = 'dashboard'`).
   - Immediately re-renders `LoginView`.
   - Dispatches confirmation toast: *"Logged out of TechGy Link: Session ended safely"*.

---

## 4. Executive Sales Dashboard Flow (`DashboardView.jsx`)

The operational cockpit of the CRM. Aggregates financial analytics, lead generation distributions, overdue action items, and relational shortcuts.

```
+------------------------------------------------------------------------------------+
|  Top Revenue KPIs:                                                                 |
|  [Monthly: ₹18,45,000 (+12%)]   [Quarterly: ₹62,80,000]   [FY Target: ₹2.00 Cr]    |
+------------------------------------------------------------------------------------+
|  Dual Charts:                                                                      |
|  +-------------------------------------+  +-------------------------------------+  |
|  | Revenue Trend (Monthly/Quarterly/FY)|  | Marketing Lead Source Mix Donut     |  |
|  | [Line Chart: Revenue vs Target]     |  | [Donut: Web, LinkedIn, Referral...] |  |
|  +-------------------------------------+  +-------------------------------------+  |
+------------------------------------------------------------------------------------+
|  Relational Counters:                                                              |
|  [Companies: 8]      [No. of Leads: 7]     [! Overdue: 3 !]    [Today's Tasks: 1]  |
|  (Click -> Accounts) (Click -> Leads)      (Click -> Overdue)  (Click -> Followups)|
+------------------------------------------------------------------------------------+
|  Follow-up Action List Table:                                                      |
|  Company           Lead         Owner         Due Time    Status    Action         |
|  Tata Technologies Rajesh S.    Rajesh Sharma 15:30 Today Follow-up [Inspect Action|
+------------------------------------------------------------------------------------+
```

### 4.1 Revenue KPI Cards & Variance Analytics
- **Monthly Revenue Card:** Shows current monthly realized income with a `+12.4% vs last month` positive variance badge.
- **Quarterly Revenue Card:** Shows Q2 quarterly run-rate with `+8.2% vs Q2 target`.
- **FY Revenue Card:** Shows total fiscal year progress toward the ₹2,00,00,000 enterprise milestone.

### 4.2 Interactive Revenue Trend Line Chart & Toggles
- **Toggle Switch Buttons (`Monthly`, `Quarterly`, `FY`):**
  - Switches active dataset in `REVENUE_DATA`.
  - Re-renders Recharts line chart with custom SVG dots and animated spline.
  - Y-axis automatically formats numerical values into Indian numbering currency notation (`₹15.0L`, `₹1.5Cr`).
  - Hovering reveals glassmorphism tooltip showing both Realized Revenue and Scheduled Target.

### 4.3 Marketing Lead Acquisition Donut & Card-Level Filtering
- **Independent Card Filters (Date & Owner):**
  - Unlike global filters, these two local dropdowns allow sales directors to analyze marketing channels independently for specific reps or custom timeframes without changing the rest of the dashboard.
- **Interactive Pie Slices & Legend Items:**
  - **What happens when you click any slice or legend item (e.g. "LinkedIn"):**
    - Calls `onNavigateToLeads(data.name)`.
    - Navigates immediately to `LeadsView`.
    - Automatically sets `sourceFilter = 'LinkedIn'`.
    - The Leads table displays only leads acquired through that specific marketing channel!

### 4.4 4 Relational KPI Counters with Deep-Link Navigation
1. **"Companies" Counter (`totalCompanies`):**
   - Displays total accounts matching active criteria.
   - **Clicking this card:** Calls `onNavigateToAccounts()` → mounts `AccountsView` with `fromDashboard: true` breadcrumbs.
2. **"No. of Leads" Counter (`totalLeadsCount`):**
   - Displays total leads matching active criteria.
   - **Clicking this card:** Calls `onNavigateToLeads()` → mounts `LeadsView` showing all leads.
3. **"Overdue Leads" Alert Counter (`overdueLeadsCount`):**
   - Crimson highlighted alert card showing count of leads past their scheduled SLA.
   - **Clicking this card:** Calls `onNavigateToLeads('OVERDUE')` → opens `LeadsView` with the `overdueOnly` filter active!
4. **"Today's Follow-ups" Tasks Counter (`todayFollowupsCount`):**
   - Displays count of follow-ups scheduled for the current calendar day.
   - **Clicking this card:** Calls `onNavigateToActivities('Follow-up')` → opens `ActivitiesView` pre-filtered to the `'Follow-up'` tab!

### 4.5 Follow-up Action List & Overdue Inspection
- **"View All Leads" Link:** Navigates directly to `LeadsView`.
- **Company Name Cell:** Clicking the company name jumps straight into `AccountDetailView` for that company account.
- **Table Row or "Inspect Next Action" Button:**
  - Jumps directly into `LeadDetailView` for that specific lead.
  - Sets `leadNavSource = 'dashboard'`.

---

## 5. Leads Directory & Pipeline Flow (`LeadsView.jsx`)

Comprehensive table of prospective clients, featuring multi-select filters, batch operations, pagination, and one-click record inspection.

```
+-----------------------------------------------------------------------------------------+
| [Search leads...]  [Source v] [Status v] [Owner v] [! Overdue Only (3)] [Reset Filters] |
+-----------------------------------------------------------------------------------------+
| [✓] 2 selected  |  [Assign Owner]  [Email]  [Update Stage]         [+ Create Lead]      |
|-----------------------------------------------------------------------------------------|
| [ ] Lead Name      Company      Designation   Source   Status    Owner     Follow-up    |
| [✓] Rajesh Sharma  Tata Tech    VP Cloud      Website  Qualified Rajesh S. 15:30 Today  |
| [✓] Sunita Rao     HDFC Bank    Director IT   LinkedIn Contacted Priya P.  11:00 [OVER] |
|-----------------------------------------------------------------------------------------|
| Showing 1 - 10 of 48 Leads                         [< Previous] (1) [2] [3] [Next >]    |
+-----------------------------------------------------------------------------------------+
```

### 5.1 Multi-Field & Multi-Select Filter Bar
- **Search Input:** Real-time debounce filtering across Lead Name, Company, Designation, Email, and Phone.
- **Source Multi-Select (`MultiSelectFilter`):** Checkbox dropdown for Website, Referral, LinkedIn, Inbound Call, Campaign, Partner.
- **Status Multi-Select:** Checkbox dropdown for New, Contacted, Qualified, Discussion, Proposal, Negotiation.
- **Owner Multi-Select:** Checkbox dropdown for all sales reps.
- **"Overdue Only" Button:** Crimson toggle button. When clicked, isolates leads where `isOverdue === true`.
- **"Reset Filters" Button:** Animates into view whenever any filter is active. Clicking it wipes all filter criteria back to pristine state.

### 5.2 Batch Selection & Indeterminate State Engine
- **Master Header Checkbox (`th-checkbox`):**
  - If 0 leads selected: Unchecked.
  - If all visible leads selected: Checked.
  - If some (but not all) leads selected: Uses React `useRef` to set `.indeterminate = true` (displaying a dash icon).
- **Row Checkbox (`td-checkbox`):** Clicking toggles that individual lead ID into or out of `selectedLeadIds`. Stops propagation so the row does not open the detail view.

### 5.3 Floating Bulk Actions CTA Bar
When $\ge 1$ lead is selected, a pill bar animates into the table header:
1. **Counter Badge:** Displays *"X selected"* with a clear button (✕) to instantly deselect all.
2. **"Assign Owner" Button:** Opens `CommonActionsModal` with `initialType = 'assignOwner'` and `bulkLeadIds` pre-populated.
3. **"Email" Button:** Opens `CommonActionsModal` with `initialType = 'email'` targeting all selected lead IDs.
4. **"Update Stage" Button:** Opens `CommonActionsModal` with `initialType = 'changeStatus'` targeting all selected lead IDs.

### 5.4 Interactive Leads Data Table & Row Click Traversal
- **Clicking Company Name:** Invokes `onSelectAccount(lead.company)` → opens `AccountDetailView`.
- **Clicking Row / "View" Button:** Invokes `onSelectLead(lead)` → opens `LeadDetailView`.

### 5.5 Pagination Controls & Boundary Handling
- Displays 10 items per page (`PAGE_SIZE = 10`).
- If records exceed 10, renders pagination controls with Previous, numbered pills, and Next buttons.
- Automatically clamps current page if filters reduce the total page count.

---

## 6. Lead Dossier & Relational Sub-Systems (`LeadDetailView.jsx`)

The central nerve center for client engagement. Replaces side drawers with an immersive, full-page workspace.

```
+---------------------------------------------------------------------------------------+
| Contacts Directory > Aarav Mehta (Tata Technologies)                                  |
|---------------------------------------------------------------------------------------|
| Aarav Mehta                     [Status: Qualified v]        [+ Quick Actions: Call v]|
| VP Cloud Architecture at Tata Technologies                                            |
|---------------------------------------------------------------------------------------|
| Left Column: Key Contact Info               | Right Column: Notes & Logged Reqs       |
| Full Name: Aarav Mehta     [Edit Details]   | "Client requested SOC-2 audit report."  |
| Phone:     +91 98765 43210                  |                                         |
| Email:     aarav@tatatech.com               | [+ Add Note]                            |
| Owner:     Rajesh Sharma                    |                                         |
|---------------------------------------------------------------------------------------|
| [Activity] [Calls] [Chats] [Enquiries] [Followups] [Mail] [Notes]   [Sort: Newest v]  |
|---------------------------------------------------------------------------------------|
| Pipeline Stream / Call Records / Gmail Modal Preview / WhatsApp Messenger             |
+---------------------------------------------------------------------------------------+
```

### 6.1 Multi-Source Breadcrumb Traversal
The top navigation breadcrumb dynamically reflects where the user navigated from:
- From Dashboard: `Dashboard > {Lead Name}`
- From Contacts: `Contacts Directory > {Lead Name}`
- From Activities: `Activities Timeline > {Lead Name}`
- From Opportunities: `Opportunities Pipeline > {Lead Name}`
- From Proposals: `Proposals Directory > {Lead Name}`
- From Leads: `Leads Directory > {Lead Name}`

Clicking the ancestor breadcrumb safely returns the user to the exact prior view and tab state.

### 6.2 Interactive Lead Status Dropdown & Stage Safety (`StageConfirmModal.jsx`)
In the top-right header card, a custom dropdown displays the current stage with a colored status orb.
- Clicking opens a popover listing all 6 stages: `New`, `Contacted`, `Qualified`, `Discussion`, `Proposal`, `Negotiation`.
- **What happens when you select a new stage:**
  - The dropdown closes.
  - The app opens `StageConfirmModal`, displaying the lead's current stage and proposed target stage with a visual transition arrow.
  - **Clicking "Cancel":** Aborts the change; status remains unchanged.
  - **Clicking "Confirm Stage Change":**
    - Updates lead's status in state and `localStorage`.
    - Appends an audit trail entry into `lead.stageHistory` with ISO timestamp, date, notes, and the updating user.
    - Dispatches system notification and confirmation toast: *"Lead moved to {newStage} stage"*.

### 6.3 Lead Contact Details Editor Modal
Clicking the **"Edit"** button in the contact information card opens a modal containing:
- Name, Company (autocomplete dropdown), Designation, Source, Phone, Email, Owner, Priority, Follow-up Date, and Follow-up Time select.
- **Saving:** Updates lead record, synchronizes state across the application, and triggers a success toast.

### 6.4 Notes & Logged Requirements Drawer
- Shows the latest logged note.
- Clicking **"+ Add Note"** launches `CommonActionsModal` with `initialType = 'addNote'`.

---

### 6.5 Tab 1: Pipeline Progress Stream (`LeadPipelineProgress.jsx`)
Visual vertical timeline of all stage transitions the lead has undergone since creation.
- **Continuous Vertical Track:** Connects every status change chronologically.
- **Nodes:** Numbered sequence pills.
- **Relative Time Badge:** *"Just now"*, *"15 mins ago"*, *"Yesterday"*, *"3 days ago"*.
- **"Newest First" / "Oldest First" Toggle Button:** Reverses the stream order instantly.

---

### 6.6 Tab 2: Call History & Dialer Launcher (`LeadCallHistory.jsx`)
Renders all calls logged for this lead with duration, outcome, and notes.
- Clicking **"+ Call"** immediately triggers `handleInitiateCall(lead)`, launching the in-browser VoIP calling engine!

---

### 6.7 Tab 3: WhatsApp & SMS Live Thread (`LeadChatHistory.jsx`)
An interactive, simulated chat messenger interface.
- Displays delivered WhatsApp and SMS messages with timestamps and blue double-check delivery indicators.
- **Sending a Message:** Type into the chat input and click send. It instantly creates an activity record, logs the message to the lead's history, and dispatches a toast notification.

---

### 6.8 Tab 4: Enquiries Log & Tracking
Lists all customer inquiries, technical requirements, and RFIs. Features a **"+ Log Enquiry"** button that opens a note-logging modal.

---

### 6.9 Tab 5: Scheduled Follow-ups & Due Date Milestones
Displays all upcoming and overdue tasks. Features a **"+ Schedule Follow-up"** button that opens the follow-up scheduler modal.

---

### 6.10 Tab 6: Corporate Mail History & Gmail-Style Inspection Modal
Displays all outbound email communication.
- Clicking **"Send Email"** opens `CommonActionsModal` with `initialType = 'email'`.
- **Clicking any email row:** Opens the high-fidelity Gmail-style inspection modal (described in §6.12).

---

### 6.11 Tab 7: Raw Notes Timeline
Displays full requirement notes with timestamps and author signatures in reverse-chronological order.

---

### 6.12 Activity Details Inspection Modal (Dual Layout Modes)
Clicking any activity row across any tab opens the detailed inspection modal:
1. **Standard Mode (Calls, Tasks, Meetings):** Displays two-column metadata grid (Lead contact, Company account, Date & time, Logged by, Status/Outcome, Duration) followed by full notes.
2. **Gmail Corporate Email Mode (Emails):**
   - Top Gmail bar with official Google red 'M' badge and *"Gmail Preview"* label.
   - Thread subject row with gray *"Inbox"* pill badge.
   - Sender row: Circular avatar, sender name, `<admin@techgy.com>`, relative timestamp, and `to: {lead.emailId}`.
   - **TechGy Corporate Banner:** Multi-tone blue angular gradient banner with official white TechGy enterprise logo and subtitle.
   - Formal salutation: *"Dear {lead.leadName},"*.
   - Rich email body text.
   - Sign-off block: *"Thank you,"*, sender name, and automated message disclaimer.
   - Standard corporate legal confidentiality notice and copyright footer.

---

## 7. In-Browser VoIP Audio Calling Engine (`CallSessionModal.jsx`)

An embedded audio-synthesized telephonic calling interface.

```
+-------------------------------------------------------------+
| TechGy Voice Calling                   [-- Minimize] [X End]|
|-------------------------------------------------------------|
|                       [ Avatar ]                            |
|                      Aarav Mehta                            |
|                   Tata Technologies                         |
|                    +91 98765 43210                          |
|                                                             |
|                 Call Duration: 02:45                        |
|                                                             |
|   [ Mic ]           [ Hold ]          [ Notes ]    [ End ]  |
|   Mute Mic          Hold Call         Live Notes   Hangup   |
+-------------------------------------------------------------+
```

### 7.1 Web Audio API Dual-Frequency Synthesizer Engine
Generates realistic telecommunications audio tones entirely in-browser without external MP3 dependencies:
- **Ringback Tone:** Dual sine oscillators at 440 Hz + 480 Hz with exponential gain decay repeating every 3 seconds.
- **Connected Chime:** Ascending sine burst from 520 Hz to 880 Hz.
- **Hangup Tone:** Descending sine sweep from 400 Hz down to 220 Hz.

### 7.2 Calling Lifecycle: Confirming → Ringing → Connected → Finished
1. **`confirming` State:** Confirms lead name, company, and phone number before placing the call. User clicks *"Start Call"*.
2. **`ringing` State:** Plays ringback tone. Displays calling animation. An automated timer triggers pickup simulation after 2.6 seconds (or user clicks *"Simulate Pickup"*).
3. **`connected` State:** Chime sounds. Live duration timer starts ticking every 1,000 ms (`MM:SS`).

### 7.3 Call Controls: Mute, Hold, Live Notes, and Minimization
- **Mute Button (`LuMic` / `LuMicOff`):** Toggles microphone mute state.
- **Hold Button (`LuPause` / `LuPlay`):** Pauses the duration timer and displays an on-hold visual indicator.
- **Live Notes Drawer (`LuFileText`):** Expands an inline textarea where the sales rep can type call notes during the conversation.
- **Minimize Button (`LuMinimize2`):**
  - Docks the active call into a floating pill widget at the bottom-right of the screen.
  - The call continues running in the background while the user navigates other CRM views!
  - Clicking the floating widget restores the full modal.

### 7.4 Call Termination & Automatic CRM Activity Injection
Clicking the crimson **"End Call"** button:
1. Stops audio oscillators and plays the disconnect tone.
2. Calculates final elapsed duration (e.g. *"02m 45s"*).
3. Auto-generates an activity of type `'Call'` in CRM state with outcome *"Connected - Discussion"* and logged notes.
4. Updates lead's `lastActivity` to *"Call logged: Connected - Discussion (02m 45s)"*.
5. Dispatches system notification and success toast.
6. Closes calling interface.

---

## 8. Company Accounts Dossier Flow (`AccountsView.jsx` & `AccountDetailView.jsx`)

### 8.1 Company Accounts Grid & Portfolio Valuation (`AccountsView.jsx`)
- Grid of company cards showing estimated account worth, industry, size, website, location, and assigned account owner.
- Filterable by global search, date range, and owner filter.
- **Clicking any card:** Calls `onSelectAccount(acc)` → opens `AccountDetailView`.

### 8.2 Full-Page Account Dossier (`AccountDetailView.jsx`)
Comprehensive company profile displaying financial valuation, employee scale, linked prospects, and corporate contacts.

### 8.3 Inline Profile Editor & Company Metadata Management
- Click **"Edit Profile"**: Form fields become editable (Company Name, Industry, Size, Estimated Account Value, Website, Location, Owner).
- Click **"Save Profile"**: Updates account record in state and `localStorage`, triggering a toast confirmation.

### 8.4 Linked Leads Sub-Table & Account-Scoped Lead Creation
- Table displaying all leads associated with this company.
- Clicking any lead row navigates directly to that lead's dossier.
- Click **"+ Add Lead"**: Launches `CommonActionsModal` with company name pre-locked to this account!

### 8.5 New Company Auto-Discovery Modal (`NewCompanyPromptModal.jsx`)
If a user creates a lead or deal for a company name that does not exist in CRM records, `NewCompanyPromptModal` intercepts the flow:
- Informs user: *"You have created a record for {companyName}. Please enter the required company details to complete the profile."*
- **"Skip for Now":** Closes modal; generates stub account with defaults.
- **"Enter Company Details":** Immediately navigates to `AccountDetailView` in edit mode so the rep can populate full company dossier data!

---

## 9. Opportunities Pipeline Flow (`OpportunitiesView.jsx`)

### 9.1 View Switcher: List View vs Interactive Kanban Board
Toggle between List View (`LuList`) and Kanban Board (`LuLayoutGrid`) via header icon buttons.

### 9.2 Kanban Drag-and-Drop Stage Transitions
5 drag-and-drop columns: **Discovery**, **Proposal Sent**, **Negotiation**, **Qualified**, **Closed Won**.

```
+---------------------------------------------------------------------------------------+
| Discovery (2)     Proposal Sent (1)   Negotiation (3)    Qualified (4)   Closed Won(2)|
| +---------------+ +-----------------+ +----------------+ +-------------+ +----------+ |
| | Tata Cloud    | | HDFC Integration| | Mahindra Fleet | | Titan Retail| | Jio 5G   | |
| | ₹45,00,000    | | ₹80,00,000      | | ₹1,20,00,000   | | ₹35,00,000  | | ₹2.40 Cr | |
| | [Drag me ---->| |                 | |                | |             | |          | |
| +---------------+ +-----------------+ +----------------+ +-------------+ +----------+ |
+---------------------------------------------------------------------------------------+
```

#### What Happens When You Drag and Drop:
1. User clicks and drags an opportunity card (`onDragStart`).
2. Target column highlights with an active drop border (`onDragOver`).
3. User releases the card into the new column (`onDrop`):
   - Card moves into the target stage column.
   - Updates `currentStage` in CRM state and `localStorage`.
   - Dispatches system notification: *"Moved '{oppName}' to {newStage}"*.
   - Displays toast confirmation.

### 9.3 List View Controls & Quick Action Communication Triggers
In List View, every deal row features communication shortcuts:
- **Phone Icon:** Initiates phone call session.
- **Mail Icon:** Opens email composer pre-addressed to the account lead.
- **WhatsApp Icon:** Opens chat composer.
- **Stage Dropdown:** Allows inline stage reassignment directly within the row.

### 9.4 Stage & Owner Drawer Filters
Clicking the filter icon opens a drawer to isolate deals by stage, owner, and expected closure date.

### 9.5 Lead-to-Opportunity Conversion Flow (`ConvertConfirmModal.jsx`)
Triggered from lead dossiers when advancing to opportunity stage:
- Shows projected deal value (default ₹1,20,00,000) and initial probability (60%).
- Clicking **"Confirm & Convert"**:
  - Creates a new opportunity record in `opportunities`.
  - Links it to the parent company account.
  - Automatically switches `activeModule = 'opportunities'`.
  - Dispatches system notification and toast.

---

## 10. Activities & Engagement Timeline (`ActivitiesView.jsx`)

### 10.1 Segmented Activity Filtering Tabs
Tabs: **All**, **Call**, **Email**, **SMS / WhatsApp**, **Follow-up**, **Meeting**.
- Clicking a tab filters the timeline cards accordingly.

### 10.2 Timeline Cards, Overdue Highlighting, and Traversal
- Chronological stream with color-coded category icons.
- Overdue activities display a crimson border and alert tag.
- **Clicking any activity card:** Automatically identifies linked lead or company and navigates directly to that entity's dossier!

---

## 11. Commercial Proposals Directory (`ProposalsView.jsx`)

### 11.1 Commercial Proposals Valuation Table
Tracks commercial quotes, contract values, submission dates, and expiration dates.
- Columns: Proposal ID, Company Account, Opportunity Name, Proposal Value, Est. Account Worth, Validity Date, Status Pipeline, Owner.

### 11.2 Account Cross-Navigation & Value Propagation
- Clicking either **Proposal ID** or **Company Account** navigates straight to `AccountDetailView` with `accountInitialTab = 'Proposals'`, displaying all proposals tied to that account.

---

## 12. Enterprise Contacts Directory (`ContactsView.jsx`)

### 12.1 Preset Classification Filters
Preset filter pills: **All Contacts**, **By Account**, **By Owner**, **Recently Contacted**, **No Activity**.
- Clicking a pill isolates contacts based on relationship activity status.

### 12.2 Relationship Status Tracking & Account Association
- Displays relationship health chips (*Active*, *Recent*, *No Activity*).
- Clicking the company name links to that company's dossier with `accountInitialTab = 'Contacts'`.

---

## 13. Master Data Management Suite (`MasterDataView.jsx`)

An administrative workspace managing 8 operational CRM dictionaries.

```
+-----------------------------------------------------------------------------+
| Master Data Categories:                                                     |
| [Products & Services]    [Lead Sources]          [Industry Sectors]         |
| [Pipeline Stages]        [Email Templates]       [Sales Objections]         |
| [Follow-up Cadences]     [AI Scoring Rules]                                 |
+-----------------------------------------------------------------------------+
| Selected: Email Templates                       [Search...]  [+ New Template|
|-----------------------------------------------------------------------------|
| Template Name           Subject Line                     Actions            |
| Initial Enterprise Intro Comprehensive Cloud & CRM Suite [Preview] [Edit] [X|
| Technical Demo Followup Architecture Specs & Next Steps  [Preview] [Edit] [X|
+-----------------------------------------------------------------------------+
```

### 13.1 Products & Services Catalog
Manage enterprise products, SKUs, pricing tiers (e.g. ₹15,00,000 / yr), and billing models.

### 13.2 Lead Acquisition Sources & Cost-per-Lead Attribution
Configure acquisition channels, digital attribution weights, and cost-per-lead tracking metrics.

### 13.3 Industry Sectors, Tiers & Margin Benchmarks
Standardize industry classifications, priority targeting tiers, and standard margin benchmarks.

### 13.4 Pipeline Funnel Stages & SLA Breach Parameters
Configure deal stages, win probabilities, and maximum allowed SLA days before escalation.

### 13.5 Corporate Email Templates & Dynamic Merge Tag Engine
Centralizes standardized sales copy. Features dynamic merge tags (`{LeadName}`, `{Company}`, `{Owner}`, `{ProductName}`).
- **Preview Button (`LuEye`):** Opens a live preview modal demonstrating how the email looks with merge tags populated.
- **Edit Button (`LuPencil`):** Opens template editor modal.
- **"+ New Template" Button:** Creates a new reusable corporate template.

### 13.6 Sales Objections & Strategic Rebuttals
Directory of common buyer pricing and technical objections paired with approved executive rebuttal strategies.

### 13.7 Lead Cadences & Escalation Timelines
Configures communication intervals (Day 1, Day 3, Day 7, Day 14) and mandatory next actions.

### 13.8 AI Lead Scoring & Intent Rule Matrix
Adjusts algorithmic point weightings (e.g., C-Suite title = +25 pts, Demo request = +30 pts) used to prioritize inbound inquiries.

---

## 14. User Profile & Workspace Configuration (`ProfileView.jsx`)

### 14.1 Hero Identity Dossier & Performance Metrics
- Displays circular monogram avatar, user full name, role, and enterprise department.
- **Key Metrics:** Win Rate (%), Year-to-Date Closed Revenue (₹ Cr), and Average Deal Size (₹ Lakhs).

### 14.2 Contact Information & Bio Form
Editable fields for Name, Title, Department, Phone, Location, Time Zone, and Executive Bio.
- Clicking **"Save Changes"** commits updates to `localStorage` and displays a confirmation badge.

### 14.3 Security Preferences, 2FA & Notification Toggles
Toggle switches for:
- Overdue Lead Email Alerts
- New Inbound Lead Push Alerts
- High-Value Deal SMS Notifications
- Two-Factor Authentication (2FA)

---

## 15. Universal Multi-Entity Modal Engine (`CommonActionsModal.jsx`)

The multi-entity creation and action modal for the entire CRM.

```
+------------------------------------------------------------------------------+
| Common Actions: Create or Log Record                                 [X Close]
| Entity Type: [Lead v] (Options: Lead, Account, Opportunity, Contact, Task...) |
|------------------------------------------------------------------------------|
| Target Company: [Tata Tech                    ]  <-- Smart Autocomplete       |
|                 [Existing: Tata Technologies  ]                               |
| Contact Name:   [Aarav Mehta                  ]                               |
| Email Address:  [aarav@tatatech.co.in         ]                               |
| Phone Number:   [+91 98765 43210              ]                               |
| Lead Source:    [Website v]        Lead Owner:  [Rajesh Sharma v]             |
| Due Date:       [2026-09-15]       Due Time:    [10:30 AM v]                  |
| Notes:          [Scheduled technical architecture discovery session.]        |
|------------------------------------------------------------------------------|
| [Cancel]                                                      [Create Lead]  |
+------------------------------------------------------------------------------+
```

### 15.1 Entity Selector & Color-Coded Categories
Dropdown at the top switches between 6 primary entity creators and 7 contextual actions:
- **Lead** (`#EFF6FF` / Blue)
- **Company / Account** (`#F0FDF4` / Green)
- **Opportunity / Deal** (`#FAF5FF` / Purple)
- **Contact Person** (`#FFF7ED` / Orange)
- **Activity / Task** (`#FEF2F2` / Red)
- **Commercial Proposal** (`#F0FDFA` / Teal)

### 15.2 Smart Company Autocomplete & Auto-Detection
The `CompanyAutocompleteInput` component evaluates input keystrokes:
- Matches existing CRM companies in real-time.
- If a new name is typed, displays a blue indicator: *"You are creating a new company"*.
- When submitted, the system auto-generates the account and opens `NewCompanyPromptModal`!

### 15.3 Detailed Flow: Creating a Lead
- **Inputs:** Lead Name, Company, Designation, Phone, Email, Source, Owner, Priority, Due Date & Time, Notes.
- **On Submit:**
  - Instantiates `LD-{timestamp}`.
  - Inserts lead at the top of `leads` array.
  - Checks if company exists; if not, creates new account and queues `NewCompanyPromptModal`.
  - Dispatches notification and toast: *"Lead '{leadName}' created"*.

### 15.4 Detailed Flow: Creating a Company Account
- **Inputs:** Company Name, Industry, Company Size, Website, Location, Estimated Value, Primary Contact, Tier, Notes.
- **On Submit:** Checks duplicates. Creates `ACC-GEN-{timestamp}`. Adds to `accounts` state. Dispatches notification and toast.

### 15.5 Detailed Flow: Creating an Opportunity
- **Inputs:** Opportunity Name, Company, Estimated Value, Stage, Probability, Close Date, Owner.
- **On Submit:** Creates `OPP-{timestamp}`. Increments `oppsCount` on parent company account. Adds to `opportunities` state.

### 15.6 Detailed Flow: Creating a Contact
- **Inputs:** Name, Company, Designation, Email, Phone, Owner.
- **On Submit:** Creates `CONT-{timestamp}`. Adds to `contacts` state.

### 15.7 Detailed Flow: Scheduling an Activity / Task
- **Inputs:** Title, Activity Type, Company, Contact Person, Due Date, Time, Owner, Notes.
- **On Submit:** Creates `ACT-{timestamp}`. Adds to `activities` state.

### 15.8 Detailed Flow: Drafting a Proposal
- **Inputs:** Proposal Title, Company, Opportunity Name, Proposal Value, Validity Date, Owner.
- **On Submit:** Creates `PROP-{timestamp}`. Adds to `proposals` state.

### 15.9 Detailed Flow: Logging a Phone Call
- **Inputs:** Outcome (e.g. *Connected - Positive*), Duration, Notes.
- **On Submit:** Adds call record to `activities`. Updates target lead's `lastActivity`.

### 15.10 Detailed Flow: Composing & Sending Rich Corporate Emails
- **Features:** Template selector, Subject input, CC email tag field, Attachment uploader, Rich body textarea.
- **On Submit:** Dispatches email record to `activities` for all target leads. Updates `lastActivity` on lead records.

### 15.11 Detailed Flow: Logging WhatsApp / SMS Messages
- **Inputs:** Message text.
- **On Submit:** Creates `SMS / WhatsApp` record in `activities`. Updates lead `lastActivity`.

### 15.12 Detailed Flow: Bulk Assigning Owners
- **Inputs:** New Owner dropdown.
- **On Submit:** Reassigns `leadOwner` across all selected lead IDs. Updates `leads` state. Clears bulk selection.

### 15.13 Detailed Flow: Bulk Updating Pipeline Stages
- **Inputs:** New Pipeline Stage dropdown.
- **On Submit:** Updates `status` across all selected leads. Appends stage transition history entry to each lead.

### 15.14 Detailed Flow: Adding Notes
- **Inputs:** Notes textarea.
- **On Submit:** Appends note with bullet point to target lead's `notes` string. Updates `lastActivity`.

### 15.15 Detailed Flow: Scheduling Follow-ups
- **Inputs:** Due Date, Time, Next Action notes.
- **On Submit:** Sets `nextFollowup` on lead. Generates scheduled activity in `activities` state.

---

## 16. Comprehensive Button Action & Relational Side-Effect Matrix

| Location / View | Button / Element | Triggered Function | Direct State Changes | Relational Side Effects & Notifications |
|---|---|---|---|---|
| **Sidebar** | Brand Container | `setActiveModule('dashboard')` | Resets detail views; sets `activeModule = 'dashboard'` | GSAP transition plays; Dashboard view mounts |
| **Sidebar** | `LuPanelLeft` Toggle | `setIsCollapsed(!isCollapsed)` | Toggles `isSidebarCollapsed` boolean | Adjusts CSS grid column width from 260px to 76px |
| **Sidebar** | Menu Item Click | `setActiveModule(item.id)` | Sets `activeModule`; clears detail views | Dismisses mobile drawer; switches view |
| **Sidebar** | Profile Card | `handleOpenProfile()` | `isProfileActive = true` | Mounts full-page user profile dossier |
| **GlobalHeader** | Universal Search Result | `handleSelectSearchResult()` | Sets `selectedLead` or `selectedAccount` | Deep-links to detail view; resets search input |
| **GlobalHeader** | Custom Date Selector | `setSelectedDateFilter()` | Updates global `selectedDateFilter` | Re-evaluates date filter predicates across all modules |
| **GlobalHeader** | Owner Filter | `setSelectedOwnerFilter()` | Updates `selectedOwnerFilter` | Filters all views by assigned sales rep |
| **GlobalHeader** | "+ Create New" | `onOpenCreateModal()` | `isCreateModalOpen = true` | Opens `CommonActionsModal` with contextual default |
| **GlobalHeader** | Notification Card | `onNotificationClick()` | Sets `isRead: true` on item; closes popover | Deep-links to target module (`targetModule`) |
| **GlobalHeader** | "Mark Read" Button | `onMarkAllAsRead()` | Sets `isRead: true` for all notifications | Unread count badge resets to 0; triggers toast |
| **Dashboard** | Revenue Toggle | `setRevenueToggle()` | Switches `revenueToggle` ('Monthly'/'Quarterly'/'FY') | Recharts line chart re-renders data series |
| **Dashboard** | Marketing Donut Slice | `onNavigateToLeads(source)` | Sets `leadsSourceFilter = source`; opens Leads | Navigates to LeadsView pre-filtered by source |
| **Dashboard** | "Companies" Card | `onNavigateToAccounts()` | Sets `activeModule = 'accounts'` | Navigates to AccountsView with breadcrumb origin |
| **Dashboard** | "No. of Leads" Card | `onNavigateToLeads()` | Sets `activeModule = 'leads'` | Navigates to LeadsView showing all leads |
| **Dashboard** | "Overdue Leads" Card | `onNavigateToLeads('OVERDUE')` | Sets `leadsOverdueOnly = true` | Navigates to LeadsView filtered to overdue leads |
| **Dashboard** | "Today's Follow-ups" | `onNavigateToActivities()` | Sets `activitiesInitialTab = 'Follow-up'` | Navigates to ActivitiesView on 'Follow-up' tab |
| **Dashboard** | "Inspect Next Action" | `onSelectLead(item)` | Sets `selectedLead = item` | Mounts LeadDetailView for target lead |
| **LeadsView** | Master Checkbox | `handleSelectAll()` | Updates `selectedLeadIds` array | Toggles all visible lead IDs; updates bulk bar |
| **LeadsView** | Row Checkbox | `handleToggleLead()` | Toggles ID in `selectedLeadIds` | Updates header counter and indeterminate state |
| **LeadsView** | "Assign Owner" (Bulk) | `handleBulkAction('assignOwner')` | Opens modal with `bulkLeadIds` | On save: updates all selected leads simultaneously |
| **LeadsView** | "Email" (Bulk) | `handleBulkAction('email')` | Opens modal with `bulkLeadIds` | On save: dispatches emails to all selected leads |
| **LeadsView** | "Update Stage" (Bulk) | `handleBulkAction('changeStatus')` | Opens modal with `bulkLeadIds` | On save: advances pipeline stage for entire batch |
| **LeadsView** | Row / "View" Button | `onSelectLead(lead)` | Sets `selectedLead = lead` | Mounts LeadDetailView; plays GSAP view transition |
| **LeadsView** | Company Name Cell | `onSelectAccount(company)` | Resolves account; sets `selectedAccount` | Mounts AccountDetailView with breadcrumb origin |
| **LeadDetail** | Breadcrumb Link | `onBack()` / `onNavigateHome()` | Clears `selectedLead = null` | Returns to origin view (Dashboard/Leads/Contacts) |
| **LeadDetail** | Status Dropdown Item | `handleStageClick(newStage)` | Sets `pendingStage = newStage` | Opens `StageConfirmModal` |
| **LeadDetail** | Stage Confirm Button | `handleConfirmStage()` | Updates `lead.status` | Records stage audit trail; pushes notification & toast |
| **LeadDetail** | "Edit" Contact Details| `handleOpenEditModal()` | `isEditModalOpen = true` | Opens full lead contact edit modal |
| **LeadDetail** | Tab Switcher | `setActiveTab(tab)` | Sets `activeTab` ('Activity'/'Calls'/etc.) | Switches sub-panel view; updates CTA action label |
| **LeadDetail** | "+ Call" CTA Button | `onQuickAction('call', lead)` | Sets `callSession` state | Launches in-browser VoIP calling modal |
| **LeadDetail** | "+ Add Note" CTA | `onQuickAction('addNote', lead)` | Opens modal with `actionType = 'addNote'` | Appends note; updates `lastActivity` on lead |
| **LeadDetail** | Sort Order Toggle | `setPipelineSortOrder()` | Toggles `pipelineSortOrder` ('desc' ↔ 'asc') | Inverts chronological flow of pipeline stream |
| **LeadDetail** | Activity Row Click | `setSelectedActivityForModal()`| Sets `selectedActivityForModal = act` | Opens inspection modal (Gmail layout if email) |
| **CallSession** | "Start Call" Button | `onConfirmCall()` | Sets `callSession.status = 'ringing'` | Starts Web Audio ringback tone; queues auto-pickup |
| **CallSession** | "Simulate Pickup" | `onSimulatePickup()` | Sets `callSession.status = 'connected'` | Plays connect chime; starts live duration timer |
| **CallSession** | Mute / Hold Toggles | `onToggleMute()` / `onToggleHold()` | Toggles boolean flags on session | Mutes mic or pauses duration counter |
| **CallSession** | Minimize Button | `onToggleMinimize()` | Toggles `callSession.isMinimized` | Docks dialer into floating bottom-right widget |
| **CallSession** | "End Call" Button | `onEndCall()` | Calculates duration; resets `callSession = null`| Injects call activity; updates lead `lastActivity` |
| **AccountsView**| Company Card Click | `onSelectAccount(acc)` | Sets `selectedAccount = acc` | Mounts AccountDetailView |
| **AccountDetail**| "Edit Profile" Button | `setIsEditing(true)` | Toggles `isEditing = true` | Form inputs become editable |
| **AccountDetail**| "Save Profile" Button | `handleSaveProfile()` | Updates account record; `isEditing = false`| Syncs to localStorage; triggers toast notification |
| **AccountDetail**| "+ Add Lead" Button | `onOpenCreateModal('createLead')`| Opens modal with company pre-filled | Created lead links automatically to this account |
| **NewCompany** | "Enter Company Details"| `onConfirm()` | Closes prompt; sets `selectedAccount` | Mounts AccountDetailView in edit mode |
| **OppsView** | View Mode Toggle | `setViewMode('list' / 'kanban')` | Toggles `viewMode` | Switches between list table and Kanban board |
| **OppsView** | Kanban Card Drag/Drop | `handleMoveStage(oppId, stage)` | Updates `opp.currentStage` | Card moves column; triggers notification & toast |
| **OppsView** | Phone / Mail Icons | `triggerLocalToast()` / Calling | Triggers call dialer or email modal | Contextual action executed for opportunity contact |
| **MasterData** | Category Card Click | `setSelectedCategory(cat)` | Sets `selectedCategory = cat` | Opens administrative catalog for that dataset |
| **MasterData** | Template Preview (Eye)| `setPreviewingTemplate(tpl)` | Sets `previewingTemplate = tpl` | Opens corporate email preview modal |
| **MasterData** | "+ Add Item" Button | `setIsAddModalOpen(true)` | Opens item creator modal | Adds new SKU/source/template to master data |
| **ProfileView** | Tab Switcher | `setActiveTab('details'/'security')`| Sets active profile tab | Switches between personal info and 2FA settings |
| **ProfileView** | "Save Changes" | `handleSaveProfile()` | Sets `savedSuccess = true` | Persists user profile; shows green success pill |
| **ProfileView** | "Log Out" Button | `onLogout()` | Sets `isLogoutModalOpen = true` | Opens LogoutConfirmModal |
| **LogoutModal** | "Yes, Log Out" | `handleConfirmLogout()` | Clears auth tokens; sets `isAuthenticated = false`| Redirects to LoginView; dispatches logout toast |

---

*This document serves as the exhaustive technical and operational source of truth for the TechGy Link Enterprise CRM platform.*
