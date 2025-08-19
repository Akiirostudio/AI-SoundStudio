import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaMusic, FaSearch } from 'react-icons/fa';
import SpotifyService from '../services/spotify';

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
  z-index: 1;
  
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

function Submissions() {
  const [songUrl, setSongUrl] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Pop');
  const [trackInfo, setTrackInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          <SearchButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSearch style={{ marginRight: '0.5rem' }} />
            Search
          </SearchButton>
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
          <EmptyState>
            <MusicIcon />
            <div>No submissions yet</div>
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Submit your first track to get started.
            </div>
          </EmptyState>
        </DashboardCard>

        <DashboardCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <CardTitle>Submission Stats</CardTitle>
          <StatsGrid>
            <StatCard>
              <StatValue color="blue">0</StatValue>
              <StatLabel>Total Submissions</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue color="green">0</StatValue>
              <StatLabel>Accepted</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue color="orange">0</StatValue>
              <StatLabel>In Review</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue color="red">0</StatValue>
              <StatLabel>Rejected</StatLabel>
            </StatCard>
          </StatsGrid>
        </DashboardCard>
      </DashboardGrid>
    </SubmissionsContainer>
  );
}

export default Submissions;
