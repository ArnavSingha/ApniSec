'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbarOn = ['/login', '/register', '/forgot-password', '/reset-password', '/profile'];
  const showNavbar = !hideNavbarOn.includes(pathname) && !pathname.startsWith('/dashboard');

  return (
    <html lang="en" className="dark">
      <head>
        <title>ApniSec - Proactive Cybersecurity Solutions</title>
        <meta name="description" content="ApniSec provides cutting-edge, AI-powered cybersecurity services, including VAPT, Cloud Security, Red Teaming, and Virtual CISO. Defend against threats before they strike." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@400;700&family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`font-body antialiased bg-background text-foreground`}>
        {showNavbar && <Navbar />}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
