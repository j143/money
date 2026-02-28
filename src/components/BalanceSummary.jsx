function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function BalanceSummary({ accounts }) {
  const totalAssets = accounts
    .filter((a) => a.balance > 0)
    .reduce((sum, a) => sum + a.balance, 0);

  const totalDue = accounts
    .filter((a) => a.balance < 0)
    .reduce((sum, a) => sum + a.balance, 0);

  const netWorth = totalAssets + totalDue;

  return (
    <div className="balance-summary pure-g">
      <div className="balance-card pure-u-1 pure-u-sm-1-3">
        <div className="balance-label">Total Balance</div>
        <div className="balance-value balance-positive">{formatINR(totalAssets)}</div>
      </div>
      <div className="balance-card pure-u-1 pure-u-sm-1-3">
        <div className="balance-label">Total Due</div>
        <div className="balance-value balance-negative">{formatINR(Math.abs(totalDue))}</div>
      </div>
      <div className="balance-card pure-u-1 pure-u-sm-1-3">
        <div className="balance-label">Net Worth</div>
        <div className={`balance-value ${netWorth >= 0 ? 'balance-positive' : 'balance-negative'}`}>
          {formatINR(netWorth)}
        </div>
      </div>
    </div>
  );
}
