const BANK_COLORS = {
  SBI: '#003090',
  ICICI: '#f68b1e',
};

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function AccountCard({ account, selected, onClick }) {
  const isCredit = account.accountType === 'Credit Card';
  const color = BANK_COLORS[account.bank] || '#666';

  return (
    <div
      className={`account-card${selected ? ' account-card--selected' : ''}`}
      style={{ borderTopColor: color }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`${account.bank} ${account.accountType} ${account.maskedNumber}`}
    >
      <div className="account-card__header">
        <span className="account-card__bank" style={{ color }}>
          {account.bank}
        </span>
        <span className="account-card__type">{account.accountType}</span>
      </div>
      <div className="account-card__number">{account.maskedNumber}</div>
      <div
        className={`account-card__balance${isCredit && account.balance < 0 ? ' account-card__balance--negative' : ''}`}
      >
        {formatINR(Math.abs(account.balance))}
        {isCredit && account.balance < 0 && (
          <span className="account-card__due"> due</span>
        )}
      </div>
      <div className="account-card__updated">
        Updated: {new Date(account.lastUpdated).toLocaleDateString('en-IN')}
      </div>
    </div>
  );
}
