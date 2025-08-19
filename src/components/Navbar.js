import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const LogoIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: ${props => props.active ? '#667eea' : 'white'};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
  
  &:hover {
    color: #667eea;
  }
  
  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      border-radius: 1px;
    }
  `}
`;

const LoginButton = styled(Link)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserButton = styled.button`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

function Navbar() {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Nav>
      <Logo>
        <LogoIcon src="/assets/logo.png" alt="Vibesona" />
        Vibesona
      </Logo>
      
      <NavLinks>
        <NavLink to="/analyzer" active={location.pathname === '/analyzer'}>
          Analyzer
        </NavLink>
        <NavLink to="/playlists" active={location.pathname === '/playlists'}>
          Playlists
        </NavLink>
        <NavLink to="/studio" active={location.pathname === '/studio'}>
          Studio
        </NavLink>
        <NavLink to="/submissions" active={location.pathname === '/submissions'}>
          Submissions
        </NavLink>
        <NavLink to="/tokens" active={location.pathname === '/tokens'}>
          Tokens
        </NavLink>
      </NavLinks>
      
      <UserSection>
        {currentUser ? (
          <UserButton onClick={handleLogout}>
            Logout
          </UserButton>
        ) : (
          <LoginButton to="/login">
            Login
          </LoginButton>
        )}
      </UserSection>
    </Nav>
  );
}

export default Navbar;
