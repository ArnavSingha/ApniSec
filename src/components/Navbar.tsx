'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Shield, LayoutDashboard, LogOut, Menu } from 'lucide-react';
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
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#', label: 'vCISO' },
    { href: '#', label: 'DarkEye Watcher' },
    { href: '#', label: 'Cloud Security' },
    { href: '#', label: 'VAPT' },
    { href: '#', label: 'RedTeam Assessment' },
    { href: '#', label: 'Compliance' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <nav className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold font-headline">ApniSec</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link, index) => (
            <Link 
              key={`${link.label}-${index}`}
              href={link.href} 
              className={`transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
               <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
                <Link href="/register">Secure Now</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Nav Trigger */}
        <div className="lg:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-sm">
                    <SheetHeader className='p-6 pb-0'>
                        <SheetTitle className='sr-only'>Mobile Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col h-full p-6">
                         <Link href="/" className="flex items-center gap-2 mb-8">
                            <Shield className="w-6 h-6 text-primary" />
                            <span className="text-xl font-bold font-headline">ApniSec</span>
                        </Link>
                        <div className="flex flex-col gap-4 text-lg">
                             {navLinks.map((link, index) => (
                                <Link 
                                key={`mobile-${link.label}-${index}`}
                                href={link.href} 
                                className={`transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : ''}`}
                                >
                                {link.label}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-auto flex flex-col gap-4">
                             {isAuthenticated ? (
                                <>
                                <Button variant="outline" asChild>
                                    <Link href="/dashboard">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                    </Link>
                                </Button>
                                <Button onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                                </>
                            ) : (
                                <>
                                <Button asChild>
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/register">Secure Now</Link>
                                </Button>
                                </>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </nav>
    </header>
  );
}
