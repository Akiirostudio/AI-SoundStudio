// Stripe Service for handling payments and subscriptions
export const PAYMENT_PRODUCTS = {
  BASIC: {
    id: 'basic_monthly',
    name: 'Basic Plan',
    price: 999, // $9.99 in cents
    currency: 'usd',
    interval: 'month',
    description: 'Perfect for independent artists starting their journey',
    features: [
      '10 Playlist Submissions per month',
      'Basic Analytics Dashboard',
      'Email Support',
      'Standard Processing Time'
    ]
  },
  PRO: {
    id: 'pro_monthly',
    name: 'Pro Plan',
    price: 1999, // $19.99 in cents
    currency: 'usd',
    interval: 'month',
    description: 'For serious artists ready to scale their reach',
    features: [
      '50 Playlist Submissions per month',
      'Advanced Analytics & Insights',
      'Priority Support',
      'Faster Processing Time',
      'Custom Playlist Targeting',
      'Submission History'
    ]
  },
  ENTERPRISE: {
    id: 'enterprise_monthly',
    name: 'Enterprise Plan',
    price: 4999, // $49.99 in cents
    currency: 'usd',
    interval: 'month',
    description: 'Complete solution for established artists and labels',
    features: [
      'Unlimited Playlist Submissions',
      'Premium Analytics Suite',
      '24/7 Priority Support',
      'Instant Processing',
      'Advanced Targeting Options',
      'Bulk Submission Tools',
      'Custom Integration Support',
      'Dedicated Account Manager'
    ]
  }
};

class StripeService {
  constructor() {
    // Use environment variable for Stripe publishable key
    this.stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_live_51Rcxa6R3rFm9kQcdFqta3K8KCr1JoeTL7Z9ODbdk4m6fvnFa2DvnCxSUPwoYS7TVztLD1T1Dm5IVEI6bi4Oj0WTR00m2MjmoxC';
  }

  // Format price from cents to dollars
  formatPrice(priceInCents) {
    return `$${(priceInCents / 100).toFixed(2)}`;
  }

  // Create a payment intent
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      console.log('Creating payment intent for amount:', amount);
      const response = await fetch('https://us-central1-vibe-sona.cloudfunctions.net/createPaymentIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Payment intent created:', data);
      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Create a subscription
  async createSubscription(priceId, customerId) {
    try {
      console.log('Creating subscription for price:', priceId);
      const response = await fetch('https://us-central1-vibe-sona.cloudfunctions.net/createSubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Subscription created:', data);
      return data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Confirm a payment
  async confirmPayment(paymentIntentId, paymentMethodId) {
    try {
      console.log('Confirming payment:', paymentIntentId);
      const response = await fetch('https://us-central1-vibe-sona.cloudfunctions.net/confirmPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          paymentMethodId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Payment confirmed:', data);
      return data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  // Cancel a subscription
  async cancelSubscription(subscriptionId) {
    try {
      console.log('Canceling subscription:', subscriptionId);
      const response = await fetch('https://us-central1-vibe-sona.cloudfunctions.net/cancelSubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Subscription canceled:', data);
      return data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Get subscription status
  async getSubscriptionStatus(subscriptionId) {
    try {
      console.log('Getting subscription status:', subscriptionId);
      const response = await fetch(`https://us-central1-vibe-sona.cloudfunctions.net/getSubscriptionStatus?subscriptionId=${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Subscription status:', data);
      return data;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw error;
    }
  }

  // Create customer portal session
  async createCustomerPortalSession(customerId, returnUrl) {
    try {
      console.log('Creating customer portal session for:', customerId);
      const response = await fetch('https://us-central1-vibe-sona.cloudfunctions.net/createPortalSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Portal session created:', data);
      return data.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }

  // Create Stripe Checkout session
  async createCheckoutSession(productId, userId, customerEmail) {
    try {
      console.log('createCheckoutSession called with:', { productId, userId, customerEmail });
      const product = PAYMENT_PRODUCTS[productId.toUpperCase()];
      console.log('Found product:', product);
      if (!product) {
        console.error('Product not found for ID:', productId);
        throw new Error('Invalid product ID');
      }
      const response = await fetch('https://us-central1-vibe-sona.cloudfunctions.net/createCheckoutSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          priceId: product.id,
          userId: userId,
          customerEmail: customerEmail,
          successUrl: `${window.location.origin}/pricing?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
          metadata: { productName: product.name, userId: userId }
        }),
      });
      if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
}

// Create and export a single instance
const stripeService = new StripeService();
export default stripeService;
