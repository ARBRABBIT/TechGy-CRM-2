import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SocialAnalyticsView from './SocialAnalyticsView';
import { computeSocialSummary, exportSocialAnalysisCsv, INITIAL_SOCIAL_POSTS } from '../data/socialData';

describe('SocialAnalyticsView Component', () => {
  it('renders the simplified social performance header', () => {
    render(<SocialAnalyticsView />);
    expect(screen.getByText('Social performance')).toBeInTheDocument();
    expect(screen.getByText(/See what content is working, what needs attention/i)).toBeInTheDocument();
  });

  it('reveals connected social platforms only when requested', () => {
    render(<SocialAnalyticsView />);
    expect(screen.queryByText('@techgylink')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Manage accounts/i }));
    expect(screen.getAllByText('Instagram')[0]).toBeInTheDocument();
    expect(screen.getAllByText('@techgylink')[0]).toBeInTheDocument();
    expect(screen.getAllByText('LinkedIn')[0]).toBeInTheDocument();
    expect(screen.getAllByText('YouTube')[0]).toBeInTheDocument();
  });

  it('displays the working vs not working scorecard metrics', () => {
    render(<SocialAnalyticsView />);
    expect(screen.getByText('Content Analyzed')).toBeInTheDocument();
    expect(screen.getByText('Total Video Views & Reach')).toBeInTheDocument();
    expect(screen.getByText('Average 3s Hook Rate')).toBeInTheDocument();
    expect(screen.getByText('Attributed CRM Pipeline')).toBeInTheDocument();
  });

  it('filters posts by verdict (Working, Average, Not Working)', () => {
    render(<SocialAnalyticsView />);
    
    // Check initial all posts
    const workingFilterBtn = screen.getByRole('button', { name: /^Working/i });
    fireEvent.click(workingFilterBtn);

    // Should display top working post
    expect(screen.getByText(/How GLC Green Land Capital sold ₹180Cr in plot sales/i)).toBeInTheDocument();

    // Now click Not Working filter
    const notWorkingFilterBtn = screen.getByRole('button', { name: /^Not Working/i });
    fireEvent.click(notWorkingFilterBtn);

    // Should display underperforming rebrand reel
    expect(screen.getByText(/TechGy Innovations is now TechGy Link: Company Rebrand Announcement/i)).toBeInTheDocument();
    expect(screen.getByText(/78% Hook Bounce/i)).toBeInTheDocument();
  });

  it('opens and closes the Video Retention Curve Inspector modal', () => {
    render(<SocialAnalyticsView />);

    // Click "Inspect Retention Curve" on first post
    const inspectButtons = screen.getAllByRole('button', { name: /Inspect Retention Curve/i });
    fireEvent.click(inspectButtons[0]);

    // Modal should be open
    expect(screen.getByText('Viewer Retention Curve Diagnostics')).toBeInTheDocument();
    expect(screen.getByText(/Second-by-Second Viewer Retention Curve/i)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /Close Inspector/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Viewer Retention Curve Diagnostics')).not.toBeInTheDocument();
  });

  it('opens connect social account modal and allows connecting a platform', () => {
    render(<SocialAnalyticsView />);

    const connectBtn = screen.getByRole('button', { name: /Connect account/i });
    fireEvent.click(connectBtn);

    expect(screen.getByRole('heading', { name: /Connect Social Account/i })).toBeInTheDocument();
    expect(screen.getByText(/Account Handle \/ Page ID/i)).toBeInTheDocument();

    // Cancel modal
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(screen.queryByRole('heading', { name: /Connect Social Account/i })).not.toBeInTheDocument();
  });

  it('computes summary and exports CSV correctly', () => {
    const summary = computeSocialSummary(INITIAL_SOCIAL_POSTS);
    expect(summary.totalAnalyzed).toBe(9);
    expect(summary.workingCount).toBe(4);
    expect(summary.averageCount).toBe(2);
    expect(summary.notWorkingCount).toBe(3);
    expect(summary.totalViews).toBeGreaterThan(100000);

    const csv = exportSocialAnalysisCsv(INITIAL_SOCIAL_POSTS);
    expect(csv).toContain('Post ID,Title,Platform,Format,Verdict');
    expect(csv).toContain('GLC Green Land Capital');
    expect(csv).toContain('WORKING');
    expect(csv).toContain('NOT_WORKING');
  });
});
