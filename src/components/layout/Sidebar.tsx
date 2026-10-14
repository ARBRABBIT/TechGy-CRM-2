import React, { useState, useEffect, useRef } from 'react';
import {
  LuLayoutDashboard,
  LuUsers,
  LuBuilding2,
  LuDatabase,
  LuPanelLeft,
  LuUserCheck,
  LuBriefcase,
  LuPlug,
  LuFlame,
  LuShare2,
  LuX
} from 'react-icons/lu';
import { animateDrawerEnter } from '../../utils/animations';
import { ROLE, getRole, getRoleLabel, getHomeModule } from '../../utils/roles';
import { onKeyActivate } from '../../utils/a11y';

const BASE_MODULES = [
  { id: 'dashboard', title: 'Dashboard', icon: LuLayoutDashboard },
  { id: 'salesHead', title: 'Sales Head', icon: LuUserCheck },
  { id: 'salesExecutive', title: 'Sales Executive', icon: LuBriefcase },
  { id: 'leads', title: 'Manage Leads', icon: LuUsers },
  { id: 'accounts', title: 'Accounts', icon: LuBuilding2 },
  { id: 'heatmap', title: 'Website Heatmap', icon: LuFlame },
  { id: 'social', title: 'Social Analytics', icon: LuShare2 },
  { id: 'masterData', title: 'Master Data', icon: LuDatabase },
  { id: 'integrations', title: 'Integrations', icon: LuPlug }
];

export default function Sidebar({
  activeModule,
  setActiveModule,
  mobileOpen,
  setMobileOpen,
  isCollapsed,
  setIsCollapsed,
  onOpenProfile,
  currentUser,
  overdueCount = 0,
  tasksCount: _tasksCount = 0
}) {
  const [hoverAfterIcons, setHoverAfterIcons] = useState(false);
  const [hoverHeader, setHoverHeader] = useState(false);
  const showToggleIcon = isCollapsed && (hoverHeader || hoverAfterIcons);
  const sidebarRef = useRef(null);
  const backdropRef = useRef(null);

  const userName = currentUser?.name || 'Team Member';
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'TM';

  const role = getRole(currentUser);
  const userRole = getRoleLabel(currentUser);
  const homeModule = getHomeModule(currentUser);

  // Admins see every module; Sales Heads also see Website Heatmap and Social Analytics; Executives see dashboard + leads.
  const navModules = BASE_MODULES.filter(item =>
    role === ROLE.ADMIN ||
    (role === ROLE.HEAD && (item.id === homeModule || item.id === 'leads' || item.id === 'heatmap' || item.id === 'social')) ||
    (role !== null && (item.id === homeModule || item.id === 'leads'))
  ).map(item => {
    if (role !== ROLE.ADMIN && item.id === homeModule) {
      return { ...item, title: 'Dashboard', icon: LuLayoutDashboard, badge: null };
    }
    if (item.id === 'leads') {
      return {
        ...item,
        badge: overdueCount > 0 ? { text: `${overdueCount} Alert`, type: 'alert' } : null
      };
    }
    return { ...item, badge: null };
  });


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
            <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
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
                <LuPanelLeft size={20} />
              </button>
            </div>
          ) : (
            <div className="sidebar-header-expanded">
              <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
                className="brand-container"
                onClick={() => setActiveModule(homeModule)}
                style={{ cursor: 'pointer' }}
                title="TechGy Link Dashboard"
              >
                <img src="/brand-logo.png" alt="TechGy Link" className="brand-wordmark" />
              </div>
              <button
                type="button"
                className="sidebar-toggle-btn"
                onClick={() => setIsCollapsed(true)}
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <LuPanelLeft size={20} />
              </button>
            </div>
          )}

          {mobileOpen && (
            <button aria-label="Close Sidebar"
              type="button"
              onClick={() => setMobileOpen(false)}
              style={{ background: 'none', border: 'none', color: '#0F1A34', cursor: 'pointer', padding: '0.25rem' }}
              title="Close Sidebar"
            >
              <LuX size={20} />
            </button>
          )}
        </div>

        {/* Navigation Menu (Module Item Clicks navigate; navigating between icons keeps showing company logo) */}
        <nav
          aria-label="Main"
          className="sidebar-menu"
          onMouseEnter={() => setHoverAfterIcons(false)}
        >
          {navModules.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
                key={item.id}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.title}
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

        {/* Empty space below icons only reveals the expand control when collapsed. */}
        <div
          className="sidebar-empty-click-area"
          onMouseEnter={() => setHoverAfterIcons(true)}
          onMouseLeave={() => setHoverAfterIcons(false)}
          style={{ flex: 1, cursor: 'default', minHeight: '40px' }}
        />

        {/* User Profile Card in Sidebar */}
        {!isCollapsed ? (
          <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
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
                background: '#0022FF',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                flexShrink: 0
              }}
            >
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F1A34', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userName}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#556987', whiteSpace: 'nowrap' }}>
                {userRole}
              </span>
            </div>
          </div>
        ) : (
          <div role="button" tabIndex={0} onKeyDown={onKeyActivate}
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
                background: '#0022FF',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none'
              }}
            >
              {initials}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
