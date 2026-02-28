import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BalanceSummary from '../BalanceSummary';

const ACCOUNTS = [
  { id: 'sbi-001', bank: 'SBI', accountType: 'Savings', balance: 142350.75 },
  { id: 'icici-001', bank: 'ICICI', accountType: 'Savings', balance: 87620.0 },
  { id: 'icici-cc-001', bank: 'ICICI', accountType: 'Credit Card', balance: -12400.0 },
];

describe('BalanceSummary', () => {
  it('renders Total Balance, Total Due and Net Worth labels', () => {
    render(<BalanceSummary accounts={ACCOUNTS} />);
    expect(screen.getByText('Total Balance')).toBeInTheDocument();
    expect(screen.getByText('Total Due')).toBeInTheDocument();
    expect(screen.getByText('Net Worth')).toBeInTheDocument();
  });

  it('renders correctly with empty accounts list', () => {
    render(<BalanceSummary accounts={[]} />);
    expect(screen.getByText('Total Balance')).toBeInTheDocument();
  });

  it('net worth value has positive class when net worth >= 0', () => {
    const positiveAccounts = [
      { id: '1', balance: 100000 },
      { id: '2', balance: -10000 },
    ];
    const { container } = render(<BalanceSummary accounts={positiveAccounts} />);
    const allBalanceValues = container.querySelectorAll('.balance-value');
    const netWorthValue = allBalanceValues[allBalanceValues.length - 1];
    expect(netWorthValue).toHaveClass('balance-positive');
  });

  it('net worth value has negative class when net worth < 0', () => {
    const negativeAccounts = [
      { id: '1', balance: 1000 },
      { id: '2', balance: -50000 },
    ];
    const { container } = render(<BalanceSummary accounts={negativeAccounts} />);
    const allBalanceValues = container.querySelectorAll('.balance-value');
    const netWorthValue = allBalanceValues[allBalanceValues.length - 1];
    expect(netWorthValue).toHaveClass('balance-negative');
  });
});
