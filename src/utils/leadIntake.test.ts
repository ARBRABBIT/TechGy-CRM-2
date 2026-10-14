import { describe, it, expect } from 'vitest';
import { buildIntakeLead, mapPayload, pickAssignee, getConnector, defaultConnectorSettings, hydrateIntegrations, sampleSubmission, CONNECTORS } from './leadIntake';

const execs = [
  { id: 'E1', name: 'Rahul Verma', reportingSalesHead: 'Rajesh Sharma' },
  { id: 'E2', name: 'Sneha Rao', reportingSalesHead: 'Priya Patel' },
  { id: 'E3', name: 'Aditya Joshi', reportingSalesHead: 'Rajesh Sharma' }
];
const settingsFor = (id, patch = {}) => ({ ...defaultConnectorSettings(getConnector(id)), ...patch });

describe('mapPayload', () => {
  it('joins several platform fields mapped to one CRM field (LinkedIn first + last name)', () => {
    const linkedin = getConnector('linkedin');
    const out = mapPayload(linkedin, { firstName: 'Ananya', lastName: 'Iyer', emailAddress: 'a@x.com' }, linkedin.defaultMapping);
    expect(out).toMatchObject({ leadName: 'Ananya Iyer', emailId: 'a@x.com' });
  });

  it('collects unmapped extras into notes and skips ignored fields', () => {
    const meta = getConnector('meta');
    const out = mapPayload(meta, { full_name: 'A B', city: 'Hyderabad', job_title: 'CEO' }, { ...meta.defaultMapping, job_title: '' });
    expect(out.notes).toBe('City: Hyderabad');
    expect(out.designation).toBeUndefined();
  });
});

describe('pickAssignee', () => {
  const leads = [
    { id: '1', salesExecutive: 'Rahul Verma', status: 'New' },
    { id: '2', salesExecutive: 'Rahul Verma', status: 'Qualified' },
    { id: '3', salesExecutive: 'Aditya Joshi', status: 'New', isJunk: true }
  ];

  it('leaves leads unassigned by default', () => {
    expect(pickAssignee({ mode: 'unassigned' }, { leads, salesExecutives: execs })).toBeNull();
  });

  it('balances to the least-busy executive in the chosen team (junk leads don’t count)', () => {
    expect(pickAssignee({ mode: 'balanced', salesHead: 'Rajesh Sharma' }, { leads, salesExecutives: execs }))
      .toEqual({ salesExecutive: 'Aditya Joshi', salesHead: 'Rajesh Sharma' });
  });

  it('assigns to a fixed executive', () => {
    expect(pickAssignee({ mode: 'executive', executive: 'Sneha Rao' }, { leads, salesExecutives: execs }))
      .toEqual({ salesExecutive: 'Sneha Rao', salesHead: 'Priya Patel' });
  });
});

describe('buildIntakeLead', () => {
  const now = new Date('2026-10-13T10:00:00');

  it('turns a Meta submission into a new lead tagged with its source', () => {
    const { lead } = buildIntakeLead({
      connectorId: 'meta',
      settings: settingsFor('meta'),
      payload: { full_name: 'Vikram Rao', email: 'vikram@acme.com', phone_number: '+91 98765 11111', company_name: 'Acme' },
      meta: { campaign: 'Weekend Offer' },
      leads: [],
      salesExecutives: execs,
      now
    });
    expect(lead).toMatchObject({
      leadName: 'Vikram Rao',
      leadSource: 'Meta',
      company: 'Acme',
      status: 'New',
      leadOwner: 'Unassigned',
      intake: { connectorId: 'meta', campaign: 'Weekend Offer' }
    });
    expect(lead.nextFollowup).toBe('2026-10-13 10:15');
  });

  it('skips or flags duplicates depending on the setting', () => {
    const leads = [{ id: 'L9', leadName: 'Vikram', emailId: 'vikram@acme.com', phoneNumber: '' }];
    const payload = { full_name: 'Vikram Rao', email: 'VIKRAM@acme.com' };
    const skip = buildIntakeLead({ connectorId: 'meta', settings: settingsFor('meta'), payload, leads, salesExecutives: execs, now });
    expect(skip).toMatchObject({ skipped: true, duplicate: { id: 'L9' } });

    const flag = buildIntakeLead({ connectorId: 'meta', settings: settingsFor('meta', { duplicates: 'flag' }), payload, leads, salesExecutives: execs, now });
    expect(flag.lead.possibleDuplicateOf).toBe('L9');
  });

  it('rejects submissions without a name or any contact detail', () => {
    expect(buildIntakeLead({ connectorId: 'webhook', settings: settingsFor('webhook'), payload: { email: 'a@b.co' }, leads: [], salesExecutives: execs }).error).toMatch(/name/);
    expect(buildIntakeLead({ connectorId: 'webhook', settings: settingsFor('webhook'), payload: { name: 'A' }, leads: [], salesExecutives: execs }).error).toMatch(/email or phone/);
  });

  it('produces a valid lead from every connector’s sample submission', () => {
    CONNECTORS.forEach(c => {
      const { payload, meta } = sampleSubmission(c.id, 123456789);
      const result = buildIntakeLead({ connectorId: c.id, settings: settingsFor(c.id), payload, meta, leads: [], salesExecutives: execs });
      expect(result.lead?.leadName, c.id).toBeTruthy();
      expect(result.lead.intake.isTest).toBe(true);
    });
  });
});

describe('hydrateIntegrations', () => {
  it('keeps saved settings and fills in anything missing', () => {
    const merged = hydrateIntegrations({ meta: { enabled: true, routing: { mode: 'balanced' } } });
    expect(merged.meta.enabled).toBe(true);
    expect(merged.meta.routing).toEqual({ mode: 'balanced', salesHead: '', executive: '' });
    expect(merged.linkedin.enabled).toBe(false);
    expect(hydrateIntegrations('garbage').googleAds).toBeTruthy();
  });
});
