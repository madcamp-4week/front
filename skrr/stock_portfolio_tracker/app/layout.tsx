import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/context/AuthProvider';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stock Portfolio Tracker',
  description: 'Track your stock portfolio with ease.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body
        className={cn(
          'relative h-full font-sans antialiased',
          inter.className,
          'bg-gray-50 text-gray-900'
        )}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
