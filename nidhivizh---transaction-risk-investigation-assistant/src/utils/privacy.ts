/**
 * Privacy and Data Protection Masking Utilities
 * Compliant with PCI-DSS and Banking Data Privacy guidelines.
 */

export const maskCustomerName = (name: string, isPrivacy: boolean): string => {
  if (!isPrivacy || !name) return name;
  const parts = name.trim().split(' ');
  return parts
    .map(p => {
      if (p.length <= 2) return p[0] + '*';
      return p.slice(0, 2) + '*'.repeat(Math.max(2, p.length - 2));
    })
    .join(' ');
};

export const maskAccountNumber = (account: string, isPrivacy: boolean): string => {
  if (!isPrivacy || !account) return account;
  // If already like '**** 4821', mask last digits too
  return '•••• ••••';
};

export const maskAmount = (amount: number, isPrivacy: boolean): string => {
  if (!isPrivacy) {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  const digits = Math.floor(amount).toString().length;
  return `₹${'•'.repeat(Math.min(digits, 6))}`;
};

export const maskPayee = (payee: string, isPrivacy: boolean): string => {
  if (!isPrivacy || !payee) return payee;
  if (payee.length <= 4) return '••••';
  return payee.slice(0, 3) + '•'.repeat(Math.max(3, payee.length - 3));
};
