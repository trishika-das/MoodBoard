import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import './CreateMoodBoard.css';

const DRAFT_KEY = 'moodboard_draft';

const CreateMoodBoard = ({ onClose, onCreated }) => {
  const [theme, setTheme] = useState('light');
  // Toggle dark/light mode
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const [formData, setFormData] = useState(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    return draft
      ? JSON.parse(draft)
      : {
          emojis: '',
          imageUrl: '',
          colorTheme: '#667eea',
          note: ''
        };
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // Giphy GIF search state
  const [gifSearch, setGifSearch] = useState('');
  const [gifResults, setGifResults] = useState([]);
  const [gifLoading, setGifLoading] = useState(false);
  const [gifError, setGifError] = useState('');
  // Giphy API search & trending
  const GIPHY_API_KEY = 'dc6zaTOxFJmzC'; // Public beta key
  const fetchTrendingGifs = async () => {
    setGifLoading(true);
    setGifError('');
    setGifResults([]);
    try {
      const res = await axios.get('http://localhost:5000/api/giphy', {
        params: {
          endpoint: 'trending',
          api_key: GIPHY_API_KEY,
          limit: 12,
          rating: 'pg'
        }
      });
      setGifResults(res.data.data || []);
    } catch (err) {
      setGifLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTrendingGifs();
  }, []);

  const handleGifSearch = async (e) => {
    e.preventDefault();
    if (!gifSearch.trim()) {
      setGifError('Please enter a search keyword.');
      fetchTrendingGifs();
      return;
    }
    setGifLoading(true);
    setGifError('');
    setGifResults([]);
    try {
      const res = await axios.get('http://localhost:5000/api/giphy', {
        params: {
          endpoint: 'search',
          api_key: GIPHY_API_KEY,
          q: gifSearch,
          limit: 12,
          rating: 'pg'
        }
      });
      setGifResults(res.data.data || []);
      if ((res.data.data || []).length === 0) setGifError('No GIFs found. Try another keyword!');
    } catch (err) {
      let message = 'Failed to fetch GIFs.';
      if (err.response) {
        message += ` [${err.response.status}] ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        message += ' (No response from server)';
      } else if (err.message) {
        message += ` (${err.message})`;
      }
      setGifError(message);
    } finally {
      setGifLoading(false);
    }
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState({});

  // Helper: Validate URL
  const isValidUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Helper: Validate form
  const validate = () => {
    if (!formData.emojis.trim()) return 'Please select at least one emoji.';
    if (!formData.note.trim()) return 'Note is required.';
    if (formData.note.length > 200) return 'Note must be 200 characters or less.';
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) return 'Please enter a valid image or GIF URL.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTouched({ emojis: true, note: true, imageUrl: true });
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/moodboards', formData);
      setSuccess('MoodBoard created successfully!');
      localStorage.removeItem(DRAFT_KEY); // Clear draft on success
      setTimeout(() => {
        setSuccess('');
        onCreated();
        onClose();
      }, 1200);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create moodboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const updated = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(updated);
    setTouched({ ...touched, [e.target.name]: true });
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
  };

  // Updated for emoji-picker-react
  const handleEmojiClick = (emojiData) => {
    const updated = {
      ...formData,
      emojis: formData.emojis + emojiData.emoji
    };
    setFormData(updated);
    setTouched({ ...touched, emojis: true });
    setShowEmojiPicker(false);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
  };

  const handleColorChange = (color) => {
    const updated = {
      ...formData,
      colorTheme: color
    };
    setFormData(updated);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
  };

  const predefinedColors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe',
    '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140',
    '#a8edea', '#fed6e3', '#ffecd2', '#fcb69f', '#ff9a9e'
  ];

  // Share MoodBoard handler
  const handleShare = () => {
    const url = window.location.origin + '/dashboard';
    navigator.clipboard.writeText(url);
    setSuccess('Link copied! Share your MoodBoard.');
    setTimeout(() => setSuccess(''), 1500);
  };

  return (
    <div className={`modal-overlay ${theme}-mode`} role="dialog" aria-modal="true" aria-label="Create MoodBoard">
      <div className={`modal-content ${theme}-mode`}>
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{position: 'absolute', top: 16, right: 16, zIndex: 10}}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'} Mode
        </button>
        <div className="modal-header">
          <h2 tabIndex={0}>Create Today's MoodBoard</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close modal">×</button>
        </div>

        <form onSubmit={handleSubmit} className={`create-form ${theme}-mode`} autoComplete="off" noValidate>
          <div className="form-group">
            <label htmlFor="emojis">Emojis <span aria-hidden="true" style={{color:'#e53e3e'}}>*</span></label>
            <div className="emoji-input">
              <input
                type="text"
                id="emojis"
                name="emojis"
                value={formData.emojis}
                onChange={(e) => setFormData({...formData, emojis: e.target.value})}
                placeholder="Select emojis or type them"
                readOnly
                aria-required="true"
                aria-invalid={touched.emojis && !formData.emojis.trim()}
                onBlur={() => setTouched({ ...touched, emojis: true })}
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="emoji-btn circle-emoji"
                aria-label="Open emoji picker"
              >
                <span className="emoji-circle" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                  color: '#fff',
                  fontSize: '1.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                }}>
                  😊
                </span>
              </button>
            </div>
            {showEmojiPicker && (
              <div className="emoji-picker-container">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme="light"
                />
              </div>
            )}
            {touched.emojis && !formData.emojis.trim() && (
              <div className="field-error">Please select at least one emoji.</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image/GIF URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Paste an image or GIF URL or use GIF search below"
              aria-invalid={touched.imageUrl && !!formData.imageUrl && !isValidUrl(formData.imageUrl)}
              onBlur={() => setTouched({ ...touched, imageUrl: true })}
              style={{marginBottom: '8px'}}
            />
            {touched.imageUrl && !!formData.imageUrl && !isValidUrl(formData.imageUrl) && (
              <div className="field-error">Please enter a valid URL.</div>
            )}
            {/* Image/GIF Preview */}
            {formData.imageUrl && isValidUrl(formData.imageUrl) && (
              <div className="image-preview" style={{marginTop: '10px'}}>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  style={{maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}
                  onError={e => {e.target.style.display='none';}}
                />
                <div style={{fontSize: '0.9em', color: '#666', marginTop: '4px'}}>Preview</div>
              </div>
            )}
            {/* Giphy GIF Search */}
            <form onSubmit={handleGifSearch} className="gif-search-bar" style={{display:'flex', gap:'8px', marginTop:'12px'}}>
              <input
                type="text"
                value={gifSearch}
                onChange={e => setGifSearch(e.target.value)}
                placeholder="Search GIFs (powered by Giphy)"
                style={{flex:1, padding:'6px 10px', borderRadius:'6px', border:'1px solid #ddd'}}
              />
              <button type="submit" className="submit-btn" style={{padding:'0 16px', minWidth:'80px'}} disabled={gifLoading}>
                {gifLoading ? 'Searching...' : 'Search'}
              </button>
              <button type="button" className="submit-btn" style={{padding:'0 12px', minWidth:'80px', background:'#f093fb', color:'#fff'}} disabled={gifLoading} onClick={fetchTrendingGifs}>
                Trending
              </button>
            </form>
            {gifError && <div className="field-error" style={{marginTop:'6px'}}>{gifError}</div>}
            {gifResults.length > 0 && (
              <div className="gif-results" style={{marginTop:'10px', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(80px,1fr))', gap:'10px'}}>
                {gifResults.map(gif => (
                  <button
                    key={gif.id}
                    type="button"
                    className="gif-thumb"
                    style={{border:'none', background:'none', padding:0, cursor:'pointer'}}
                    onClick={() => {
                      setFormData({...formData, imageUrl: gif.images.fixed_height.url});
                      setGifResults([]);
                      setGifSearch('');
                    }}
                    title="Select this GIF"
                  >
                    <img src={gif.images.fixed_height_small.url} alt={gif.title || 'GIF'} style={{width:'100%', height:'70px', objectFit:'cover', borderRadius:'6px', boxShadow:'0 1px 4px rgba(0,0,0,0.10)'}} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="colorTheme">Color Theme</label>
            <div className="color-picker">
              <input
                type="color"
                id="colorTheme"
                name="colorTheme"
                value={formData.colorTheme}
                onChange={(e) => handleColorChange(e.target.value)}
                className="color-input"
                aria-label="Pick a color theme"
              />
              <div className="color-presets">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="color-preset"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    aria-label={`Select color ${color}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="note">Note (max 200 characters) <span aria-hidden="true" style={{color:'#e53e3e'}}>*</span></label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="How are you feeling today?"
              maxLength={200}
              rows={3}
              aria-required="true"
              aria-invalid={touched.note && !formData.note.trim()}
              onBlur={() => setTouched({ ...touched, note: true })}
            />
            <div className="char-count">
              {formData.note.length}/200
            </div>
            {touched.note && !formData.note.trim() && (
              <div className="field-error">Note is required.</div>
            )}
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="error-message" role="alert">
              {error}
              <button className="dismiss-btn" aria-label="Dismiss error" onClick={() => setError('')}>×</button>
            </div>
          )}
          {success && (
            <div className="success-message" role="status">
              {success}
              <button
                className="submit-btn"
                style={{marginTop: '1rem'}}
                onClick={handleShare}
                type="button"
              >
                Share MoodBoard
              </button>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                localStorage.removeItem(DRAFT_KEY);
                setFormData({ emojis: '', imageUrl: '', colorTheme: '#667eea', note: '' });
                setTouched({});
              }}
              style={{marginLeft: '0.5rem'}}
            >
              Clear Draft
            </button>
            <button type="submit" className="submit-btn" disabled={loading} aria-busy={loading}>
              {loading ? <span className="spinner" aria-label="Loading"></span> : 'Create MoodBoard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMoodBoard;