import type { Account } from '../types/crm';

/**
 * Account lookup helpers shared by navigation and create flows.
 */

/** Exact (case-insensitive) match first, then a loose contains-either-way match. */
export function findAccountByCompany(accounts: Account[], companyName: string | null | undefined): Account | null {
  const name = (companyName || '').trim().toLowerCase();
  if (!name) return null;
  return (
    accounts.find(a => a.companyName.toLowerCase() === name) ||
    accounts.find(a => {
      const accName = a.companyName.toLowerCase();
      return accName.includes(name) || name.includes(accName);
    }) ||
    null
  );
}

export function createGeneratedAccount(companyName: string, overrides: Partial<Account> = {}): Account {
  const { accountOwner, ...rest } = overrides;
  return {
    id: `ACC-GEN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    companyName: companyName || 'Enterprise Account',
    industry: '',
    companySize: '',
    website: '',
    location: '',
    estimatedAccountValue: '',
    leadsCount: 1,
    contactsCount: 0,
    ...rest,
    accountOwner: accountOwner || 'Unassigned'
  };
}
