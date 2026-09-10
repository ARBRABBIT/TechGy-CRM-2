import React from 'react';
import LeadPipelineProgress from './LeadPipelineProgress';

export default function LeadRecentActivities({
  lead,
  activities: _activities = [],
  onSelectActivity: _onSelectActivity,
  onLogActivity: _onLogActivity,
  onSelectStage,
  onUpdateStage
}) {
  return (
    <LeadPipelineProgress
      lead={lead}
      onSelectStage={onSelectStage || onUpdateStage}
      onUpdateStage={onUpdateStage}
    />
  );
}
