import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="login-page">
      <div className="login-card pure-u-1 pure-u-md-1-3">
        <div className="login-logo">₹</div>
        <h1>MoneyApp</h1>
        <p className="login-subtitle">
          Consolidate your SBI, ICICI &amp; UPI transactions in one dashboard.
          Powered by RBI's Account Aggregator framework.
        </p>
        <button
          className="pure-button pure-button-primary login-btn"
          onClick={signInWithGoogle}
        >
          <span className="btn-icon">G</span> Sign in with Google
        </button>
        <p className="login-note">
          🔒 Consent-based access only. No sensitive data stored long-term.
        </p>
      </div>
    </div>
  );
}
