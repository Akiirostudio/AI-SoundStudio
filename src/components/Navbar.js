import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FaCog, FaSignOutAlt, FaTrash, FaUser, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa';

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
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    z-index: 999999;
  }
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
  
  @media (max-width: 480px) {
    font-size: 1.125rem;
    gap: 0.375rem;
  }
`;

const LogoIcon = styled.img`
  width: 28px;
  height: 18px;
  border-radius: 0;
  
  @media (max-width: 480px) {
    width: 24px;
    height: 16px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.isOpen ? 'rgba(0, 0, 0, 0.9)' : 'transparent'};
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    gap: 1rem;
    padding-top: 6rem;
    padding-right: 2rem;
    z-index: 999999;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.active ? '#667eea' : 'white'};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: color 0.3s ease;
  position: relative;
  letter-spacing: 0;
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  
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
  
  @media (max-width: 768px) {
    font-size: 1rem;
    font-weight: 500;
    min-height: 50px;
    min-width: 200px;
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    margin-bottom: 0.5rem;
    text-align: center;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    ${props => props.active && `
      &::after {
        display: none;
      }
      background: rgba(102, 126, 234, 0.2);
    `}
  }
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
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    min-height: 48px;
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
  min-height: 44px;
  min-width: 44px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
  }
  
  @media (max-width: 768px) {
    min-height: 48px;
    min-width: 48px;
    padding: 0.75rem;
  }
`;

const MobileMenuButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  color: white;
  padding: 0.625rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  display: none;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    display: flex;
    min-height: 48px;
    min-width: 48px;
    padding: 0.75rem;
    z-index: 999999;
    
    svg {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    }
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
  
  @media (max-width: 768px) {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    border-radius: 12px 12px 0 0;
    min-width: auto;
    max-height: 60vh;
    overflow-y: auto;
  }
`;

const UserInfo = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const UserName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
  letter-spacing: -0.005em;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  letter-spacing: 0;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
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
  min-height: 44px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.danger {
    color: #ff6b6b;
    
    &:hover {
      background: rgba(255, 107, 107, 0.1);
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    font-size: 1rem;
    min-height: 56px;
  }
`;

const DropdownIcon = styled.div`
  font-size: 0.875rem;
  opacity: 0.7;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
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
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const ModalTitle = styled.h3`
  color: white;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const ModalText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  line-height: 1.5;
  
  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  min-height: 44px;
  min-width: 44px;
  
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
  
  @media (max-width: 480px) {
    padding: 0.875rem 1.5rem;
    min-height: 48px;
  }
`;

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, deleteUserAccount } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    console.log('Mobile menu toggled:', newState);
    setIsMobileMenuOpen(newState);
  };

  return (
    <Nav>
      <Logo onClick={handleLogoClick}>
        <LogoIcon src="/assets/logo.png" alt="Vibesona" />
        Vibesona
      </Logo>
      
      <NavLinks isOpen={isMobileMenuOpen}>
        <NavLink to="/analyzer" active={location.pathname === '/analyzer'}>Playlist Analyzer</NavLink>
        <NavLink to="/submissions" active={location.pathname === '/submissions'}>Submissions</NavLink>
        <NavLink to="/playlists" active={location.pathname === '/playlists'}>Playlists</NavLink>
        <NavLink to="/pricing" active={location.pathname === '/pricing'}>Pricing</NavLink>
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
        
        <MobileMenuButton onClick={toggleMobileMenu} isOpen={isMobileMenuOpen}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
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
