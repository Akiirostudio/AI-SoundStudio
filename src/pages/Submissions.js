import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaMusic, FaUpload, FaSearch, FaUsers, FaPlay, FaExternalLinkAlt } from 'react-icons/fa';
import ReactDOM from 'react-dom';
import SpotifyService from '../services/spotify';
import userDataService from '../services/userData';
import { useAuth } from '../contexts/AuthContext';

const SubmissionsContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  position: relative;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
  pointer-events: none;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DashboardCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  min-height: 300px;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: white;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
  
  option {
    background: #1a1a1a;
    color: white;
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SearchButton = styled(Button)`
  background: #000;
  
  &:hover {
    background: #333;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.5);
`;

const MusicIcon = styled(FaMusic)`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.3;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => {
    if (props.color === 'blue') return '#667eea';
    if (props.color === 'green') return '#51cf66';
    if (props.color === 'orange') return '#ffd43b';
    if (props.color === 'red') return '#ff6b6b';
    return 'white';
  }};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const TrackImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
`;

const TrackDetails = styled.div`
  flex: 1;
`;

const TrackName = styled.div`
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
`;

const TrackArtist = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
`;

const TrackStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const TrackFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const FeatureTag = styled.span`
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const PlaylistSearchContainer = styled.div`
  margin-top: 1rem;
  position: relative;
  z-index: 999999;
`;

const PlaylistDropdown = styled.div`
  position: fixed;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  width: ${props => props.width}px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-height: 500px;
  overflow-y: auto;
  z-index: 999999;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

const PlaylistItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1.5rem;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const PlaylistImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

const PlaylistInfo = styled.div`
  flex: 1;
  min-width: 0;
  margin-right: 1rem;
`;

const PlaylistName = styled.div`
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlaylistDetails = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.25rem;
`;

const PlaylistStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
  margin-right: 1rem;
`;

const FollowerCount = styled.div`
  color: #51cf66;
  font-weight: 600;
  font-size: 0.9rem;
`;

const TrackCount = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #51cf66, #40c057);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  min-width: 80px;
  justify-content: center;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(81, 207, 102, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const NoPlaylistsMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
`;

const PlaylistOwner = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const SubmissionItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SubmissionInfo = styled.div`
  flex: 1;
`;

const SubmissionTitle = styled.div`
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
`;

const SubmissionDetails = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SubmissionStatus = styled.div`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'submitted': return 'rgba(116, 192, 252, 0.2)';
      case 'accepted': return 'rgba(81, 207, 102, 0.2)';
      case 'rejected': return 'rgba(255, 107, 107, 0.2)';
      default: return 'rgba(255, 212, 59, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'submitted': return '#74c0fc';
      case 'accepted': return '#51cf66';
      case 'rejected': return '#ff6b6b';
      default: return '#ffd43b';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'submitted': return 'rgba(116, 192, 252, 0.3)';
      case 'accepted': return 'rgba(81, 207, 102, 0.3)';
      case 'rejected': return 'rgba(255, 107, 107, 0.3)';
      default: return 'rgba(255, 212, 59, 0.3)';
    }
  }};
`;

function Submissions() {
  const { currentUser } = useAuth();
  const [songUrl, setSongUrl] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Pop');
  const [trackInfo, setTrackInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [searchingPlaylists, setSearchingPlaylists] = useState(false);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [submittingToPlaylist, setSubmittingToPlaylist] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Load user's submissions from Firestore
  useEffect(() => {
    const loadUserSubmissions = async () => {
      if (currentUser) {
        setLoadingSubmissions(true);
        try {
          const userSubmissions = await userDataService.getUserSubmissions(currentUser.uid);
          setSubmissions(userSubmissions || []);
        } catch (error) {
          console.error('Error loading submissions:', error);
          if (error.code === 'permission-denied') {
            setError('Permission denied. Please check your account status.');
          } else if (error.code === 'unavailable') {
            setError('Database unavailable. Please try again later.');
          } else {
            setError('Failed to load your submissions. Please try again.');
          }
          setSubmissions([]); // Set empty array as fallback
        } finally {
          setLoadingSubmissions(false);
        }
      } else {
        setSubmissions([]); // No user, no submissions
      }
    };

    loadUserSubmissions();
  }, [currentUser]);

  // Debug: Test Firestore connection on component mount
  useEffect(() => {
    const testFirestore = async () => {
      if (currentUser) {
        console.log('User authenticated:', currentUser.uid);
        console.log('Firestore should be working for user data');
      }
    };

    testFirestore();
  }, [currentUser]);

  // Update dropdown position when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (showPlaylistDropdown) {
        const searchButton = document.getElementById('search-button');
        if (searchButton) {
          const rect = searchButton.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
          
          setDropdownPosition({
            top: rect.bottom + scrollTop + 10,
            left: rect.left + scrollLeft,
            width: Math.max(rect.width, 600)
          });
        }
      }
    };

    const handleClickOutside = (event) => {
      if (showPlaylistDropdown) {
        const searchButton = document.getElementById('search-button');
        const dropdown = document.querySelector('[data-dropdown]');
        
        if (searchButton && !searchButton.contains(event.target) && 
            dropdown && !dropdown.contains(event.target)) {
          setShowPlaylistDropdown(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPlaylistDropdown]);

  const handleLoadTrack = async () => {
    if (!songUrl.trim()) {
      setError('Please enter a song URL');
      return;
    }

    setLoading(true);
    setError('');
    setTrackInfo(null);

    try {
      const trackData = await SpotifyService.getTrackInfo(songUrl);
      setTrackInfo(trackData);
    } catch (err) {
      setError('Failed to load track. Please check the URL and try again.');
      console.error('Track loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatAudioFeatures = (features) => {
    if (!features) return [];
    
    return [
      { label: 'Danceability', value: Math.round(features.danceability * 100) },
      { label: 'Energy', value: Math.round(features.energy * 100) },
      { label: 'Tempo', value: Math.round(features.tempo) },
      { label: 'Valence', value: Math.round(features.valence * 100) }
    ];
  };

  const genres = ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Country', 'R&B', 'Indie', 'Metal'];

  const handleSearchPlaylists = async () => {
    if (!selectedGenre) {
      setError('Please select a genre');
      return;
    }

    // Calculate dropdown position relative to viewport
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
      const rect = searchButton.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      setDropdownPosition({
        top: rect.bottom + scrollTop + 10,
        left: rect.left + scrollLeft,
        width: Math.max(rect.width, 600) // Ensure minimum width of 600px
      });
    }

    setSearchingPlaylists(true);
    setError('');
    setPlaylists([]);
    setShowPlaylistDropdown(true);

    try {
      const foundPlaylists = await SpotifyService.searchPlaylistsByGenre(selectedGenre, 10);
      setPlaylists(foundPlaylists);
    } catch (err) {
      setError('Failed to search playlists. Please try again.');
      console.error('Playlist search error:', err);
    } finally {
      setSearchingPlaylists(false);
    }
  };

  const handleSubmitToPlaylist = async (playlist) => {
    if (!trackInfo) {
      setError('Please load a track first');
      return;
    }

    if (!currentUser) {
      setError('Please log in to submit to playlists');
      return;
    }

    setSubmittingToPlaylist(playlist.id);
    setError('');

    try {
      // Test write access first
      const writeAccess = await userDataService.testUserWriteAccess(currentUser.uid);
      if (!writeAccess) {
        setError('Permission denied. Please check your account status.');
        return;
      }

      // Prepare submission data
      const submissionData = {
        trackName: trackInfo.name,
        trackArtist: trackInfo.artists?.map(a => a.name).join(', '),
        playlistName: playlist.name,
        playlistOwner: playlist.owner,
        playlistFollowers: playlist.followers,
        playlistId: playlist.id,
        playlistImage: playlist.images?.[0]?.url,
        trackImage: trackInfo.album?.images?.[0]?.url,
        trackId: trackInfo.id,
        trackUrl: trackInfo.external_urls?.spotify,
        status: 'submitted',
        userEmail: currentUser.email,
        userName: currentUser.displayName
      };

      // Save to Firestore
      const result = await userDataService.savePlaylistSubmission(currentUser.uid, submissionData);
      
      // Update local state
      const newSubmission = {
        id: result.submissionId,
        ...submissionData,
        submittedAt: new Date()
      };
      
      setSubmissions(prev => [newSubmission, ...prev]);
      
      // Update user stats
      const currentStats = await userDataService.getUserStats(currentUser.uid);
      await userDataService.updateUserStats(currentUser.uid, {
        ...currentStats,
        totalSubmissions: currentStats.totalSubmissions + 1
      });
      
      // Show success message
      alert(`Successfully submitted to ${playlist.name}!`);
    } catch (err) {
      console.error('Submission error:', err);
      if (err.code === 'permission-denied') {
        setError('Permission denied. Please check your account status.');
      } else if (err.code === 'unavailable') {
        setError('Database unavailable. Please try again later.');
      } else {
        setError('Failed to submit to playlist. Please try again.');
      }
    } finally {
      setSubmittingToPlaylist(null);
    }
  };

  const formatFollowerCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubmissionStats = () => {
    const total = submissions.length;
    const accepted = submissions.filter(s => s.status === 'accepted').length;
    const rejected = submissions.filter(s => s.status === 'rejected').length;
    const inReview = submissions.filter(s => s.status === 'submitted').length;
    
    return { total, accepted, rejected, inReview };
  };

  return (
    <SubmissionsContainer>
      <BackgroundPattern />
      
      <Header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title>Submissions Dashboard</Title>
        <Subtitle>Track your music submissions and discover new playlists.</Subtitle>
      </Header>

      <DashboardGrid>
        <DashboardCard
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <CardTitle>Add Your Song</CardTitle>
          <FormGroup>
            <Input
              type="text"
              placeholder="Paste your Spotify song URL here..."
              value={songUrl}
              onChange={(e) => setSongUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLoadTrack()}
            />
          </FormGroup>
          <Button
            onClick={handleLoadTrack}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Loading...
              </>
            ) : (
              'Load Track'
            )}
          </Button>

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          {trackInfo && (
            <TrackInfo>
              <TrackImage 
                src={trackInfo.album?.images?.[0]?.url || '/placeholder-track.jpg'} 
                alt={trackInfo.name}
              />
              <TrackDetails>
                <TrackName>{trackInfo.name}</TrackName>
                <TrackArtist>{trackInfo.artists?.map(a => a.name).join(', ')}</TrackArtist>
                <TrackStats>
                  <span>Popularity: {trackInfo.popularity}/100</span>
                  <span>Duration: {formatDuration(trackInfo.duration_ms)}</span>
                  <span>Album: {trackInfo.album?.name}</span>
                </TrackStats>
                {trackInfo.audio_features && (
                  <TrackFeatures>
                    {formatAudioFeatures(trackInfo.audio_features).map((feature, index) => (
                      <FeatureTag key={index}>
                        {feature.label}: {feature.value}
                      </FeatureTag>
                    ))}
                  </TrackFeatures>
                )}
              </TrackDetails>
            </TrackInfo>
          )}
        </DashboardCard>

        <DashboardCard
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <CardTitle>Find Playlists</CardTitle>
          <FormGroup>
            <Select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </Select>
          </FormGroup>
          
          <PlaylistSearchContainer>
            <SearchButton
              id="search-button"
              onClick={handleSearchPlaylists}
              disabled={searchingPlaylists}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {searchingPlaylists ? (
                <>
                  <LoadingSpinner />
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch />
                  Search for Playlists
                </>
              )}
            </SearchButton>

                          {showPlaylistDropdown && (
                ReactDOM.createPortal(
                  <PlaylistDropdown
                    data-dropdown
                    top={dropdownPosition.top}
                    left={dropdownPosition.left}
                    width={dropdownPosition.width}
                  >
                  {searchingPlaylists ? (
                    <NoPlaylistsMessage>
                      <LoadingSpinner />
                      Searching for playlists...
                    </NoPlaylistsMessage>
                  ) : playlists.length > 0 ? (
                    playlists.map((playlist, index) => (
                      <PlaylistItem key={playlist.id}>
                        <PlaylistImage 
                          src={playlist.images?.[0]?.url || '/placeholder-playlist.jpg'} 
                          alt={playlist.name}
                        />
                        <PlaylistInfo>
                          <PlaylistName>{playlist.name}</PlaylistName>
                          <PlaylistDetails>
                            <span>By {playlist.owner}</span>
                            {playlist.description && (
                              <span>• {playlist.description.substring(0, 50)}...</span>
                            )}
                          </PlaylistDetails>
                          <PlaylistOwner>
                            {playlist.public ? 'Public' : 'Private'} • {playlist.collaborative ? 'Collaborative' : 'Curated'}
                          </PlaylistOwner>
                        </PlaylistInfo>
                        <PlaylistStats>
                          <FollowerCount>
                            <FaUsers /> {formatFollowerCount(playlist.followers)}
                          </FollowerCount>
                          <TrackCount>
                            <FaMusic /> {playlist.tracks} tracks
                          </TrackCount>
                        </PlaylistStats>
                        <SubmitButton
                          onClick={() => handleSubmitToPlaylist(playlist)}
                          disabled={submittingToPlaylist === playlist.id || !trackInfo}
                        >
                          {submittingToPlaylist === playlist.id ? (
                            <>
                              <LoadingSpinner />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <FaUpload />
                              Submit
                            </>
                          )}
                        </SubmitButton>
                      </PlaylistItem>
                    ))
                  ) : (
                    <NoPlaylistsMessage>
                      No playlists found for "{selectedGenre}". Try a different genre.
                    </NoPlaylistsMessage>
                  )}
                </PlaylistDropdown>,
                document.body
              )
            )}
          </PlaylistSearchContainer>
          
          <Description>
            Search for playlists by genre to submit your music.
          </Description>
        </DashboardCard>

        <DashboardCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <CardTitle>Your Submissions</CardTitle>
          {loadingSubmissions ? (
            <EmptyState>
              <LoadingSpinner />
              Loading submissions...
            </EmptyState>
          ) : submissions.length > 0 ? (
            <div>
              {submissions.map((submission) => (
                <SubmissionItem key={submission.id}>
                  <img 
                    src={submission.trackImage || '/placeholder-track.jpg'} 
                    alt={submission.trackName}
                    style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <SubmissionInfo>
                    <SubmissionTitle>{submission.trackName}</SubmissionTitle>
                    <SubmissionDetails>
                      <span>by {submission.trackArtist}</span>
                      <span>•</span>
                      <span>to {submission.playlistName}</span>
                      <span>•</span>
                      <span>{formatFollowerCount(submission.playlistFollowers)} followers</span>
                      <span>•</span>
                      <span>{formatDate(submission.submittedAt)}</span>
                    </SubmissionDetails>
                  </SubmissionInfo>
                  <SubmissionStatus status={submission.status}>
                    {submission.status === 'submitted' && 'Submitted'}
                    {submission.status === 'accepted' && 'Accepted'}
                    {submission.status === 'rejected' && 'Rejected'}
                  </SubmissionStatus>
                </SubmissionItem>
              ))}
            </div>
          ) : (
            <EmptyState>
              <MusicIcon />
              <div>No submissions yet</div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Submit your first track to get started.
              </div>
            </EmptyState>
          )}
        </DashboardCard>

        <DashboardCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <CardTitle>Submission Stats</CardTitle>
          <StatsGrid>
            <StatCard>
              <StatValue color="blue">{getSubmissionStats().total}</StatValue>
              <StatLabel>Total Submissions</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue color="green">{getSubmissionStats().accepted}</StatValue>
              <StatLabel>Accepted</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue color="orange">{getSubmissionStats().inReview}</StatValue>
              <StatLabel>In Review</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue color="red">{getSubmissionStats().rejected}</StatValue>
              <StatLabel>Rejected</StatLabel>
            </StatCard>
          </StatsGrid>
        </DashboardCard>
      </DashboardGrid>
    </SubmissionsContainer>
  );
}

export default Submissions;
