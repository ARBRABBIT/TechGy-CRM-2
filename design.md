# TechGy CRM — Mobile & Web Design System Specification
> **Document Version:** 2.0.0  
> **Target Platforms:** Mobile (iOS / Android / React Native / Flutter / SwiftUI / Jetpack Compose) & Responsive Web  
> **Core Theme:** Enterprise Modern Blue (`#063669`) & Apple Human Interface Guidelines (HIG) Minimalist Clean  
> **Design Language:** *Borderless Soft Elevation*

---

## Table of Contents
1. [Design Philosophy & Core Tenets](#1-design-philosophy--core-tenets)
2. [Design Tokens & Theme Variables](#2-design-tokens--theme-variables)
   - [2.1 Color Palette & Semantic System](#21-color-palette--semantic-system)
   - [2.2 Typography Scale & Hierarchy](#22-typography-scale--hierarchy)
   - [2.3 Elevation, Shadows & Glassmorphism](#23-elevation-shadows--glassmorphism)
   - [2.4 Border Radii & Corner Geometry](#24-border-radii--corner-geometry)
   - [2.5 Spacing, Grid & Touch Targets](#25-spacing-grid--touch-targets)
3. [Comprehensive Status & Chip Matrix](#3-comprehensive-status--chip-matrix)
4. [Component Library Specifications](#4-component-library-specifications)
   - [4.1 Buttons & Action CTAs](#41-buttons--action-ctas)
   - [4.2 Form Controls, Inputs & Selectors](#42-form-controls-inputs--selectors)
   - [4.3 Apple HIG Segmented Controls](#43-apple-hig-segmented-controls)
   - [4.4 Apple Translucent Glassmorphic Date Picker](#44-apple-translucent-glassmorphic-date-picker)
   - [4.5 Metric Cards & KPI Revenue Blocks](#45-metric-cards--kpi-revenue-blocks)
   - [4.6 Lead Pipeline Progress Stepper](#46-lead-pipeline-progress-stepper)
   - [4.7 Data Tables to Mobile Card Transformation](#47-data-tables-to-mobile-card-transformation)
   - [4.8 Dialogs, Bottom Sheets & Drawers](#48-dialogs-bottom-sheets--drawers)
   - [4.9 Apple-Style Notifications Dropdown / Sheet](#49-apple-style-notifications-dropdown--sheet)
   - [4.10 Interactive In-App Call Manager & Floating Bar](#410-interactive-in-app-call-manager--floating-bar)
   - [4.11 Timeline & Chronological Activity Feed](#411-timeline--chronological-activity-feed)
5. [Mobile Navigation Architecture & Safe Areas](#5-mobile-navigation-architecture--safe-areas)
6. [Motion, Physics & Animation Guidelines](#6-motion-physics--animation-guidelines)
7. [Screen-by-Screen Mobile UI Blueprint](#7-screen-by-screen-mobile-ui-blueprint)
8. [Multi-Platform Mobile Token Reference](#8-multi-platform-mobile-token-reference)

---

## 1. Design Philosophy & Core Tenets

TechGy CRM's design system blends the authority and precision of enterprise B2B software with the lightweight, translucent, and tactile finesse of modern Apple Human Interface Guidelines (HIG).

### 1.1 "Borderless Soft Elevation"
Instead of heavy 1px or 2px gray borders separating every container, cards and widgets sit seamlessly on a clean off-white background (`#F9F9F9`). Structural grouping is achieved through:
- **Pure white card surfaces (`#FFFFFF`)** with gentle multi-stop shadows (`rgba(6, 54, 105, 0.05)` to `0.07`).
- **Generous internal padding** (16px to 24px) creating clear breathing room.
- **Tonal separation** via subtle fills (`#F0F5FA`, `#F8FAFC`, `#F1F5F9`) rather than divider lines.

### 1.2 Tactile 100% Pill Shapes
All interactive triggers—including Primary CTAs, secondary action buttons, filter tags, status chips, search boxes, and bottom action bars—employ full pill geometry (`border-radius: 9999px`). This creates a friendly, highly touchable mobile affordance that feels natural under the thumb.

### 1.3 Fluid Feedback & Apple Spring Curves
Every state transition (button presses, tab switches, bottom sheet reveals, call sound ripples) uses Apple's signature spring curve:  
`cubic-bezier(0.16, 1, 0.3, 1)` or `easeOutBack`. Active touch feedback depresses elements by `scale(0.97)` to `scale(0.96)`.

---

## 2. Design Tokens & Theme Variables

### 2.1 Color Palette & Semantic System

```
Primary Brand:       #063669 (TechGy Deep Indigo Navy)
Primary Hover:       #04264A (Midnight Blue)
Primary Active:      #084482 (Vibrant Royal Navy)
Primary Tint / Light:#F0F4F9 (Soft Ice Blue)
Surface App:         #F9F9F9 (Light Neutral Cloud)
Surface Card:        #FFFFFF (Pure Snow White)
Surface Inset / Alt: #F8FAFC (Cool Soft Gray)
```

#### Complete Palette Mapping

| Token Name | Hex Code | RGBA Equivalent | Usage in UI |
|---|---|---|---|
| `--primary` | `#063669` | `rgba(6, 54, 105, 1.0)` | Brand hero, primary buttons, active headers, calendar range caps |
| `--primary-hover` | `#04264A` | `rgba(4, 38, 74, 1.0)` | Button pressed state, hover highlights |
| `--primary-light` | `#F0F4F9` | `rgba(240, 244, 249, 1.0)`| Active menu pills, badge backgrounds, search focus |
| `--primary-active` | `#E6EFF8` | `rgba(230, 239, 248, 1.0)`| Selected table row, active segmented tab tint |
| `--primary-border` | `#D5E2EE` | `rgba(213, 226, 238, 1.0)`| Light borders, pill outlines, subtle separators |
| `--bg-app` | `#F9F9F9` | `rgba(249, 249, 249, 1.0)`| Master screen background behind cards |
| `--bg-card` | `#FFFFFF` | `rgba(255, 255, 255, 1.0)`| Surface of all cards, bottom sheets, modals |
| `--bg-subtle` | `#F8FAFC` | `rgba(248, 250, 252, 1.0)`| Form inputs, timeline cards, inactive preset buttons |
| `--text-main` | `#063669` | `rgba(6, 54, 105, 1.0)` | Primary text, titles, numeric metrics, bold labels |
| `--text-dark` | `#1A1C1D` | `rgba(26, 28, 29, 1.0)`   | Login headings, strong values, high-contrast text |
| `--text-muted` | `#557396` | `rgba(85, 115, 150, 1.0)` | Subtitles, field labels, metadata, secondary copy |
| `--text-secondary`| `#64748B` | `rgba(100, 116, 139, 1.0)`| Timestamp, table subheaders, inactive tab text |
| `--text-light` | `#94A3B8` | `rgba(148, 163, 184, 1.0)`| Placeholders, disabled states, overlines |
| `--alert-red` | `#DC2626` | `rgba(220, 38, 38, 1.0)`  | Destructive buttons, call hangup, overdue status, errors |
| `--alert-bg` | `#FEF2F2` | `rgba(254, 242, 242, 1.0)`| Alert badge background, warning banners |
| `--alert-border` | `#FECACA` | `rgba(254, 202, 202, 1.0)`| Border around critical alerts |
| `--success-green` | `#059669` | `rgba(5, 150, 105, 1.0)`  | Won deal badge, completed stage, positive KPI badge |
| `--success-accent`| `#10B981` | `rgba(16, 185, 129, 1.0)` | Call active green pulse, WhatsApp badge |
| `--success-bg` | `#ECFDF5` | `rgba(236, 253, 245, 1.0)`| Success chip fill, qualified stage pill |
| `--warning-amber` | `#D97706` | `rgba(217, 119, 6, 1.0)`  | High-priority warning, follow-up pending, discussion |
| `--warning-bg` | `#FFFBEB` | `rgba(255, 251, 235, 1.0)`| Warning chip background |
| `--info-blue` | `#2563EB` | `rgba(37, 99, 235, 1.0)`  | Informational links, in-progress stages |
| `--info-bg` | `#EFF6FF` | `rgba(239, 246, 255, 1.0)`| Info badges, unread notification pill |

---

### 2.2 Typography Scale & Hierarchy

- **Font Family:** `Plus Jakarta Sans`, accompanied by native fallbacks `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto`.
- **Typographic Rules:** Clean geometric sans-serif, tight letter-spacing on display numbers (`-0.02em` to `-0.04em`), clear contrast between labels and values.

| Level / Token | Size (px / pt) | Line Height | Weight | Letter Spacing | Mobile Usage |
|---|---|---|---|---|---|
| **Display Hero** | `32px` | `40px` | `600` / `700` | `-0.9px` (`-0.028em`) | Login greeting, total portfolio KPI value |
| **Heading 1 (H1)** | `24px` | `30px` | `700` / `800` | `-0.02em` | Main screen titles, large counter numbers |
| **Heading 2 (H2)** | `20px` | `26px` | `700` | `-0.015em` | Lead detail name, modal headers, section titles |
| **Heading 3 (H3)** | `17px` | `22px` | `600` / `700` | `-0.01em` | Card headlines, bottom sheet titles, popover headers |
| **Subtitle / Lead**| `15px` | `22px` | `500` / `600` | `normal` | Profile subtitle, customer company name |
| **Body Regular** | `14px` | `20px` | `400` / `500` | `normal` | Primary list items, input fields, email copy |
| **Body Medium** | `14px` | `20px` | `600` | `-0.005em` | Table data cells, interactive list titles |
| **Body Small** | `13px` | `18px` | `500` | `normal` | Activity notes, timeline descriptions, dropdown options |
| **Caption / Sub** | `12px` | `16px` | `500` / `600` | `+0.01em` | Timestamps, relative time ("2 hrs ago"), metadata |
| **Micro / Overline**| `10px` - `11px` | `14px` | `700` / `800` | `+0.06em` (UPPER) | Field labels ("LEAD SOURCE"), status badges |

---

### 2.3 Elevation, Shadows & Glassmorphism

Shadows in this design system use a distinct blue tint (`rgba(6, 54, 105, ...)`) rather than neutral black. This creates a branded, high-end glow.

```css
/* Token Definitions */
--shadow-sm: 0 2px 8px rgba(6, 54, 105, 0.05);
--shadow-md: 0 6px 16px rgba(6, 54, 105, 0.07);
--shadow-lg: 0 12px 24px rgba(6, 54, 105, 0.10);
--shadow-popover: 0 20px 40px -10px rgba(6, 54, 105, 0.20), 0 10px 20px -5px rgba(0, 0, 0, 0.06);
--shadow-modal: 0 25px 60px -12px rgba(6, 54, 105, 0.28), 0 10px 24px -6px rgba(6, 54, 105, 0.12);
--shadow-floating: 0 16px 40px rgba(6, 54, 105, 0.18), 0 4px 12px rgba(6, 54, 105, 0.08);
```

#### Glassmorphism & Translucency
- **Apple Date Popover & Filter Bar:** `background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);`
- **Modal / Bottom Sheet Backdrop:** `background: rgba(6, 54, 105, 0.45); backdrop-filter: blur(8px);`
- **Floating Active Call Bar:** `background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(12px);`

---

### 2.4 Border Radii & Corner Geometry

| Radius Token | Value | Applied To |
|---|---|---|
| `radius-xs` | `4px` - `6px` | Inline mini tags, calendar today dots |
| `radius-sm` | `7px` - `8px` | Form inputs, select dropdowns, brand logo squircle |
| `radius-md` | `10px` - `12px` | Inner calendar badges, timeline cards, segmented container |
| `radius-lg` | `16px` | Screen cards, modal dialogs, floating call bar |
| `radius-xl` | `20px` | Master data hub cards, bottom sheet top corners, notifications card |
| `radius-pill` | `9999px` (Full) | All buttons (`.btn-primary`, `.btn-secondary`), status chips, date trigger, search box |
| `radius-circle`| `50%` | Contact avatars, timeline node icons, call action buttons |

---

### 2.5 Spacing, Grid & Touch Targets

- **Base Unit:** `4px` grid (8, 12, 16, 20, 24, 32, 40, 48, 64px).
- **Mobile Screen Margins:** `16px` horizontal padding on compact phones (`≤ 390px`), `20px` on larger devices.
- **Card Gutter / Gap:** `12px` to `16px` vertical separation between cards.
- **Minimum Tap Target:** `44 × 44 pt` (iOS HIG) / `48 × 48 dp` (Material Design).
- **Form Input Height:** `48px` to `56px` for comfortable thumb input.
- **Primary CTA Height:** `48px` to `52px` with full pill radius.

---

## 3. Comprehensive Status & Chip Matrix

Status indicators are crucial for CRM mobile users scanning leads, deals, and proposals in the field. Every status uses a 100% borderless pill with distinct color semantics.

```
Geometry: Height 24px - 28px | Padding: 4px 10px | Border Radius: 9999px (or 6px for compact table chip)
Font: Plus Jakarta Sans, 11px - 12px, Weight 700 (Bold)
```

| Entity | Status Name | Background Hex | Text Hex | Shadow / Border | Mobile Icon |
|---|---|---|---|---|---|
| **Lead / Deal** | `New` | `#FFFFFF` | `#063669` | `0 1px 4px rgba(6, 54, 105, 0.08)` | Sparkle / Circle |
| **Lead / Deal** | `Contacted` | `#F0F5FA` | `#063669` | None | PhoneCall |
| **Lead / Deal** | `Qualified` | `#063669` | `#FFFFFF` | None | CheckCircle |
| **Lead / Deal** | `Discussion` | `#084482` | `#FFFFFF` | None | MessageSquare |
| **Lead / Deal** | `Proposal` | `#E0E6EE` | `#063669` | None | FileText |
| **Lead / Deal** | `Negotiation` | `#084482` | `#FFFFFF` | None | Handshake |
| **Lead / Deal** | `Won` | `#063669` (or `#059669`) | `#FFFFFF` | `0 2px 6px rgba(6, 54, 105, 0.2)` | Trophy / Star |
| **Lead / Deal** | `Lost` | `#EF4444` | `#FFFFFF` | None | XCircle |
| **Proposal** | `Draft` | `#F1F5F9` | `#475569` | None | Edit3 |
| **Proposal** | `Sent` | `#E0E6EE` | `#063669` | None | Send |
| **Proposal** | `Viewed` | `#DBEAFE` | `#1D4ED8` | None | Eye |
| **Proposal** | `Accepted` | `#063669` | `#FFFFFF` | None | CheckCheck |
| **Proposal** | `Rejected` | `#EF4444` | `#FFFFFF` | None | Ban |
| **Activity** | `Overdue` | `#DC2626` | `#FFFFFF` | None | AlertTriangle |
| **Activity** | `Due Today` | `#D97706` | `#FFFFFF` | None | Clock |
| **Activity** | `Upcoming` | `#063669` | `#FFFFFF` | None | Calendar |
| **Priority** | `High` | `#FEF2F2` | `#DC2626` | Border: `1px solid #FECACA` | Flame |
| **Priority** | `Medium` | `#FFFBEB` | `#D97706` | Border: `1px solid #FDE68A` | Minus |
| **Priority** | `Low` | `#F0FDF4` | `#16A34A` | Border: `1px solid #BBF7D0` | ArrowDown |

---

## 4. Component Library Specifications

### 4.1 Buttons & Action CTAs

All buttons adhere to the **Pill Rule** (`border-radius: 9999px`).

```
┌──────────────────────────────────────────────────────────────┐
│  [✦ Primary Action Button]       [ Secondary Action Button ] │
│  Height: 48px | Radius: 9999px   Height: 48px | Radius: 9999px│
│  BG: #063669 | Text: #FFFFFF     BG: #FFFFFF | Text: #063669  │
│  Shadow: 0 4px 14px (20% Navy)   Shadow: 0 2px 6px (5% Navy)  │
└──────────────────────────────────────────────────────────────┘
```

#### Primary CTA (`.btn-primary`)
- **Background:** `#063669`
- **Text Color:** `#FFFFFF`
- **Font:** 15px Bold (`weight: 700`)
- **Height:** 48px (Mobile), 40px (Compact desktop)
- **Padding:** `0 24px`
- **Border Radius:** `9999px`
- **Shadow:** `0 4px 14px rgba(6, 54, 105, 0.20)`
- **Pressed State:** Background `#04264A`, `transform: scale(0.97)`
- **Active Ripple:** Soft circular wave expanding from touch origin.

#### Secondary CTA (`.btn-secondary`)
- **Background:** `#FFFFFF`
- **Text Color:** `#063669`
- **Font:** 15px Semi-Bold (`weight: 600`)
- **Height:** 48px
- **Padding:** `0 20px`
- **Border Radius:** `9999px`
- **Shadow:** `0 2px 6px rgba(6, 54, 105, 0.05)`
- **Pressed State:** Background `#F9F9F9`, `transform: scale(0.97)`

#### Destructive Action Button (`.btn-danger`)
- **Background:** `#DC2626`
- **Text Color:** `#FFFFFF`
- **Height:** 48px | **Border Radius:** `9999px`
- **Shadow:** `0 4px 14px rgba(220, 38, 38, 0.25)`
- **Pressed State:** Background `#B91C1C`

#### Circular Quick-Action Buttons (Table & Header)
- **Dimensions:** 40 × 40 px (Touch target 48 × 48 px with invisible padding)
- **Border Radius:** `50%`
- **Variants:**
  - *Call Button:* Background `#ECFDF5`, Icon Color `#059669`
  - *WhatsApp Button:* Background `#E8F5E9`, Icon Color `#10B981`
  - *Email Button:* Background `#F0F5FA`, Icon Color `#063669`
  - *More / Chevron:* Background `#F1F5F9`, Icon Color `#475569`

---

### 4.2 Form Controls, Inputs & Selectors

#### Standard Text Input & Select Box
- **Container Height:** 48px - 52px
- **Background:** `#F8FAFC` (Inactive) → `#FFFFFF` (Focused)
- **Corner Radius:** `10px` - `12px` (Cards) or `32px` (Auth Screens)
- **Border:** None (borderless aesthetic)
- **Focus Ring:** `box-shadow: 0 0 0 2px rgba(6, 54, 105, 0.18)`
- **Placeholder Text:** `#94A3B8`, Weight 400
- **Value Text:** `#063669`, Weight 500, Size 15px

#### Probability Range Slider (Deals & Opportunities)
A signature interactive control linking a range thumb to a percentage input badge.
- **Track:** Height 6px, radius 9999px, background `#E2E8F0`
- **Thumb:** Diameter 22px, circular, background `#063669`, 2px white border, shadow `0 2px 6px rgba(6, 54, 105, 0.35)`
- **Thumb Drag State:** Scale 1.18, glow `#137FEC`
- **Linked Value Badge:** Pill shape, background `#E8F1FC`, text `#063669`, weight 700, 14px

---

### 4.3 Apple HIG Segmented Controls

Used for switching views (Presets vs Custom Range, All vs Unread Notifications, Table vs Kanban).

```
┌─────────────────────────────────────────────────────────────┐
│  [  Active Tab (White Pill)  ]   [     Inactive Tab     ]   │
│  Background: #F1F5F9 | Inset Padding: 3px | Radius: 10px    │
└─────────────────────────────────────────────────────────────┘
```

- **Container:** Background `#F1F5F9`, padding `3px`, border-radius `10px`
- **Sliding Indicator (Active Pill):**
  - Background `#FFFFFF`
  - Border-radius `7px`
  - Shadow: `0 2px 7px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)`
  - Slide Animation: `transition: left 0.28s cubic-bezier(0.16, 1, 0.3, 1)`
- **Tab Item:**
  - Padding: `8px 16px`
  - Active Color: `#063669`, Weight 700
  - Inactive Color: `#64748B`, Weight 600

---

### 4.4 Apple Translucent Glassmorphic Date Picker

For mobile, the popover adapts into an **iOS-Style Date Wheel / Bottom Sheet**:

#### Visual Elements
1. **Trigger Pill:**
   - Background: `rgba(255, 255, 255, 0.9)`
   - Backdrop Filter: `blur(12px)`
   - Border: `1px solid rgba(6, 54, 105, 0.12)`
   - Radius: `9999px`
   - Content: Calendar Icon (Navy), Selected Date Range ("This Month"), Chevron (rotates 180° when open).
2. **Sheet Header:** Segmented control toggling between **"Presets"** and **"Calendar"**.
3. **Presets Grid:** 2-column grid of pill buttons:
   - *Options:* Today, Yesterday, This Week, Last Week, This Month, Last Month, This Quarter, This Year.
   - *Selected Preset:* Background `#063669`, Text `#FFFFFF`.
4. **Calendar Grid:**
   - Weekday headers: `S M T W T F S` in `#94A3B8` (11px Bold)
   - Day Cell: 36 × 36 px circle
   - Range Start: Background `#063669`, Text `#FFFFFF`, Left-pill curve
   - Range In-Between: Background `#E0ECF8`, Text `#063669`
   - Range End: Background `#063669`, Text `#FFFFFF`, Right-pill curve
   - Today Indicator: 4px dot below day number in `#063669`.

---

### 4.5 Metric Cards & KPI Revenue Blocks

```
┌─────────────────────────────────────────────────────────────┐
│  TOTAL PIPELINE VALUE                     [ +12.4% vs LM ]  │
│  ₹ 48.50 L                                                  │
│  ─────────────────────────────────────────────────────────  │
│  28 Deals Active  •  ₹ 12.2 L Expected This Month           │
└─────────────────────────────────────────────────────────────┘
```

- **Card Surface:** `#FFFFFF` with `border-radius: 16px` and `--shadow-md`
- **Value Number:** `24px` - `28px`, Weight 800, Color `#063669`, negative letter spacing `-0.02em`
- **Label / Title:** `11px` UPPERCASE, Weight 700, Color `#557396`, tracking `+0.05em`
- **Trend Pill:**
  - Positive: Background `#ECFDF5`, Text `#059669`, Value `+12.4%` with upward trend icon
  - Negative: Background `#FEF2F2`, Text `#DC2626`, Value `-4.2%` with downward trend icon
- **Interactive Stagger:** Staggered fade-up animation when screen loads (`0.05s` interval).

---

### 4.6 Lead Pipeline Progress Stepper

The pipeline visualizes stages:  
`New → Contacted → Qualified → Discussion → Proposal → Negotiation → Won`

#### Mobile Layout: Horizontal Scrollable Chevron Stepper OR Vertical Flow Card

```
[ ✓ New ] ──> [ ✓ Contacted ] ──> [ ● Discussion ] ──> [ ○ Proposal ]
  Past            Past               ACTIVE CURRENT         UPCOMING
```

#### Node Styling Specs
- **Completed Stage:**
  - Node circle: 24px, background `#063669`, white checkmark icon
  - Connecting bar: 3px height, background `#063669`
  - Text: `#063669`, Weight 600
- **Active Current Stage:**
  - Node circle: 28px, background `#063669`, pulsating outer ring `0 0 0 4px rgba(6, 54, 105, 0.18)`
  - Text: `#063669`, Weight 800, badge "Active"
- **Upcoming Stage:**
  - Node circle: 22px, background `#F1F5F9`, border `2px solid #CBD5E1`
  - Connecting bar: 3px height, background `#E2E8F0`
  - Text: `#94A3B8`, Weight 500

---

### 4.7 Data Tables to Mobile Card Transformation

Wide desktop data tables cannot be horizontally scrolled comfortably on mobile devices. The TechGy CRM design system converts table rows into **Structured Swipeable Cards**:

#### Mobile CRM Lead Card Anatomy
```
┌─────────────────────────────────────────────────────────────┐
│  [Avatar]  Rajesh Kumar                     [ Won Pill ]   │
│            Apex Technologies Pvt Ltd                        │
│                                                             │
│  ₹ 4,50,000  •  Enterprise ERP Solution                     │
│  Owner: Anita Roy  •  Last contact: 2 hours ago            │
│  ─────────────────────────────────────────────────────────  │
│  [ 📞 Call ]    [ 💬 WhatsApp ]    [ ✉️ Email ]    [ More > ]│
└─────────────────────────────────────────────────────────────┘
```

1. **Card Container:**
   - Background: `#FFFFFF`
   - Radius: `16px`
   - Shadow: `0 2px 10px rgba(6, 54, 105, 0.05)`
   - Padding: `16px`
   - Margin Bottom: `12px`
2. **Top Header Row:**
   - Left: 38px circular contact avatar with two-letter initials (gradient background `#063669` to `#1E5B99`)
   - Middle: Contact Name (`16px Bold #063669`) + Company Name (`13px Regular #557396`)
   - Right: Status Pill (`New`, `Qualified`, `Discussion`, etc.)
3. **Details Row:**
   - Deal Value formatted in Indian Rupee format (`₹ 4,50,000`) in `15px Bold #063669`
   - Product tag / Opportunity stage in `#557396`
4. **Action Footer Bar:**
   - Four quick-tap buttons: Direct phone dialer, WhatsApp direct chat, Native mail composer, and Lead detail chevron.
5. **Swipe Gestures (Mobile):**
   - *Swipe Left:* Reveals "Delete" (Red) and "Reassign" (Gray) actions.
   - *Swipe Right:* Reveals "Convert" (Green) and "Mark Contacted" (Blue) actions.

---

### 4.8 Dialogs, Bottom Sheets & Drawers

On desktop, detail panels slide out as right drawers (`width: 520px`). On mobile devices, they adapt to **iOS-Style Drag-to-Dismiss Bottom Sheets**:

```
┌─────────────────────────────────────────────────────────────┐
│                           [ — ]                             │  <-- Grabber Handle (36x4px)
│  Lead Details                              [ Close (✕) ]   │
│  ─────────────────────────────────────────────────────────  │
│  [ Tab: Overview ]    [ Tab: Timeline ]    [ Tab: Calls ]   │
│                                                             │
│  Scrollable Content Body...                                 │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  [ Save Changes (Primary) ]        [ Cancel (Secondary) ]   │
└─────────────────────────────────────────────────────────────┘
```

- **Top Geometry:** `border-top-left-radius: 20px; border-top-right-radius: 20px;`
- **Grabber Handle:** Width 36px, height 4px, background `#CBD5E1`, radius 9999px, centered 8px from top.
- **Backdrop:** `rgba(6, 54, 105, 0.45)` with `backdrop-filter: blur(8px)`.
- **Dismiss Behavior:** Drag down by >80px or fast flick downward to dismiss.
- **Footer Buttons:** Sticky bottom bar, padded for Safe Area, full-width primary action button.

---

### 4.9 Apple-Style Notifications Dropdown / Sheet

- **Placement:** Desktop popover anchored to bell icon; Mobile full bottom sheet or modal page.
- **Card Separation:** Each notification is an isolated rounded card (`border-radius: 12px; background: #F8FAFC; border: 1px solid #E2E8F0;`).
- **Unread Indicator:** A pulsating 8px royal blue dot (`#063669`).
- **Icon Squircles:** 36 × 36 px icon box with `border-radius: 10px`:
  - *Lead assigned:* Ice blue `#E0ECF8` with `#063669` icon
  - *Payment received / Won:* Green `#ECFDF5` with `#059669` icon
  - *Urgent task / Overdue:* Red `#FEF2F2` with `#DC2626` icon

---

### 4.10 Interactive In-App Call Manager & Floating Bar

TechGy CRM includes a built-in virtual call assistant with real-time audio visualization.

#### A. Full Call Screen / Active Modal
```
               ┌───────────────────────────────┐
               │         (((   )))             │  <-- 3-Tier Ripple Pulse
               │            (👤)               │  <-- 88px Avatar Circle
               │         (((   )))             │
               │                               │
               │         Rajesh Sharma         │
               │        Apex Technologies      │
               │            02:45              │  <-- Call Duration Timer
               │         ||| | |||| |          │  <-- Dynamic Sound Waves
               │                               │
               │  [ 🎤 Mute ]  [ ⏸️ Hold ]     │
               │  [ ⌨️ Dial ]  [ 📝 Notes ]    │
               │                               │
               │          [ 📞 End ]           │  <-- 56px Red Circle CTA
               └───────────────────────────────┘
```

- **Avatar Visualizer:** 88px circle with gradient (`#063669` to `#1E5B99`).
- **Pulsing Ripples:** 3 concentric ring borders (`2px solid #063669`) animated with `@keyframes callRingPulse` expanding to `1.7x` scale and fading.
- **Sound Equalizer:** 5 animated vertical bars (3px wide) flexing height between 8px and 32px (`@keyframes callSoundWave`).
- **Hangup Button:** 56 × 56 px circle, background `#DC2626`, white phone icon rotated 135°.

#### B. Floating Minimized Call Bar
When the agent navigates through other screens during an ongoing call, the call minimizes into a persistent floating island:
- **Position:** Docked 16px above bottom navigation bar or screen bottom.
- **Geometry:** Height 58px, padding `8px 16px`, border-radius `16px`, background `rgba(255, 255, 255, 0.96)`, backdrop blur `12px`.
- **Shadow:** `0 16px 40px rgba(6, 54, 105, 0.20)`.
- **Components:** Mini avatar with live green status dot (`#10B981` with `@keyframes pulseGreenDot`), contact name, active timer ("03:12"), mini equalizer, and tap-to-maximize target.

---

### 4.11 Timeline & Chronological Activity Feed

Tracks calls, meetings, stage updates, emails, and notes.

```
│  ●  [Phone Call]  Completed outbound call with Rajesh
│  │  "Discussed customized pricing quote for 25 seats..."
│  │  Yesterday, 04:30 PM • Logged by Rahul Verma
│  │
│  ●  [Stage Moved] Discussion ──> Proposal Sent
│     2 days ago • Automated
```

- **Vertical Spine Track:** 2px width line in `#E0E6EE`, positioned 20px from left edge.
- **Activity Node Icons:** 26px circle, background `#FFFFFF`, shadow `0 2px 6px rgba(6, 54, 105, 0.15)`. On hover/tap: transforms to `#063669` with white icon.
- **Activity Content Card:** Background `#F9F9F9`, border-radius `10px`, padding `12px 14px`.

---

## 5. Mobile Navigation Architecture & Safe Areas

### 5.1 Bottom Navigation Bar (Mobile Main Navigation)
Replaces the desktop fixed sidebar (`width: 260px`) on screens `< 768px`.

```
┌─────────────────────────────────────────────────────────────┐
│    📊         👥          💼          📅          ⚙️       │
│ Dashboard    Leads      Deals     Activities     More       │
└─────────────────────────────────────────────────────────────┘
  Safe Area Inset Bottom (34pt for iPhone Home Indicator)
```

- **Height:** `56px` + `env(safe-area-inset-bottom)`.
- **Surface:** `#FFFFFF` with translucent blur (`backdrop-filter: blur(20px)`).
- **Border:** Top border `1px solid #E5EBF2`.
- **Active Item:** Icon in `#063669`, weight 800, text in `#063669` with a subtle top accent bar or soft pill background.
- **Inactive Item:** Icon and text in `#64748B`, weight 500.

### 5.2 Header App Bar (Top Navigation)
- **Height:** `54px` + `env(safe-area-inset-top)`.
- **Left:** TechGy Brand squircle logo or Contextual Back Arrow (`←`).
- **Title:** Centered or left-aligned `18px Bold #063669`.
- **Right:** Search icon button, Notification Bell (with red badge count), User Profile avatar.

### 5.3 Safe Area Handling
- **iOS Safe Area Top:** Add padding top `env(safe-area-inset-top, 44px)` for Dynamic Island and camera notch.
- **iOS Safe Area Bottom:** Add padding bottom `env(safe-area-inset-bottom, 34px)` for bottom sheets, sticky footers, and bottom navigation bar.
- **Android Display Cutout & Navigation:** Use system inset listeners to ensure full edge-to-edge support without UI overlap.

---

## 6. Motion, Physics & Animation Guidelines

All animations must maintain high frame rates (60fps to 120fps) and use hardware-accelerated transforms (`transform` and `opacity`).

### 6.1 Standard Easing Tokens
```
--ease-apple-spring: cubic-bezier(0.16, 1, 0.3, 1);
--ease-pop-in:       cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-standard:     cubic-bezier(0.4, 0.0, 0.2, 1);
```

### 6.2 Keyframe Specifications

#### Modal & Bottom Sheet Entrance
```css
@keyframes sheetSlideUp {
  0% {
    transform: translateY(100%);
    opacity: 0.8;
  }
  100% {
    transform: translateY(0%);
    opacity: 1;
  }
}
/* Duration: 0.32s | Easing: cubic-bezier(0.16, 1, 0.3, 1) */
```

#### Avatar Call Ripple Animation
```css
@keyframes callRingPulse {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.35);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.70);
    opacity: 0;
  }
}
/* Duration: 2.4s | Iteration: Infinite | Easing: cubic-bezier(0.215, 0.61, 0.355, 1) */
```

#### Active Status Green Dot Pulse
```css
@keyframes pulseGreenDot {
  0%   { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70%  { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}
/* Duration: 2.0s | Iteration: Infinite */
```

### 6.3 Haptic Feedback Map (Mobile)
- **Tab / Segment Switch:** Light tactile tick (`UIImpactFeedbackGenerator(style: .light)`).
- **Primary CTA Press:** Medium impact (`UIImpactFeedbackGenerator(style: .medium)`).
- **Stage Changed / Won Deal:** Success haptic notification (`UINotificationFeedbackGenerator().notificationOccurred(.success)`).
- **Call Hangup / Delete Lead:** Warning or Heavy impact (`UIImpactFeedbackGenerator(style: .heavy)`).

---

## 7. Screen-by-Screen Mobile UI Blueprint

### 7.1 Login & Authentication Screen
- **Background:** Clean white (`#FFFFFF`) with subtle, faded watermark vector graphic in bottom right.
- **Top Header:** Right-aligned TechGy brand emblem (height 48px).
- **Form Card:** Padded 24px, centered vertically.
- **Title:** "Welcome Back" (`32px Bold #1A1C1D`, letter spacing `-0.9px`).
- **Subtitle:** "Sign in to access your enterprise CRM dashboard" (`15px Regular #3D4949`).
- **Inputs:** Height 54px, pill shape (`radius: 32px`), background `#F0F1F3`, left icon inside field, password toggle eye button.
- **Sign In Button:** Height 52px, full pill, background `#063669`, bold white text, shadow `0 4px 14px rgba(6, 54, 105, 0.20)`.
- **Security Footer:** Centered SSL shield icon with green tint `#006D3A` and caption: "Protected by enterprise-grade 256-bit encryption".

### 7.2 Home Dashboard View
1. **Header Bar:** Greeting "Good morning, Rajesh" + Date filter pill ("September 2026") + Notification Bell.
2. **Horizontal Carousel of Metric Cards:**
   - Card 1: Total Revenue (`₹ 48.5 L`, `+14.2%`)
   - Card 2: Active Pipeline (`₹ 1.28 Cr`, `28 Deals`)
   - Card 3: Win Rate (`68.4%`, `+3.1%`)
3. **Four Counter Squares:** 2 × 2 grid of white rounded cards:
   - Total Leads (38)
   - Follow-up Due (7)
   - Meetings Today (3)
   - Proposals Out (5)
4. **Follow-Up Action List:** Card list of priority actions with immediate one-tap Call and Complete checkmark.

### 7.3 Leads List View
1. **Sticky Header:** "Leads (142)" with Quick Add `+` Pill button.
2. **Search & Filter Bar:** Pill search input + "Filter" chip showing active filter count.
3. **Status Filter Chips:** Horizontal scrolling pill chips: `All`, `New`, `Contacted`, `Qualified`, `Discussion`, `Proposal`.
4. **Cards Stream:** List of Lead Cards (as specified in Section 4.7) with pull-to-refresh.

### 7.4 Lead Detail View
1. **Top Bar:** Back button `←`, Lead Name (`20px Bold`), and Status Chip.
2. **Hero Header:**
   - Company Name, Deal Value in large typography (`24px Bold #063669`).
   - Action Bar with 4 circular buttons: Call, WhatsApp, Email, Edit.
3. **Pipeline Progress Stepper:** Interactive visual stage track (Section 4.6).
4. **Segmented Tabs:** `Overview`, `Activity`, `Calls`, `Notes`, `Deals`.
5. **Tab Content:** Detail fields in 2-column or 1-column layout, chronological timeline, or call audio recordings.

### 7.5 Master Data Hub Screen
- 1-column (or 2-column on tablets) card grid displaying configurable system modules:
  - *Lead Sources*, *Industry Sectors*, *Deal Stages*, *Loss Reasons*, *Products & Services*.
- Each card features a 44 × 44 px icon squircle, title, item count badge, description, and chevron trigger opening the configuration bottom sheet.

---

## 8. Multi-Platform Mobile Token Reference

To immediately copy and paste tokens into your mobile codebase, use the platform-specific definitions below:

### React Native / StyleSheet (JavaScript/TypeScript)
```typescript
export const TechGyTheme = {
  colors: {
    primary: '#063669',
    primaryHover: '#04264A',
    primaryLight: '#F0F4F9',
    primaryActive: '#E6EFF8',
    bgApp: '#F9F9F9',
    bgCard: '#FFFFFF',
    bgSubtle: '#F8FAFC',
    textMain: '#063669',
    textDark: '#1A1C1D',
    textMuted: '#557396',
    textSecondary: '#64748B',
    textPlaceholder: '#94A3B8',
    alertRed: '#DC2626',
    alertBg: '#FEF2F2',
    successGreen: '#059669',
    successAccent: '#10B981',
    successBg: '#ECFDF5',
    warningAmber: '#D97706',
    warningBg: '#FFFBEB',
  },
  radii: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#063669',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    md: {
      shadowColor: '#063669',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.07,
      shadowRadius: 16,
      elevation: 4,
    },
    floating: {
      shadowColor: '#063669',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
      elevation: 8,
    },
  },
  typography: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontFamilyMedium: 'PlusJakartaSans-Medium',
    fontFamilySemiBold: 'PlusJakartaSans-SemiBold',
    fontFamilyBold: 'PlusJakartaSans-Bold',
    fontFamilyExtraBold: 'PlusJakartaSans-ExtraBold',
  }
};
```

### Flutter (Dart)
```dart
import 'package:flutter/material.dart';

class TechGyTheme {
  // Colors
  static const Color primary = Color(0xFF063669);
  static const Color primaryHover = Color(0xFF04264A);
  static const Color primaryLight = Color(0xFFF0F4F9);
  static const Color primaryActive = Color(0xFFE6EFF8);
  static const Color bgApp = Color(0xFFF9F9F9);
  static const Color bgCard = Color(0xFFFFFFFF);
  static const Color bgSubtle = Color(0xFFF8FAFC);
  static const Color textMain = Color(0xFF063669);
  static const Color textDark = Color(0xFF1A1C1D);
  static const Color textMuted = Color(0xFF557396);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color alertRed = Color(0xFFDC2626);
  static const Color successGreen = Color(0xFF059669);
  static const Color successAccent = Color(0xFF10B981);
  static const Color warningAmber = Color(0xFFD97706);

  // Border Radii
  static const BorderRadius radiusSm = BorderRadius.all(Radius.circular(8));
  static const BorderRadius radiusMd = BorderRadius.all(Radius.circular(12));
  static const BorderRadius radiusLg = BorderRadius.all(Radius.circular(16));
  static const BorderRadius radiusXl = BorderRadius.all(Radius.circular(20));
  static const BorderRadius radiusPill = BorderRadius.all(Radius.circular(9999));

  // Shadows
  static const List<BoxShadow> shadowSm = [
    BoxShadow(color: Color(0x0D063669), blurRadius: 8, offset: Offset(0, 2)),
  ];
  static const List<BoxShadow> shadowMd = [
    BoxShadow(color: Color(0x12063669), blurRadius: 16, offset: Offset(0, 6)),
  ];
  static const List<BoxShadow> shadowFloating = [
    BoxShadow(color: Color(0x2E063669), blurRadius: 32, offset: Offset(0, 12)),
  ];
}
```

### iOS / Swift & SwiftUI
```swift
import SwiftUI

extension Color {
    static let techgyPrimary       = Color(red: 6/255, green: 54/255, blue: 105/255)
    static let techgyPrimaryHover  = Color(red: 4/255, green: 38/255, blue: 74/255)
    static let techgyPrimaryLight  = Color(red: 240/255, green: 244/255, blue: 249/255)
    static let techgyBgApp         = Color(red: 249/255, green: 249/255, blue: 249/255)
    static let techgyCard          = Color.white
    static let techgyTextMain      = Color(red: 6/255, green: 54/255, blue: 105/255)
    static let techgyTextMuted     = Color(red: 85/255, green: 115/255, blue: 150/255)
    static let techgyAlertRed      = Color(red: 220/255, green: 38/255, blue: 38/255)
    static let techgySuccessGreen  = Color(red: 5/255, green: 150/255, blue: 105/255)
}

struct TechGyPrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 15, weight: .bold, design: .rounded))
            .foregroundColor(.white)
            .padding(.horizontal, 24)
            .padding(.vertical, 14)
            .background(Color.techgyPrimary)
            .clipShape(Capsule())
            .shadow(color: Color.techgyPrimary.opacity(0.20), radius: 10, x: 0, y: 4)
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0)
            .animation(.spring(response: 0.28, dampingFraction: 0.75), value: configuration.isPressed)
    }
}
```

---

## 9. QA & Pixel-Perfect Checklist for Mobile Developers

Before shipping any mobile screen, verify that the implementation adheres to these criteria:

- [ ] **No Harsh Gray Borders:** Containers rely on `#FFFFFF` surfaces with blue-tinted shadows on `#F9F9F9` background.
- [ ] **Full Pill CTA Buttons:** All action buttons and status chips have `border-radius: 9999px` (Capsule shape).
- [ ] **Fluid Press Animation:** Every button and card slightly scales down (`scale(0.97)`) upon touch down.
- [ ] **Font Family:** `Plus Jakarta Sans` is embedded and rendered for all headers, metrics, and labels.
- [ ] **Color Accuracy:** Hero primary color is exactly `#063669`. No generic default blues (`#0000FF` or `#1E40AF`).
- [ ] **Table to Card Conversion:** No horizontal table scrolling; records are rendered as cards with avatars, status pills, and quick action buttons.
- [ ] **Safe Area Compliance:** Full padding is implemented for device notches, Dynamic Islands, and navigation indicator bars.
- [ ] **Modal to Bottom Sheet Adaptation:** Center modals convert to bottom drag-sheets with grabber bars (`36 × 4 px`) and backdrop blur.
- [ ] **In-App Call Feedback:** Audio waveforms and avatar ripples animate smoothly using hardware acceleration.
