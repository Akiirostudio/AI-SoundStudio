import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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
    radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(102, 126, 234, 0.05) 0%, transparent 50%);
  pointer-events: none;
`;

const HeroSection = styled(motion.div)`
  max-width: 800px;
  margin-bottom: 4rem;
  z-index: 1;
`;

const LargeLogo = styled(motion.img)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 2rem;
  display: block;
`;

const MainTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
  }
`;

const SecondaryButton = styled(Link)`
  background: transparent;
  color: #667eea;
  padding: 1rem 2rem;
  border: 2px solid #667eea;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-3px);
  }
`;

const SubmitSection = styled(motion.div)`
  max-width: 600px;
  margin-bottom: 4rem;
  z-index: 1;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
`;

const SectionSubtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
`;

const SubmitForm = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
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

const LoadButton = styled.button`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const FeatureCards = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  width: 100%;
  z-index: 1;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: left;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
`;

const CardDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

function Home() {
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
          Analyze playlists for authenticity, craft tracks in a sleek studio, and submit to curated lists — all in one seamless, next-gen experience.
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
          />
          <LoadButton>Load Track</LoadButton>
        </SubmitForm>
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
