import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase';
import { createUserProfile, getUserProfile } from '../utils/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  // Sign up with email, password, and role
  const signup = async (email, password, role = 'student') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user.uid, {
      email: userCredential.user.email,
      role,
      displayName: userCredential.user.displayName || email.split('@')[0],
      photoURL: userCredential.user.photoURL || null,
    });
    return userCredential;
  };

  // Login with email/password
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // Logout
  const logout = async () => {
    setUserProfile(null);
    setProfileLoading(true);
    await signOut(auth);
  };

  // Login with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Create Firestore profile if it doesn't exist
    const profile = await getUserProfile(userCredential.user.uid);
    if (!profile) {
      await createUserProfile(userCredential.user.uid, {
        email: userCredential.user.email,
        role: 'student',
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      });
    }

    return userCredential;
  };

  // Reset password
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // Load Firestore user profile
  const loadUserProfile = async (user) => {
    setProfileLoading(true);
    if (user) {
      try {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
        console.log('User profile loaded:', profile);
      } catch (error) {
        console.error('Error loading user profile:', error.message);
        setUserProfile(null);
      }
    } else {
      setUserProfile(null);
    }
    setProfileLoading(false);
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await loadUserProfile(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    profileLoading,
    signup,
    login,
    logout,
    signInWithGoogle,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};