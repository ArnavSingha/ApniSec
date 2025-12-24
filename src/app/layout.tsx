import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ApniSec',
  description: 'Modern Foundations for Secure and Scalable Web Applications.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@400;700&family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
