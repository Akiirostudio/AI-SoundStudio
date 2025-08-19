import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SpotifyService from '../services/spotify';

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

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

function Analyzer() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!playlistUrl.trim()) {
      setError('Please enter a playlist URL');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const playlistData = await SpotifyService.getPlaylistInfo(playlistUrl);
      const analysis = SpotifyService.analyzePlaylist(playlistData);
      
      setResults({
        playlist: playlistData,
        analysis: analysis
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
          disabled={loading}
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
                <MetricLabel>Popularity</MetricLabel>
              </MetricCard>
              <MetricCard>
                <MetricValue>{results.analysis.freshness}%</MetricValue>
                <MetricLabel>Freshness</MetricLabel>
              </MetricCard>
            </MetricsGrid>

            <AnalysisText>
              {results.analysis.analysis}
            </AnalysisText>
          </ResultsCard>
        </ResultsContainer>
      )}
    </AnalyzerContainer>
  );
}

export default Analyzer;
