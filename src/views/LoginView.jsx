import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const currentRole = ROLES.find(r => r.id === selectedRoleId) || ROLES[0];


  const handleLoginSubmit = (e) => {
    e.preventDefault();
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
    }, 600);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setResetEmailSent(true);
    }, 600);
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
                    <User size={18} className="input-icon-left" />
                    <input
                      type="email"
                      className="login-input"
                      placeholder="Enter your register mail here"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                    <div className="toggle-password-btn" style={{ pointerEvents: 'none' }}>
                      <EyeOff size={18} />
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
                  <ShieldCheck size={18} className="shield-icon" />
                  <span>Secured by TechGy Link. End-to-end encrypted connection.</span>
                </div>
              </form>
            </div>
          ) : (
            /* Forgot Password Success State */
            <div className="login-card-box">
              <div className="forgot-success-badge">
                <CheckCircle2 size={36} color="#16A34A" />
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
                <ShieldCheck size={18} className="shield-icon" />
                <span>Secured by TechGy Link. End-to-end encrypted connection.</span>
              </div>
            </div>
          )
        ) : (
          /* ================= Standard Login View ================= */
          <div className="login-card-box">
            <h1 className="login-title">{currentRole.title}</h1>
            <p className="login-subtitle">{currentRole.desc}</p>

            <form onSubmit={handleLoginSubmit} className="login-form">
              {/* Login ID Input */}
              <div className="form-group">
                <label className="form-label">Login ID</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon-left" />
                  <input
                    type="text"
                    className="login-input"
                    placeholder="Enter your assigned ID"
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
                  <Lock size={18} className="input-icon-left" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="login-input"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="forgot-password-row">
                <button
                  type="button"
                  className="forgot-link-btn"
                  onClick={() => {
                    setResetEmail(loginId);
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
                  <span>Login</span>
                )}
              </button>

              {/* Security Encrypted Footer Badge */}
              <div className="security-notice-footer">
                <ShieldCheck size={18} className="shield-icon" />
                <span>Secured by TechGy Link. End-to-end encrypted connection.</span>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
