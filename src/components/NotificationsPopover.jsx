import React, { useState, useRef, useEffect } from 'react';
import {
  LuBell,
  LuTriangleAlert,
  LuCircleCheck,
  LuUserPlus,
  LuCalendar,
  LuFileText,
  LuTrendingUp,
  LuX,
  LuCheckCheck,
  LuTrash2
} from 'react-icons/lu';
import gsap from 'gsap';

const TABS = ['All', 'Unread', 'Overdue', 'Updates'];

export default function NotificationsPopover({
  isOpen,
  onClose,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick
}) {
  const [activeTab, setActiveTab] = useState('All');
  const popoverRef = useRef(null);
  const listRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Animate items smoothly when switching tabs or opening
  useEffect(() => {
    if (!isOpen || !listRef.current) return;

    const items = listRef.current.querySelectorAll('.notification-item, .notifications-empty-state');
    if (items.length > 0) {
      gsap.killTweensOf(items);
      gsap.fromTo(
        items,
        { opacity: 0, y: 8, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.26,
          stagger: 0.035,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );
    }
  }, [activeTab, isOpen]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'Unread') return !n.isRead;
    if (activeTab === 'Overdue') return n.category === 'Overdue' || n.priority === 'High';
    if (activeTab === 'Updates') return n.category === 'Lead' || n.category === 'Opportunity' || n.category === 'Proposal';
    return true;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Overdue':
        return <LuTriangleAlert size={16} />;
      case 'Opportunity':
        return <LuTrendingUp size={16} />;
      case 'Lead':
        return <LuUserPlus size={16} />;
      case 'Activity':
        return <LuCalendar size={16} />;
      case 'Proposal':
        return <LuFileText size={16} />;
      default:
        return <LuCircleCheck size={16} />;
    }
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case 'Overdue': return 'overdue';
      case 'Opportunity': return 'opportunity';
      case 'Lead': return 'lead';
      case 'Activity': return 'activity';
      case 'Proposal': return 'proposal';
      default: return 'default';
    }
  };

  return (
    <div className="notifications-dropdown apple-popover" ref={popoverRef}>
      {/* Header */}
      <div className="notifications-header">
        <div className="notifications-title">
          <LuBell size={17} className="notifications-bell-icon" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="apple-notification-badge">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="notifications-header-actions">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="apple-pill-action-btn"
              title="Mark all notifications as read"
            >
              <LuCheckCheck size={13} />
              <span>Mark Read</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="apple-circle-close-btn"
            aria-label="Close notifications"
          >
            <LuX size={15} />
          </button>
        </div>
      </div>

      {/* Apple Segmented Filter Tabs with Smooth Sliding Pill */}
      <div className="apple-segmented-bar notifications-segmented-bar">
        <div
          className="segmented-active-pill"
          style={{
            width: `calc((100% - 6px) / ${TABS.length})`,
            left: `calc(3px + ${Math.max(0, TABS.indexOf(activeTab))} * ((100% - 6px) / ${TABS.length}))`
          }}
        />
        {TABS.map(tab => (
          <button
            key={tab}
            type="button"
            className={`segmented-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === 'Unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="notifications-list" ref={listRef}>
        {filteredNotifications.length === 0 ? (
          <div className="notifications-empty-state">
            <div className="notifications-empty-icon">
              <LuCircleCheck size={28} />
            </div>
            <p className="notifications-empty-title">All caught up</p>
            <p className="notifications-empty-desc">No notifications in "{activeTab}"</p>
          </div>
        ) : (
          filteredNotifications.map(item => (
            <div
              key={item.id}
              className={`notification-item ${!item.isRead ? 'unread' : ''}`}
              onClick={() => {
                onMarkAsRead(item.id);
                if (onNotificationClick) onNotificationClick(item);
              }}
            >
              <div className={`notification-icon-wrap ${getCategoryClass(item.category)}`}>
                {getCategoryIcon(item.category)}
              </div>
              <div className="notification-content-wrap">
                <div className="notification-meta-row">
                  <span className="notification-item-title">
                    {item.title}
                  </span>
                  <span className="notification-item-time">
                    {item.timestamp}
                  </span>
                </div>
                <div className="notification-item-message">
                  {item.message}
                </div>
              </div>
              {!item.isRead && (
                <div className="notification-unread-dot" title="Unread notification" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="notifications-footer">
          <button
            type="button"
            onClick={onClearAll}
            className="notifications-clear-btn"
          >
            <LuTrash2 size={12} />
            <span>Clear all notifications</span>
          </button>
        </div>
      )}
    </div>
  );
}
