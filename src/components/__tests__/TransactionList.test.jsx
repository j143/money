import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionList from '../TransactionList';

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
];

describe('TransactionList', () => {
  it('shows loading indicator when loading prop is true', () => {
    render(<TransactionList transactions={[]} loading={true} />);
    expect(screen.getByText(/Loading transactions/i)).toBeInTheDocument();
  });

  it('renders all transactions when loaded', () => {
    render(<TransactionList transactions={MOCK_TRANSACTIONS} loading={false} />);
    expect(screen.getByText('Grocery Store')).toBeInTheDocument();
    expect(screen.getByText('Salary credit')).toBeInTheDocument();
  });

  it('shows empty state message when no transactions match', () => {
    render(<TransactionList transactions={[]} loading={false} />);
    expect(screen.getByText(/No transactions found/i)).toBeInTheDocument();
  });

  it('filters by category when a category button is clicked', async () => {
    const user = userEvent.setup();
    render(<TransactionList transactions={MOCK_TRANSACTIONS} loading={false} />);
    await user.click(screen.getByRole('button', { name: /Food/i }));
    expect(screen.getByText('Grocery Store')).toBeInTheDocument();
    expect(screen.queryByText('Salary credit')).not.toBeInTheDocument();
  });

  it('filters by search term', async () => {
    const user = userEvent.setup();
    render(<TransactionList transactions={MOCK_TRANSACTIONS} loading={false} />);
    await user.type(screen.getByPlaceholderText(/Search transactions/i), 'Salary');
    expect(screen.getByText('Salary credit')).toBeInTheDocument();
    expect(screen.queryByText('Grocery Store')).not.toBeInTheDocument();
  });

  it('shows UPI badge for UPI transactions', () => {
    render(<TransactionList transactions={MOCK_TRANSACTIONS} loading={false} />);
    // The badge span has a title attribute; query by title
    expect(document.querySelector('.txn-upi-badge[title="GPay"]')).toBeInTheDocument();
  });

  it('shows debit amounts with minus sign', () => {
    render(<TransactionList transactions={MOCK_TRANSACTIONS} loading={false} />);
    // All debit rows have the '−' sign (unicode minus)
    const debits = screen.getAllByText('−', { exact: false });
    expect(debits.length).toBeGreaterThan(0);
  });

  it('shows credit amounts with plus sign', () => {
    render(<TransactionList transactions={MOCK_TRANSACTIONS} loading={false} />);
    expect(screen.getByText('+', { exact: false })).toBeInTheDocument();
  });

  it('resets filter to All when All button is clicked', async () => {
    const user = userEvent.setup();
    render(<TransactionList transactions={MOCK_TRANSACTIONS} loading={false} />);
    await user.click(screen.getByRole('button', { name: /Food/i }));
    await user.click(screen.getByRole('button', { name: /^All$/i }));
    expect(screen.getByText('Grocery Store')).toBeInTheDocument();
    expect(screen.getByText('Salary credit')).toBeInTheDocument();
  });
});
