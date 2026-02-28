import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertsPanel from '../AlertsPanel';

const LOW_BALANCE_ACCOUNT = {
  id: 'sbi-001',
  bank: 'SBI',
  accountType: 'Savings',
  maskedNumber: 'XXXX 4321',
  balance: 5000,
};

const HIGH_DUE_ACCOUNT = {
  id: 'icici-cc-001',
  bank: 'ICICI',
  accountType: 'Credit Card',
  maskedNumber: 'XXXX 3322',
  balance: -15000,
};

const HEALTHY_ACCOUNT = {
  id: 'icici-001',
  bank: 'ICICI',
  accountType: 'Savings',
  maskedNumber: 'XXXX 8765',
  balance: 87620,
};

describe('AlertsPanel', () => {
  it('renders nothing when all accounts are healthy', () => {
    const { container } = render(<AlertsPanel accounts={[HEALTHY_ACCOUNT]} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows low-balance warning for savings account below ₹10,000', () => {
    render(<AlertsPanel accounts={[LOW_BALANCE_ACCOUNT]} />);
    expect(screen.getByText(/Low balance/i)).toBeInTheDocument();
    expect(screen.getByText(/SBI/)).toBeInTheDocument();
  });

  it('shows high-due error for credit card with balance below −₹10,000', () => {
    render(<AlertsPanel accounts={[HIGH_DUE_ACCOUNT]} />);
    expect(screen.getByText(/High credit card due/i)).toBeInTheDocument();
    expect(screen.getByText(/ICICI/)).toBeInTheDocument();
  });

  it('shows multiple alerts when multiple accounts need attention', () => {
    render(<AlertsPanel accounts={[LOW_BALANCE_ACCOUNT, HIGH_DUE_ACCOUNT]} />);
    expect(screen.getByText(/Low balance/i)).toBeInTheDocument();
    expect(screen.getByText(/High credit card due/i)).toBeInTheDocument();
  });

  it('dismisses an alert when the dismiss button is clicked', async () => {
    const user = userEvent.setup();
    render(<AlertsPanel accounts={[LOW_BALANCE_ACCOUNT]} />);
    expect(screen.getByText(/Low balance/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Dismiss alert/i }));
    expect(screen.queryByText(/Low balance/i)).not.toBeInTheDocument();
  });

  it('renders nothing when no accounts are provided', () => {
    const { container } = render(<AlertsPanel accounts={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
