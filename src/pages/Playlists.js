import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSearch, FaMusic, FaUsers, FaClock, FaCheck, FaTimes, FaEye, FaExternalLinkAlt, FaFilter } from 'react-icons/fa';
import ReactDOM from 'react-dom';
import SpotifyService from '../services/spotify';

const PlaylistsContainer = styled.div`
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
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const DashboardCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  min-height: 400px;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchSection = styled.div`
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Select = styled.select`
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  min-width: 150px;
  
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

const SearchButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 150px;
  justify-content: center;

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
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const PlaylistItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &:last-child {
    border-bottom: none;
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
  margin-right: 1rem;
`;

const PlaylistName = styled.div`
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
`;

const PlaylistDetails = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
`;

const PlaylistStats = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
  min-width: 120px;
`;

const FollowerCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const TrackCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PlaylistOwner = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
`;

const NoPlaylistsMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
`;

const SubmissionsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
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

const TrackImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
`;

const SubmissionInfo = styled.div`
  flex: 1;
`;

const SubmissionTitle = styled.div`
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
`;

const SubmissionDetails = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.25rem;
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
      case 'live': return 'rgba(102, 126, 234, 0.2)';
      default: return 'rgba(255, 212, 59, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'submitted': return '#74c0fc';
      case 'accepted': return '#51cf66';
      case 'rejected': return '#ff6b6b';
      case 'live': return '#667eea';
      default: return '#ffd43b';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'submitted': return 'rgba(116, 192, 252, 0.3)';
      case 'accepted': return 'rgba(81, 207, 102, 0.3)';
      case 'rejected': return 'rgba(255, 107, 107, 0.3)';
      case 'live': return 'rgba(102, 126, 234, 0.3)';
      default: return 'rgba(255, 212, 59, 0.3)';
    }
  }};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: 1px solid ${props => props.active ? 'rgba(102, 126, 234, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.4);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

function Playlists() {
  const [selectedGenre, setSelectedGenre] = useState('Pop');
  const [playlists, setPlaylists] = useState([]);
  const [searchingPlaylists, setSearchingPlaylists] = useState(false);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const genres = ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Country', 'R&B', 'Indie', 'Metal', 'Alternative', 'Folk', 'Blues', 'Reggae', 'Latin', 'K-Pop'];

  // Sample submissions data (in real app, this would come from your backend)
  const sampleSubmissions = [
    {
      id: 1,
      trackName: 'Midnight Dreams',
      artist: 'Luna Echo',
      playlistName: 'Chill Vibes Only',
      playlistOwner: 'Spotify',
      status: 'live',
      submittedAt: '2024-01-15',
      coverImage: 'https://via.placeholder.com/50x50/667eea/ffffff?text=MD'
    },
    {
      id: 2,
      trackName: 'Electric Soul',
      artist: 'Neon Pulse',
      playlistName: 'Electronic Beats',
      playlistOwner: 'Music Curator',
      status: 'accepted',
      submittedAt: '2024-01-10',
      coverImage: 'https://via.placeholder.com/50x50/764ba2/ffffff?text=ES'
    },
    {
      id: 3,
      trackName: 'Urban Flow',
      artist: 'Street Sound',
      playlistName: 'Hip Hop Essentials',
      playlistOwner: 'Hip Hop Central',
      status: 'submitted',
      submittedAt: '2024-01-12',
      coverImage: 'https://via.placeholder.com/50x50/51cf66/ffffff?text=UF'
    },
    {
      id: 4,
      trackName: 'Acoustic Memories',
      artist: 'Folk Tales',
      playlistName: 'Indie Discoveries',
      playlistOwner: 'Indie Music',
      status: 'rejected',
      submittedAt: '2024-01-08',
      coverImage: 'https://via.placeholder.com/50x50/ff6b6b/ffffff?text=AM'
    }
  ];

  useEffect(() => {
    setSubmissions(sampleSubmissions);
  }, []);

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

  const handleSearchPlaylists = async () => {
    setSearchingPlaylists(true);
    setShowPlaylistDropdown(false);

    try {
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

      const playlistsData = await SpotifyService.searchPlaylistsByGenre(selectedGenre, 10);
      console.log('Playlists data received:', playlistsData);
      console.log('First playlist images:', playlistsData[0]?.images);
      setPlaylists(playlistsData);
      setShowPlaylistDropdown(true);
    } catch (error) {
      console.error('Error searching playlists:', error);
    } finally {
      setSearchingPlaylists(false);
    }
  };

  const handleSubmitToPlaylist = async (playlist) => {
    // In a real app, this would submit to your backend
    const newSubmission = {
      id: Date.now(),
      trackName: 'Your Track Name', // This would come from the current track
      artist: 'Your Artist Name',
      playlistName: playlist.name,
      playlistOwner: playlist.owner,
      status: 'submitted',
      submittedAt: new Date().toISOString().split('T')[0],
      coverImage: playlist.images?.[0]?.url || 'https://via.placeholder.com/50x50/667eea/ffffff?text=PL'
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    setShowPlaylistDropdown(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <FaClock />;
      case 'accepted': return <FaCheck />;
      case 'rejected': return <FaTimes />;
      case 'live': return <FaEye />;
      default: return <FaClock />;
    }
  };

  const filteredSubmissions = statusFilter === 'all' 
    ? submissions 
    : submissions.filter(sub => sub.status === statusFilter);

  const stats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === 'submitted').length,
    accepted: submissions.filter(s => s.status === 'accepted').length,
    live: submissions.filter(s => s.status === 'live').length
  };

  return (
    <PlaylistsContainer>
      <BackgroundPattern />
      
      <Header
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title>Playlist Management</Title>
        <Subtitle>Discover playlists and track your submissions</Subtitle>
      </Header>

      <DashboardGrid>
        {/* Playlist Discovery Section */}
        <DashboardCard
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <CardTitle>
            <FaSearch />
            Discover Playlists
          </CardTitle>
          
          <SearchSection>
            <SearchContainer>
              <Select 
                value={selectedGenre} 
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </Select>
              
              <SearchButton 
                id="search-button"
                onClick={handleSearchPlaylists} 
                disabled={searchingPlaylists}
              >
                {searchingPlaylists ? (
                  <>
                    <div className="spinner" />
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch />
                    Search Playlists
                  </>
                )}
              </SearchButton>
            </SearchContainer>
            
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
              Find the top 10 playlists in {selectedGenre} with 10k+ followers
            </p>
          </SearchSection>

          {showPlaylistDropdown && (
            ReactDOM.createPortal(
              <PlaylistDropdown
                data-dropdown
                top={dropdownPosition.top}
                left={dropdownPosition.left}
                width={dropdownPosition.width}
              >
                {playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <PlaylistItem key={playlist.id}>
                      <PlaylistImage 
                        src={playlist.images?.[0]?.url || 'https://via.placeholder.com/60x60/667eea/ffffff?text=PL'} 
                        alt={playlist.name}
                        onError={(e) => {
                          console.log('Image failed to load for playlist:', playlist.name, 'Images:', playlist.images);
                          e.target.src = 'https://via.placeholder.com/60x60/667eea/ffffff?text=PL';
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully for playlist:', playlist.name, 'URL:', playlist.images?.[0]?.url);
                        }}
                      />
                      <PlaylistInfo>
                        <PlaylistName>{playlist.name}</PlaylistName>
                        <PlaylistDetails>{playlist.description}</PlaylistDetails>
                        <PlaylistOwner>by {playlist.owner}</PlaylistOwner>
                      </PlaylistInfo>
                      <PlaylistStats>
                        <FollowerCount>
                          <FaUsers />
                          {(playlist.followers / 1000).toFixed(1)}k
                        </FollowerCount>
                        <TrackCount>
                          <FaMusic />
                          {playlist.tracks}
                        </TrackCount>
                      </PlaylistStats>
                      <SearchButton
                        onClick={() => handleSubmitToPlaylist(playlist)}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                      >
                        Submit
                      </SearchButton>
                    </PlaylistItem>
                  ))
                ) : (
                  <NoPlaylistsMessage>
                    No playlists found for {selectedGenre}
                  </NoPlaylistsMessage>
                )}
              </PlaylistDropdown>,
              document.body
            )
          )}
        </DashboardCard>

        {/* Submissions Tracking Section */}
        <DashboardCard
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <CardTitle>
            <FaMusic />
            Your Submissions
          </CardTitle>

          <StatsGrid>
            <StatCard>
              <StatValue>{stats.total}</StatValue>
              <StatLabel>Total</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.submitted}</StatValue>
              <StatLabel>Submitted</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.accepted}</StatValue>
              <StatLabel>Accepted</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.live}</StatValue>
              <StatLabel>Live</StatLabel>
            </StatCard>
          </StatsGrid>

          <FilterSection>
            <FilterButton 
              active={statusFilter === 'all'} 
              onClick={() => setStatusFilter('all')}
            >
              All
            </FilterButton>
            <FilterButton 
              active={statusFilter === 'submitted'} 
              onClick={() => setStatusFilter('submitted')}
            >
              Submitted
            </FilterButton>
            <FilterButton 
              active={statusFilter === 'accepted'} 
              onClick={() => setStatusFilter('accepted')}
            >
              Accepted
            </FilterButton>
            <FilterButton 
              active={statusFilter === 'live'} 
              onClick={() => setStatusFilter('live')}
            >
              Live
            </FilterButton>
            <FilterButton 
              active={statusFilter === 'rejected'} 
              onClick={() => setStatusFilter('rejected')}
            >
              Rejected
            </FilterButton>
          </FilterSection>

          <SubmissionsList>
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission) => (
                <SubmissionItem key={submission.id}>
                  <TrackImage src={submission.coverImage} alt={submission.trackName} />
                  <SubmissionInfo>
                    <SubmissionTitle>{submission.trackName}</SubmissionTitle>
                    <SubmissionDetails>
                      <span>by {submission.artist}</span>
                      <span>to {submission.playlistName}</span>
                      <span>by {submission.playlistOwner}</span>
                      <span>{submission.submittedAt}</span>
                    </SubmissionDetails>
                  </SubmissionInfo>
                  <SubmissionStatus status={submission.status}>
                    <StatusIcon>
                      {getStatusIcon(submission.status)}
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </StatusIcon>
                  </SubmissionStatus>
                </SubmissionItem>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)', padding: '2rem' }}>
                No submissions found for this filter
              </div>
            )}
          </SubmissionsList>
        </DashboardCard>
      </DashboardGrid>
    </PlaylistsContainer>
  );
}

export default Playlists;
