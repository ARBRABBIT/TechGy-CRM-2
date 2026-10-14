import { describe, it, expect } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { STORAGE_KEYS } from './constants/storageKeys';

const ADMIN = { name: 'System Administrator', email: 'admin@techgy.com', role: 'Sales Admin' };
const HEAD = { name: 'Rajesh Sharma', email: 'head@techgy.com', role: 'Sales Head' };
const EXECUTIVE = { name: 'Rahul Verma', email: 'executive@techgy.com', role: 'Sales Executive' };

const signInAs = (user) => localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
const storedLeads = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]');
const storedLead = (id) => storedLeads().find(l => l.id === id);
const THARUN = '#PG26080008';

async function openLeads(user) {
  await user.click(screen.getByRole('button', { name: 'Manage Leads' }));
  return screen.findByRole('heading', { name: /Lead Management Queue|Manage Junks/ });
}

async function openLeadRow(user, name) {
  await openLeads(user);
  const nameCell = (await screen.findAllByRole('button', { name }))[0];
  return nameCell.closest('tr');
}

describe('login', () => {
  it('shows the sign-in screen when there is no session', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Main' })).not.toBeInTheDocument();
  });

  it('rejects a too-short password', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('Password'), 'ab');
    await user.click(screen.getByRole('button', { name: /Sign in to workspace/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('at least 4 characters');
    expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBeNull();
  });

  it('signs in with the selected role and lands on that role’s dashboard', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('tab', { name: 'Sales Head' }));
    await user.type(screen.getByLabelText('Password'), 'testpass');
    await user.click(screen.getByRole('button', { name: /Sign in to workspace/ }));

    const nav = await screen.findByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('button', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).queryByRole('button', { name: 'Master Data' })).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER))).toMatchObject({ name: 'Rajesh Sharma', role: 'Sales Head' });
  });

  it('ignores a tampered session with an unknown role', () => {
    signInAs({ name: 'Mallory', email: 'm@x.com', role: 'Owner' });
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });
});

describe('logout', () => {
  it('asks for confirmation, then clears the session and returns to sign-in', async () => {
    const user = userEvent.setup();
    signInAs(ADMIN);
    render(<App />);

    await user.click(screen.getByText('System Administrator', { selector: '.sidebar *' }));
    await user.click(await screen.findByRole('button', { name: /Log Out/ }));

    const dialog = await screen.findByRole('dialog', { name: 'Confirm Log Out' });
    await user.click(within(dialog).getByRole('button', { name: /Yes, Log Out/ }));

    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBeNull();
  });
});

describe('lead editing', () => {
  it('saves edited details and refuses an empty name', async () => {
    const user = userEvent.setup();
    signInAs(ADMIN);
    render(<App />);

    const row = await openLeadRow(user, 'Tharun Duggi');
    await user.click(within(row).getByRole('button', { name: 'Tharun Duggi' }));
    await user.click(await screen.findByRole('button', { name: /Edit/ }));

    const dialog = await screen.findByRole('dialog', { name: 'Edit lead details' });
    const nameInput = within(dialog).getByLabelText('Full Name');

    await user.clear(nameInput);
    await user.click(within(dialog).getByRole('button', { name: /Save Changes/ }));
    expect(await within(dialog).findByText('Lead name is required.')).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');

    await user.type(nameInput, 'Tharun K Duggi');
    await user.click(within(dialog).getByRole('button', { name: /Save Changes/ }));

    await waitFor(() => expect(storedLead(THARUN).leadName).toBe('Tharun K Duggi'));
    expect(await screen.findByRole('heading', { name: 'Tharun K Duggi' })).toBeInTheDocument();
  });

  it('hides the Edit control from sales executives', async () => {
    const user = userEvent.setup();
    signInAs(EXECUTIVE);
    render(<App />);

    const row = await openLeadRow(user, 'Vijay Kumar');
    await user.click(within(row).getByRole('button', { name: 'Vijay Kumar' }));
    await screen.findByRole('heading', { name: 'Vijay Kumar' });
    expect(screen.queryByRole('button', { name: /Edit Lead Contact Details/ })).not.toBeInTheDocument();
  });
});

describe('lead assignment', () => {
  it('assigns an unassigned lead to a sales executive', async () => {
    const user = userEvent.setup();
    signInAs(ADMIN);
    render(<App />);

    const row = await openLeadRow(user, 'Tharun Duggi');
    expect(storedLead(THARUN).salesExecutive || '').toBe('');
    await user.click(within(row).getByRole('button', { name: /Assign Sales Executive/ }));

    const dialog = await screen.findByRole('dialog', { name: /Assign Sales Executive/ });
    await user.click(within(dialog).getAllByRole('button', { name: /Rahul Verma/ })[0]);
    await user.click(within(dialog).getByRole('button', { name: /Confirm & Move to Assigned/ }));

    await waitFor(() => expect(storedLead(THARUN)).toMatchObject({
      salesExecutive: 'Rahul Verma',
      assignedSalesExecutive: 'Rahul Verma'
    }));
  });

  it('lets a sales head assign but not bulk-import', async () => {
    const user = userEvent.setup();
    signInAs(HEAD);
    render(<App />);
    await openLeads(user);
    expect(screen.getByRole('button', { name: /Create New Lead/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Bulk Import/ })).not.toBeInTheDocument();
  });

  it('gives sales executives no create, assign or import controls', async () => {
    const user = userEvent.setup();
    signInAs(EXECUTIVE);
    render(<App />);
    await openLeads(user);
    expect(screen.queryByRole('button', { name: /Create New/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Bulk Import/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Assign Sales Executive/ })).not.toBeInTheDocument();
  });
});

describe('lead deletion', () => {
  it('permanently deletes a junk lead after confirmation', async () => {
    const user = userEvent.setup();
    signInAs(ADMIN);
    render(<App />);
    await openLeads(user);

    await user.click(screen.getByRole('tab', { name: /Junk/ }));
    const deleteButtons = await screen.findAllByRole('button', { name: /^Delete$/ });
    const row = deleteButtons[0].closest('tr');
    const leadId = within(row).getByText(/^#/).textContent.trim();
    expect(storedLead(leadId)).toBeTruthy();

    await user.click(deleteButtons[0]);
    await user.click(await screen.findByRole('button', { name: /Delete Permanently/ }));

    await waitFor(() => expect(storedLead(leadId)).toBeUndefined());
  });

  it('does not offer permanent deletion to sales heads', async () => {
    const user = userEvent.setup();
    signInAs(HEAD);
    render(<App />);
    await openLeads(user);
    await user.click(screen.getByRole('tab', { name: /Junk/ }));
    expect(screen.queryByRole('button', { name: /^Delete$/ })).not.toBeInTheDocument();
  });
});

describe('integrations', () => {
  it('is admin-only', async () => {
    signInAs(HEAD);
    render(<App />);
    expect(screen.queryByRole('button', { name: 'Integrations' })).not.toBeInTheDocument();
  });

  it('sends a test lead through routing into the lead list', async () => {
    const user = userEvent.setup();
    signInAs(ADMIN);
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Integrations' }));
    await screen.findByRole('heading', { name: 'Integrations', level: 2 });

    // Route Meta leads to a fixed executive
    const metaCard = screen.getByRole('heading', { name: 'Meta Lead Ads' }).closest('article');
    await user.click(within(metaCard).getByRole('button', { name: /Configure/ }));
    const dialog = await screen.findByRole('dialog', { name: 'Meta Lead Ads' });
    await user.click(within(dialog).getByRole('checkbox', { name: /Import leads/ }));
    await user.click(within(dialog).getByRole('radio', { name: /Always assign to/ }));
    await user.selectOptions(within(dialog).getByRole('combobox', { name: 'Executive to assign' }), 'Sneha Rao');
    await user.click(within(dialog).getByRole('button', { name: /Save settings/ }));

    await user.click(within(metaCard).getByRole('button', { name: /Send test lead/ }));

    await waitFor(() => {
      const captured = storedLeads().filter(l => l.intake?.connectorId === 'meta');
      expect(captured).toHaveLength(1);
      expect(captured[0]).toMatchObject({ leadSource: 'Meta', salesExecutive: 'Sneha Rao', intake: { isTest: true } });
    });
    expect(within(metaCard).getByText('Set up')).toBeInTheDocument();
    expect(await screen.findByRole('cell', { name: /Meta Lead Ads/ })).toBeInTheDocument();
  });
});

describe('call logging', () => {
  it('logs a call made outside the portal into the lead’s call history', async () => {
    const user = userEvent.setup();
    signInAs(ADMIN);
    render(<App />);

    const row = await openLeadRow(user, 'Tharun Duggi');
    await user.click(within(row).getByRole('button', { name: 'Tharun Duggi' }));
    await user.click(await screen.findByRole('button', { name: /^Calls/ }));
    await user.click((await screen.findAllByRole('button', { name: /Log Call/ }))[0]);

    const dialog = await screen.findByRole('dialog', { name: 'Log Call' });
    await user.type(within(dialog).getAllByRole('textbox').at(-1), 'Discussed site visit on Saturday');
    await user.click(within(dialog).getByRole('button', { name: /Confirm Action/ }));

    await waitFor(() => {
      const acts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITIES) || '[]');
      expect(acts.find(a => a.type === 'Call' && a.lead === 'Tharun Duggi')).toBeTruthy();
    });
    expect(screen.queryByRole('dialog', { name: /Confirm Voice Call|Active call/ })).not.toBeInTheDocument();
  });
});
