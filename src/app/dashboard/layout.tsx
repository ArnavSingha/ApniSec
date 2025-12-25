'use client';
import {
  Sidebar,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Home,
  ShieldCheck,
  Eye,
  Shield,
  Briefcase,
  Crosshair,
  LogOut,
  ChevronDown,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '#', label: 'vCISO', icon: ShieldCheck },
  { href: '#', label: 'DarkEye Watcher', icon: Eye },
  { href: '#', label: 'Cloud Security', icon: Shield },
  { href: '#', label: 'VAPT', icon: Briefcase },
  { href: '#', label: 'RedTeam Assessment', icon: Crosshair },
];

interface User {
    name: string;
    email: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        } else {
          console.error('Failed to fetch user, redirecting to login.');
          router.push('/');
        }
      } catch (error) {
        console.error('An error occurred while fetching user:', error);
        router.push('/');
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-lg">
             A
            </div>
            <span className="text-lg font-bold font-headline group-data-[collapsible=icon]:hidden">
              ApniSec
            </span>
          </div>
        </SidebarHeader>
        <SidebarMenu className="flex-1 p-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarFooter>
          <div className="flex flex-col gap-2 p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton tooltip="Profile & Settings" className='h-auto p-2'>
                        <div className="flex items-center gap-2 w-full">
                           <Avatar className="w-7 h-7">
                                <AvatarImage src={`https://picsum.photos/seed/${user?.email}/100`} />
                                <AvatarFallback>{user?.name?.[0] ?? 'U'}</AvatarFallback>
                            </Avatar>
                           <div className='flex flex-col items-start group-data-[collapsible=icon]:hidden'>
                                <span className='font-medium text-sm'>Welcome</span>
                                <span className='text-xs text-muted-foreground'>{user?.name ?? 'User'}</span>
                           </div>
                           <ChevronDown className='w-4 h-4 ml-auto group-data-[collapsible=icon]:hidden'/>
                        </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="mb-2">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
