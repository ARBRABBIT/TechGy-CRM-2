import { Plus_Jakarta_Sans } from 'next/font/google';
import '../src/index.css';

// Self-hosted at build time — no runtime requests to Google Fonts
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata = {
  title: 'TechGy Link - CRM Internal Workspace',
  description: 'Enterprise CRM Workspace for Leads, Accounts, Opportunities, Proposals, and Activities',
  icons: {
    icon: '/vector.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
