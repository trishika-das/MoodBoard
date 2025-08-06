import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Helper: Validate email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Helper: Validate form
  const validate = () => {
    if (!formData.email.trim()) return 'Email is required.';
    if (!isValidEmail(formData.email)) return 'Please enter a valid email address.';
    if (!formData.password.trim()) return 'Password is required.';
    if (!isLogin && !formData.name.trim()) return 'Name is required.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTouched({ name: true, email: true, password: true });
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.name, formData.email, formData.password);
      }
      if (result.success) {
        if (isLogin) {
          navigate('/dashboard');
        } else {
          setSuccess('Registration successful! You can now log in.');
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '' });
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setTouched({ ...touched, [e.target.name]: true });
  };

  return (
    <div className="auth-container" role="main" aria-label="Authentication">
      <div className="auth-card">
        <div className="auth-header">
          <h1 tabIndex={0}>🎨 MoodBoard Lite</h1>
          <p>Express your daily mood through colors, emojis, and creativity</p>
        </div>

        <div className="auth-tabs" role="tablist">
          <button
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            role="tab"
            aria-selected={isLogin}
            tabIndex={0}
          >
            Login
          </button>
          <button
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            role="tab"
            aria-selected={!isLogin}
            tabIndex={0}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off" noValidate>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name <span aria-hidden="true" style={{color:'#e53e3e'}}>*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Enter your name"
                aria-required={!isLogin}
                aria-invalid={touched.name && !formData.name.trim()}
                onBlur={() => setTouched({ ...touched, name: true })}
              />
              {touched.name && !formData.name.trim() && (
                <div className="field-error">Name is required.</div>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email <span aria-hidden="true" style={{color:'#e53e3e'}}>*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              aria-required="true"
              aria-invalid={touched.email && (!formData.email.trim() || !isValidEmail(formData.email))}
              onBlur={() => setTouched({ ...touched, email: true })}
            />
            {touched.email && !formData.email.trim() && (
              <div className="field-error">Email is required.</div>
            )}
            {touched.email && formData.email && !isValidEmail(formData.email) && (
              <div className="field-error">Please enter a valid email address.</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password <span aria-hidden="true" style={{color:'#e53e3e'}}>*</span></label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              aria-required="true"
              aria-invalid={touched.password && (!formData.password.trim() || formData.password.length < 6)}
              onBlur={() => setTouched({ ...touched, password: true })}
            />
            {touched.password && !formData.password.trim() && (
              <div className="field-error">Password is required.</div>
            )}
            {touched.password && formData.password && formData.password.length < 6 && (
              <div className="field-error">Password must be at least 6 characters.</div>
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
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading} aria-busy={loading}>
            {loading ? <span className="spinner" aria-label="Loading"></span> : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 