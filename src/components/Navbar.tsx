'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Shield, LayoutDashboard, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // This check runs on the client-side
    const token = document.cookie.includes('accessToken');
    setIsAuthenticated(token);
  }, [pathname]); // Re-check on route change

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <nav className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold font-headline">ApniSec</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/#features" className="hover:text-primary transition-colors">Services</Link>
          {isAuthenticated && <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>}
          <Link href="#" className="hover:text-primary transition-colors">About</Link>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
