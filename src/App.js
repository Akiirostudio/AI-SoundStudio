import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Playlists from './pages/Playlists';
import Studio from './pages/Studio';
import Submissions from './pages/Submissions';
import Tokens from './pages/Tokens';
import Login from './pages/Login';
import { GlobalStyles } from './styles/GlobalStyles';

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyles />
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/tokens" element={<Tokens />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
