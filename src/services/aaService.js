/**
 * Account Aggregator (AA) Service
 *
 * Implements the RBI Account Aggregator framework for consent-based data fetching.
 * In production, replace MOCK_* constants with real Setu / Finvu AA API calls.
 *
 * Docs:
 *   Setu AA  – https://docs.setu.co/data/account-aggregator/quickstart
 *   Finvu AA – https://docs.finvu.in/
 */

const BASE_URL = import.meta.env.VITE_AA_BASE_URL || '';

// ---------------------------------------------------------------------------
// Mock data – used when no AA credentials are configured (demo / dev mode)
// ---------------------------------------------------------------------------

const MOCK_ACCOUNTS = [
  {
    id: 'sbi-001',
    bank: 'SBI',
    accountType: 'Savings',
    maskedNumber: 'XXXX 4321',
    balance: 142350.75,
    currency: 'INR',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'icici-001',
    bank: 'ICICI',
    accountType: 'Savings',
    maskedNumber: 'XXXX 8765',
    balance: 87620.0,
    currency: 'INR',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'icici-cc-001',
    bank: 'ICICI',
    accountType: 'Credit Card',
    maskedNumber: 'XXXX 3322',
    balance: -12400.0,
    currency: 'INR',
    lastUpdated: new Date().toISOString(),
  },
];

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Transfer', 'UPI', 'Other'];

function randomCategory() {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}

const UPI_APPS = ['GPay', 'PhonePe', 'Paytm', 'BHIM'];

function buildMockTransactions(accountId, count = 20) {
  return Array.from({ length: count }, (_, i) => {
    const isDebit = Math.random() > 0.4;
    const amount = parseFloat((Math.random() * 5000 + 10).toFixed(2));
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const category = randomCategory();
    const upiApp = category === 'UPI' ? UPI_APPS[Math.floor(Math.random() * UPI_APPS.length)] : null;
    return {
      id: `${accountId}-txn-${i}`,
      accountId,
      date: date.toISOString(),
      description: upiApp
        ? `${upiApp} payment to merchant`
        : `Transaction ${i + 1}`,
      amount: isDebit ? -amount : amount,
      category,
      upiApp,
      balance: parseFloat((Math.random() * 200000).toFixed(2)),
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ---------------------------------------------------------------------------
// Consent & data fetching helpers
// ---------------------------------------------------------------------------

let consentHandle = null;

export async function requestConsent(userId) {
  if (!BASE_URL) {
    // Demo mode – return a mock consent handle
    consentHandle = `mock-consent-${userId}-${Date.now()}`;
    return { consentHandle, status: 'GRANTED', mock: true };
  }
  const res = await fetch(`${BASE_URL}/consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      consentTypes: ['PROFILE', 'SUMMARY', 'TRANSACTIONS'],
      fiTypes: ['DEPOSIT', 'CREDIT_CARD', 'RECURRING_DEPOSIT'],
    }),
  });
  if (!res.ok) throw new Error('Failed to request AA consent');
  const data = await res.json();
  consentHandle = data.consentHandle;
  return data;
}

export async function fetchAccounts() {
  if (!BASE_URL || !consentHandle || consentHandle.startsWith('mock-consent')) {
    return MOCK_ACCOUNTS;
  }
  const res = await fetch(`${BASE_URL}/fi/fetch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ consentHandle, fiTypes: ['DEPOSIT', 'CREDIT_CARD'] }),
  });
  if (!res.ok) throw new Error('Failed to fetch accounts via AA');
  return res.json();
}

export async function fetchTransactions(accountId) {
  if (!BASE_URL || !consentHandle || consentHandle.startsWith('mock-consent')) {
    return buildMockTransactions(accountId);
  }
  const res = await fetch(`${BASE_URL}/fi/fetch/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ consentHandle, accountId }),
  });
  if (!res.ok) throw new Error('Failed to fetch transactions via AA');
  return res.json();
}
