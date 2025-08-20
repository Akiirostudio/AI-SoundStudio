import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

class UserDataService {
  // User Profile Management
  async createUserProfile(userId, userData) {
    try {
      console.log('Creating user profile for:', userId);
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      console.log('User profile created successfully');
      return { success: true };
    } catch (error) {
      console.error('Error creating user profile:', error);
      console.error('Error details:', error.code, error.message);
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      console.log('Getting user profile for:', userId);
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        console.log('User profile found');
        return userSnap.data();
      } else {
        console.log('User profile not found');
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      console.error('Error details:', error.code, error.message);
      throw error;
    }
  }

  async updateUserProfile(userId, updates) {
    try {
      console.log('Updating user profile for:', userId);
      const userRef = doc(db, 'users', userId);
      
      // Check if user profile exists first
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        // Create user profile if it doesn't exist
        console.log('User profile not found, creating new profile');
        await setDoc(userRef, {
          ...updates,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        // Update existing profile
        await updateDoc(userRef, {
          ...updates,
          updatedAt: serverTimestamp()
        });
      }
      
      console.log('User profile updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      console.error('Error details:', error.code, error.message);
      throw error;
    }
  }

  // Test if user can write to their submissions subcollection
  async testUserWriteAccess(userId) {
    try {
      console.log('Testing write access for user:', userId);
      const testRef = doc(db, 'users', userId, 'submissions', 'test');
      await setDoc(testRef, { test: true, timestamp: serverTimestamp() });
      await deleteDoc(testRef); // Clean up test document
      console.log('Write access test successful');
      return true;
    } catch (error) {
      console.error('Write access test failed:', error);
      console.error('Error details:', error.code, error.message);
      return false;
    }
  }

  // Playlist Submissions Management
  async savePlaylistSubmission(userId, submissionData) {
    try {
      console.log('Saving playlist submission for user:', userId);
      
      // Ensure user profile exists first
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) {
        console.log('Creating user profile before saving submission');
        await this.createUserProfile(userId, {
          email: submissionData.userEmail || 'user@example.com',
          displayName: submissionData.userName || 'User',
          emailVerified: false
        });
      }
      
      const submissionsRef = collection(db, 'users', userId, 'submissions');
      const submission = {
        ...submissionData,
        userId,
        createdAt: serverTimestamp(),
        status: 'submitted',
        id: null // Will be set after creation
      };

      const docRef = await addDoc(submissionsRef, submission);
      
      // Update the submission with its ID
      await updateDoc(docRef, { id: docRef.id });
      
      console.log('Playlist submission saved successfully with ID:', docRef.id);
      return { success: true, submissionId: docRef.id };
    } catch (error) {
      console.error('Error saving playlist submission:', error);
      console.error('Error details:', error.code, error.message);
      throw error;
    }
  }

  async getUserSubmissions(userId) {
    try {
      console.log('Getting user submissions for:', userId);
      const submissionsRef = collection(db, 'users', userId, 'submissions');
      const q = query(submissionsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const submissions = [];
      querySnapshot.forEach((doc) => {
        submissions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('Found', submissions.length, 'submissions');
      return submissions;
    } catch (error) {
      console.error('Error getting user submissions:', error);
      console.error('Error details:', error.code, error.message);
      
      // If it's a permission error, return empty array
      if (error.code === 'permission-denied') {
        console.log('Permission denied, returning empty submissions array');
        return [];
      }
      
      throw error;
    }
  }

  async updateSubmissionStatus(userId, submissionId, status, additionalData = {}) {
    try {
      const submissionRef = doc(db, 'users', userId, 'submissions', submissionId);
      await updateDoc(submissionRef, {
        status,
        ...additionalData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating submission status:', error);
      throw error;
    }
  }

  // Analytics Data Management
  async savePlaylistAnalysis(userId, analysisData) {
    try {
      const analysesRef = collection(db, 'users', userId, 'analyses');
      const analysis = {
        ...analysisData,
        userId,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(analysesRef, analysis);
      return { success: true, analysisId: docRef.id };
    } catch (error) {
      console.error('Error saving playlist analysis:', error);
      throw error;
    }
  }

  async getUserAnalyses(userId) {
    try {
      const analysesRef = collection(db, 'users', userId, 'analyses');
      const q = query(analysesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const analyses = [];
      querySnapshot.forEach((doc) => {
        analyses.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return analyses;
    } catch (error) {
      console.error('Error getting user analyses:', error);
      throw error;
    }
  }

  // User Preferences and Settings
  async saveUserPreferences(userId, preferences) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        preferences: {
          ...preferences,
          updatedAt: serverTimestamp()
        }
      });
      return { success: true };
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }

  async getUserPreferences(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData.preferences || {};
      } else {
        return {};
      }
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw error;
    }
  }

  // Track Data Management
  async saveTrackData(userId, trackData) {
    try {
      const tracksRef = collection(db, 'users', userId, 'tracks');
      const track = {
        ...trackData,
        userId,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(tracksRef, track);
      return { success: true, trackId: docRef.id };
    } catch (error) {
      console.error('Error saving track data:', error);
      throw error;
    }
  }

  async getUserTracks(userId) {
    try {
      const tracksRef = collection(db, 'users', userId, 'tracks');
      const q = query(tracksRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const tracks = [];
      querySnapshot.forEach((doc) => {
        tracks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return tracks;
    } catch (error) {
      console.error('Error getting user tracks:', error);
      throw error;
    }
  }

  // Usage Statistics
  async updateUserStats(userId, statsUpdate) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        stats: {
          ...statsUpdate,
          updatedAt: serverTimestamp()
        }
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }

  async getUserStats(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData.stats || {
          totalSubmissions: 0,
          totalAnalyses: 0,
          acceptedSubmissions: 0,
          rejectedSubmissions: 0,
          liveSubmissions: 0
        };
      } else {
        return {
          totalSubmissions: 0,
          totalAnalyses: 0,
          acceptedSubmissions: 0,
          rejectedSubmissions: 0,
          liveSubmissions: 0
        };
      }
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // Account Management
  async deleteUserData(userId) {
    try {
      // Delete user profile
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);

      // Delete all user submissions
      const submissionsRef = collection(db, 'users', userId, 'submissions');
      const submissionsSnapshot = await getDocs(submissionsRef);
      const submissionDeletions = submissionsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(submissionDeletions);

      // Delete all user analyses
      const analysesRef = collection(db, 'users', userId, 'analyses');
      const analysesSnapshot = await getDocs(analysesRef);
      const analysisDeletions = analysesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(analysisDeletions);

      // Delete all user tracks
      const tracksRef = collection(db, 'users', userId, 'tracks');
      const tracksSnapshot = await getDocs(tracksRef);
      const trackDeletions = tracksSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(trackDeletions);

      return { success: true };
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw error;
    }
  }

  // Utility Functions
  async initializeUserData(userId, userData) {
    try {
      console.log('Initializing user data for:', userId);
      
      // Create user profile
      await this.createUserProfile(userId, userData);
      
      // Initialize user stats
      await this.updateUserStats(userId, {
        totalSubmissions: 0,
        totalAnalyses: 0,
        acceptedSubmissions: 0,
        rejectedSubmissions: 0,
        liveSubmissions: 0
      });

      // Initialize default preferences
      await this.saveUserPreferences(userId, {
        theme: 'dark',
        notifications: true,
        autoSave: true,
        defaultGenre: 'Pop'
      });

      console.log('User data initialized successfully');
      return { success: true };
    } catch (error) {
      console.error('Error initializing user data:', error);
      console.error('Error details:', error.code, error.message);
      throw error;
    }
  }
}

const userDataService = new UserDataService();
export default userDataService;
