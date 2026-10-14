import { describe, it, expect } from 'vitest';
import { ACTION, can, actionForLeadUpdate, scopeLeadsForUser, scopeExecutivesForUser, SAVE_ACTION_PERMISSION } from './permissions';
import { canAccessModule, getHomeModule, getRole } from './roles';

const admin = { name: 'System Administrator', role: 'Sales Admin' };
const head = { name: 'Rajesh Sharma', role: 'Sales Head' };
const exec = { name: 'Rahul Verma', role: 'executive' };
const stranger = { name: 'Mallory', role: 'Owner' };

describe('roles', () => {
  it('normalises role spellings and rejects unknown roles', () => {
    expect(getRole(admin)).toBe('admin');
    expect(getRole({ role: ' sales head ' })).toBe('head');
    expect(getRole(exec)).toBe('executive');
    expect(getRole(stranger)).toBeNull();
    expect(getRole(null)).toBeNull();
  });

  it('sends each role to its own landing module and blocks admin-only modules', () => {
    expect(getHomeModule(admin)).toBe('dashboard');
    expect(getHomeModule(head)).toBe('salesHead');
    expect(getHomeModule(exec)).toBe('salesExecutive');
    expect(canAccessModule(head, 'masterData')).toBe(false);
    expect(canAccessModule(exec, 'salesHead')).toBe(false);
    expect(canAccessModule(stranger, 'leads')).toBe(false);
  });
});

describe('permission matrix', () => {
  it('lets admins do everything', () => {
    Object.values(ACTION).forEach(action => expect(can(admin, action)).toBe(true));
  });

  it('lets sales heads manage their pipeline but not delete, import or administer', () => {
    expect(can(head, ACTION.LEAD_CREATE)).toBe(true);
    expect(can(head, ACTION.LEAD_ASSIGN)).toBe(true);
    expect(can(head, ACTION.LEAD_EDIT)).toBe(true);
    expect(can(head, ACTION.LEAD_DELETE)).toBe(false);
    expect(can(head, ACTION.LEAD_IMPORT)).toBe(false);
    expect(can(head, ACTION.LEAD_ASSIGN_HEAD)).toBe(false);
    expect(can(head, ACTION.TEAM_MANAGE)).toBe(false);
    expect(can(head, ACTION.MASTER_DATA_MANAGE)).toBe(false);
  });

  it('limits executives to status changes and engagement', () => {
    expect(can(exec, ACTION.LEAD_STATUS)).toBe(true);
    expect(can(exec, ACTION.LEAD_ENGAGE)).toBe(true);
    [ACTION.LEAD_CREATE, ACTION.LEAD_EDIT, ACTION.LEAD_ASSIGN, ACTION.LEAD_DELETE, ACTION.LEAD_IMPORT]
      .forEach(action => expect(can(exec, action)).toBe(false));
  });

  it('denies everything to unknown roles and unknown actions', () => {
    expect(can(stranger, ACTION.LEAD_STATUS)).toBe(false);
    expect(can(admin, 'something.else')).toBe(false);
    expect(can(admin, SAVE_ACTION_PERMISSION.notARealType)).toBe(false);
  });
});

describe('actionForLeadUpdate', () => {
  const lead = { id: 'L1', leadName: 'A', leadOwner: 'Rajesh Sharma', salesHead: 'Rajesh Sharma', status: 'New' };

  it('classifies updates by the fields that actually change', () => {
    expect(actionForLeadUpdate({ status: 'Qualified' }, lead)).toBe(ACTION.LEAD_STATUS);
    expect(actionForLeadUpdate({ leadName: 'B', leadOwner: 'Rajesh Sharma' }, lead)).toBe(ACTION.LEAD_EDIT);
    expect(actionForLeadUpdate({ salesExecutive: 'Rahul Verma', salesHead: 'Rajesh Sharma' }, lead)).toBe(ACTION.LEAD_ASSIGN);
    expect(actionForLeadUpdate({ salesHead: 'Priya Patel' }, lead)).toBe(ACTION.LEAD_ASSIGN_HEAD);
    expect(actionForLeadUpdate({ isJunk: true }, lead)).toBe(ACTION.LEAD_JUNK);
  });
});

describe('data scoping', () => {
  const leads = [
    { id: '1', salesHead: 'Rajesh Sharma' },
    { id: '2', salesExecutive: 'Rahul Verma' },
    { id: '3', salesHead: 'Priya Patel', salesExecutive: 'Sneha Rao' },
    { id: '4', leadOwner: 'rahul verma' }
  ];
  const team = [
    { name: 'Rahul Verma', reportingSalesHead: 'Rajesh Sharma' },
    { name: 'Sneha Rao', reportingSalesHead: 'Priya Patel' }
  ];

  it('shows admins every lead', () => {
    expect(scopeLeadsForUser(leads, admin, team)).toHaveLength(4);
  });

  it('shows sales heads their own and their team’s leads', () => {
    expect(scopeLeadsForUser(leads, head, team).map(l => l.id)).toEqual(['1', '2']);
  });

  it('shows executives only leads assigned to them', () => {
    expect(scopeLeadsForUser(leads, exec, team).map(l => l.id)).toEqual(['2', '4']);
  });

  it('shows nothing to unknown roles', () => {
    expect(scopeLeadsForUser(leads, stranger, team)).toEqual([]);
  });

  it('restricts a head’s assignable executives to their team', () => {
    expect(scopeExecutivesForUser(team, head).map(e => e.name)).toEqual(['Rahul Verma']);
    expect(scopeExecutivesForUser(team, admin)).toHaveLength(2);
  });
});
