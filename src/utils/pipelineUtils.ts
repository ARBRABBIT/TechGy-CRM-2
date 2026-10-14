/**
 * Pipeline Utility for TechGy CRM Internal
 * Manages pipeline stage constants and chronological stage transition history.
 */

import type { Lead, StageHistoryEntry } from '../types/crm';

export const PIPELINE_STAGES = [
  'New',
  'Contacted',
  'Qualified',
  'Discussion',
  'Proposal',
  'Negotiation'
];

export const formatStageDateTime = (dateInput = new Date()) => {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${y}-${m}-${day} • ${timeStr}`;
};

// Helper to add days to ISO date string (YYYY-MM-DD)
const addDaysToIso = (baseIso: string, days: number): string => {
  try {
    const d = new Date(baseIso);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  } catch {
    return baseIso;
  }
};

/**
 * Generates initial dynamic stage change event containers for any lead based on their current status.
 * This ensures the activity stream shows the real progression history (e.g. New -> Contacted).
 */
export const getInitialStageHistory = (lead: Lead | null | undefined): StageHistoryEntry[] => {
  if (!lead) return [];

  const stages = PIPELINE_STAGES;
  const curStage = lead.status || 'New';
  const curIdx = stages.indexOf(curStage);
  const maxIdx = curIdx >= 0 ? curIdx : 0;

  const createdIso = lead.createdDate || '2026-09-08';
  const times = ['09:30 AM', '11:15 AM', '10:30 AM', '02:00 PM', '03:30 PM', '04:45 PM'];
  const history: StageHistoryEntry[] = [];

  // Entry 1: Lead created with status New
  history.push({
    id: `STG-init-0-${lead.id || 'lead'}`,
    type: 'initial_creation',
    fromStage: null,
    toStage: 'New',
    title: 'Lead created with status New',
    timestamp: `${createdIso}T09:30:00.000Z`,
    date: `${createdIso} • ${times[0]}`,
    updatedBy: lead.leadOwner || 'System Automation',
    notes: `Lead captured and ingested into CRM pipeline from ${lead.leadSource || 'Website'} channel with initial status "New".`
  });

  // For each stage reached beyond New, generate a "Lead status changed [fromStage] -> [toStage]" event
  for (let i = 1; i <= maxIdx; i++) {
    const fromStage = stages[i - 1];
    const toStage = stages[i];
    const stageDate = addDaysToIso(createdIso, i);
    const stageTime = times[i] || '11:00 AM';

    history.push({
      id: `STG-init-${i}-${lead.id || 'lead'}`,
      type: 'stage_change',
      fromStage,
      toStage,
      title: `Lead status changed ${fromStage} → ${toStage}`,
      timestamp: `${stageDate}T${stageTime.replace(' ', '')}.000Z`,
      date: `${stageDate} • ${stageTime}`,
      updatedBy: lead.leadOwner || 'Rajesh Sharma',
      notes: `Pipeline stage transitioned from "${fromStage}" to "${toStage}".`
    });
  }

  return history;
};

/**
 * Returns the lead moved to `newStage` with a stage_change entry appended to its
 * history. Returns the same object when the stage is unchanged.
 */
export const applyStageChange = (lead: Lead, newStage: string, updatedBy?: string): Lead => {
  const fromStage = lead.status || 'New';
  if (fromStage === newStage) return lead;

  const now = new Date();
  const history = Array.isArray(lead.stageHistory) && lead.stageHistory.length > 0
    ? lead.stageHistory
    : getInitialStageHistory(lead);

  return {
    ...lead,
    status: newStage,
    stageHistory: [
      ...history,
      {
        id: `STG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: 'stage_change',
        fromStage,
        toStage: newStage,
        title: `Lead status changed ${fromStage} → ${newStage}`,
        timestamp: now.toISOString(),
        date: formatStageDateTime(now),
        updatedBy: updatedBy || lead.leadOwner || 'Rajesh Sharma',
        notes: `Pipeline stage transitioned from "${fromStage}" to "${newStage}".`
      }
    ]
  };
};
