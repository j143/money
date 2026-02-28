import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { exportTransactionsCSV } from '../exportService';

const MOCK_TRANSACTIONS = [
  {
    id: 'txn-1',
    date: '2024-01-15T10:00:00.000Z',
    description: 'Grocery Store',
    category: 'Food',
    upiApp: null,
    amount: -450.5,
  },
  {
    id: 'txn-2',
    date: '2024-01-14T08:00:00.000Z',
    description: 'GPay payment to merchant',
    category: 'UPI',
    upiApp: 'GPay',
    amount: -200.0,
  },
  {
    id: 'txn-3',
    date: '2024-01-13T16:00:00.000Z',
    description: 'Salary credit',
    category: 'Transfer',
    upiApp: null,
    amount: 50000.0,
  },
  {
    id: 'txn-4',
    date: '2024-01-12T12:00:00.000Z',
    description: 'Description with "quotes"',
    category: 'Other',
    upiApp: null,
    amount: -100.0,
  },
];

// capturedAnchor holds the <a> element intercepted via the appendChild spy
let capturedAnchor;

beforeEach(() => {
  capturedAnchor = null;

  globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  globalThis.URL.revokeObjectURL = vi.fn();

  // Intercept appendChild WITHOUT calling the original to avoid DOM side effects.
  // Capture the element and stub its click() before it fires.
  vi.spyOn(document.body, 'appendChild').mockImplementation((el) => {
    capturedAnchor = el;
    vi.spyOn(el, 'click').mockImplementation(() => {});
    return el;
  });
  vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
});

// Fully restore all spies after each test so the next beforeEach starts clean
afterEach(() => {
  vi.restoreAllMocks();
});

/** Helper: runs exportTransactionsCSV and returns the generated CSV text. */
async function exportAndReadCSV(transactions, filename = 'out.csv') {
  let blob;
  globalThis.URL.createObjectURL = vi.fn((b) => {
    blob = b;
    return 'blob:mock-url';
  });
  exportTransactionsCSV(transactions, filename);
  return blob.text();
}

describe('exportTransactionsCSV', () => {
  it('creates an anchor element with the correct filename', () => {
    exportTransactionsCSV(MOCK_TRANSACTIONS, 'test-export.csv');
    expect(capturedAnchor.getAttribute('download')).toBe('test-export.csv');
    expect(capturedAnchor.getAttribute('href')).toBe('blob:mock-url');
  });

  it('uses default filename when none is provided', () => {
    exportTransactionsCSV(MOCK_TRANSACTIONS);
    expect(capturedAnchor.getAttribute('download')).toBe('transactions.csv');
  });

  it('calls click() on the created link element', () => {
    exportTransactionsCSV(MOCK_TRANSACTIONS, 'out.csv');
    expect(capturedAnchor.click).toHaveBeenCalledOnce();
  });

  it('revokes the object URL after download', () => {
    exportTransactionsCSV(MOCK_TRANSACTIONS, 'out.csv');
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('CSV includes header row', async () => {
    const text = await exportAndReadCSV(MOCK_TRANSACTIONS);
    expect(text).toMatch(/^Date,Description,Category,UPI App,Amount \(INR\)/);
  });

  it('CSV contains one data row per transaction', async () => {
    const text = await exportAndReadCSV(MOCK_TRANSACTIONS);
    const lines = text.trim().split('\n');
    // 1 header + 4 data rows
    expect(lines).toHaveLength(5);
  });

  it('escapes double-quotes in descriptions', async () => {
    const text = await exportAndReadCSV(MOCK_TRANSACTIONS);
    expect(text).toContain('Description with ""quotes""');
  });

  it('includes UPI app name when present', async () => {
    const text = await exportAndReadCSV(MOCK_TRANSACTIONS);
    expect(text).toContain('GPay');
  });

  it('handles empty transaction list gracefully', () => {
    expect(() => exportTransactionsCSV([], 'empty.csv')).not.toThrow();
  });
});
