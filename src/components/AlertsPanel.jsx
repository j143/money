import { useState } from 'react';

export default function AlertsPanel({ accounts }) {
  const [dismissed, setDismissed] = useState([]);

  const alerts = [];

  accounts.forEach((acc) => {
    if (acc.accountType === 'Savings' && acc.balance < 10000) {
      alerts.push({
        id: `low-balance-${acc.id}`,
        type: 'warning',
        message: `⚠️ Low balance in ${acc.bank} ${acc.maskedNumber}: ₹${acc.balance.toLocaleString('en-IN')}`,
      });
    }
    if (acc.accountType === 'Credit Card' && acc.balance < -10000) {
      alerts.push({
        id: `high-due-${acc.id}`,
        type: 'error',
        message: `🔴 High credit card due on ${acc.bank} ${acc.maskedNumber}: ₹${Math.abs(acc.balance).toLocaleString('en-IN')}`,
      });
    }
  });

  const visible = alerts.filter((a) => !dismissed.includes(a.id));

  if (visible.length === 0) return null;

  return (
    <div className="alerts-panel">
      {visible.map((alert) => (
        <div key={alert.id} className={`alert-item alert-${alert.type}`}>
          <span>{alert.message}</span>
          <button
            className="alert-dismiss"
            onClick={() => setDismissed((d) => [...d, alert.id])}
            aria-label="Dismiss alert"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
