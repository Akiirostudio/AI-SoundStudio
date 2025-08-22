import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

class SearchLimitService {
  constructor() {
    this.db = db;
  }

  // Get user's IP address
  async getUserIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting IP address:', error);
      // Fallback to a default IP if the service fails
      return 'unknown';
    }
  }

  // Get search count for an IP address
  async getSearchCount(ipAddress) {
    try {
      const ipDoc = doc(this.db, 'searchLimits', ipAddress);
      const ipSnapshot = await getDoc(ipDoc);
      
      if (ipSnapshot.exists()) {
        const count = ipSnapshot.data().searchCount || 0;
        return count;
      } else {
        // Create new IP record
        await setDoc(ipDoc, {
          ipAddress,
          searchCount: 0,
          firstSearch: new Date(),
          lastSearch: new Date()
        });
        return 0;
      }
    } catch (error) {
      console.error('Error getting search count:', error);
      return 0;
    }
  }

  // Increment search count for an IP address
  async incrementSearchCount(ipAddress) {
    try {
      const ipDoc = doc(this.db, 'searchLimits', ipAddress);
      await updateDoc(ipDoc, {
        searchCount: increment(1),
        lastSearch: new Date()
      });
    } catch (error) {
      console.error('Error incrementing search count:', error);
    }
  }

  // Check if user can perform a search
  async canSearch(userId = null) {
    try {
      // If user is authenticated, they have unlimited searches
      if (userId) {
        return { canSearch: true, remainingSearches: -1, totalSearches: -1 };
      }

      // For non-authenticated users, check IP-based limits
      const ipAddress = await this.getUserIP();
      const searchCount = await this.getSearchCount(ipAddress);
      const maxSearches = 3;
      const remainingSearches = Math.max(0, maxSearches - searchCount);

      return {
        canSearch: searchCount < maxSearches,
        remainingSearches,
        totalSearches: searchCount,
        maxSearches
      };
    } catch (error) {
      console.error('Error checking search limit:', error);
      // Allow search if there's an error (fail open)
      return { canSearch: true, remainingSearches: -1, totalSearches: -1 };
    }
  }

  // Record a search attempt
  async recordSearch(userId = null) {
    try {
      if (!userId) {
        const ipAddress = await this.getUserIP();
        await this.incrementSearchCount(ipAddress);
      }
    } catch (error) {
      console.error('Error recording search:', error);
    }
  }

    // Get search limit info for display
  async getSearchLimitInfo(userId = null) {
    try {
      if (userId) {
        return {
          isAuthenticated: true,
          remainingSearches: -1,
          totalSearches: -1,
          maxSearches: -1
        };
      }

      const ipAddress = await this.getUserIP();
      const searchCount = await this.getSearchCount(ipAddress);
      const maxSearches = 3;
      const remainingSearches = Math.max(0, maxSearches - searchCount);

      return {
        isAuthenticated: false,
        remainingSearches,
        totalSearches: searchCount,
        maxSearches
      };
    } catch (error) {
      console.error('Error getting search limit info:', error);
      return {
        isAuthenticated: false,
        remainingSearches: -1,
        totalSearches: -1,
        maxSearches: 3
      };
    }
  }

  // Check if user can submit to playlists (requires authentication)
  canSubmitToPlaylists(userId = null) {
    return userId !== null;
  }
}

const searchLimitService = new SearchLimitService();
export default searchLimitService;
