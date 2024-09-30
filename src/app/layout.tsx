import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/Footer';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Upai',
  description: 'Image Cloud Storage',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR' className='dark'>
      <body className={cn('h-screen min-h-screen', inter.className)}>
        <Toaster />

        <Header />

        {children}

        {/* <Footer /> */}
      </body>
    </html>
  );
}
