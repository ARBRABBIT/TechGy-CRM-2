# TechGy Link — Enterprise CRM Workspace

TechGy Link is an enterprise CRM platform designed for managing leads, company accounts, sales opportunities, proposals, and customer engagement activities with an Apple-grade, responsive design system.

## Key Features

- **Executive Dashboard**: Real-time sales KPIs, revenue forecasts, activity tracking, and priority action lists.
- **Lead Pipeline**: Kanban and list views with stage transitions, custom date filters, and one-click opportunity conversion.
- **Account Management**: Company dossiers with estimated worth, linked leads, contacts, and activity timelines.
- **Opportunity & Proposals Tracking**: Pipeline stages, closing probabilities, and commercial documentation tracking.
- **Interactive Notifications**: Apple-style segmented notifications popover with overdue alerts, unread badges, and toast announcements.
- **Micro-Interactions**: Smooth GSAP page transitions and Framer Motion spring physics.

## Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **UI & Components**: React 19, React Icons (`react-icons/lu`)
- **Animation**: GSAP + Framer Motion
- **Data Visualizations**: Recharts
- **Linting**: Oxlint

## Getting Started

### Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test            # run once
npm run test:watch  # re-run on change
```
Vitest + Testing Library (jsdom). Unit tests cover roles, permissions, validation and session storage; `src/App.test.jsx` drives the real app through login, logout, lead editing, assignment and deletion for each role.

## Roles & Permissions

Rules live in `src/utils/permissions.js` and are checked twice: the UI hides controls a role can't use, and every App handler re-checks before changing data.

| | Sales Admin | Sales Head | Sales Executive |
|---|---|---|---|
| Leads visible | All | Own + team's | Assigned to them |
| Create / edit leads | ✓ | ✓ | — |
| Change status, notes, follow-ups, calls, email | ✓ | ✓ | ✓ |
| Assign executives | ✓ | Own team only | — |
| Junk / restore | ✓ | ✓ | — |
| Delete, bulk import, assign sales heads | ✓ | — | — |
| Team registry, Master Data | ✓ | — | — |

These checks run in the browser only. A production backend must enforce the same rules on the server.
