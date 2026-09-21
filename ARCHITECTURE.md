# 🏗️ TechGy CRM Code Architecture & Folder Structure

Welcome to the TechGy CRM codebase! This project is organized so that **anyone (even a toddler!)** can immediately find what they need, and **any backend developer** can hook up a real REST or GraphQL server in minutes.

---

## 📁 The Big Picture

```
TechGy CRM Internal/
├── app/                  # 🌐 Next.js App Router entry points (layout.jsx, page.jsx)
├── public/               # 🖼️ Static assets (icons, images, logos)
├── docs/                 # 📚 Detailed CRM flow & specifications documentation
├── jsconfig.json         # ⚡ Enables "@/*" import alias pointing directly to "./src/*"
│
└── src/                  # 💻 All Application Source Code
    ├── api/              # 🔌 SERVER TALK: Where the frontend talks to the backend
    ├── components/       # 🧩 LEGO BLOCKS: Reusable visual UI components
    │   ├── common/       # 🧰 Everyday tools (date pickers, filters, badges)
    │   ├── layout/       # 🏛️ Frame of the house (Sidebar, GlobalHeader)
    │   ├── leads/        # 🎯 Lead tools (Call history, chat timeline, stage progress)
    │   ├── modals/       # 💬 Popups (Call session, create actions, stage confirmation)
    │   └── index.js      # 📦 Handy barrel export for all components
    ├── constants/        # ⚙️ FIXED RULES: Endpoints, API URLs, storage keys
    ├── data/             # 📦 TOY BOX: Mock initial data (leads, accounts, templates)
    ├── utils/            # 🛠️ HELPER TOOLS: Date formatting, animations, pipeline math
    ├── views/            # 🖥️ FULL SCREENS: What the user sees on each page
    ├── App.jsx           # 🚀 MAIN BRAIN: Orchestrates state, views, and routing
    └── index.css         # 🎨 COLOR & STYLE: Enterprise Navy design system & tokens
```

---

## 👶 Toddler-Simple Folder Guide

| Folder | Simple Analogy | What lives here? |
| :--- | :--- | :--- |
| **`src/api/`** | **The Telephone** | Everything that communicates with the server (`client.js`, `leadsApi.js`, `accountsApi.js`, etc.). |
| **`src/components/layout/`** | **The House Frame** | The header bar at the top and the sidebar menu on the left. |
| **`src/components/modals/`** | **Popup Boxes** | Pop-up windows that ask questions or let you log calls and actions. |
| **`src/components/leads/`** | **Lead Widgets** | Visual widgets specifically used inside lead detail pages (timeline, calls, chat). |
| **`src/components/common/`** | **Utility Tools** | Reusable selectors like the calendar picker and multi-tag dropdown filter. |
| **`src/views/`** | **Television Channels** | Each full screen in the app (Dashboard, Leads, Accounts, Contacts, Activities, Master Data, Profile, Login). |
| **`src/constants/`** | **The Rulebook** | Backend URL settings (`apiConfig.js`) and database/storage names (`storageKeys.js`). |
| **`src/data/`** | **Sample Toys** | Sample leads, accounts, and phone numbers to play with before the real backend is connected. |
| **`src/utils/`** | **The Toolbox** | Handy math and formatting functions (like converting dates into "2 hours ago"). |

---

## 🔌 How to Integrate with a Real Backend in 3 Steps

All backend communication is already centralized inside `src/api/`! You never need to touch the UI components to hook up your server.

### Step 1: Tell the App Where Your Server Lives
Create a file named `.env.local` in the project root:

```env
# URL of your backend API server (Node/Express, Django, FastAPI, Go, etc.)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/v1

# Turn off mock mode so requests go to your live server
NEXT_PUBLIC_USE_MOCK=false
```

### Step 2: The API Client Automatically Handles Authentication
In `src/api/client.js`, the `apiClient` automatically attaches the logged-in JWT token:
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### Step 3: Match Your Backend Endpoints
In `src/constants/apiConfig.js`, you can adjust the route paths to match your server routes:
```javascript
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile'
  },
  LEADS: {
    LIST: '/leads',
    DETAIL: (id) => `/leads/${id}`,
    UPDATE_STAGE: (id) => `/leads/${id}/stage`
  },
  ACCOUNTS: {
    LIST: '/accounts',
    DETAIL: (id) => `/accounts/${id}`
  }
  // ...
};
```

That's it! Every method in `src/api/leadsApi.js`, `src/api/accountsApi.js`, etc. is an `async` function that returns clean data ready for React.

---

## 💡 Quick Import Examples

Thanks to path aliases configured in `jsconfig.json`, you can import from anywhere cleanly without messy `../../../`:

```javascript
// Import from the API layer
import { leadsApi, accountsApi } from '@/api';

// Import UI components
import { GlobalHeader, Sidebar } from '@/components';
import FormDateSelector from '@/components/common/FormDateSelector';
import StageConfirmModal from '@/components/modals/StageConfirmModal';

// Import constants
import { API_BASE_URL } from '@/constants/apiConfig';
```
