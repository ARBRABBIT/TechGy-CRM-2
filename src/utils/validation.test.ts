import { describe, it, expect } from 'vitest';
import { validate, ACTION_RULES, isEmail, isPhone, isUrl, findDuplicateLead } from './validation';

describe('field validators', () => {
  it('accepts valid and rejects invalid emails, phones and URLs', () => {
    expect(isEmail('rahul@techgy.com')).toBe(true);
    expect(isEmail('rahul@techgy')).toBe(false);
    expect(isPhone('+91 98765 43210')).toBe(true);
    expect(isPhone('12345')).toBe(false);
    expect(isPhone('call me')).toBe(false);
    expect(isUrl('techgylink.com')).toBe(true);
    expect(isUrl('not a url')).toBe(false);
  });
});

describe('create lead rules', () => {
  it('requires a name and company and checks optional contact formats', () => {
    const errors = validate({ leadName: '', company: '', email: 'bad', phone: '12' }, ACTION_RULES.createLead);
    expect(Object.keys(errors).sort()).toEqual(['company', 'email', 'leadName', 'phone']);
  });

  it('passes a complete lead', () => {
    expect(validate({ leadName: 'Vikram', company: 'Acme', email: 'v@acme.com', phone: '9876543210' }, ACTION_RULES.createLead)).toEqual({});
  });

  it('rejects follow-ups scheduled in the past', () => {
    expect(validate({ dueDate: '2000-01-01' }, ACTION_RULES.scheduleFollowup).dueDate).toMatch(/past/);
  });
});

describe('findDuplicateLead', () => {
  const leads = [{ id: 'L1', leadName: 'Vikram', emailId: 'Vikram@Acme.com', phoneNumber: '+91 98765 43210' }];

  it('matches on email (case-insensitive) or phone digits', () => {
    expect(findDuplicateLead(leads, { email: 'vikram@acme.com' })?.id).toBe('L1');
    expect(findDuplicateLead(leads, { phone: '9876543210' })?.id).toBe('L1');
    expect(findDuplicateLead(leads, { email: 'new@acme.com', phone: '9123456789' })).toBeNull();
  });
});
