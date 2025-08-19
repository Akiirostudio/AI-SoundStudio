import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PlaylistsContainer = styled.div`
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

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: left;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
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

const CreateButton = styled(motion.button)`
  background: #000;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: #333;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  color: #51cf66;
  background: rgba(81, 207, 102, 0.1);
  border: 1px solid rgba(81, 207, 102, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

function Playlists() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    spotifyId: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.spotifyId.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Playlist created successfully!');
      setFormData({
        title: '',
        description: '',
        spotifyId: ''
      });
    } catch (err) {
      setError('Failed to create playlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlaylistsContainer>
      <BackgroundPattern />
      
      <MainContent
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title>Playlists</Title>
        
        <FormContainer>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                placeholder="Enter playlist title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                placeholder="Enter playlist description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Spotify ID</Label>
              <Input
                type="text"
                name="spotifyId"
                placeholder="Enter Spotify playlist ID"
                value={formData.spotifyId}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <CreateButton
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Creating...' : 'Create'}
            </CreateButton>
          </form>

          {success && (
            <SuccessMessage>
              {success}
            </SuccessMessage>
          )}

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}
        </FormContainer>
      </MainContent>
    </PlaylistsContainer>
  );
}

export default Playlists;
