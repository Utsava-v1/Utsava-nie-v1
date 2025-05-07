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

// Access via: const { currentUser, userProfile } = useAuth()
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);      // Firebase user
  const [userProfile, setUserProfile] = useState(null);      // Firestore profile
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user.uid, {
      email: userCredential.user.email,
      role: 'student',
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
    if (user) {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } else {
      setUserProfile(null);
    }
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
    userProfile,  // This replaces the misleading name `currentUserDetails`
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
