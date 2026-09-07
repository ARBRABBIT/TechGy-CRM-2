import React, { useState } from 'react';
import {
  LuUser,
  LuLock,
  LuEye,
  LuEyeOff,
  LuShieldCheck,
  LuCircleCheck
} from 'react-icons/lu';

const ROLES = [
  { id: 'admin', title: 'Sales Admin', email: 'admin@techgy.com', desc: 'Secure access for authorized Sales Admin. Please authenticate to continue.' },
  { id: 'rep', title: 'Sales Rep', email: 'rajesh@techgy.com', desc: 'Personalized workspace for Sales Representatives and deal tracking.' },
  { id: 'manager', title: 'Sales Manager', email: 'manager@techgy.com', desc: 'Executive dashboard, team activity tracking, and commercial pipeline access.' }
];

export default function LoginView({ onLoginSuccess, initialMode = 'login' }) {
  // Support URL view param (?view=forgot or ?view=login) or fallback to initialMode
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('view');
      if (param === 'login') return 'login';
      if (param === 'forgot') return 'forgot';
    }
    return initialMode;
  });

  const [selectedRoleId, setSelectedRoleId] = useState('admin');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const currentRole = ROLES.find(r => r.id === selectedRoleId) || ROLES[0];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!password || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onLoginSuccess) {
        onLoginSuccess({
          role: currentRole.title,
          email: loginId || currentRole.email,
          name: currentRole.id === 'admin' ? 'System Administrator' : (currentRole.id === 'rep' ? 'Rajesh Sharma' : 'Priya Patel')
        });
      }
    }, 500);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setResetEmailSent(true);
    }, 500);
  };

  return (
    <div className="techgy-login-wrapper">
      {/* Full Resolution Login Background Image */}
      <img src="/login-bg.png" alt="Login Background" className="login-full-bg-img" />

      {/* Bigger Logo SVG graphic starting from middle of screen */}
      <div className="login-bigger-logo-svg">
        <img src="/logo.svg" alt="TechGy Bigger Logo Graphic" />
      </div>

      {/* Top Header Logo positioned at top-right */}
      <header className="login-header">
        <div className="brand-logo-container">
          <img src="/main-logo.png" alt="TechGy Link Logo" className="techgy-logo-img" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="login-content-container">
        {viewMode === 'forgot' ? (
          /* ================= Forgot Password View ================= */
          !resetEmailSent ? (
            <div className="login-card-box">
              <h1 className="login-title">Forgot your password?</h1>
              <p className="login-subtitle">Enter your registered mail to receive a temporary password</p>

              <form onSubmit={handleForgotSubmit} className="login-form">
                {/* Registered Email Input */}
                <div className="form-group">
                  <label className="form-label">Enter registered mail</label>
                  <div className="input-with-icon">
                    <LuUser size={18} className="input-icon-left" />
                    <input
                      type="email"
                      className="login-input"
                      placeholder="Enter your register mail here"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                    <div className="toggle-password-btn" style={{ pointerEvents: 'none' }}>
                      <LuEyeOff size={18} />
                    </div>
                  </div>
                </div>

                {/* Submit Send password Button */}
                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={isSubmitting}
                  style={{ marginTop: '32px' }}
                >
                  {isSubmitting ? (
                    <span className="btn-loading-text">Sending password...</span>
                  ) : (
                    <span>Send password</span>
                  )}
                </button>

                {/* Back to Login Link */}
                <div className="forgot-back-link-row">
                  <button
                    type="button"
                    className="forgot-link-btn"
                    onClick={() => {
                      setViewMode('login');
                      setResetEmailSent(false);
                    }}
                  >
                    Back to Login
                  </button>
                </div>

                {/* Security Encrypted Footer Badge */}
                <div className="security-notice-footer">
                  <LuShieldCheck size={18} className="shield-icon" />
                  <span>Secured by TechGy Link. End-to-end encrypted connection.</span>
                </div>
              </form>
            </div>
          ) : (
            /* Forgot Password Success State */
            <div className="login-card-box">
              <div className="forgot-success-badge">
                <LuCircleCheck size={36} color="#16A34A" />
              </div>
              <h1 className="login-title">Temporary Password Sent!</h1>
              <p className="login-subtitle">
                We have dispatched a temporary password to <strong>{resetEmail}</strong>. Please check your inbox to access your account.
              </p>

              <button
                type="button"
                className="login-submit-btn"
                onClick={() => {
                  setViewMode('login');
                  setResetEmailSent(false);
                }}
              >
                Back to Login
              </button>

              <div className="forgot-back-link-row">
                <button
                  type="button"
                  className="forgot-link-btn"
                  onClick={() => setResetEmailSent(false)}
                >
                  Didn't receive email? Send again
                </button>
              </div>

              <div className="security-notice-footer">
                <LuShieldCheck size={18} className="shield-icon" />
                <span>TechGy Link Enterprise Workspace • Protected CRM Session</span>
              </div>
            </div>
          )
        ) : (
          /* ================= Standard Login View ================= */
          <div className="login-card-box">
            {/* Role Switcher Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
              {ROLES.map(role => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    setSelectedRoleId(role.id);
                    setLoginId(role.email);
                    setErrorMessage('');
                  }}
                  style={{
                    flex: 1,
                    border: 'none',
                    padding: '0.35rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: selectedRoleId === role.id ? 700 : 500,
                    backgroundColor: selectedRoleId === role.id ? '#FFFFFF' : 'transparent',
                    color: selectedRoleId === role.id ? '#063669' : '#557396',
                    boxShadow: selectedRoleId === role.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {role.title.replace(' Access', '')}
                </button>
              ))}
            </div>

            <h1 className="login-title">{currentRole.title}</h1>
            <p className="login-subtitle">{currentRole.desc}</p>

            {errorMessage && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 500 }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="login-form">
              {/* Login ID Input */}
              <div className="form-group">
                <label className="form-label">Login ID</label>
                <div className="input-with-icon">
                  <LuUser size={18} className="input-icon-left" />
                  <input
                    type="text"
                    className="login-input"
                    placeholder="Enter your registered login ID"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-with-icon">
                  <LuLock size={18} className="input-icon-left" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="login-input"
                    placeholder="Enter your secret password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="forgot-password-row">
                <button
                  type="button"
                  className="forgot-link-btn"
                  onClick={() => {
                    setResetEmail(loginId || currentRole.email);
                    setResetEmailSent(false);
                    setViewMode('forgot');
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Login Button */}
              <button
                type="submit"
                className="login-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="btn-loading-text">Authenticating...</span>
                ) : (
                  <span>Login to Workspace</span>
                )}
              </button>

              {/* Security Encrypted Footer Badge */}
              <div className="security-notice-footer">
                <LuShieldCheck size={18} className="shield-icon" />
                <span>TechGy Link Enterprise Workspace • Protected CRM Session</span>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
