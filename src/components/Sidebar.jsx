import React, { useState, useEffect, useRef } from 'react';
import {
  LuLayoutDashboard,
  LuUsers,
  LuBuilding2,
  LuTrendingUp,
  LuCalendar,
  LuFileText,
  LuContact,
  LuPanelLeft,
  LuX
} from 'react-icons/lu';
import { animateDrawerEnter } from '../utils/animations';

const MODULES = [
  { id: 'dashboard', title: 'Dashboard', icon: LuLayoutDashboard, badge: null },
  { id: 'leads', title: 'Leads', icon: LuUsers, badge: { text: '7 Alert', type: 'alert' } },
  { id: 'accounts', title: 'Accounts', icon: LuBuilding2, badge: null },
  { id: 'opportunities', title: 'Opportunities', icon: LuTrendingUp, badge: null },
  { id: 'activities', title: 'Activities', icon: LuCalendar, badge: { text: '14 Tasks', type: 'tasks' } },
  { id: 'proposals', title: 'Proposals', icon: LuFileText, badge: null },
  { id: 'contacts', title: 'Contacts', icon: LuContact, badge: null }
];

export default function Sidebar({
  activeModule,
  setActiveModule,
  mobileOpen,
  setMobileOpen,
  isCollapsed,
  setIsCollapsed,
  onOpenProfile
}) {
  const [hoverAfterIcons, setHoverAfterIcons] = useState(false);
  const [hoverHeader, setHoverHeader] = useState(false);
  const showToggleIcon = isCollapsed && (hoverHeader || hoverAfterIcons);
  const sidebarRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (mobileOpen && sidebarRef.current) {
      animateDrawerEnter(sidebarRef.current, backdropRef.current);
    }
  }, [mobileOpen]);

  return (
    <>
      {mobileOpen && (
        <div
          ref={backdropRef}
          className="sidebar-backdrop active"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside 
        ref={sidebarRef}
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        onMouseLeave={() => {
          setHoverAfterIcons(false);
          setHoverHeader(false);
        }}
      >
      {/* Sidebar Header */}
      <div className="sidebar-header">
        {isCollapsed ? (
          <div
            className={`brand-logo-wrapper ${showToggleIcon ? 'show-toggle' : ''}`}
            onClick={() => setIsCollapsed(false)}
            onMouseEnter={() => setHoverHeader(true)}
            onMouseLeave={() => setHoverHeader(false)}
            title="Expand Sidebar"
            style={{ cursor: 'pointer' }}
          >
            {/* 1. Default Display: Company Logo */}
            <div className="brand-logo" title="TechGy Link">
              <img
                src="/vector.png"
                alt="TechGy Link Logo"
                style={{ width: '22px', height: '22px', objectFit: 'contain' }}
              />
            </div>

            {/* 2. On Hover Display: Sidebar Toggle Icon (PanelLeft) */}
            <button
              type="button"
              className="sidebar-collapse-hover-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed(false);
              }}
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <LuPanelLeft size={21} />
            </button>
          </div>
        ) : (
          <div className="sidebar-header-expanded">
            <div
              className="brand-container"
              onClick={() => setActiveModule('dashboard')}
              style={{ cursor: 'pointer' }}
              title="TechGy Link Dashboard"
            >
              <div className="brand-logo" title="TechGy Link">
                <img
                  src="/vector.png"
                  alt="TechGy Link Logo"
                  style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                />
              </div>
              <div className="brand-text">
                <span className="brand-title">TechGy Link</span>
                <div className="brand-subtitle">Internal Workspace</div>
              </div>
            </div>
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={() => setIsCollapsed(true)}
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <LuPanelLeft size={21} />
            </button>
          </div>
        )}

        {mobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            style={{ background: 'none', border: 'none', color: '#063669', cursor: 'pointer', padding: '0.25rem' }}
            title="Close Sidebar"
          >
            <LuX size={20} />
          </button>
        )}
      </div>

      {/* Navigation Menu (Module Item Clicks navigate; navigating between icons keeps showing company logo) */}
      <nav 
        className="sidebar-menu"
        onMouseEnter={() => setHoverAfterIcons(false)}
      >
        {MODULES.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <div
              key={item.id}
              className={`menu-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveModule(item.id);
                setMobileOpen(false);
              }}
              title={isCollapsed ? item.title : undefined}
            >
              <div className="menu-left">
                <Icon size={18} className="menu-icon" />
                {!isCollapsed && <span>{item.title}</span>}
              </div>
              {item.badge && (
                <span className={`menu-badge ${item.badge.type}`}>
                  {item.badge.text}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Empty space below icons (Hovering here reveals sidebar icon at top; clicking here opens/collapses sidebar) */}
      <div
        className="sidebar-empty-click-area"
        onMouseEnter={() => setHoverAfterIcons(true)}
        onMouseLeave={() => setHoverAfterIcons(false)}
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ flex: 1, cursor: 'pointer', minHeight: '40px' }}
        title={isCollapsed ? "Click empty space to expand sidebar" : "Click empty space to collapse sidebar"}
      />

      {/* User Profile Card in Sidebar */}
      {!isCollapsed ? (
        <div
          className="sidebar-profile"
          style={{
            padding: '1rem',
            borderTop: '1px solid #E5EBF2',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'transparent',
            cursor: 'pointer'
          }}
          onClick={() => {
            if (onOpenProfile) onOpenProfile();
          }}
          title="View My Profile"
        >
          <div
            className="avatar"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#063669',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              flexShrink: 0
            }}
          >
            RS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#063669', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Rajesh Sharma
            </span>
            <span style={{ fontSize: '0.725rem', color: '#557396', whiteSpace: 'nowrap' }}>
              Sales Director
            </span>
          </div>
        </div>
      ) : (
        <div
          className="sidebar-profile collapsed"
          style={{
            padding: '1rem 0',
            borderTop: '1px solid #E5EBF2',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="View My Profile"
          onClick={() => {
            if (onOpenProfile) onOpenProfile();
          }}
        >
          <div
            className="avatar"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#063669',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none'
            }}
          >
            RS
          </div>
        </div>
      )}
      </aside>
    </>
  );
}
