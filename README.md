# Vibesona - AI-Powered Music Studio

A modern web application for playlist analysis, music submission, and audio production with a sleek, professional interface.

## Features

### 🎵 Playlist Analyzer
- Analyze Spotify playlists for authenticity, popularity, and freshness
- Get detailed insights about playlist composition
- View track statistics and artist diversity metrics

### 🎧 Music Studio
- Modern waveform editing interface
- Audio trimming and effects processing
- Real-time audio controls and visualization

### 📤 Submissions Dashboard
- Submit tracks to curated playlists
- Track submission statistics and status
- Search playlists by genre
- View track information and analytics

### 💰 Token System
- Purchase tokens for playlist submissions
- Transaction history and referral rewards
- Multiple token packages available

### 🔐 Authentication
- Secure Firebase authentication
- User account management
- Protected routes and features

## Tech Stack

- **Frontend**: React 18, Styled Components, Framer Motion
- **Authentication**: Firebase Auth
- **API Integration**: Spotify Web API
- **Styling**: CSS-in-JS with glassmorphism effects
- **Icons**: React Icons
- **Routing**: React Router DOM

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- Spotify Developer account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibesona
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - The Firebase configuration is already included in the code
   - Spotify API credentials are configured in the service

4. **Add Logo**
   - Place your Vibesona logo image in the `public/assets/` folder
   - Name it `logo.png`
   - The logo should be a stylized infinity symbol or wave-like icon with purple and blue gradients

5. **Start development server**
   ```bash
   npm start
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.js       # Navigation component
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── firebase/           # Firebase configuration
│   └── config.js       # Firebase setup
├── pages/              # Page components
│   ├── Home.js         # Landing page
│   ├── Analyzer.js     # Playlist analyzer
│   ├── Playlists.js    # Playlist management
│   ├── Studio.js       # Audio studio
│   ├── Submissions.js  # Submissions dashboard
│   ├── Tokens.js       # Token management
│   └── Login.js        # Authentication
├── services/           # API services
│   └── spotify.js      # Spotify API integration
├── styles/             # Global styles
│   └── GlobalStyles.js # Styled-components global styles
├── App.js              # Main app component
└── index.js            # App entry point
```

## API Configuration

### Spotify API
The app uses the Spotify Web API for:
- Playlist analysis and information
- Track details and audio features
- User authentication (can be extended)

### Firebase
Firebase is configured for:
- User authentication
- Database storage (can be extended)
- Analytics

## Deployment

### Building for Production
```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Hosting
The build folder can be deployed to any static hosting service:

1. **Traditional Web Hosting**
   - Upload the contents of the `build` folder to your web server
   - Ensure the server is configured to serve `index.html` for all routes

2. **Cloud Platforms**
   - **Vercel**: Connect your repository and deploy automatically
   - **Netlify**: Drag and drop the build folder or connect repository
   - **AWS S3**: Upload build files to S3 bucket with CloudFront
   - **Firebase Hosting**: Use `firebase deploy` after configuration

### Important Notes
- The app uses client-side routing, so your hosting provider must be configured to serve `index.html` for all routes
- Ensure CORS is properly configured if you plan to extend the API functionality
- The Spotify API credentials are client-side for demo purposes; consider moving to server-side for production

## Customization

### Styling
- Colors and gradients can be modified in `src/styles/GlobalStyles.js`
- Component-specific styles are in each component file
- The design uses a dark theme with purple/blue gradients

### Features
- Add new pages by creating components in the `pages/` directory
- Extend the Spotify service for additional API calls
- Implement additional Firebase features for data persistence

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## License
This project is for demonstration purposes. Please ensure you comply with Spotify's API terms of service and Firebase usage policies.

## Support
For questions or issues, please refer to the documentation or create an issue in the repository.
