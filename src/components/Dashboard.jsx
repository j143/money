import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestConsent, fetchAccounts, fetchTransactions } from '../services/aaService';
import { exportTransactionsCSV } from '../services/exportService';
import AccountCard from './AccountCard';
import BalanceSummary from './BalanceSummary';
import TransactionList from './TransactionList';
import AlertsPanel from './AlertsPanel';
import Navbar from './Navbar';

export default function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingTxns, setLoadingTxns] = useState(false);
  const [consentStatus, setConsentStatus] = useState(null);
  const [error, setError] = useState(null);

  // Request AA consent and load accounts on mount
  useEffect(() => {
    async function init() {
      try {
        setLoadingAccounts(true);
        const consent = await requestConsent(user.uid);
        setConsentStatus(consent);
        const accs = await fetchAccounts();
        setAccounts(accs);
        if (accs.length > 0) {
          setSelectedAccount(accs[0]);
        }
      } catch (err) {
        setError('Failed to load account data. Please try again.');
        console.error(err);
      } finally {
        setLoadingAccounts(false);
      }
    }
    init();
  }, [user]);

  // Load transactions when selected account changes
  useEffect(() => {
    if (!selectedAccount) return;
    let cancelled = false;
    async function loadTxns() {
      setLoadingTxns(true);
      try {
        const txns = await fetchTransactions(selectedAccount.id);
        if (!cancelled) setTransactions(txns);
      } catch (err) {
        if (!cancelled) setError('Failed to load transactions.');
        console.error(err);
      } finally {
        if (!cancelled) setLoadingTxns(false);
      }
    }
    loadTxns();
    return () => { cancelled = true; };
  }, [selectedAccount]);

  const handleExport = useCallback(() => {
    exportTransactionsCSV(
      transactions,
      `transactions-${selectedAccount?.bank || 'all'}.csv`
    );
  }, [transactions, selectedAccount]);

  return (
    <div className="dashboard">
      <Navbar onExport={transactions.length > 0 ? handleExport : null} />

      <div className="dashboard-content pure-g">
        <div className="pure-u-1">
          {error && (
            <div className="error-banner">
              ⚠️ {error}{' '}
              <button className="pure-button" onClick={() => setError(null)}>
                Dismiss
              </button>
            </div>
          )}

          {consentStatus?.mock && (
            <div className="demo-banner">
              🔬 <strong>Demo mode</strong> – No AA credentials configured. Showing mock
              data. See <code>.env.example</code> to connect real accounts.
            </div>
          )}
        </div>

        {/* Balance summary */}
        <div className="pure-u-1 section-block">
          <h2 className="section-title">Overview</h2>
          {loadingAccounts ? (
            <div className="skeleton-row" />
          ) : (
            <BalanceSummary accounts={accounts} />
          )}
        </div>

        {/* Alerts */}
        {!loadingAccounts && accounts.length > 0 && (
          <div className="pure-u-1 section-block">
            <AlertsPanel accounts={accounts} />
          </div>
        )}

        {/* Account cards */}
        <div className="pure-u-1 section-block">
          <h2 className="section-title">Accounts</h2>
          {loadingAccounts ? (
            <div className="accounts-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="account-card skeleton-card" />
              ))}
            </div>
          ) : (
            <div className="accounts-grid">
              {accounts.map((acc) => (
                <AccountCard
                  key={acc.id}
                  account={acc}
                  selected={selectedAccount?.id === acc.id}
                  onClick={() => setSelectedAccount(acc)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="pure-u-1 section-block">
          <h2 className="section-title">
            Transactions
            {selectedAccount && (
              <span className="section-subtitle">
                {' '}– {selectedAccount.bank} {selectedAccount.maskedNumber}
              </span>
            )}
          </h2>
          <TransactionList transactions={transactions} loading={loadingTxns} />
        </div>
      </div>
    </div>
  );
}
