# TechGy CRM Internal — Date Filter Audit Report

**Audited by:** Senior Code Tester (automated verification against the real modules)
**Runtime used:** 2026-09-08 (India Standard Time) — matches the app's live data window
**Method:** The audit executed `src/utils/dateUtils.js` and `src/data/mockData.js` directly under Node and
replicated the exact filter expressions from each View (line references cited below). Nothing in the
codebase was modified to produce these results.

---

## 1. Executive summary

| Question | Answer |
|---|---|
| Does the date filter change the Dashboard metrics? | **Only for narrow custom ranges, and for side lists (Opportunities/Proposals).** The four Dashboard KPI counters (Companies, No. of Leads, Overdue, Today's Follow-ups) and the Lead-Source donut return **identical values for all 6 presets**. |
| Are the date boundaries precise? | **No — 7 precision/edge-case bugs found, reproduced live (see §4).** The two most severe: (a) `FY 2025-26` includes **every** date in 2025 and 2026 (so dates from *today*, which belongs to FY 2026-27, are still counted as FY 2025-26); (b) `Last 7/30 Days` exclude the exact-boundary day and **include tomorrow**. |
| Do revenue KPIs change with the filter? | No — the three revenue cards and the trend chart are **static seed constants** (`REVENUE_DATA`) that no filter can affect. Known mock limitation. |
| Root cause of "metrics never move" | Three compounding causes: (1) accounts are deliberately NOT date-filtered for presets; (2) leads use `createdDate OR nextFollowup` so every lead with a "today" follow-up survives every preset; (3) the marketing donut's internal `marketingDateFilter` state is **not re-synced when a custom range is chosen** (it silently keeps the previous preset). |

---

## 2. Verified metric table (run on the real seed data)

Dashboard + side-view counts per date filter (`All Owners`). Dashboard row = exact `DashboardView.jsx` logic.

| Date filter | Companies | Leads | Overdue | Today's FU | Donut leads | Opportunities | Proposals | Activities |
|---|---|---|---|---|---|---|---|---|
| This Month | 8 | 7 | 3 | 1 | 7 | 48 | 3 | 6 |
| This Quarter | 8 | 7 | 3 | 1 | 7 | 48 | 3 | 6 |
| FY 2025-26 | 8 | 7 | 3 | 1 | 7 | 48 | 4 | 6 |
| Last 7 Days | 8 | 7 | 3 | 1 | 7 | 8 | 0 | 6 |
| Last 30 Days | 8 | 7 | 3 | 1 | 7 | 9 | 0 | 6 |
| All Time | 8 | 7 | 3 | 1 | 7 | 48 | 4 | 6 |
| ⬜ Custom 01–08 Sep | 8 | 7 | 3 | 1 | 7 | — | — | — |
| ⬜ Custom 07 Sep (single day) | 8 | **2** | 1 | 0 | **2** | — | — | — |
| ⬜ Custom Aug 2026 | 8 | **0** | 0 | 0 | **0** | — | — | — |

Conclusions from the numbers:

- **Presets move NOTHING on the dashboard.** Every preset row is identical to "This Month" (verified programmatically: `changed == NONE`).
- The filter *engine* does work — narrow custom ranges produce 2 and 0 leads. So the problem is **data semantics + state-sync**, not the filter being dead.
- `LeadsView` is equally frozen across presets (7,7,7,7,7,7) for the same `OR` reason.
- Proposals drop to **0** for Last 7/30 Days because they are filtered on the future `validityDate`, not `proposalDate`.

---

## 3. Reproduce the audit yourself

```bash
# 1) Edge-case unit checks (proves the 7 failures)
node /tmp/crm_filter_audit.mjs

# 2) Metric-responsiveness table
node --loader /tmp/extensionless-loader.mjs /tmp/crm_metrics_audit.mjs
```

`extensionless-loader.mjs` is only needed because `mockData.js` uses bundler-style imports
(`import '../utils/dateUtils'` without `.js`) that raw Node rejects.

---

## 4. Failing edge cases (reproduced live, `pass → FAIL`)

### 4.1 `FY 2025-26` — wrong fiscal window (*dateUtils.js L109–114*)

Current code: `return parsed.startsWith('2025') || parsed.startsWith('2026');`
This accepts the **entire calendar years 2025 and 2026** instead of Apr 2025–Mar 2026.

| Date | Expected | Actual | Verdict |
|---|---|---|---|
| `2025-04-01` (FY start) | true | true | PASS |
| `2026-03-31` (FY end) | true | true | PASS |
| `2025-03-31` (belongs to FY 2024-25) | **false** | true | **FAIL** |
| `2026-04-01` (belongs to FY 2026-27) | **false** | true | **FAIL** |
| `2026-09-08` (**the live "today"**, FY 2026-27) | **false** | true | **FAIL** |

### 4.2 `Last 7 Days` — boundary day dropped, tomorrow included (*dateUtils.js L116–122*)

Item timestamps are normalized to **midnight**, but the window uses `nowTs` (current clock time,
2026-09-08 11:01) and `nowTs + 86400000`. So the window opens Sep 1 *11:01* and closes Sep 9 *11:01*.

| Date | Expected | Actual | Verdict |
|---|---|---|---|
| `2026-09-01` (exactly 7 days ago, whole day) | true | **false** | **FAIL** |
| `2026-09-02` … `2026-09-08` | true | true | PASS |
| `2026-09-09` (tomorrow) | **false** | true | **FAIL** |

### 4.3 `Last 30 Days` — same two flaws (*dateUtils.js L124–130*)

| Date | Expected | Actual | Verdict |
|---|---|---|---|
| `2026-08-09` (exactly 30 days ago) | true | **false** | **FAIL** |
| `2026-09-09` (tomorrow) | **false** | true | **FAIL** |

### 4.4 Custom range — *passes all boundary checks* (inclusive start, inclusive end)

`08 Sep` inside `01–08 Sep` → true; `09 Sep` → false; `31 Aug` → false; single-day range works. ✔

### 4.5 Presets that beat the edge cases ✔
`This Month` and `This Quarter` (calendar Q3 = Jul–Sep in Sep) pass every boundary check.

> **15 of 22 unit checks passed; 7 failed.** Root causes are `startsWith('2025'/'2026')` for FY, and
> comparing midnight item timestamps against un-normalized `now`.

---

## 5. Changes needed (file → line → what → fix)

### CHANGE 1 — `src/utils/dateUtils.js` L109–114 · **Fix the FY window**
Replace the year-prefix check with real fiscal-year boundaries (Apr–Mar), parsed from the label so a
future `FY 2026-27` works without a code edit:

```js
if (/^FY\s*\d{4}-\d{2}$/.test(filterValue)) {
  const fyStartYear = parseInt(filterValue.slice(3, 7), 10);
  const fyEndYear = fyStartYear + 1;
  const fyStartTs = new Date(fyStartYear, 3, 1).getTime();        // Apr 1, midnight
  const fyEndTs   = new Date(fyEndYear, 2, 31).getTime() + 24*60*60*1000 - 1; // Mar 31, whole day
  if (!parsed) {
    return rawLower.includes(`${fyStartYear}-04`) || rawLower.includes(`${fyEndYear}-03`);
  }
  const t = toTimestamp(parsed);
  return t !== null && t >= fyStartTs && t <= fyEndTs;
}
```
**Expected effect (live data):** leads created in Sep 2026 will no longer count inside `FY 2025-26`;
side-view counts will drop from the inflated values quoted in §2 — that is the correct behavior.

### CHANGE 2 — `src/utils/dateUtils.js` L116–130 · **Make Last 7/30 Days whole-day, not clock-time**
Normalise the window to calendar days so the boundary day is included and **tomorrow is excluded**:

```js
const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(); // today 00:00
const endOfToday   = startOfToday + 24*60*60*1000 - 1;                                     // today 23:59:59.999

if (filterValue === 'Last 7 Days') {
  if (!parsed) return true;
  const itemTs = toTimestamp(parsed);
  if (!itemTs) return true;
  return itemTs >= startOfToday - 7*24*60*60*1000 && itemTs <= endOfToday;
}
if (filterValue === 'Last 30 Days') {
  if (!parsed) return true;
  const itemTs = toTimestamp(parsed);
  if (!itemTs) return true;
  return itemTs >= startOfToday - 30*24*60*60*1000 && itemTs <= endOfToday;
}
```
Apply the same 24h inclusive treatment already used for custom ranges (`endTs + 24h − 1`, L68).

### CHANGE 3 — `src/views/DashboardView.jsx` L51–65 · **Marketing donut ignores custom ranges**
The sync `useEffect` handles only 4 string presets; a custom `{type:'custom'}` object from the global
header hits **no branch**, so the donut + center "Leads" total keep the last preset's numbers
(verified: stale 7 vs correct 2/0 for narrow ranges). Sync every filter; only force the revenue toggle
for the presets that map to a toggle:

```js
useEffect(() => {
  setMarketingDateFilter(selectedDateFilter);          // strings AND custom objects
  if (typeof selectedDateFilter === 'string') {
    if (selectedDateFilter === 'This Month')       setRevenueToggle('Monthly');
    else if (selectedDateFilter === 'This Quarter')  setRevenueToggle('Quarterly');
    else if (selectedDateFilter === 'FY 2025-26' || selectedDateFilter === 'All Time') setRevenueToggle('FY');
  }
}, [selectedDateFilter]);
```

### CHANGE 4 — `src/views/DashboardView.jsx` L83–85 · **"Companies" KPI is date-invariant**
The dashboard's `filteredAccounts` applies **owner only**; the Accounts list (`AccountsView.jsx` L25–27)
applies a date filter **only for custom ranges**. Business decision required. If "Total Companies" is an
all-time organisational metric, keep the current behaviour but add a tooltip ("All-time, not filtered by
date"). If it must mirror the filtered Accounts list, replicate the same rule:

```js
const isCustomDate = typeof selectedDateFilter === 'object' && selectedDateFilter?.type === 'custom';
const filteredAccounts = accounts.filter(a => {
  const matchOwner = selectedOwnerFilter === 'All Owners' || a.accountOwner === selectedOwnerFilter;
  const matchDate  = isCustomDate ? (!a.createdDate ? true : isDateInFilter(a.createdDate, selectedDateFilter)) : true;
  return matchOwner && matchDate;
});
```

### CHANGE 5 — `src/views/DashboardView.jsx` L77–81 & `src/views/LeadsView.jsx` L89–94 · **Leads KPI desensitised by OR-logic**
`matchDate = createdDate MATCHES OR nextFollowup MATCHES`. Every lead carries a *today* follow-up
(`getTodayISO()` in the seed), so every lead passes every preset → the "No. of Leads" count is frozen at 7.
Recommendation: use **createdDate only** for the *lead-generation* KPIs (dashboard "No. of Leads", Leads list),
while keeping the OR only for the **follow-up / due-today lists**:

```js
// LeadsView / Dashboard lead count (generation metric)
const matchDate = isDateMatch(l.createdDate);

// Follow-up action list (unchanged — due/overdue items)
const followUpActions = leads.filter(l => (l.isOverdue || l.dueToday) && <owner/date context>);
```
This makes "No. of Leads" respond to date filters the way users expect (e.g., count drops for a
single-day range even when a follow-up is scheduled that day).
### CHANGE 6 — `src/views/ProposalsView.jsx` L14 · **Proposals vanish on short presets**
Filter runs on future `validityDate` → `Last 7/30 Days` returns 0 proposals and PR-403 (validity
`2026-10-15`) drops out of *This Month*. Filter on the date the proposal was raised (`proposalDate`),
not its validity horizon:

```js
const matchesDate = isDateInFilter(p.proposalDate || p.createdDate, selectedDateFilter);
```

### CHANGE 7 — (minor, copy) `src/views/AccountsView.jsx` L63
Empty-state text says "active search query or selected owner filter" but never mentions the date filter;
update it to include one once CHANGE 4's rule is decided.

### CHANGE 8 — `src/data/mockData.js` L14–19 + `src/components/CustomDateSelector.jsx` L19–26 · **Fiscal-year preset is static**
`'FY 2025-26'` is hard-coded in two places. After CHANGE 1, the current FY is 2026-27; derive the FY
labels from `new Date()` (e.g., `FY ${y}-${String(y+1).slice(2)}` for Apr–Mar) so the selector always
offers the *current* FY. Keep a legacy fallback only if a static label is required for reporting.

### CHANGE 9 — (known limitation, document only) `src/data/mockData.js` L30–64 + `DashboardView.jsx` L101–102, 173–211
The revenue KPI cards, the `revenueToggle` data, and the trend chart all read the **constant**
`REVENUE_DATA`. Date/owner filters intentionally cannot change revenue figures in the current build.
If revenue must react to filters, wire `currentRevObj` from the filtered opportunity/proposal values
instead of `REVENUE_DATA[toggle]`.

---

## 6. Priority order

1. **CHANGE 3** — custom-range donut is stale (visible wrong number on the dashboard).
2. **CHANGE 1** — FY window is mathematically wrong (today counted in the wrong FY).
3. **CHANGE 2** — boundary + tomorrow inclusion in Last 7/30 Days.
4. **CHANGE 5** — leads KPI frozen across presets (the "does it change?" complaint).
5. **CHANGE 6** — proposals vanish on short presets.
6. **CHANGE 4, 7, 8** — consistency, copy, and FY label.
7. **CHANGE 9** — feature decision, not a defect.

---

## 7. Helpers used for this audit (left outside the repo)

The verification scripts ran from `/tmp` and leave the repository untouched:
- `/tmp/crm_filter_audit.mjs` — 22 unit checks on `isDateInFilter` (15 pass / 7 fail).
- `/tmp/crm_metrics_audit.mjs` — dashboard & side-view metric table per filter.
- `/tmp/extensionless-loader.mjs` — ESM loader resolving extensionless imports for raw Node.

(For a repeatable in-repo suite, a `node --test tests/filter-behavior.test.mjs` harness was prepared
and can be added on request — it adds no dependencies.)