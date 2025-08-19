import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCoins, FaCreditCard, FaHistory, FaGift } from 'react-icons/fa';

const TokensContainer = styled.div`
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

const TokenBalance = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  margin: 0 auto 3rem;
  z-index: 1;
`;

const BalanceIcon = styled.div`
  font-size: 3rem;
  color: #ffd700;
  margin-bottom: 1rem;
`;

const BalanceAmount = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const BalanceLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
`;

const TokensGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 1;
`;

const TokenCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
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

const CardIcon = styled.div`
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 1rem;
`;

const TokenPackages = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const PackageCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
  
  &.popular {
    border-color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
  }
`;

const PackageTokens = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const PackagePrice = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const PackageLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
`;

const PopularBadge = styled.div`
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #000;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  display: inline-block;
`;

const PurchaseButton = styled(motion.button)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const HistoryList = styled.div`
  margin-top: 2rem;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const HistoryInfo = styled.div`
  text-align: left;
`;

const HistoryTitle = styled.div`
  color: white;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const HistoryDate = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
`;

const HistoryAmount = styled.div`
  color: #667eea;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  padding: 2rem;
`;

function Tokens() {
  const [currentTokens, setCurrentTokens] = useState(150);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const packages = [
    { id: 1, tokens: 50, price: 9.99, label: 'Starter Pack' },
    { id: 2, tokens: 150, price: 24.99, label: 'Popular Pack', popular: true },
    { id: 3, tokens: 500, price: 79.99, label: 'Pro Pack' },
    { id: 4, tokens: 1000, price: 149.99, label: 'Enterprise Pack' }
  ];

  const history = [
    { id: 1, title: 'Purchased 150 tokens', date: '2024-01-15', amount: '+150' },
    { id: 2, title: 'Submitted to Pop Playlist', date: '2024-01-14', amount: '-5' },
    { id: 3, title: 'Submitted to Rock Playlist', date: '2024-01-13', amount: '-5' },
    { id: 4, title: 'Purchased 50 tokens', date: '2024-01-10', amount: '+50' }
  ];

  const handlePurchase = (pkg) => {
    setSelectedPackage(pkg);
    // Simulate purchase
    setTimeout(() => {
      setCurrentTokens(prev => prev + pkg.tokens);
      setSelectedPackage(null);
    }, 1000);
  };

  return (
    <TokensContainer>
      <BackgroundPattern />
      
      <Header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title>Tokens</Title>
        <Subtitle>Purchase tokens to submit your music to curated playlists.</Subtitle>
      </Header>

      <TokenBalance
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <BalanceIcon>
          <FaCoins />
        </BalanceIcon>
        <BalanceAmount>{currentTokens}</BalanceAmount>
        <BalanceLabel>Available Tokens</BalanceLabel>
      </TokenBalance>

      <TokensGrid>
        <TokenCard
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <CardIcon>
            <FaCreditCard />
          </CardIcon>
          <CardTitle>Purchase Tokens</CardTitle>
          <TokenPackages>
            {packages.map(pkg => (
              <PackageCard 
                key={pkg.id} 
                className={pkg.popular ? 'popular' : ''}
                onClick={() => handlePurchase(pkg)}
              >
                {pkg.popular && <PopularBadge>MOST POPULAR</PopularBadge>}
                <PackageTokens>{pkg.tokens}</PackageTokens>
                <PackagePrice>${pkg.price}</PackagePrice>
                <PackageLabel>{pkg.label}</PackageLabel>
                <PurchaseButton
                  disabled={selectedPackage?.id === pkg.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {selectedPackage?.id === pkg.id ? 'Processing...' : 'Purchase'}
                </PurchaseButton>
              </PackageCard>
            ))}
          </TokenPackages>
        </TokenCard>

        <TokenCard
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <CardIcon>
            <FaHistory />
          </CardIcon>
          <CardTitle>Transaction History</CardTitle>
          <HistoryList>
            {history.length > 0 ? (
              history.map(item => (
                <HistoryItem key={item.id}>
                  <HistoryInfo>
                    <HistoryTitle>{item.title}</HistoryTitle>
                    <HistoryDate>{item.date}</HistoryDate>
                  </HistoryInfo>
                  <HistoryAmount>{item.amount}</HistoryAmount>
                </HistoryItem>
              ))
            ) : (
              <EmptyState>
                <div>No transactions yet</div>
                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Purchase tokens to get started
                </div>
              </EmptyState>
            )}
          </HistoryList>
        </TokenCard>

        <TokenCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <CardIcon>
            <FaGift />
          </CardIcon>
          <CardTitle>Referral Rewards</CardTitle>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem' }}>
            Invite friends and earn free tokens for every successful referral.
          </div>
          <PurchaseButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Referral Link
          </PurchaseButton>
        </TokenCard>
      </TokensGrid>
    </TokensContainer>
  );
}

export default Tokens;
