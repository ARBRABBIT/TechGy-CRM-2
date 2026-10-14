'use client';

import dynamic from 'next/dynamic';
import { LoadingState } from '../src/components/common/StateViews';

// The CRM is a client-only app (it reads the session and data from localStorage)
const CRMApp = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => (
    <div className="app-loading">
      <LoadingState label="Loading TechGy Link…" />
    </div>
  )
});

export default function Page() {
  return <CRMApp />;
}
