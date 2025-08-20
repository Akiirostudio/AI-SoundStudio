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
      
      // Get ALL tracks for analysis (handle pagination)
      let allTracks = [];
      let offset = 0;
      const limit = 100;
      
      while (true) {
        const tracksResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!tracksResponse.ok) {
          throw new Error('Failed to fetch playlist tracks');
        }

        const tracksData = await tracksResponse.json();
        allTracks = allTracks.concat(tracksData.items);
        
        // If we got fewer tracks than the limit, we've reached the end
        if (tracksData.items.length < limit) {
          break;
        }
        
        offset += limit;
      }

      // Get audio features for all tracks to analyze patterns
      const trackIds = allTracks
        .filter(item => item.track && item.track.id)
        .map(item => item.track.id);
      
      let audioFeatures = [];
      if (trackIds.length > 0) {
        // Spotify API allows max 100 tracks per request for audio features
        for (let i = 0; i < trackIds.length; i += 100) {
          const batch = trackIds.slice(i, i + 100);
          const featuresResponse = await fetch(
            `https://api.spotify.com/v1/audio-features?ids=${batch.join(',')}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (featuresResponse.ok) {
            const featuresData = await featuresResponse.json();
            audioFeatures = audioFeatures.concat(featuresData.audio_features.filter(f => f !== null));
          }
        }
      }

      // Get artist details for discovery analysis
      const artistIds = new Set();
      allTracks.forEach(item => {
        if (item.track && item.track.artists) {
          item.track.artists.forEach(artist => artistIds.add(artist.id));
        }
      });

      let artistDetails = [];
      if (artistIds.size > 0) {
        const artistIdsArray = Array.from(artistIds);
        // Spotify API allows max 50 artists per request
        for (let i = 0; i < artistIdsArray.length; i += 50) {
          const batch = artistIdsArray.slice(i, i + 50);
          const artistsResponse = await fetch(
            `https://api.spotify.com/v1/artists?ids=${batch.join(',')}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (artistsResponse.ok) {
            const artistsData = await artistsResponse.json();
            artistDetails = artistDetails.concat(artistsData.artists.filter(a => a !== null));
          }
        }
      }

      // Analyze for bot indicators using real data
      const botAnalysis = this.analyzeBotIndicators(playlist, allTracks, audioFeatures);
      
      // Analyze discovery potential
      const discoveryAnalysis = this.analyzeDiscoveryPotential(allTracks, artistDetails);
      
      return {
        ...playlist,
        tracks: allTracks,
        audioFeatures,
        artistDetails,
        botAnalysis,
        discoveryAnalysis
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
        totalTracks: 0,
        uniqueArtists: 0,
        analysis: "No tracks found in playlist"
      };
    }

    // Filter out null tracks (some tracks might be unavailable)
    const validTracks = tracks.filter(item => item.track && item.track.id);
    const validTrackCount = validTracks.length;

    if (validTrackCount === 0) {
      return {
        authenticity: 0,
        popularity: 0,
        freshness: 0,
        totalTracks: totalTracks,
        uniqueArtists: 0,
        analysis: `Playlist contains ${totalTracks} tracks, but none are currently available for analysis.`
      };
    }

    // Calculate average popularity
    const totalPopularity = validTracks.reduce((sum, item) => sum + (item.track?.popularity || 0), 0);
    const avgPopularity = totalPopularity / validTrackCount;

    // Calculate freshness (how recent the tracks are)
    const now = new Date();
    const totalDays = validTracks.reduce((sum, item) => {
      const releaseDate = new Date(item.track?.album?.release_date || now);
      const daysDiff = (now - releaseDate) / (1000 * 60 * 60 * 24);
      return sum + daysDiff;
    }, 0);
    const avgDays = totalDays / validTrackCount;
    const freshness = Math.max(0, 100 - (avgDays / 365) * 100);

    // Calculate authenticity (based on various factors)
    const uniqueArtists = new Set(validTracks.map(item => item.track?.artists?.[0]?.id).filter(Boolean)).size;
    const artistDiversity = (uniqueArtists / validTrackCount) * 100;
    
    const authenticity = Math.min(100, (avgPopularity * 0.4) + (artistDiversity * 0.6));

    return {
      authenticity: Math.round(authenticity),
      popularity: Math.round(avgPopularity),
      freshness: Math.round(freshness),
      totalTracks: totalTracks,
      uniqueArtists,
      analysis: `Playlist contains ${totalTracks} tracks from ${uniqueArtists} unique artists with an average popularity of ${Math.round(avgPopularity)}/100. ${validTrackCount < totalTracks ? `${totalTracks - validTrackCount} tracks are currently unavailable.` : ''}`
    };
  }

  analyzeBotIndicators(playlist, tracks, audioFeatures) {
    const validTracks = tracks.filter(item => item.track && item.track.id);
    const validFeatures = audioFeatures.filter(f => f !== null);
    
    if (validTracks.length === 0) {
      return {
        botScore: 0,
        indicators: [],
        hasBotActivity: false,
        analysis: 'No tracks available for analysis'
      };
    }

    let botScore = 0;
    const indicators = [];

    // 1. Follower to Track Ratio Analysis
    if (playlist.followers && playlist.followers.total) {
      const followerToTrackRatio = playlist.followers.total / validTracks.length;
      
      if (followerToTrackRatio > 1000) {
        botScore += 30;
        indicators.push(`Extremely high follower-to-track ratio (${Math.round(followerToTrackRatio)}:1)`);
      } else if (followerToTrackRatio > 500) {
        botScore += 20;
        indicators.push(`Very high follower-to-track ratio (${Math.round(followerToTrackRatio)}:1)`);
      } else if (followerToTrackRatio > 200) {
        botScore += 10;
        indicators.push(`High follower-to-track ratio (${Math.round(followerToTrackRatio)}:1)`);
      }
    }

    // 2. Track Popularity Distribution Analysis
    const popularities = validTracks.map(item => item.track.popularity);
    const avgPopularity = popularities.reduce((sum, pop) => sum + pop, 0) / popularities.length;
    
    // Check for suspicious popularity patterns
    const highPopularityTracks = popularities.filter(pop => pop >= 80).length;
    const lowPopularityTracks = popularities.filter(pop => pop <= 20).length;
    
    // If playlist has mostly very popular tracks (hits playlist) - less suspicious
    if (highPopularityTracks / validTracks.length > 0.8) {
      botScore -= 5; // Slightly reduce score for legitimate hits playlists
      indicators.push('Playlist contains mostly popular tracks (legitimate hits playlist)');
    }
    
    // If playlist has mostly very obscure tracks with high followers - suspicious
    if (lowPopularityTracks / validTracks.length > 0.7 && playlist.followers && playlist.followers.total > 1000) {
      botScore += 25;
      indicators.push('Many obscure tracks with high follower count (suspicious)');
    }

    // 3. Audio Features Consistency Analysis (using real data)
    if (validFeatures.length > 10) {
      const features = ['danceability', 'energy', 'valence', 'tempo'];
      const featureVariances = {};
      
      features.forEach(feature => {
        const values = validFeatures.map(f => f[feature]).filter(v => v !== null);
        if (values.length > 0) {
          featureVariances[feature] = this.calculateVariance(values);
        }
      });

      // Check for unnaturally consistent audio features
      Object.entries(featureVariances).forEach(([feature, variance]) => {
        if (variance < 0.01) { // Very low variance
          botScore += 15;
          indicators.push(`Unnaturally consistent ${feature} across tracks`);
        }
      });
    }

    // 4. Track Duration Analysis
    const durations = validTracks.map(item => item.track.duration_ms);
    const avgDuration = durations.reduce((sum, dur) => sum + dur, 0) / durations.length;
    const durationVariance = this.calculateVariance(durations);
    
    // Check for suspicious duration patterns
    if (durationVariance < 1000000 && validTracks.length > 20) { // Very consistent durations
      botScore += 10;
      indicators.push('Unusually consistent track durations');
    }

    // 5. Artist Diversity Analysis
    const artists = new Set();
    validTracks.forEach(item => {
      if (item.track.artists) {
        item.track.artists.forEach(artist => artists.add(artist.id));
      }
    });
    
    const artistDiversity = artists.size / validTracks.length;
    
    if (artistDiversity < 0.3 && validTracks.length > 20) {
      botScore += 15;
      indicators.push(`Low artist diversity (${Math.round(artistDiversity * 100)}% unique artists)`);
    }

    // 6. Playlist Description and Name Analysis
    const playlistName = playlist.name.toLowerCase();
    const playlistDescription = playlist.description ? playlist.description.toLowerCase() : '';
    
    const suspiciousKeywords = ['follow', 'like', 'stream', 'boost', 'promote', 'viral', 'trending'];
    const hasSuspiciousKeywords = suspiciousKeywords.some(keyword => 
      playlistName.includes(keyword) || playlistDescription.includes(keyword)
    );
    
    if (hasSuspiciousKeywords) {
      botScore += 20;
      indicators.push('Playlist name/description contains suspicious keywords');
    }

    // 7. Track Addition Pattern Analysis
    // Check if tracks were added in suspicious batches
    const addedDates = validTracks.map(item => item.added_at);
    const uniqueDates = new Set(addedDates.map(date => date.split('T')[0]));
    
    if (uniqueDates.size < validTracks.length * 0.1 && validTracks.length > 50) {
      botScore += 15;
      indicators.push('Tracks added in suspicious batches (few unique dates)');
    }

    // Calculate final score and determine bot activity
    const finalBotScore = Math.min(botScore, 100);
    const hasBotActivity = finalBotScore > 30;

    let analysis = '';
    if (hasBotActivity) {
      analysis = `This playlist shows ${finalBotScore}% likelihood of bot activity based on ${indicators.length} suspicious indicators.`;
    } else if (finalBotScore > 15) {
      analysis = `This playlist shows some suspicious patterns (${finalBotScore}% score) but may be legitimate.`;
    } else {
      analysis = `This playlist appears to be legitimate with normal activity patterns.`;
    }

    return {
      botScore: finalBotScore,
      indicators,
      hasBotActivity,
      analysis,
      metrics: {
        followerToTrackRatio: playlist.followers ? Math.round(playlist.followers.total / validTracks.length) : 0,
        artistDiversity: Math.round(artistDiversity * 100),
        avgPopularity: Math.round(avgPopularity),
        avgDuration: Math.round(avgDuration / 1000), // in seconds
        uniqueDates: uniqueDates.size
      }
    };
  }

  analyzeDiscoveryPotential(tracks, artistDetails) {
    const validTracks = tracks.filter(item => item.track && item.track.id);
    
    if (validTracks.length === 0) {
      return {
        discoveryScore: 0,
        discoveredArtists: [],
        discoveryMetrics: {},
        analysis: 'No tracks available for discovery analysis'
      };
    }

    // Create artist popularity map
    const artistPopularityMap = {};
    artistDetails.forEach(artist => {
      artistPopularityMap[artist.id] = artist.popularity;
    });

    // Analyze each track for discovery potential
    const discoveredArtists = [];
    const artistAppearances = {};
    let totalDiscoveryScore = 0;

    validTracks.forEach(item => {
      if (item.track && item.track.artists) {
        item.track.artists.forEach(artist => {
          const artistId = artist.id;
          const popularity = artistPopularityMap[artistId] || 0;
          
          // Count artist appearances
          artistAppearances[artistId] = (artistAppearances[artistId] || 0) + 1;
          
          // Calculate discovery score for this artist
          let discoveryScore = 0;
          let discoveryReason = '';
          
          // Lower popularity = higher discovery potential
          if (popularity <= 20) {
            discoveryScore = 90;
            discoveryReason = 'Very obscure artist (popularity ≤ 20)';
          } else if (popularity <= 40) {
            discoveryScore = 70;
            discoveryReason = 'Emerging artist (popularity 21-40)';
          } else if (popularity <= 60) {
            discoveryScore = 50;
            discoveryReason = 'Mid-level artist (popularity 41-60)';
          } else if (popularity <= 80) {
            discoveryScore = 30;
            discoveryReason = 'Popular artist (popularity 61-80)';
          } else {
            discoveryScore = 10;
            discoveryReason = 'Very popular artist (popularity > 80)';
          }

          // Check if this is a new discovery (first appearance)
          if (artistAppearances[artistId] === 1) {
            discoveredArtists.push({
              id: artistId,
              name: artist.name,
              popularity,
              discoveryScore,
              discoveryReason,
              trackName: item.track.name,
              trackPopularity: item.track.popularity
            });
            totalDiscoveryScore += discoveryScore;
          }
        });
      }
    });

    // Calculate overall discovery metrics
    const uniqueArtists = Object.keys(artistAppearances).length;
    const avgArtistPopularity = Object.values(artistPopularityMap).reduce((sum, pop) => sum + pop, 0) / Object.values(artistPopularityMap).length;
    
    // Discovery score calculation
    const avgDiscoveryScore = discoveredArtists.length > 0 ? totalDiscoveryScore / discoveredArtists.length : 0;
    
    // Bonus for artist diversity
    const artistDiversityBonus = Math.min(20, (uniqueArtists / validTracks.length) * 100);
    
    // Penalty for too many popular artists
    const popularArtistPenalty = Math.max(0, (avgArtistPopularity - 50) * 0.5);
    
    const finalDiscoveryScore = Math.min(100, Math.max(0, avgDiscoveryScore + artistDiversityBonus - popularArtistPenalty));

    // Categorize discovery level
    let discoveryLevel = '';
    let discoveryDescription = '';
    
    if (finalDiscoveryScore >= 80) {
      discoveryLevel = 'Exceptional Discovery';
      discoveryDescription = 'This playlist is excellent for discovering new and emerging artists.';
    } else if (finalDiscoveryScore >= 60) {
      discoveryLevel = 'Great Discovery';
      discoveryDescription = 'This playlist offers good opportunities to discover lesser-known artists.';
    } else if (finalDiscoveryScore >= 40) {
      discoveryLevel = 'Moderate Discovery';
      discoveryDescription = 'This playlist has some discovery potential with a mix of known and unknown artists.';
    } else if (finalDiscoveryScore >= 20) {
      discoveryLevel = 'Limited Discovery';
      discoveryDescription = 'This playlist focuses mainly on popular artists with limited discovery potential.';
    } else {
      discoveryLevel = 'No Discovery';
      discoveryDescription = 'This playlist contains mostly very popular artists with minimal discovery value.';
    }

    return {
      discoveryScore: Math.round(finalDiscoveryScore),
      discoveryLevel,
      discoveryDescription,
      discoveredArtists: discoveredArtists.sort((a, b) => b.discoveryScore - a.discoveryScore),
      discoveryMetrics: {
        totalArtists: uniqueArtists,
        discoveredArtistsCount: discoveredArtists.length,
        avgArtistPopularity: Math.round(avgArtistPopularity),
        artistDiversity: Math.round((uniqueArtists / validTracks.length) * 100),
        avgDiscoveryScore: Math.round(avgDiscoveryScore),
        artistDiversityBonus: Math.round(artistDiversityBonus),
        popularArtistPenalty: Math.round(popularArtistPenalty)
      }
    };
  }

  calculateVariance(numbers) {
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  }
}

const spotifyService = new SpotifyService();
export default spotifyService;
