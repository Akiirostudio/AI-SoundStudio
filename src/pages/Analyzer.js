import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaChartBar, FaArrowUp, FaArrowDown, FaRobot, FaShieldAlt, FaSearch, FaStar, FaUserFriends, FaLock, FaUser } from 'react-icons/fa';
import SpotifyService from '../services/spotify';
import searchLimitService from '../services/searchLimit';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const AnalyzerContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
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

const MainContent = styled(motion.div)`
  max-width: 600px;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const InputContainer = styled.div`
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.1rem;
  text-align: center;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
`;

const AnalyzeButton = styled(motion.button)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 1rem 3rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultsContainer = styled(motion.div)`
  max-width: 800px;
  margin-top: 3rem;
  z-index: 1;
`;

const ResultsCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const PlaylistInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const PlaylistImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
`;

const PlaylistDetails = styled.div`
  text-align: left;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const PlaylistName = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
`;

const PlaylistDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
`;

const PlaylistStats = styled.div`
  display: flex;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MetricLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
`;

const AnalysisText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: 1rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const SearchLimitBanner = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const SearchLimitInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
`;

const SearchLimitCount = styled.span`
  color: ${props => props.warning ? '#ff6b6b' : '#4CAF50'};
  font-weight: 600;
`;

const SignUpButton = styled(Link)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  }
`;

const UnlimitedBadge = styled.div`
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const BotWarning = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ff6b6b;
  font-weight: 500;
`;

const GrowthChart = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const ChartTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartContainer = styled.div`
  height: 200px;
  position: relative;
  margin-top: 1rem;
`;

const ChartLine = styled.svg`
  width: 100%;
  height: 100%;
`;

const ChartPath = styled.path`
  fill: none;
  stroke: linear-gradient(45deg, #667eea, #764ba2);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const ChartGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  pointer-events: none;
`;

const GridLine = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const BotScoreCard = styled.div`
  background: ${props => props.score > 30 ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.score > 30 ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin-top: 1rem;
`;

const BotScoreValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.score > 30 ? '#ff6b6b' : '#51cf66'};
  margin-bottom: 0.5rem;
`;

const BotScoreLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
`;

const BotIndicators = styled.div`
  margin-top: 1rem;
  text-align: left;
`;

const BotIndicator = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
  
  &::before {
    content: '•';
    color: #ff6b6b;
    position: absolute;
    left: 0;
  }
`;

const PopularityChart = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const DistributionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const DistributionCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const DistributionValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => {
    if (props.range.includes('High')) return '#51cf66';
    if (props.range.includes('Medium')) return '#ffd43b';
    return '#ff6b6b';
  }};
  margin-bottom: 0.25rem;
`;

const DistributionLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 500;
`;

const TrendIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => {
    if (props.trend === 'high') return '#51cf66';
    if (props.trend === 'low') return '#ff6b6b';
    return '#ffd43b';
  }};
  font-weight: 600;
  margin-top: 1rem;
`;

const SuspiciousWarning = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ff6b6b;
  font-weight: 500;
`;

const SuspiciousPatterns = styled.div`
  margin-top: 1rem;
  text-align: left;
`;

const SuspiciousPattern = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
  
  &::before {
    content: '•';
    color: #ff6b6b;
    position: absolute;
    left: 0;
  }
`;

const BotAnalysisCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  border: 1px solid ${props => props.hasBotActivity ? 'rgba(255, 107, 107, 0.3)' : 'rgba(102, 126, 234, 0.3)'};
`;

const BotScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const BotScoreCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  background: ${props => {
    if (props.score >= 70) return 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
    if (props.score >= 40) return 'linear-gradient(135deg, #ffd93d, #f6c90e)';
    return 'linear-gradient(135deg, #51cf66, #40c057)';
  }};
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const BotScoreInfo = styled.div`
  flex: 1;
`;

const BotScoreDescription = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;



const BotMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const BotMetricCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const BotMetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
`;

const BotMetricLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 500;
`;

const LegitimateIndicator = styled.div`
  background: rgba(81, 207, 102, 0.1);
  border: 1px solid rgba(81, 207, 102, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #51cf66;
  font-weight: 500;
`;

const DiscoveryCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  border: 1px solid rgba(102, 126, 234, 0.3);
`;

const DiscoveryScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DiscoveryScoreCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  background: ${props => {
    if (props.score >= 80) return 'linear-gradient(135deg, #51cf66, #40c057)';
    if (props.score >= 60) return 'linear-gradient(135deg, #74c0fc, #4dabf7)';
    if (props.score >= 40) return 'linear-gradient(135deg, #ffd43b, #fcc419)';
    if (props.score >= 20) return 'linear-gradient(135deg, #ffa8a8, #ff8787)';
    return 'linear-gradient(135deg, #adb5bd, #868e96)';
  }};
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const DiscoveryScoreInfo = styled.div`
  flex: 1;
`;

const DiscoveryScoreLabel = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
`;

const DiscoveryScoreDescription = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const DiscoveredArtistsList = styled.div`
  margin-top: 1.5rem;
`;

const ArtistCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ArtistInfo = styled.div`
  flex: 1;
`;

const ArtistName = styled.div`
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
`;

const ArtistDetails = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const DiscoveryBadge = styled.div`
  background: ${props => {
    if (props.score >= 80) return 'rgba(81, 207, 102, 0.2)';
    if (props.score >= 60) return 'rgba(116, 192, 252, 0.2)';
    if (props.score >= 40) return 'rgba(255, 212, 59, 0.2)';
    return 'rgba(255, 168, 168, 0.2)';
  }};
  color: ${props => {
    if (props.score >= 80) return '#51cf66';
    if (props.score >= 60) return '#74c0fc';
    if (props.score >= 40) return '#ffd43b';
    return '#ffa8a8';
  }};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid ${props => {
    if (props.score >= 80) return 'rgba(81, 207, 102, 0.3)';
    if (props.score >= 60) return 'rgba(116, 192, 252, 0.3)';
    if (props.score >= 40) return 'rgba(255, 212, 59, 0.3)';
    return 'rgba(255, 168, 168, 0.3)';
  }};
`;

const DiscoveryMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const DiscoveryMetricCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const DiscoveryMetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
`;

const DiscoveryMetricLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 500;
`;

function Analyzer() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [searchLimitInfo, setSearchLimitInfo] = useState(null);
  const [limitLoading, setLimitLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load search limit info on component mount only once
  useEffect(() => {
    const loadSearchLimitInfo = async () => {
      try {
        const info = await searchLimitService.getSearchLimitInfo(currentUser?.uid);
        setSearchLimitInfo(info);
      } catch (error) {
        console.error('Error loading search limit info:', error);
        // Set default info if there's an error
        setSearchLimitInfo({
          isAuthenticated: false,
          remainingSearches: 3,
          totalSearches: 0,
          maxSearches: 3
        });
      } finally {
        setLimitLoading(false);
      }
    };

    // Only load once when component mounts or user changes
    if (!searchLimitInfo) {
      loadSearchLimitInfo();
    }
  }, [currentUser, searchLimitInfo]);

  const generateChartPath = (growthData) => {
    if (!growthData || growthData.length === 0) return '';
    
    const maxFollowers = Math.max(...growthData.map(d => d.followers));
    const minFollowers = Math.min(...growthData.map(d => d.followers));
    const range = maxFollowers - minFollowers || 1;
    
    const points = growthData.map((data, index) => {
      const x = (index / (growthData.length - 1)) * 100;
      const y = 100 - ((data.followers - minFollowers) / range) * 100;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  const handleAnalyze = async () => {
    if (!playlistUrl.trim()) {
      setError('Please enter a playlist URL');
      return;
    }

    // For non-authenticated users, check and decrement search count
    if (!currentUser) {
      if (!searchLimitInfo || searchLimitInfo.remainingSearches <= 0) {
        setError(`You've reached the limit of 3 searches. Please sign up for unlimited access!`);
        return;
      }
      
      // Decrement the count immediately
      const newRemainingSearches = searchLimitInfo.remainingSearches - 1;
      setSearchLimitInfo(prev => ({
        ...prev,
        remainingSearches: newRemainingSearches,
        totalSearches: prev.totalSearches + 1
      }));
      
      // Record the search in the background
      searchLimitService.recordSearch(currentUser?.uid);
      
      // If this was the last search, show error and return
      if (newRemainingSearches <= 0) {
        setError(`You've reached the limit of 3 searches. Please sign up for unlimited access!`);
        return;
      }
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const playlistData = await SpotifyService.getPlaylistInfo(playlistUrl);
      const analysis = SpotifyService.analyzePlaylist(playlistData);
      
      setResults({
        playlist: playlistData,
        analysis: analysis,
        botAnalysis: playlistData.botAnalysis,
        discoveryAnalysis: playlistData.discoveryAnalysis
      });
    } catch (err) {
      setError('Failed to analyze playlist. Please check the URL and try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnalyzerContainer>
      <BackgroundPattern />
      
      <MainContent
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title>Playlist Analyzer</Title>
        
        {/* Search Limit Banner */}
        {!limitLoading && (
          <SearchLimitBanner>
            {currentUser ? (
              <UnlimitedBadge>
                <FaUser />
                Unlimited Searches
              </UnlimitedBadge>
            ) : (
              <>
                <SearchLimitInfo>
                  <FaLock />
                  Searches remaining: 
                  <SearchLimitCount warning={searchLimitInfo?.remainingSearches <= 1}>
                    {searchLimitInfo?.remainingSearches || 3} / {searchLimitInfo?.maxSearches || 3}
                  </SearchLimitCount>
                </SearchLimitInfo>
                <SignUpButton to="/signup">
                  Sign Up for Unlimited
                </SignUpButton>
              </>
            )}
          </SearchLimitBanner>
        )}
        
        <InputContainer>
          <Input
            type="text"
            placeholder="Paste Spotify playlist link or ID"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
          />
        </InputContainer>
        
        <AnalyzeButton
          onClick={handleAnalyze}
          disabled={loading || (!currentUser && searchLimitInfo?.remainingSearches <= 0)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              Analyzing...
            </>
          ) : (
            'Analyze'
          )}
        </AnalyzeButton>



        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}
      </MainContent>

      {results && (
        <ResultsContainer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ResultsCard>
            <PlaylistInfo>
              <PlaylistImage 
                src={results.playlist.images?.[0]?.url || '/placeholder-playlist.jpg'} 
                alt={results.playlist.name}
              />
              <PlaylistDetails>
                <PlaylistName>{results.playlist.name}</PlaylistName>
                <PlaylistDescription>
                  {results.playlist.description || 'No description available'}
                </PlaylistDescription>
                <PlaylistStats>
                  <span>{results.analysis.totalTracks} tracks</span>
                  <span>•</span>
                  <span>{results.analysis.uniqueArtists} artists</span>
                  <span>•</span>
                  <span>By {results.playlist.owner?.display_name}</span>
                  {results.playlist.followers && (
                    <>
                      <span>•</span>
                      <span>{results.playlist.followers.total.toLocaleString()} followers</span>
                    </>
                  )}
                </PlaylistStats>
              </PlaylistDetails>
            </PlaylistInfo>

            <MetricsGrid>
              <MetricCard>
                <MetricValue>{results.analysis.authenticity}%</MetricValue>
                <MetricLabel>Authenticity</MetricLabel>
              </MetricCard>
              <MetricCard>
                <MetricValue>{results.analysis.popularity}</MetricValue>
                <MetricLabel>Avg Popularity</MetricLabel>
              </MetricCard>
              <MetricCard>
                <MetricValue>{results.analysis.freshness}%</MetricValue>
                <MetricLabel>Freshness</MetricLabel>
              </MetricCard>
              <MetricCard>
                <MetricValue>{results.analysis.uniqueArtists}</MetricValue>
                <MetricLabel>Unique Artists</MetricLabel>
              </MetricCard>
            </MetricsGrid>

            <AnalysisText>
              {results.analysis.analysis}
            </AnalysisText>

            {/* Bot Detection Analysis */}
            {results.botAnalysis && (
              <BotAnalysisCard hasBotActivity={results.botAnalysis.hasBotActivity}>
                <ChartTitle>
                  <FaRobot />
                  Bot Detection Analysis
                </ChartTitle>
                
                <BotScoreDisplay>
                  <BotScoreCircle score={results.botAnalysis.botScore}>
                    {results.botAnalysis.botScore}%
                  </BotScoreCircle>
                  <BotScoreInfo>
                    <BotScoreLabel>
                      {results.botAnalysis.hasBotActivity ? 'Bot Activity Detected' : 'Legitimate Playlist'}
                    </BotScoreLabel>
                    <BotScoreDescription>
                      {results.botAnalysis.analysis}
                    </BotScoreDescription>
                  </BotScoreInfo>
                </BotScoreDisplay>

                {results.botAnalysis.hasBotActivity ? (
                  <BotWarning>
                    <FaExclamationTriangle />
                    This playlist shows signs of bot activity
                  </BotWarning>
                ) : (
                  <LegitimateIndicator>
                    <FaShieldAlt />
                    This playlist appears to be legitimate
                  </LegitimateIndicator>
                )}

                {results.botAnalysis.indicators.length > 0 && (
                  <BotIndicators>
                    {results.botAnalysis.indicators.map((indicator, index) => (
                      <BotIndicator key={index}>
                        <FaExclamationTriangle />
                        {indicator}
                      </BotIndicator>
                    ))}
                  </BotIndicators>
                )}

                <BotMetricsGrid>
                  <BotMetricCard>
                    <BotMetricValue>{results.botAnalysis.metrics.followerToTrackRatio}</BotMetricValue>
                    <BotMetricLabel>Follower/Track Ratio</BotMetricLabel>
                  </BotMetricCard>
                  <BotMetricCard>
                    <BotMetricValue>{results.botAnalysis.metrics.artistDiversity}%</BotMetricValue>
                    <BotMetricLabel>Artist Diversity</BotMetricLabel>
                  </BotMetricCard>
                  <BotMetricCard>
                    <BotMetricValue>{results.botAnalysis.metrics.avgPopularity}</BotMetricValue>
                    <BotMetricLabel>Avg Popularity</BotMetricLabel>
                  </BotMetricCard>
                  <BotMetricCard>
                    <BotMetricValue>{results.botAnalysis.metrics.avgDuration}s</BotMetricValue>
                    <BotMetricLabel>Avg Duration</BotMetricLabel>
                  </BotMetricCard>
                  <BotMetricCard>
                    <BotMetricValue>{results.botAnalysis.metrics.uniqueDates}</BotMetricValue>
                    <BotMetricLabel>Unique Dates</BotMetricLabel>
                  </BotMetricCard>
                </BotMetricsGrid>
              </BotAnalysisCard>
            )}

            {/* Discovery Analysis */}
            {results.discoveryAnalysis && (
              <DiscoveryCard>
                <ChartTitle>
                  <FaSearch />
                  Discovery Analysis
                </ChartTitle>
                
                <DiscoveryScoreDisplay>
                  <DiscoveryScoreCircle score={results.discoveryAnalysis.discoveryScore}>
                    {results.discoveryAnalysis.discoveryScore}%
                  </DiscoveryScoreCircle>
                  <DiscoveryScoreInfo>
                    <DiscoveryScoreLabel>
                      {results.discoveryAnalysis.discoveryLevel}
                    </DiscoveryScoreLabel>
                    <DiscoveryScoreDescription>
                      {results.discoveryAnalysis.discoveryDescription}
                    </DiscoveryScoreDescription>
                  </DiscoveryScoreInfo>
                </DiscoveryScoreDisplay>

                {results.discoveryAnalysis.discoveredArtists && results.discoveryAnalysis.discoveredArtists.length > 0 && (
                  <DiscoveredArtistsList>
                    <h4 style={{ color: 'white', marginBottom: '1rem' }}>Top Discovered Artists</h4>
                    {results.discoveryAnalysis.discoveredArtists.slice(0, 5).map((artist, index) => (
                      <ArtistCard key={index}>
                        <FaStar />
                        <ArtistInfo>
                          <ArtistName>{artist.name}</ArtistName>
                          <ArtistDetails>
                            Popularity: {artist.popularity}/100 • Track: {artist.trackName}
                          </ArtistDetails>
                        </ArtistInfo>
                        <DiscoveryBadge score={artist.discoveryScore}>
                          {artist.discoveryScore}%
                        </DiscoveryBadge>
                      </ArtistCard>
                    ))}
                  </DiscoveredArtistsList>
                )}

                <DiscoveryMetricsGrid>
                  <DiscoveryMetricCard>
                    <DiscoveryMetricValue>{results.discoveryAnalysis.discoveryMetrics.totalArtists}</DiscoveryMetricValue>
                    <DiscoveryMetricLabel>Total Artists</DiscoveryMetricLabel>
                  </DiscoveryMetricCard>
                  <DiscoveryMetricCard>
                    <DiscoveryMetricValue>{results.discoveryAnalysis.discoveryMetrics.discoveredArtistsCount}</DiscoveryMetricValue>
                    <DiscoveryMetricLabel>Discovered Artists</DiscoveryMetricLabel>
                  </DiscoveryMetricCard>
                  <DiscoveryMetricCard>
                    <DiscoveryMetricValue>{results.discoveryAnalysis.discoveryMetrics.avgArtistPopularity}</DiscoveryMetricValue>
                    <DiscoveryMetricLabel>Avg Artist Popularity</DiscoveryMetricLabel>
                  </DiscoveryMetricCard>
                  <DiscoveryMetricCard>
                    <DiscoveryMetricValue>{results.discoveryAnalysis.discoveryMetrics.artistDiversity}%</DiscoveryMetricValue>
                    <DiscoveryMetricLabel>Artist Diversity</DiscoveryMetricLabel>
                  </DiscoveryMetricCard>
                </DiscoveryMetricsGrid>
              </DiscoveryCard>
            )}
          </ResultsCard>
        </ResultsContainer>
      )}
    </AnalyzerContainer>
  );
}

export default Analyzer;
