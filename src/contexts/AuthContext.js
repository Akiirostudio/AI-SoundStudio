import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { auth } from '../firebase/config';
import userDataService from '../services/userData';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, displayName) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      if (displayName) {
        await updateProfile(result.user, {
          displayName: displayName
        });
      }

      // Initialize user data in Firestore
      try {
        await userDataService.initializeUserData(result.user.uid, {
          email: email,
          displayName: displayName,
          emailVerified: result.user.emailVerified
        });
      } catch (firestoreError) {
        console.error('Error initializing user data:', firestoreError);
        // Don't fail signup if Firestore fails, just log the error
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    try {
      // Update last login time before logging out
      if (currentUser) {
        await userDataService.updateUserProfile(currentUser.uid, {
          lastLogin: new Date()
        });
      }
      return await signOut(auth);
    } catch (error) {
      throw error;
    }
  }

  async function deleteUserAccount() {
    try {
      if (currentUser) {
        // Delete all user data from Firestore
        await userDataService.deleteUserData(currentUser.uid);
        
        // Delete the user account from Firebase Auth
        await deleteUser(currentUser);
      }
    } catch (error) {
      throw error;
    }
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function ensureUserData(user) {
    try {
      // Check if user profile exists
      const userProfile = await userDataService.getUserProfile(user.uid);
      if (!userProfile) {
        // Create user profile if it doesn't exist
        console.log('Creating user profile for existing user');
        await userDataService.initializeUserData(user.uid, {
          email: user.email,
          displayName: user.displayName || 'User',
          emailVerified: user.emailVerified
        });
      }
    } catch (error) {
      console.error('Error ensuring user data:', error);
      // Don't throw error, just log it
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Update last login time when user signs in
      if (user) {
        try {
          // Ensure user data exists
          await ensureUserData(user);
          
          // Update last login time
          await userDataService.updateUserProfile(user.uid, {
            lastLogin: new Date()
          });
        } catch (error) {
          console.error('Error updating last login:', error);
          // Don't throw error, just log it
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    deleteUserAccount,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
