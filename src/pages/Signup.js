import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const SignupContainer = styled.div`
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
    radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(102, 126, 234, 0.05) 0%, transparent 50%);
  pointer-events: none;
`;

const BrandSection = styled(motion.div)`
  margin-bottom: 3rem;
  z-index: 1;
`;

const LargeLogo = styled(motion.img)`
  width: 120px;
  height: 75px;
  border-radius: 0;
  margin: 0 auto 2rem;
  display: block;
`;

const AppName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
`;

const Tagline = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
`;

const SignupForm = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 400px;
  width: 100%;
  z-index: 1;
`;

const FormTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: white;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
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

const SignUpButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 1.5rem;
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

const LinkText = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const StyledLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  color: #51cf66;
  background: rgba(81, 207, 102, 0.1);
  border: 1px solid rgba(81, 207, 102, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const PasswordRequirements = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: left;
`;

const Requirement = styled.div`
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RequirementIcon = styled.span`
  color: ${props => props.met ? '#51cf66' : 'rgba(255, 255, 255, 0.3)'};
  font-weight: bold;
`;

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return requirements;
  };

  const passwordRequirements = validatePassword(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = formData.name.trim() && 
                     formData.email.trim() && 
                     formData.password && 
                     passwordsMatch &&
                     Object.values(passwordRequirements).every(req => req);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError('Please fill in all fields correctly and ensure passwords match.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signup(formData.email, formData.password, formData.name);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupContainer>
      <BackgroundPattern />
      
      <BrandSection
        initial={{ opacity: 0, y: -30 }}
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
        <AppName>Vibesona</AppName>
        <Tagline>Your AI-Powered Music Studio</Tagline>
      </BrandSection>

      <SignupForm
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <FormTitle>Create Account</FormTitle>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Full Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {formData.password && (
              <PasswordRequirements>
                <Requirement>
                  <RequirementIcon met={passwordRequirements.length}>✓</RequirementIcon>
                  At least 8 characters
                </Requirement>
                <Requirement>
                  <RequirementIcon met={passwordRequirements.uppercase}>✓</RequirementIcon>
                  One uppercase letter
                </Requirement>
                <Requirement>
                  <RequirementIcon met={passwordRequirements.lowercase}>✓</RequirementIcon>
                  One lowercase letter
                </Requirement>
                <Requirement>
                  <RequirementIcon met={passwordRequirements.number}>✓</RequirementIcon>
                  One number
                </Requirement>
                <Requirement>
                  <RequirementIcon met={passwordRequirements.special}>✓</RequirementIcon>
                  One special character
                </Requirement>
              </PasswordRequirements>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            {formData.confirmPassword && !passwordsMatch && (
              <div style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Passwords do not match
              </div>
            )}
          </FormGroup>

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          {success && (
            <SuccessMessage>
              {success}
            </SuccessMessage>
          )}
          
          <SignUpButton
            type="submit"
            disabled={loading || !isFormValid}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </SignUpButton>
        </form>
        
        <LinkText>
          Already have an account? <StyledLink to="/login">Sign In</StyledLink>
        </LinkText>
      </SignupForm>
    </SignupContainer>
  );
}

export default Signup;
