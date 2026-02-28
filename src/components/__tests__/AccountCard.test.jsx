import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountCard from '../AccountCard';

const BASE_ACCOUNT = {
  id: 'sbi-001',
  bank: 'SBI',
  accountType: 'Savings',
  maskedNumber: 'XXXX 4321',
  balance: 142350.75,
  currency: 'INR',
  lastUpdated: '2024-01-15T10:00:00.000Z',
};

describe('AccountCard', () => {
  it('renders bank name and account type', () => {
    render(<AccountCard account={BASE_ACCOUNT} selected={false} onClick={() => {}} />);
    expect(screen.getByText('SBI')).toBeInTheDocument();
    expect(screen.getByText('Savings')).toBeInTheDocument();
  });

  it('renders masked account number', () => {
    render(<AccountCard account={BASE_ACCOUNT} selected={false} onClick={() => {}} />);
    expect(screen.getByText('XXXX 4321')).toBeInTheDocument();
  });

  it('applies selected class when selected prop is true', () => {
    const { container } = render(
      <AccountCard account={BASE_ACCOUNT} selected={true} onClick={() => {}} />
    );
    expect(container.firstChild).toHaveClass('account-card--selected');
  });

  it('does not apply selected class when selected prop is false', () => {
    const { container } = render(
      <AccountCard account={BASE_ACCOUNT} selected={false} onClick={() => {}} />
    );
    expect(container.firstChild).not.toHaveClass('account-card--selected');
  });

  it('shows "due" label for credit card with negative balance', () => {
    const creditAccount = {
      ...BASE_ACCOUNT,
      id: 'icici-cc-001',
      bank: 'ICICI',
      accountType: 'Credit Card',
      balance: -12400.0,
    };
    render(<AccountCard account={creditAccount} selected={false} onClick={() => {}} />);
    expect(screen.getByText('due')).toBeInTheDocument();
  });

  it('does not show "due" label for savings account', () => {
    render(<AccountCard account={BASE_ACCOUNT} selected={false} onClick={() => {}} />);
    expect(screen.queryByText('due')).not.toBeInTheDocument();
  });

  it('has accessible aria-label', () => {
    render(<AccountCard account={BASE_ACCOUNT} selected={false} onClick={() => {}} />);
    expect(
      screen.getByRole('button', { name: /SBI Savings XXXX 4321/i })
    ).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<AccountCard account={BASE_ACCOUNT} selected={false} onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
