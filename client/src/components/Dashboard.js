import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import CreateMoodBoard from './CreateMoodBoard';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [todayMoodBoard, setTodayMoodBoard] = useState(null);
  const [pastMoodBoards, setPastMoodBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    fetchMoodBoards();
    // eslint-disable-next-line
  }, []);

  const fetchMoodBoards = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/moodboards');
      const { today, past } = response.data;
      setTodayMoodBoard(today);
      setPastMoodBoards(past);
    } catch (error) {
      setError('Failed to load moodboards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Share handler for dashboard
  const shareUrl = window.location.origin + '/dashboard';
  const shareText = encodeURIComponent('Check out my MoodBoard!');

  const handleSharePlatform = (platform) => {
    let url = '';
    if (platform === 'whatsapp') {
      url = `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'email') {
      url = `mailto:?subject=MoodBoard&body=${shareText}%20${encodeURIComponent(shareUrl)}`;
    }
    window.open(url, '_blank');
    setShowShareMenu(false);
  };

  // Social media SVG icons

  return (
    <div className="dashboard-container" role="main" aria-label="MoodBoard Dashboard">
      <header className="dashboard-header" role="banner">
        <div className="header-content">
          <h1 tabIndex={0}>🎨 MoodBoard Lite</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}!</span>
            <button onClick={handleLogout} className="logout-btn" aria-label="Logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main" role="region" aria-label="MoodBoard Content">
        {loading ? (
          <div className="loading" role="status" aria-live="polite">Loading...</div>
        ) : error ? (
          <div className="error-message" role="alert">
            {error}
            <button className="dismiss-btn" aria-label="Dismiss error" onClick={() => setError('')}>×</button>
            <button className="retry-btn" onClick={fetchMoodBoards} aria-label="Retry loading">Retry</button>
          </div>
        ) : (
          <div className="dashboard-grid">
            <section className="today-section" aria-label="Today's MoodBoard">
              <h2 tabIndex={0}>Today's Mood</h2>
              {todayMoodBoard ? (
                <div className="moodboard-card today" tabIndex={0} aria-label="Today's MoodBoard">
                  <div className="moodboard-header">
                    <div className="emojis" aria-label="Emojis">{todayMoodBoard.emojis}</div>
                    <div className="date">{new Date(todayMoodBoard.date).toLocaleDateString()}</div>
                  </div>
                  {todayMoodBoard.imageUrl && (
                    <div className="moodboard-image">
                      <img src={todayMoodBoard.imageUrl} alt="Mood visual" />
                    </div>
                  )}
                  <div className="moodboard-content">
                    <div 
                      className="color-theme" 
                      style={{ backgroundColor: todayMoodBoard.colorTheme }}
                      aria-label={`Color theme: ${todayMoodBoard.colorTheme}`}
                    ></div>
                    <p className="note">{todayMoodBoard.note}</p>
                  </div>
                  <button
                    className="submit-btn"
                    style={{marginTop: '1rem'}}
                    onClick={() => setShowShareMenu(!showShareMenu)}
                  >
                    Share MoodBoard
                  </button>
                  {showShareMenu && (
                    <div className="share-menu" style={{marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
                      <button className="share-btn icon-btn" title="Share on WhatsApp" onClick={() => handleSharePlatform('whatsapp')}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="#25D366"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.637 1.934 6.627L4 29l7.373-1.934A12.96 12.96 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.91-.516-5.627-1.494l-.4-.229-4.373 1.148 1.148-4.373-.229-.4A10.96 10.96 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.373-7.627c-.293-.146-1.727-.852-1.994-.949-.267-.098-.461-.146-.654.146-.195.293-.752.949-.922 1.146-.17.195-.341.22-.634.073-.293-.146-1.236-.455-2.355-1.449-.87-.775-1.457-1.732-1.631-2.025-.171-.293-.018-.45.128-.596.131-.13.293-.341.439-.512.146-.171.195-.293.293-.488.098-.195.049-.366-.024-.512-.073-.146-.654-1.584-.896-2.168-.237-.57-.478-.493-.654-.502-.17-.007-.366-.009-.561-.009-.195 0-.512.073-.78.366-.267.293-1.02 1.001-1.02 2.439 0 1.438 1.045 2.827 1.191 3.022.146.195 2.057 3.143 5.001 4.276.7.302 1.245.482 1.67.616.701.224 1.34.192 1.844.117.563-.084 1.727-.704 1.972-1.384.244-.68.244-1.263.171-1.384-.073-.122-.268-.195-.561-.341z"/></svg>
                      </button>
                      <button className="share-btn icon-btn" title="Share on Facebook" onClick={() => handleSharePlatform('facebook')}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="#1877F3"><path d="M29 0H3C1.343 0 0 1.343 0 3v26c0 1.657 1.343 3 3 3h13V20h-4v-5h4v-3.5C16 8.57 18.57 6 22.5 6c1.104 0 2 .896 2 2v4h-3c-.553 0-1 .447-1 1v3h4l-1 5h-3v12h5c1.657 0 3-1.343 3-3V3c0-1.657-1.343-3-3-3z"/></svg>
                      </button>
                      <button className="share-btn icon-btn" title="Share on Twitter" onClick={() => handleSharePlatform('twitter')}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="#1DA1F2"><path d="M32 6.076a13.14 13.14 0 01-3.769 1.031A6.601 6.601 0 0031.115 4.1a13.19 13.19 0 01-4.169 1.594A6.563 6.563 0 0022.155 3c-3.626 0-6.563 2.938-6.563 6.563 0 .514.058 1.016.17 1.496C10.272 10.85 5.444 8.13 2.228 4.161c-.564.969-.888 2.096-.888 3.301 0 2.277 1.159 4.287 2.921 5.463A6.548 6.548 0 01.64 11.1v.083c0 3.181 2.263 5.834 5.266 6.437-.552.15-1.134.23-1.735.23-.425 0-.837-.041-1.24-.117.838 2.615 3.266 4.516 6.145 4.568A13.18 13.18 0 010 28.13a18.616 18.616 0 0010.063 2.948c12.072 0 18.68-10.004 18.68-18.68 0-.285-.007-.568-.02-.85A13.348 13.348 0 0032 6.076z"/></svg>
                      </button>
                      <button className="share-btn icon-btn" title="Share via Email" onClick={() => handleSharePlatform('email')}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="#EA4335"><path d="M28 4H4c-1.104 0-2 .896-2 2v20c0 1.104.896 2 2 2h24c1.104 0 2-.896 2-2V6c0-1.104-.896-2-2-2zm0 2v.511l-12 9.021-12-9.021V6h24zm0 20H4V8.489l12 9.021 12-9.021V26z"/></svg>
                      </button>
                      <button className="share-btn icon-btn" title="Copy Link" onClick={() => {navigator.clipboard.writeText(shareUrl); setShowShareMenu(false);}}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="#6C63FF"><path d="M17.657 14.343a6 6 0 010 8.485l-4.242 4.242a6 6 0 01-8.485-8.485l2.121-2.121a1 1 0 011.414 1.414l-2.121 2.121a4 4 0 005.657 5.657l4.242-4.242a4 4 0 00-5.657-5.657 1 1 0 01-1.414-1.414 6 6 0 018.485 0zm-3.535-3.535a1 1 0 010 1.414 4 4 0 00-5.657 5.657l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.121a6 6 0 018.485-8.485l4.242 4.242a6 6 0 01-8.485 8.485 1 1 0 010-1.414 4 4 0 005.657-5.657l-4.242-4.242a4 4 0 015.657-5.657z"/></svg>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="create-moodboard">
                  <p>No mood board for today yet!</p>
                  <button 
                    onClick={() => setShowCreate(true)}
                    className="create-btn"
                    aria-label="Create today's MoodBoard"
                  >
                    Create Today's MoodBoard
                  </button>
                </div>
              )}
            </section>

            <section className="history-section" aria-label="Past MoodBoards">
              <h2 tabIndex={0}>Past MoodBoards</h2>
              <div className="moodboard-timeline">
                {pastMoodBoards.length > 0 ? (
                  pastMoodBoards.map((moodboard) => (
                    <div key={moodboard._id} className="moodboard-card past" tabIndex={0} aria-label="Past MoodBoard">
                      <div className="moodboard-header">
                        <div className="emojis" aria-label="Emojis">{moodboard.emojis}</div>
                        <div className="date">
                          {new Date(moodboard.date).toLocaleDateString()}
                        </div>
                      </div>
                      {moodboard.imageUrl && (
                        <div className="moodboard-image">
                          <img src={moodboard.imageUrl} alt="Mood visual" />
                        </div>
                      )}
                      <div className="moodboard-content">
                        <div 
                          className="color-theme" 
                          style={{ backgroundColor: moodboard.colorTheme }}
                          aria-label={`Color theme: ${moodboard.colorTheme}`}
                        ></div>
                        <p className="note">{moodboard.note}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-moodboards">No past mood boards yet. Your moodboard history will appear here!</p>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Render modal at top level for proper overlay */}
      {showCreate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.18)'
        }}>
        <div style={{
          minWidth: '380px',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '88vh',
          marginLeft: '16px',
          marginRight: '16px',
          padding: '24px 20px',
          overflowY: 'auto',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          borderRadius: '14px',
          background: '#fff',
        }}>
            <CreateMoodBoard 
              onClose={() => setShowCreate(false)}
              onCreated={fetchMoodBoards}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;