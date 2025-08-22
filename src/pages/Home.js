import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SpotifyService from '../services/spotify';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(102, 126, 234, 0.04) 0%, transparent 50%);
  pointer-events: none;
`;

const HeroSection = styled(motion.div)`
  max-width: 700px;
  margin-bottom: 3rem;
  z-index: 1;
`;

const LargeLogo = styled(motion.img)`
  width: 100px;
  height: 62px;
  border-radius: 0;
  margin: 0 auto 1.5rem;
  display: block;
`;

const MainTitle = styled(motion.h1)`
  font-size: 2.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.025em;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  letter-spacing: 0;
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  letter-spacing: 0;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const SecondaryButton = styled(Link)`
  background: transparent;
  color: #667eea;
  padding: 0.875rem 1.75rem;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  letter-spacing: 0;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: rgba(102, 126, 234, 0.5);
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled(motion.div)`
  max-width: 1000px;
  width: 100%;
  z-index: 1;
`;

const SubmitSection = styled(motion.div)`
  max-width: 600px;
  width: 100%;
  margin-top: 2rem;
  z-index: 1;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: white;
  letter-spacing: -0.01em;
`;

const SectionSubtitle = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: 0;
`;

const SubmitForm = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const LoadButton = styled.button`
  padding: 0.875rem 1.5rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const FeatureCards = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  width: 100%;
  z-index: 1;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: left;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;



const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: white;
  letter-spacing: -0.01em;
`;

const CardDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0;
`;

function Home() {
  const [songUrl, setSongUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackInfo, setTrackInfo] = useState(null);

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

  return (
    <HomeContainer>
      <BackgroundPattern />
      
      <HeroSection
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <LargeLogo
          src="/assets/logo.png"
          alt="Vibesona"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <MainTitle>Intelligent creation. Verified growth.</MainTitle>
        <Subtitle>
          Analyze playlists for authenticity, craft tracks in a sleek studio, and submit to curated lists. All in one seamless, next-gen experience.
        </Subtitle>
      </HeroSection>

      <CTAButtons
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <PrimaryButton to="/analyzer">Analyze a Playlist</PrimaryButton>
        <SecondaryButton to="/studio">Open Studio</SecondaryButton>
      </CTAButtons>

      <SubmitSection
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <SectionTitle>Submit Your Track</SectionTitle>
        <SectionSubtitle>Enter your song link and submit to curated playlists instantly</SectionSubtitle>
        <SubmitForm>
          <Input 
            type="text" 
            placeholder="Paste your Spotify song URL here..." 
            value={songUrl}
            onChange={(e) => setSongUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLoadTrack()}
          />
          <LoadButton 
            onClick={handleLoadTrack}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load Track'}
          </LoadButton>
        </SubmitForm>

        {error && (
          <div style={{ color: '#ff6b6b', marginTop: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {trackInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ 
              marginTop: '2rem', 
              padding: '1.5rem', 
              background: 'rgba(255, 255, 255, 0.08)', 
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              maxWidth: '500px',
              margin: '2rem auto 0'
            }}
          >
            {/* Track Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <img 
                src={trackInfo.album?.images?.[0]?.url} 
                alt={trackInfo.name}
                style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: 'white', marginBottom: '0.25rem', fontSize: '1.125rem' }}>
                  {trackInfo.name}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                  {trackInfo.artists?.map(a => a.name).join(', ')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  {trackInfo.album?.name} • {trackInfo.album?.release_date?.split('-')[0]}
                </div>
              </div>
            </div>

            {/* Detailed Stats Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                padding: '0.75rem', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>
                  Popularity
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>
                  {trackInfo.popularity}/100
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '4px', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '2px',
                  marginTop: '0.5rem'
                }}>
                  <div style={{ 
                    width: `${trackInfo.popularity}%`, 
                    height: '100%', 
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    borderRadius: '2px'
                  }} />
                </div>
              </div>

              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                padding: '0.75rem', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>
                  Duration
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>
                  {formatDuration(trackInfo.duration_ms)}
                </div>
              </div>

              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                padding: '0.75rem', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>
                  Track ID
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white', wordBreak: 'break-all' }}>
                  {trackInfo.id}
                </div>
              </div>

              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                padding: '0.75rem', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>
                  Explicit
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: trackInfo.explicit ? '#ff6b6b' : '#4CAF50' }}>
                  {trackInfo.explicit ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                Track Details
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                <div>• Spotify URI: {trackInfo.uri}</div>
                <div>• External URL: <a href={trackInfo.external_urls?.spotify} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'none' }}>Open in Spotify</a></div>
                <div>• Disc Number: {trackInfo.disc_number}</div>
                <div>• Track Number: {trackInfo.track_number}</div>
              </div>
            </div>

            {/* Choose Playlist Button */}
            <Link 
              to="/submissions" 
              state={{ trackInfo: trackInfo }}
              style={{
                display: 'block',
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🎵 Choose Playlist & Submit
            </Link>
          </motion.div>
        )}
      </SubmitSection>

      <FeatureCards
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <FeatureCard>
          <CardTitle>Playlist Analyzer</CardTitle>
          <CardDescription>
            Bot heuristics, popularity trends, and activity freshness.
          </CardDescription>
        </FeatureCard>
        
        <FeatureCard>
          <CardTitle>Studio</CardTitle>
          <CardDescription>
            Waveform editing, trimming, and export with a modern UI.
          </CardDescription>
        </FeatureCard>
        
        <FeatureCard>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            Spend tokens to submit to quality-curated playlists.
          </CardDescription>
        </FeatureCard>
      </FeatureCards>
    </HomeContainer>
  );
}

export default Home;
