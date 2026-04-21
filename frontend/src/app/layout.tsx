import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'RealEstate AI Platform',
  description: 'AI-powered real estate marketplace and analytics platform',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-950 antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}