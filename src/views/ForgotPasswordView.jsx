import React, { useState } from 'react';
import { LuUser, LuEyeOff, LuShieldCheck, LuCircleCheck } from 'react-icons/lu';

export default function ForgotPasswordView({ onBackToLogin }) {
  const [resetEmail, setResetEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

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

      {/* Top Header Logo - Positioned at Top Right */}
      <header className="login-header">
        <div className="brand-logo-container">
          <img src="/main-logo.png" alt="TechGy Link Logo" className="techgy-logo-img" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="login-content-container">
        {!resetEmailSent ? (
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

              {/* Submit Button */}
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
              {onBackToLogin && (
                <div className="forgot-back-link-row">
                  <button
                    type="button"
                    className="forgot-link-btn"
                    onClick={onBackToLogin}
                  >
                    Back to Login
                  </button>
                </div>
              )}

              {/* Security Encrypted Footer Badge */}
              <div className="security-notice-footer">
                <LuShieldCheck size={18} className="shield-icon" />
                <span>Secured by TechGy Link. End-to-end encrypted connection.</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="login-card-box">
            <div className="forgot-success-badge" style={{ marginBottom: '16px' }}>
              <LuCircleCheck size={44} color="#16A34A" />
            </div>
            <h1 className="login-title">Temporary Password Sent!</h1>
            <p className="login-subtitle">
              We have dispatched a temporary password to <strong>{resetEmail}</strong>. Please check your inbox to access your account.
            </p>

            <button
              type="button"
              className="login-submit-btn"
              onClick={onBackToLogin ? onBackToLogin : () => setResetEmailSent(false)}
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
              <span>Secured by TechGy Link. End-to-end encrypted connection.</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
