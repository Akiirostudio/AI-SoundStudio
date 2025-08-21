import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FaCog, FaSignOutAlt, FaTrash, FaUser, FaEnvelope } from 'react-icons/fa';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1.5rem;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: opacity 0.3s ease;
  letter-spacing: -0.01em;
  
  &:hover {
    opacity: 0.8;
  }
`;

const LogoIcon = styled.img`
  width: 28px;
  height: 18px;
  border-radius: 0;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: ${props => props.active ? '#667eea' : 'white'};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: color 0.3s ease;
  position: relative;
  letter-spacing: 0;
  
  &:hover {
    color: #667eea;
  }
  
  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -0.375rem;
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
  padding: 0.625rem 1.25rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  letter-spacing: 0;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
`;

const SettingsButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  color: white;
  padding: 0.625rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

const SettingsDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 0.75rem;
  min-width: 200px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1001;
`;

const UserInfo = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
`;

const UserName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
  letter-spacing: -0.005em;
`;

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  letter-spacing: 0;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  background: none;
  border: none;
  color: white;
  font-size: 0.875rem;
  font-weight: 400;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  letter-spacing: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.danger {
    color: #ff6b6b;
    
    &:hover {
      background: rgba(255, 107, 107, 0.1);
    }
  }
`;

const DropdownIcon = styled.div`
  font-size: 0.875rem;
  opacity: 0.7;
`;

const DeleteConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h3`
  color: white;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const ModalText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &.cancel {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  &.delete {
    background: #ff6b6b;
    color: white;
    
    &:hover {
      background: #ff5252;
    }
  }
`;

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, deleteUserAccount } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowSettings(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      await deleteUserAccount();
      setShowDeleteConfirm(false);
      setShowSettings(false);
      navigate('/');
      alert('Account deletion would be implemented here in a real app.');
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Nav>
      <Logo onClick={handleLogoClick}>
        <LogoIcon src="/assets/logo.png" alt="Vibesona" />
        Vibesona
      </Logo>
      
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/analyzer">Playlist Analyzer</NavLink>
        <NavLink to="/submissions">Submissions</NavLink>
        <NavLink to="/playlists">Playlists</NavLink>
        <NavLink to="/pricing">Pricing</NavLink>
      </NavLinks>
      
      <UserSection ref={settingsRef}>
        {currentUser ? (
          <>
            <SettingsButton onClick={() => setShowSettings(!showSettings)}>
              <FaCog />
            </SettingsButton>
            {showSettings && (
              <SettingsDropdown>
                <UserInfo>
                  <UserName>
                    <FaUser />
                    {currentUser.displayName || 'User'}
                  </UserName>
                  <UserEmail>
                    <FaEnvelope />
                    {currentUser.email}
                  </UserEmail>
                </UserInfo>
                <DropdownItem onClick={handleLogout}>
                  <DropdownIcon><FaSignOutAlt /></DropdownIcon>
                  Sign Out
                </DropdownItem>
                <DropdownItem 
                  className="danger" 
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <DropdownIcon><FaTrash /></DropdownIcon>
                  Delete Account
                </DropdownItem>
              </SettingsDropdown>
            )}
          </>
        ) : (
          <LoginButton to="/login">
            Login
          </LoginButton>
        )}
      </UserSection>

      {showDeleteConfirm && (
        <DeleteConfirmModal>
          <ModalContent>
            <ModalTitle>Delete Account</ModalTitle>
            <ModalText>
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </ModalText>
            <ModalButtons>
              <ModalButton 
                className="cancel" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </ModalButton>
              <ModalButton 
                className="delete" 
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
              >
                {deletingAccount ? 'Deleting...' : 'Delete Account'}
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </DeleteConfirmModal>
      )}
    </Nav>
  );
}

export default Navbar;
