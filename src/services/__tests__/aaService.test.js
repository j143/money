import { describe, it, expect, beforeEach, vi } from 'vitest';
import { requestConsent, fetchAccounts, fetchTransactions } from '../aaService';

// Reset module state (consentHandle) between tests by re-importing each time
beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('VITE_AA_BASE_URL', '');
});

describe('aaService – demo / mock mode (no BASE_URL)', () => {
  it('requestConsent returns a mock consent handle', async () => {
    const result = await requestConsent('user-123');
    expect(result.mock).toBe(true);
    expect(result.status).toBe('GRANTED');
    expect(result.consentHandle).toMatch(/^mock-consent-user-123-/);
  });

  it('fetchAccounts returns mock account array', async () => {
    await requestConsent('user-123');
    const accounts = await fetchAccounts();
    expect(Array.isArray(accounts)).toBe(true);
    expect(accounts.length).toBeGreaterThan(0);
    const [first] = accounts;
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('bank');
    expect(first).toHaveProperty('balance');
    expect(first).toHaveProperty('maskedNumber');
  });

  it('fetchTransactions returns sorted transactions for an account', async () => {
    await requestConsent('user-123');
    const txns = await fetchTransactions('sbi-001');
    expect(Array.isArray(txns)).toBe(true);
    expect(txns.length).toBeGreaterThan(0);
    const [first] = txns;
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('amount');
    expect(first).toHaveProperty('category');
    expect(first).toHaveProperty('date');
    // Transactions must be sorted newest-first
    for (let i = 1; i < txns.length; i++) {
      expect(new Date(txns[i - 1].date) >= new Date(txns[i].date)).toBe(true);
    }
  });

  it('each mock transaction has a numeric amount', async () => {
    await requestConsent('user-123');
    const txns = await fetchTransactions('icici-001');
    txns.forEach((t) => {
      expect(typeof t.amount).toBe('number');
    });
  });
});

describe('aaService – production mode (BASE_URL set)', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_AA_BASE_URL', 'https://api.example.com');
  });

  it('requestConsent calls /consent endpoint and returns response data', async () => {
    const mockConsentHandle = 'real-consent-abc';
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ consentHandle: mockConsentHandle, status: 'GRANTED' }),
    });

    const { requestConsent: rc } = await import('../aaService');
    const result = await rc('user-prod');
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const [url, opts] = globalThis.fetch.mock.calls[0];
    expect(url).toBe('https://api.example.com/consent');
    expect(opts.method).toBe('POST');
    expect(result.consentHandle).toBe(mockConsentHandle);
  });

  it('requestConsent throws when /consent returns non-ok status', async () => {
    globalThis.fetch.mockResolvedValueOnce({ ok: false });

    const { requestConsent: rc } = await import('../aaService');
    await expect(rc('user-fail')).rejects.toThrow('Failed to request AA consent');
  });
});
