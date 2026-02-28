import { useAuth } from '../context/AuthContext';

export default function Navbar({ onExport }) {
  const { user, logout } = useAuth();

  return (
    <div className="navbar pure-menu pure-menu-horizontal">
      <span className="pure-menu-heading navbar-brand">₹ MoneyApp</span>
      <ul className="pure-menu-list navbar-right">
        {onExport && (
          <li className="pure-menu-item">
            <button className="pure-button navbar-export-btn" onClick={onExport}>
              ⬇ Export CSV
            </button>
          </li>
        )}
        {user && (
          <>
            <li className="pure-menu-item navbar-user">
              <img
                src={user.photoURL || ''}
                alt={user.displayName || 'User'}
                className="navbar-avatar"
                referrerPolicy="no-referrer"
              />
              <span className="navbar-name">{user.displayName}</span>
            </li>
            <li className="pure-menu-item">
              <button className="pure-button navbar-logout-btn" onClick={logout}>
                Sign out
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
