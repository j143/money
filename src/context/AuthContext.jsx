import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AuthContext = createContext(null);

// Demo user shown when Firebase is not configured
const DEMO_USER = {
  uid: 'demo-user',
  displayName: 'Demo User',
  email: 'demo@example.com',
  photoURL: null,
};

const isFirebaseConfigured = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(isFirebaseConfigured ? null : DEMO_USER);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = () => {
    if (!isFirebaseConfigured) {
      setUser(DEMO_USER);
      return Promise.resolve();
    }
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    if (!isFirebaseConfigured) {
      setUser(null);
      return Promise.resolve();
    }
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
