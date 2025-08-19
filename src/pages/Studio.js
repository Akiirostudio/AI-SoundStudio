import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaStop, FaUpload, FaDownload, FaCut, FaVolumeUp } from 'react-icons/fa';

const StudioContainer = styled.div`
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

const StudioLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  height: fit-content;
`;

const SidebarTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: white;
`;

const ControlGroup = styled.div`
  margin-bottom: 2rem;
`;

const ControlLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(45deg, #667eea, #764ba2);
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: linear-gradient(45deg, #667eea, #764ba2);
    cursor: pointer;
    border: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ControlButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  &.active {
    background: linear-gradient(45deg, #667eea, #764ba2);
  }
`;

const UploadArea = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    color: #667eea;
  }
`;

const MainArea = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  min-height: 600px;
`;

const WaveformContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  min-height: 200px;
  position: relative;
  overflow: hidden;
`;

const Waveform = styled.div`
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
`;

const WaveformBars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 100px;
  width: 100%;
  justify-content: center;
`;

const WaveformBar = styled.div`
  width: 3px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 2px;
  height: ${props => props.height}%;
  transition: height 0.3s ease;
`;

const TransportControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TransportButton = styled(motion.button)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const TimeDisplay = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 2rem;
`;

const ToolsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ToolCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const ToolIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #667eea;
`;

const ToolName = styled.div`
  font-size: 0.9rem;
  color: white;
  font-weight: 500;
`;

function Studio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [tempo, setTempo] = useState(120);
  const [currentTime, setCurrentTime] = useState('00:00');

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime('00:00');
  };

  const generateWaveform = () => {
    const bars = [];
    for (let i = 0; i < 50; i++) {
      bars.push(
        <WaveformBar 
          key={i} 
          height={Math.random() * 80 + 20} 
        />
      );
    }
    return bars;
  };

  return (
    <StudioContainer>
      <BackgroundPattern />
      
      <Header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title>Studio</Title>
        <Subtitle>Waveform editing, trimming, and export with a modern UI.</Subtitle>
      </Header>

      <StudioLayout>
        <Sidebar
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SidebarTitle>Controls</SidebarTitle>
          
          <ControlGroup>
            <ControlLabel>Volume</ControlLabel>
            <Slider
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              {volume}%
            </div>
          </ControlGroup>

          <ControlGroup>
            <ControlLabel>Tempo (BPM)</ControlLabel>
            <Slider
              type="range"
              min="60"
              max="200"
              value={tempo}
              onChange={(e) => setTempo(e.target.value)}
            />
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              {tempo} BPM
            </div>
          </ControlGroup>

          <ControlGroup>
            <ControlLabel>Effects</ControlLabel>
            <ButtonGroup>
              <ControlButton>Reverb</ControlButton>
              <ControlButton>Delay</ControlButton>
            </ButtonGroup>
            <ButtonGroup>
              <ControlButton>EQ</ControlButton>
              <ControlButton>Comp</ControlButton>
            </ButtonGroup>
          </ControlGroup>

          <ControlGroup>
            <ControlLabel>Import Audio</ControlLabel>
            <UploadArea>
              <FaUpload style={{ fontSize: '2rem', marginBottom: '1rem' }} />
              <div>Click to upload or drag files here</div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Supports MP3, WAV, FLAC
              </div>
            </UploadArea>
          </ControlGroup>
        </Sidebar>

        <MainArea
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <WaveformContainer>
            <Waveform>
              <WaveformBars>
                {generateWaveform()}
              </WaveformBars>
            </Waveform>
          </WaveformContainer>

          <TimeDisplay>
            {currentTime} / 03:45
          </TimeDisplay>

          <TransportControls>
            <TransportButton
              onClick={handlePlayPause}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </TransportButton>
            <TransportButton
              onClick={handleStop}
              className="secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaStop />
            </TransportButton>
          </TransportControls>

          <ToolsSection>
            <ToolCard>
              <ToolIcon>
                <FaCut />
              </ToolIcon>
              <ToolName>Trim</ToolName>
            </ToolCard>
            <ToolCard>
              <ToolIcon>
                <FaVolumeUp />
              </ToolIcon>
              <ToolName>Fade</ToolName>
            </ToolCard>
            <ToolCard>
              <ToolIcon>
                <FaDownload />
              </ToolIcon>
              <ToolName>Export</ToolName>
            </ToolCard>
          </ToolsSection>
        </MainArea>
      </StudioLayout>
    </StudioContainer>
  );
}

export default Studio;
