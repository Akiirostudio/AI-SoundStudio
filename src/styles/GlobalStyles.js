import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%);
    background-attachment: fixed;
    min-height: 100vh;
    color: white;
    overflow-x: hidden;
  }

  .App {
    min-height: 100vh;
    position: relative;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #667eea, #764ba2);
    border-radius: 4px;
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
  }

  /* Input reset */
  input, textarea, select {
    font-family: inherit;
    border: none;
    outline: none;
  }

  /* Link reset */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* Glassmorphism effect */
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
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
    border-radius: 8px;
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
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

  @media (max-width: 768px) {
    .container {
      padding: 0 16px;
    }
  }
`;
