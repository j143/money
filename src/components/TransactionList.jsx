import { useState } from 'react';

const CATEGORY_ICONS = {
  Food: '🍔',
  Transport: '🚌',
  Shopping: '🛍️',
  Bills: '🧾',
  Transfer: '↔️',
  UPI: '📱',
  Other: '💸',
};

const UPI_ICONS = {
  GPay: '🇬',
  PhonePe: '📲',
  Paytm: '💙',
  BHIM: '🇮🇳',
};

function formatINR(amount) {
  const abs = Math.abs(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(abs);
}

const ALL_CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Transfer', 'UPI', 'Other'];

export default function TransactionList({ transactions, loading }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter((t) => {
    const matchCategory = filterCategory === 'All' || t.category === filterCategory;
    const matchSearch =
      !searchTerm ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) {
    return <div className="txn-loading">Loading transactions…</div>;
  }

  return (
    <div className="txn-section">
      <div className="txn-filters pure-g">
        <div className="pure-u-1 pure-u-md-1-2">
          <input
            className="pure-input-1 txn-search"
            type="search"
            placeholder="Search transactions…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="pure-u-1 pure-u-md-1-2 txn-category-btns">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pure-button txn-cat-btn${filterCategory === cat ? ' pure-button-primary' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {CATEGORY_ICONS[cat] || ''} {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="txn-empty">No transactions found.</p>
      ) : (
        <table className="pure-table pure-table-striped txn-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th className="txn-amount-col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((txn) => (
              <tr key={txn.id}>
                <td className="txn-date">
                  {new Date(txn.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </td>
                <td>
                  {txn.upiApp && (
                    <span className="txn-upi-badge" title={txn.upiApp}>
                      {UPI_ICONS[txn.upiApp] || '📱'} {txn.upiApp}
                    </span>
                  )}{' '}
                  {txn.description}
                </td>
                <td>
                  <span className="txn-category-badge">
                    {CATEGORY_ICONS[txn.category] || '💸'} {txn.category}
                  </span>
                </td>
                <td
                  className={`txn-amount ${txn.amount < 0 ? 'txn-debit' : 'txn-credit'}`}
                >
                  {txn.amount < 0 ? '−' : '+'} {formatINR(txn.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
