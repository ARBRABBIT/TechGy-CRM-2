import React from 'react';
import { LuInbox, LuLoaderCircle, LuTriangleAlert, LuRotateCcw } from 'react-icons/lu';

/**
 * Shared loading / empty / error states so every list, table and page
 * communicates "nothing here", "working" and "something broke" the same way.
 */

export function EmptyState({ icon: Icon = LuInbox, title, description, action, compact = false }) {
  return (
    <div className={`state-view ${compact ? 'compact' : ''}`} role="status">
      <span className="state-view-icon"><Icon aria-hidden="true" /></span>
      <div className="state-view-title">{title}</div>
      {description && <p className="state-view-desc">{description}</p>}
      {action && <div className="state-view-action">{action}</div>}
    </div>
  );
}

/** EmptyState inside a full-width table row. */
export function EmptyRow({ colSpan, ...props }) {
  return (
    <tr className="state-row">
      <td colSpan={colSpan}>
        <EmptyState compact {...props} />
      </td>
    </tr>
  );
}

export function LoadingState({ label = 'Loading…', compact = false }) {
  return (
    <div className={`state-view ${compact ? 'compact' : ''}`} role="status" aria-live="polite">
      <LuLoaderCircle className="state-spinner" aria-hidden="true" />
      <div className="state-view-desc">{label}</div>
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description, onRetry, retryLabel = 'Try again' }) {
  return (
    <div className="state-view error" role="alert">
      <span className="state-view-icon"><LuTriangleAlert aria-hidden="true" /></span>
      <div className="state-view-title">{title}</div>
      {description && <p className="state-view-desc">{description}</p>}
      {onRetry && (
        <div className="state-view-action">
          <button type="button" className="btn-secondary" onClick={onRetry}>
            <LuRotateCcw aria-hidden="true" />
            <span>{retryLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Catches render errors in a page so one broken view doesn't blank the whole app.
 * Render it inside a container keyed by the current page so navigating away resets it.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[TechGy] View crashed:', error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="section-card">
          <ErrorState
            title="This page couldn’t be displayed"
            description="An unexpected error occurred. Your data is safe — try again, or switch to another module."
            onRetry={() => this.setState({ error: null })}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
