const CLIENT_ID = 'a8df3452dfc0440bba545aede15536ff';
const CLIENT_SECRET = '5e7f07244d104bc78238d711b608e7c1';

class SpotifyService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
      },
      body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000);
    return this.accessToken;
  }

  async getPlaylistInfo(playlistUrl) {
    try {
      const token = await this.getAccessToken();
      const playlistId = this.extractPlaylistId(playlistUrl);
      
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch playlist');
      }

      const playlist = await response.json();
      
      // Get tracks for analysis
      const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const tracksData = await tracksResponse.json();
      
      return {
        ...playlist,
        tracks: tracksData.items
      };
    } catch (error) {
      console.error('Error fetching playlist:', error);
      throw error;
    }
  }

  async getTrackInfo(trackUrl) {
    try {
      const token = await this.getAccessToken();
      const trackId = this.extractTrackId(trackUrl);
      
      const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch track');
      }

      const track = await response.json();
      
      // Get audio features
      const featuresResponse = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const features = await featuresResponse.json();
      
      return {
        ...track,
        audio_features: features
      };
    } catch (error) {
      console.error('Error fetching track:', error);
      throw error;
    }
  }

  extractPlaylistId(url) {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : url;
  }

  extractTrackId(url) {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : url;
  }

  analyzePlaylist(playlist) {
    const tracks = playlist.tracks || [];
    const totalTracks = tracks.length;
    
    if (totalTracks === 0) {
      return {
        authenticity: 0,
        popularity: 0,
        freshness: 0,
        analysis: "No tracks found in playlist"
      };
    }

    // Calculate average popularity
    const totalPopularity = tracks.reduce((sum, item) => sum + (item.track?.popularity || 0), 0);
    const avgPopularity = totalPopularity / totalTracks;

    // Calculate freshness (how recent the tracks are)
    const now = new Date();
    const totalDays = tracks.reduce((sum, item) => {
      const releaseDate = new Date(item.track?.album?.release_date || now);
      const daysDiff = (now - releaseDate) / (1000 * 60 * 60 * 24);
      return sum + daysDiff;
    }, 0);
    const avgDays = totalDays / totalTracks;
    const freshness = Math.max(0, 100 - (avgDays / 365) * 100);

    // Calculate authenticity (based on various factors)
    const uniqueArtists = new Set(tracks.map(item => item.track?.artists?.[0]?.id).filter(Boolean)).size;
    const artistDiversity = (uniqueArtists / totalTracks) * 100;
    
    const authenticity = Math.min(100, (avgPopularity * 0.4) + (artistDiversity * 0.6));

    return {
      authenticity: Math.round(authenticity),
      popularity: Math.round(avgPopularity),
      freshness: Math.round(freshness),
      totalTracks,
      uniqueArtists,
      analysis: `Playlist contains ${totalTracks} tracks from ${uniqueArtists} unique artists with an average popularity of ${Math.round(avgPopularity)}/100.`
    };
  }
}

const spotifyService = new SpotifyService();
export default spotifyService;
