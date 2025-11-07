import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Indian Road Laws Learning Game',
    template: '%s | Road Laws Game',
  },
  description: 'Learn Indian road driving laws through interactive scenarios and quizzes',
  keywords: ['Indian traffic laws', 'road safety', 'driving rules', 'traffic education'],
  authors: [{ name: 'Road Laws Game' }],
  creator: 'Road Laws Game',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Indian Road Laws Learning Game',
    description: 'Learn Indian road driving laws through interactive scenarios and quizzes',
    siteName: 'Road Laws Game',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indian Road Laws Learning Game',
    description: 'Learn Indian road driving laws through interactive scenarios and quizzes',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0284c7' },
    { media: '(prefers-color-scheme: dark)', color: '#0369a1' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
