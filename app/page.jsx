'use client';

import dynamic from 'next/dynamic';

// Dynamically import the main CRM application with SSR disabled to ensure seamless client hydration
const CRMApp = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F8FAFC',
      color: '#063669',
      fontFamily: 'Plus Jakarta Sans, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          border: '3px solid #E2E8F0',
          borderTopColor: '#063669',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.02em' }}>
          Loading TechGy Link...
        </span>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
});

export default function Page() {
  return <CRMApp />;
}
