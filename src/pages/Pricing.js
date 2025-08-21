import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaCheck, 
  FaRocket,
  FaChartLine,
  FaCrown
} from 'react-icons/fa';
import stripeService, { PAYMENT_PRODUCTS } from '../services/stripe';

const PricingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
`;

const PricingHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.875rem;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.025em;
  line-height: 1.1;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  max-width: 500px;
  margin: 0 auto;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.5;
`;

const PlansContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PlanCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  ${props => props.featured && `
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    border: 2px solid #fff;
    transform: scale(1.05);
    
    &:hover {
      transform: scale(1.05) translateY(-10px);
    }
  `}
`;

const PlanBadge = styled.div`
  position: absolute;
  top: -10px;
  right: 20px;
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  transform: rotate(15deg);
`;

const PlanName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: -0.01em;
`;

const PlanPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const PlanPeriod = styled.span`
  font-size: 0.875rem;
  opacity: 0.7;
  font-weight: 400;
  letter-spacing: 0;
`;

const PlanDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  margin-bottom: 0.625rem;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0;
`;

const CheckIcon = styled(FaCheck)`
  color: #4CAF50;
  font-size: 0.875rem;
`;

const SubscribeButton = styled(motion.button)`
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0;

  &:hover {
    background: linear-gradient(45deg, #45a049, #4CAF50);
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const PlanIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: white;
`;

const SuccessMessage = styled.div`
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
  padding: 0.5rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

// Main Pricing Component
const Pricing = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  const plans = [
    {
      id: 'BASIC',
      icon: <FaRocket />,
      featured: false,
      name: PAYMENT_PRODUCTS.BASIC.name,
      price: PAYMENT_PRODUCTS.BASIC.price,
      currency: PAYMENT_PRODUCTS.BASIC.currency,
      interval: PAYMENT_PRODUCTS.BASIC.interval,
      features: PAYMENT_PRODUCTS.BASIC.features,
      description: PAYMENT_PRODUCTS.BASIC.description
    },
    {
      id: 'PRO',
      icon: <FaChartLine />,
      featured: true,
      name: PAYMENT_PRODUCTS.PRO.name,
      price: PAYMENT_PRODUCTS.PRO.price,
      currency: PAYMENT_PRODUCTS.PRO.currency,
      interval: PAYMENT_PRODUCTS.PRO.interval,
      features: PAYMENT_PRODUCTS.PRO.features,
      description: PAYMENT_PRODUCTS.PRO.description
    },
    {
      id: 'ENTERPRISE',
      icon: <FaCrown />,
      featured: false,
      name: PAYMENT_PRODUCTS.ENTERPRISE.name,
      price: PAYMENT_PRODUCTS.ENTERPRISE.price,
      currency: PAYMENT_PRODUCTS.ENTERPRISE.currency,
      interval: PAYMENT_PRODUCTS.ENTERPRISE.interval,
      features: PAYMENT_PRODUCTS.ENTERPRISE.features,
      description: PAYMENT_PRODUCTS.ENTERPRISE.description
    }
  ];

  const handleSubscribe = async (plan) => {
    console.log('handleSubscribe called with plan:', plan);
    console.log('Plan ID:', plan.id);
    console.log('Plan object keys:', Object.keys(plan));
    console.log('currentUser:', currentUser);
    
    if (!currentUser) {
      console.log('No current user, navigating to login');
      navigate('/login');
      return;
    }
    
    try {
      console.log('Creating checkout session...');
      // Create Stripe Checkout session
      const checkoutUrl = await stripeService.createCheckoutSession(
        plan.id, 
        currentUser.uid, 
        currentUser.email
      );
      
      console.log('Redirecting to Stripe Checkout:', checkoutUrl);
      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error creating checkout session. Please try again.');
    }
  };

  return (
    <PricingContainer>
      <PricingHeader>
        <Title>Choose Your Plan</Title>
        <Subtitle>
          Unlock premium features and take your music career to the next level with our flexible subscription plans.
        </Subtitle>
      </PricingHeader>

      <PlansContainer>
        {plans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            featured={plan.featured}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            {plan.featured && <PlanBadge>Most Popular</PlanBadge>}
            
            <PlanIcon>{plan.icon}</PlanIcon>
            <PlanName>{plan.name}</PlanName>
            <PlanPrice>
              {stripeService.formatPrice(plan.price)}
              <PlanPeriod>/{plan.interval}</PlanPeriod>
            </PlanPrice>
            <PlanDescription>{plan.description}</PlanDescription>
            
            <FeaturesList>
              {plan.features.map((feature, featureIndex) => (
                <FeatureItem key={featureIndex}>
                  <CheckIcon />
                  {feature}
                </FeatureItem>
              ))}
            </FeaturesList>

            <SubscribeButton
              onClick={() => {
                console.log('Subscribe button clicked for plan:', plan.name);
                handleSubscribe(plan);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Subscribe Now
            </SubscribeButton>
          </PlanCard>
        ))}
      </PlansContainer>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000
          }}
        >
          <SuccessMessage>{successMessage}</SuccessMessage>
        </motion.div>
      )}
    </PricingContainer>
  );
};

export default Pricing;
