import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%);
    background-attachment: fixed;
    min-height: 100vh;
    color: white;
    overflow-x: hidden;
    font-size: 14px;
    line-height: 1.5;
    letter-spacing: -0.01em;
    /* Mobile touch improvements */
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Enable text selection for specific elements */
  p, h1, h2, h3, h4, h5, h6, span, div {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  .App {
    min-height: 100vh;
    position: relative;
  }

  /* Apple Design Award Typography System */
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.015em;
    margin-bottom: 0.875rem;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
    margin-bottom: 0.75rem;
  }

  h4 {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: -0.005em;
    margin-bottom: 0.625rem;
  }

  h5 {
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: 0;
    margin-bottom: 0.5rem;
  }

  h6 {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: 0;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.875rem;
    line-height: 1.6;
    letter-spacing: 0;
    margin-bottom: 1rem;
    font-weight: 400;
  }

  .text-xs {
    font-size: 0.75rem;
    line-height: 1.4;
    letter-spacing: 0.01em;
  }

  .text-sm {
    font-size: 0.875rem;
    line-height: 1.5;
    letter-spacing: 0;
  }

  .text-base {
    font-size: 1rem;
    line-height: 1.5;
    letter-spacing: -0.005em;
  }

  .text-lg {
    font-size: 1.125rem;
    line-height: 1.4;
    letter-spacing: -0.01em;
  }

  .text-xl {
    font-size: 1.25rem;
    line-height: 1.3;
    letter-spacing: -0.015em;
  }

  .text-2xl {
    font-size: 1.5rem;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .text-3xl {
    font-size: 1.875rem;
    line-height: 1.1;
    letter-spacing: -0.025em;
  }

  .text-4xl {
    font-size: 2.25rem;
    line-height: 1.1;
    letter-spacing: -0.03em;
  }

  .text-5xl {
    font-size: 3rem;
    line-height: 1;
    letter-spacing: -0.035em;
  }

  /* Font weights */
  .font-light {
    font-weight: 300;
  }

  .font-normal {
    font-weight: 400;
  }

  .font-medium {
    font-weight: 500;
  }

  .font-semibold {
    font-weight: 600;
  }

  .font-bold {
    font-weight: 700;
  }

  .font-extrabold {
    font-weight: 800;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #667eea, #764ba2);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #764ba2, #667eea);
  }

  /* Selection styles */
  ::selection {
    background: rgba(102, 126, 234, 0.3);
    color: white;
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  /* Button reset */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0;
    /* Mobile touch improvements */
    min-height: 44px;
    min-width: 44px;
    touch-action: manipulation;
  }

  /* Input reset */
  input, textarea, select {
    font-family: inherit;
    border: none;
    outline: none;
    font-size: 0.875rem;
    font-weight: 400;
    letter-spacing: 0;
    /* Mobile input improvements */
    -webkit-appearance: none;
    border-radius: 0;
    min-height: 44px;
    touch-action: manipulation;
  }

  /* Link reset */
  a {
    text-decoration: none;
    color: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0;
    /* Mobile touch improvements */
    min-height: 44px;
    min-width: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
  }

  /* Glassmorphism effect */
  .glass {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
  }

  /* Gradient text */
  .gradient-text {
    background: linear-gradient(45deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Gradient button */
  .gradient-button {
    background: linear-gradient(45deg, #667eea, #764ba2);
    border: none;
    border-radius: 12px;
    color: white;
    font-weight: 500;
    font-size: 0.875rem;
    padding: 0.75rem 1.5rem;
    transition: all 0.3s ease;
    letter-spacing: 0;
    min-height: 44px;
    min-width: 44px;
    touch-action: manipulation;
  }

  .gradient-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  /* Animation classes */
  .fade-in {
    animation: fadeIn 0.6s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .slide-up {
    animation: slideUp 0.8s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive utilities */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* Mobile-first responsive design */
  @media (max-width: 1024px) {
    .container {
      padding: 0 16px;
    }
  }

  @media (max-width: 768px) {
    body {
      font-size: 13px;
    }
    
    h1 {
      font-size: 2rem;
      line-height: 1.2;
    }
    
    h2 {
      font-size: 1.75rem;
      line-height: 1.3;
    }
    
    h3 {
      font-size: 1.375rem;
      line-height: 1.4;
    }
    
    h4 {
      font-size: 1.125rem;
      line-height: 1.4;
    }
    
    .container {
      padding: 0 16px;
    }

    /* Mobile-specific improvements */
    button, a {
      min-height: 48px;
      min-width: 48px;
    }

    input, textarea, select {
      min-height: 48px;
      font-size: 16px; /* Prevents zoom on iOS */
    }

    /* Mobile scrollbar */
    ::-webkit-scrollbar {
      width: 4px;
    }
  }

  @media (max-width: 480px) {
    body {
      font-size: 12px;
    }
    
    h1 {
      font-size: 1.75rem;
      line-height: 1.3;
    }
    
    h2 {
      font-size: 1.5rem;
      line-height: 1.4;
    }
    
    h3 {
      font-size: 1.25rem;
      line-height: 1.4;
    }

    h4 {
      font-size: 1rem;
      line-height: 1.4;
    }
    
    .container {
      padding: 0 12px;
    }

    /* Small mobile improvements */
    button, a {
      min-height: 44px;
      min-width: 44px;
    }

    input, textarea, select {
      min-height: 44px;
    }
  }

  @media (max-width: 360px) {
    body {
      font-size: 11px;
    }
    
    h1 {
      font-size: 1.5rem;
    }
    
    h2 {
      font-size: 1.25rem;
    }
    
    h3 {
      font-size: 1.125rem;
    }
    
    .container {
      padding: 0 8px;
    }
  }

  /* Landscape mobile optimizations */
  @media (max-height: 500px) and (orientation: landscape) {
    body {
      font-size: 12px;
    }
    
    .container {
      padding: 0 12px;
    }
  }

  /* High DPI displays */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    /* Ensure crisp rendering on retina displays */
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    /* Already optimized for dark mode */
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
