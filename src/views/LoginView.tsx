import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuUser,
  LuLock,
  LuEye,
  LuEyeOff,
  LuShieldCheck,
  LuMail,
  LuMailCheck,
  LuArrowRight,
  LuArrowLeft,
  LuLoaderCircle,
  LuKanban,
  LuUsers,
  LuCalendarClock,
  LuCircleAlert
} from 'react-icons/lu';

const ROLES = [
  { id: 'admin', title: 'Sales Admin', email: 'admin@techgy.com', name: 'System Administrator', desc: 'Secure access for authorized Sales Admins. Sign in to manage teams, leads and master data.' },
  { id: 'head', title: 'Sales Head', email: 'head@techgy.com', name: 'Rajesh Sharma', desc: 'Track your team’s activity, pipeline progress and commercial performance.' },
  { id: 'executive', title: 'Sales Executive', email: 'executive@techgy.com', name: 'Rahul Verma', desc: 'Your personal workspace for assigned leads, follow-ups and deal tracking.' }
];

const FEATURES = [
  { icon: LuKanban, title: 'Lead pipeline', text: 'Every stage from first enquiry to close, in one view.' },
  { icon: LuUsers, title: 'Team performance', text: 'Sales heads see their executives’ activity as it happens.' },
  { icon: LuCalendarClock, title: 'Follow-ups', text: 'Due-today and overdue reminders so nothing slips.' }
];

// Card content staggers in; each direct child uses `item`
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
};

function Field({ id, label, icon: Icon, children }) {
  return (
    <motion.div className="auth-field" variants={item}>
      <label htmlFor={id} className="auth-label">{label}</label>
      <div className="auth-input-wrap">
        <Icon size={18} className="auth-input-icon" aria-hidden="true" />
        {children}
      </div>
    </motion.div>
  );
}

// Wrapper animates in; the button itself stays free for CSS hover/press transforms
function SubmitButton({ busy, busyText, children }) {
  return (
    <motion.div variants={item}>
      <button type="submit" className="auth-submit" disabled={busy}>
        {busy ? (
          <>
            <LuLoaderCircle size={18} className="auth-spin" aria-hidden="true" />
            <span>{busyText}</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            <LuArrowRight size={18} className="auth-submit-arrow" aria-hidden="true" />
          </>
        )}
      </button>
    </motion.div>
  );
}

export default function LoginView({ onLoginSuccess, initialMode = 'login' }) {
  // Support URL view param (?view=forgot or ?view=login) or fallback to initialMode
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('view');
      if (param === 'login' || param === 'forgot') return param;
    }
    return initialMode;
  });

  const [selectedRoleId, setSelectedRoleId] = useState('admin');
  const [loginId, setLoginId] = useState(ROLES[0].email);
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
      onLoginSuccess?.({
        role: currentRole.title,
        email: loginId || currentRole.email,
        name: currentRole.name
      });
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

  const backToLogin = () => {
    setViewMode('login');
    setResetEmailSent(false);
  };

  const viewKey = viewMode === 'forgot' ? (resetEmailSent ? 'sent' : 'forgot') : 'login';

  return (
    <div className="auth-page">
      {/* ================= Form panel ================= */}
      <section className="auth-form-panel">
        <header className="auth-brand">
          <img src="/brand-logo.png" alt="TechGy Link" className="auth-logo" />
        </header>

        <main className="auth-form-wrap">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewKey}
              className="auth-card"
              variants={stagger}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {viewKey === 'login' && (
                <>
                  <motion.div className="auth-roles" role="tablist" aria-label="Sign in as" variants={item}>
                    {ROLES.map(role => {
                      const active = role.id === selectedRoleId;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          className={`auth-role ${active ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedRoleId(role.id);
                            setLoginId(role.email);
                            setErrorMessage('');
                          }}
                        >
                          {active && (
                            <motion.span
                              layoutId="auth-role-indicator"
                              className="auth-role-indicator"
                              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                            />
                          )}
                          <span className="auth-role-label">{role.title}</span>
                        </button>
                      );
                    })}
                  </motion.div>

                  <motion.h1 className="auth-title" variants={item}>Welcome back</motion.h1>
                  <motion.p className="auth-subtitle" variants={item}>{currentRole.desc}</motion.p>

                  <AnimatePresence>
                    {errorMessage && (
                      <motion.div
                        className="auth-error"
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto', x: [0, -6, 6, -4, 4, 0] }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        <LuCircleAlert size={16} aria-hidden="true" />
                        <span>{errorMessage}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleLoginSubmit} className="auth-form">
                    <Field id="login-id" label="Login ID" icon={LuUser}>
                      <input
                        id="login-id"
                        type="text"
                        className="auth-input"
                        placeholder="name@techgy.com"
                        autoComplete="username"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        required
                      />
                    </Field>

                    <Field id="login-password" label="Password" icon={LuLock}>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        className="auth-input has-action"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="auth-input-action"
                        onClick={() => setShowPassword(v => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                      </button>
                    </Field>

                    <motion.div className="auth-row-end" variants={item}>
                      <button
                        type="button"
                        className="auth-link"
                        onClick={() => {
                          setResetEmail(loginId || currentRole.email);
                          setResetEmailSent(false);
                          setViewMode('forgot');
                        }}
                      >
                        Forgot password?
                      </button>
                    </motion.div>

                    <SubmitButton busy={isSubmitting} busyText="Signing in…">Sign in to workspace</SubmitButton>
                  </form>
                </>
              )}

              {viewKey === 'forgot' && (
                <>
                  <motion.button type="button" className="auth-back" onClick={backToLogin} variants={item}>
                    <LuArrowLeft size={16} aria-hidden="true" />
                    <span>Back to sign in</span>
                  </motion.button>
                  <motion.h1 className="auth-title" variants={item}>Reset your password</motion.h1>
                  <motion.p className="auth-subtitle" variants={item}>
                    Enter your registered email and we’ll send you a temporary password.
                  </motion.p>

                  <form onSubmit={handleForgotSubmit} className="auth-form">
                    <Field id="reset-email" label="Registered email" icon={LuMail}>
                      <input
                        id="reset-email"
                        type="email"
                        className="auth-input"
                        placeholder="name@techgy.com"
                        autoComplete="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </Field>
                    <SubmitButton busy={isSubmitting} busyText="Sending…">Send temporary password</SubmitButton>
                  </form>
                </>
              )}

              {viewKey === 'sent' && (
                <>
                  <motion.div
                    className="auth-success-badge"
                    variants={{
                      hidden: { scale: 0.5, opacity: 0 },
                      show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 380, damping: 18 } }
                    }}
                  >
                    <LuMailCheck size={28} aria-hidden="true" />
                  </motion.div>
                  <motion.h1 className="auth-title" variants={item}>Check your inbox</motion.h1>
                  <motion.p className="auth-subtitle" variants={item}>
                    We sent a temporary password to <strong>{resetEmail}</strong>. Use it to sign in, then set a new one from your profile.
                  </motion.p>
                  <motion.div variants={item}>
                    <button type="button" className="auth-submit" onClick={backToLogin}>
                      <span>Back to sign in</span>
                      <LuArrowRight size={18} className="auth-submit-arrow" aria-hidden="true" />
                    </button>
                  </motion.div>
                  <motion.div className="auth-row-center" variants={item}>
                    <button type="button" className="auth-link" onClick={() => setResetEmailSent(false)}>
                      Didn’t get it? Send again
                    </button>
                  </motion.div>
                </>
              )}

              <motion.div className="auth-secure-note" variants={item}>
                <LuShieldCheck size={16} aria-hidden="true" />
                <span>Protected CRM session · TechGy Link Enterprise Workspace</span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="auth-footer">© {new Date().getFullYear()} TechGy Link. All rights reserved.</footer>
      </section>

      {/* ================= Brand panel ================= */}
      <aside className="auth-showcase" aria-hidden="true">
        <div className="auth-showcase-grid" />
        <img src="/vector.png" alt="" className="auth-showcase-mark" />

        <motion.div
          className="auth-showcase-content"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
        >
          <motion.div className="auth-showcase-icon" variants={item}>
            <img src="/vector.png" alt="" />
          </motion.div>
          <motion.h2 className="auth-showcase-title" variants={item}>
            Every lead, follow-up and deal is linked in one workspace.
          </motion.h2>
          <motion.p className="auth-showcase-text" variants={item}>
            TechGy Link keeps your sales team, pipeline and customer conversations in sync.
          </motion.p>

          <ul className="auth-features">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <motion.li key={title} className="auth-feature" variants={item}>
                <span className="auth-feature-icon"><Icon size={18} /></span>
                <span className="auth-feature-body">
                  <strong>{title}</strong>
                  <span>{text}</span>
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </aside>
    </div>
  );
}
