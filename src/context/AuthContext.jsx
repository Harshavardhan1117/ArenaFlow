// ============================================================================
// AUTHENTICATION CONTEXT & SERVICE
// Firebase Authentication (Google, Email/Password, and Session Management)
// ============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.js';

const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Maps Firebase Auth error codes to user-friendly messages as requested.
 * Logs error.code and error.message to browser console for debugging.
 */
function mapFirebaseSignupError(err) {
  if (!err) {
    return 'Account creation failed. Please try again.';
  }

  // Explicitly log error.code and error.message to browser console
  console.error('Firebase Auth Error Code:', err.code);
  console.error('Firebase Auth Error Message:', err.message);
  console.error('Firebase Auth Full Error:', err);

  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';

    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/weak-password':
      return 'Password is too weak. Use a stronger password.';

    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';

    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled. Please enable Email/Password provider under Authentication > Sign-in method in the Firebase console.';

    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';

    case 'auth/user-disabled':
      return 'This account has been disabled.';

    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid':
      return 'Firebase API key is invalid. Please check your Firebase configuration.';

    default:
      return 'Account creation failed. Please try again.';
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('organizer');
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Restore local demo session if active
    const savedDemo = localStorage.getItem('arenaflow_demo_user');
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setCurrentUser(parsed);
        setUserRole(parsed.role || 'organizer');
      } catch (e) {
        console.warn('Demo session restore error', e);
      }
    }

    // Firebase Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let role = 'organizer';
        try {
          const profileDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid));
          if (profileDoc.exists()) {
            role = profileDoc.data().role || 'organizer';
          }
        } catch (e) {
          // If Firestore is offline or restricted, role defaults to organizer
        }

        const userObj = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL || null,
          role: role
        };
        setCurrentUser(userObj);
        setUserRole(role);
      } else {
        if (!localStorage.getItem('arenaflow_demo_user')) {
          setCurrentUser(null);
          setUserRole('viewer');
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1. Email + Password Login
  async function login(email, password) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = cred.user;
      const userObj = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        role: 'organizer'
      };
      setCurrentUser(userObj);
      setUserRole('organizer');
      return { success: true, user: userObj };
    } catch (err) {
      console.error('Firebase login error code:', err.code);
      console.error('Firebase login error message:', err.message);
      console.error('Firebase login full error:', err);

      let friendly = 'Failed to sign in. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendly = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        friendly = 'Please enter a valid email address.';
      } else if (err.code === 'auth/network-request-failed') {
        friendly = 'Network error. Please check your internet connection.';
      } else if (err.code === 'auth/operation-not-allowed') {
        friendly = 'Email/Password sign-in is not enabled. Please enable Email/Password provider under Authentication > Sign-in method in the Firebase console.';
      } else if (err.code === 'auth/too-many-requests') {
        friendly = 'Too many attempts. Please try again later.';
      } else if (err.code === 'auth/user-disabled') {
        friendly = 'This account has been disabled.';
      }
      return { success: false, error: friendly, code: err.code };
    }
  }

  // 2. Email + Password Sign Up (createUserWithEmailAndPassword)
  async function register(email, password, name) {
    try {
      const trimmedEmail = email ? email.trim() : '';
      const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);

      // Update profile displayName if provided
      if (name && name.trim()) {
        try {
          await updateProfile(cred.user, { displayName: name.trim() });
        } catch (profileErr) {
          console.warn('Profile displayName update error:', profileErr);
        }
      }

      const userObj = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name ? name.trim() : (cred.user.email?.split('@')[0] || 'Organizer'),
        role: 'organizer'
      };

      // Safely store user profile document in Firestore
      try {
        await setDoc(doc(db, 'profiles', cred.user.uid), {
          id: cred.user.uid,
          name: userObj.displayName,
          email: cred.user.email,
          role: 'organizer',
          createdAt: new Date().toISOString()
        });
      } catch (dbErr) {
        console.warn('Profile doc store note (offline/restricted fallback):', dbErr.message);
      }

      // Update session state
      setCurrentUser(userObj);
      setUserRole('organizer');

      return { success: true, user: userObj };
    } catch (err) {
      // Map error to user-friendly text and log error.code + error.message
      const friendlyMessage = mapFirebaseSignupError(err);
      return {
        success: false,
        error: friendlyMessage,
        code: err?.code,
        message: err?.message
      };
    }
  }

  // 3. Google Login via Firebase
  async function loginWithGoogle() {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const user = cred.user;
      const userObj = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Organizer',
        photoURL: user.photoURL || null,
        role: 'organizer'
      };

      try {
        await setDoc(doc(db, 'profiles', user.uid), {
          id: user.uid,
          name: userObj.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: 'organizer',
          lastLogin: new Date().toISOString()
        }, { merge: true });
      } catch (dbErr) {
        // quiet fallback
      }

      setCurrentUser(userObj);
      setUserRole('organizer');
      return { success: true, user: userObj };
    } catch (err) {
      console.error('Google sign-in error code:', err.code);
      console.error('Google sign-in error message:', err.message);
      let friendly = 'Google sign-in failed. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') {
        friendly = 'Sign-in cancelled. Please try again.';
      } else if (err.code === 'auth/popup-blocked') {
        friendly = 'Sign-in popup was blocked by your browser. Please allow popups or use email login.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        friendly = 'Sign-in window closed. Please try again.';
      } else if (err.code === 'auth/operation-not-allowed') {
        friendly = 'Google sign-in is not enabled in Firebase Console. Please use email login or Demo mode.';
      } else if (err.code === 'auth/network-request-failed') {
        friendly = 'Network error. Please check your internet connection.';
      }
      return { success: false, error: friendly, code: err.code };
    }
  }

  // 4. Quick Demo Login for testing and evaluations
  function quickDemoLogin(role = 'organizer') {
    const demoUser = {
      uid: 'demo-organizer-' + Math.floor(Math.random() * 1000),
      email: 'organizer@arenaflow.io',
      displayName: role === 'organizer' ? 'Tournament Director' : 'Fan Viewer',
      role: role
    };
    localStorage.setItem('arenaflow_demo_user', JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    setUserRole(role);
    return demoUser;
  }

  // 5. Logout
  async function logout() {
    localStorage.removeItem('arenaflow_demo_user');
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setCurrentUser(null);
    setUserRole('viewer');
  }

  const isOrganizer = userRole === 'organizer';
  const isViewer = userRole === 'viewer';
  const hasRole = (requiredRole) => userRole === requiredRole;

  const value = {
    currentUser,
    userRole,
    isOrganizer,
    isViewer,
    hasRole,
    authLoading,
    login,
    register,
    loginWithGoogle,
    quickDemoLogin,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
