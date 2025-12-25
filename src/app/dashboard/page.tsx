

'use client';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import {
  MoreHorizontal,
  ChevronDown,
  Calendar,
  Download,
  Shield,
  Sun,
  Moon,
  HelpCircle,
  Bell,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  Edit,
  Trash,
  Notebook,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

const riskData = [
  { name: 'Jan', critical: 30, medium: 45, high: 40, low: 20 },
  { name: 'Feb', critical: 40, medium: 50, high: 35, low: 25 },
  { name: 'Mar', critical: 35, medium: 30, high: 50, low: 30 },
  { name: 'Apr', critical: 42, medium: 38, high: 45, low: 28 },
  { name: 'May', critical: 50, medium: 42, high: 30, low: 35 },
  { name: 'Jun', critical: 45, medium: 48, high: 38, low: 40 },
  { name: 'Jul', critical: 38, medium: 35, high: 42, low: 30 },
  { name: 'Aug', critical: 30, medium: 40, high: 48, low: 25 },
  { name: 'Sep', critical: 45, medium: 50, high: 35, low: 28 },
  { name: 'Oct', critical: 52, medium: 45, high: 40, low: 32 },
  { name: 'Nov', critical: 48, medium: 40, high: 45, low: 38 },
  { name: 'Dec', critical: 55, medium: 42, high: 38, low: 42 },
];

const riskStatusData = [
  { name: 'No Applicable', value: 10, color: '#6366F1' },
  { name: 'Low', value: 20, color: '#34D399' },
  { name: 'Guarded', value: 30, color: '#FBBF24' },
  { name: 'Elevated', value: 25, color: '#F97316' },
  { name: 'High', value: 10, color: '#EF4444' },
  { name: 'Severe', value: 5, color: '#DC2626' },
];

const securityPostureData = [{ name: 'score', value: 80 }];

const redTeamDonutData = [
    { name: 'Received', value: 59, color: '#A7F3D0' },
    { name: 'Resolved', value: 57, color: '#34D399' }
];

const domainsDonutData = [
    { name: 'Open Issue', value: 30, color: '#F87171' },
    { name: 'Resolved', value: 70, color: '#34D399' }
]

const riskyFindings = [
    { name: 'sfsffgdgfdt6546575', region: 'US', service: 'KMS', severity: 'High' },
    { name: 'sfsffgdgfdt6546575', region: 'India', service: 'CloudWatch', severity: 'Medium' },
    { name: 'i-08612348asbjaft', region: 'India', service: 'EC2', severity: 'Low' },
    { name: 'sfsffgdgfdt6546575', region: 'India', service: 'CloudWatch', severity: 'Critical' },
];

const breachedSLAs = [
    { type: 'Broken Access Control', sla: '12h 0m', resolution: 'Open', resolutionColor: 'text-red-400' },
    { type: 'Admin Leaked Creds', sla: '6h 0m', resolution: '25h 5m', resolutionColor: 'text-orange-400' },
    { type: 'Privilege Esc [TY pro]', sla: '4d 0h', resolution: 'Open', resolutionColor: 'text-red-400' },
];

type LeakType = 'Cookies' | 'Man-in-the-middle' | 'Hashed Passwords' | 'Documents' | 'Plain-text Passwords' | 'Generic';
type Leak = { type: LeakType, count: number };
type DayLeaks = { day: number; leaks: Leak[] };
interface User {
    name: string;
    email: string;
}
interface Issue {
  _id: string;
  title: string;
  type: 'Cloud Security' | 'RedTeam Assessment' | 'VAPT';
  status: string;
  priority?: string;
  createdAt: string;
  description: string;
}
interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

const issueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['Cloud Security', 'RedTeam Assessment', 'VAPT']),
  description: z.string().min(1, 'Description is required'),
  priority: z.string().optional(),
  status: z.string().optional(),
});
const noteSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
});

type IssueFormValues = z.infer<typeof issueSchema>;
type NoteFormValues = z.infer<typeof noteSchema>;

// Custom hook for debouncing
function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export default function DashboardPage() {
  console.log('Rendering Dashboard');
  const [leaksData, setLeaksData] = useState<DayLeaks[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [issueFilter, setIssueFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingIssueId, setDeletingIssueId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const issueForm = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: '',
      type: 'VAPT',
      description: '',
      priority: 'Medium',
      status: 'OPEN',
    },
  });
  
  const noteForm = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
        title: "",
        content: "",
    },
  });

  const fetchIssues = useCallback(async () => {
    setIsLoadingIssues(true);
    const params = new URLSearchParams();
    if (issueFilter !== 'All') {
        const typeMap: { [key: string]: string } = {
            'VAPT': 'vapt',
            'Cloud Security': 'cloud-security',
            'RedTeam Assessment': 'redteam-assessment'
        };
        const filterParam = typeMap[issueFilter as keyof typeof typeMap];
        if (filterParam) {
            params.append('type', filterParam);
        }
    }
    if (debouncedSearchQuery) {
        params.append('search', debouncedSearchQuery);
    }
    const url = `/api/issues?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch issues');
      const data = await response.json();
      setIssues(data.data);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch issues.' });
      console.error(error);
    } finally {
      setIsLoadingIssues(false);
    }
  }, [issueFilter, debouncedSearchQuery, toast]);
  
  const fetchNotes = useCallback(async () => {
    setIsLoadingNotes(true);
    try {
      const response = await fetch('/api/notes');
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data.data);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch notes.' });
      console.error(error);
    } finally {
      setIsLoadingNotes(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    const generateLeaksData = () => Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        leaks: [
            { type: 'Cookies' as LeakType, count: Math.floor(Math.random() * 3) },
            { type: 'Man-in-the-middle' as LeakType, count: Math.floor(Math.random() * 2) },
            { type: 'Hashed Passwords' as LeakType, count: Math.floor(Math.random() * 4) },
            { type: 'Documents' as LeakType, count: Math.floor(Math.random() * 2) },
            { type: 'Plain-text Passwords' as LeakType, count: Math.floor(Math.random() * 1) },
            { type: 'Generic' as LeakType, count: Math.floor(Math.random() * 5) },
        ].sort(() => 0.5 - Math.random())
    }));
    setLeaksData(generateLeaksData());
    
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

  // FORCE UNLOCK: Fixes the Radix UI "Scroll Lock" bug
  useEffect(() => {
    if (!isIssueDialogOpen && !isDeleteDialogOpen) {
      // Small timeout to allow Radix to attempt its own cleanup first
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = "";
        document.body.style.overflow = "";
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isIssueDialogOpen, isDeleteDialogOpen]);

  const handleCreateNewIssue = () => {
    setEditingIssue(null);
    issueForm.reset({
        title: '',
        type: 'VAPT',
        description: '',
        priority: 'Medium',
        status: 'OPEN',
    });
    setIsIssueDialogOpen(true);
  };

  const handleEditIssue = (issue: Issue) => {
    setEditingIssue(issue);
    issueForm.reset({
        title: issue.title,
        type: issue.type,
        description: issue.description,
        priority: issue.priority,
        status: issue.status,
    });
    setIsIssueDialogOpen(true);
  };

  const handleDeleteIssue = (id: string) => {
    setDeletingIssueId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!deletingIssueId) return;

    console.log('Deleting...');
    const issueIdToDelete = deletingIssueId;
    
    // Keep a copy of the old state in case we need to revert
    const previousIssues = issues;
    // Optimistic UI update
    setIssues(prevIssues => prevIssues.filter(issue => issue._id !== issueIdToDelete));
    
    try {
        const response = await fetch(`/api/issues/${issueIdToDelete}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
           // Revert optimistic update
           toast({ variant: 'destructive', title: 'Error', description: 'Could not delete issue.' });
           setIssues(previousIssues);
        } else {
            toast({ title: 'Success', description: 'Issue deleted successfully.' });
        }
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not delete issue.' });
        console.error(error);
        setIssues(previousIssues);
    } finally {
        setIsDeleteDialogOpen(false);
        setDeletingIssueId(null);
    }
  };

  const onIssueFormSubmit = async (values: IssueFormValues) => {
    const isEditing = !!editingIssue;
    const url = isEditing ? `/api/issues/${editingIssue._id}` : '/api/issues';
    const method = isEditing ? 'PUT' : 'POST';

    // Keep a copy of the old state for potential rollback
    const previousIssues = issues;

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const optimisticIssue: Issue = {
        _id: isEditing ? editingIssue!._id : tempId,
        createdAt: new Date().toISOString(),
        status: 'OPEN',
        priority: 'Medium',
        ...values,
        description: values.description || '',
    };

    if (isEditing) {
        setIssues(prev => prev.map(i => i._id === editingIssue!._id ? optimisticIssue : i));
    } else {
        setIssues(prev => [optimisticIssue, ...prev]);
    }
    
    setIsIssueDialogOpen(false);

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to save issue.');
        }

        toast({ title: 'Success', description: `Issue ${isEditing ? 'updated' : 'created'} successfully.` });
        
        // Final state update with real data from server, replacing temp ID if necessary
        setIssues(prev => prev.map(i => (i._id === tempId ? result.data : i._id === result.data._id ? result.data : i)));

    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
        console.error(error);
        // Rollback on error
        setIssues(previousIssues);
    } finally {
        console.log('Modal Closed');
    }
  };
  
  const onNoteFormSubmit = async (values: NoteFormValues) => {
    try {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        const result = await response.json();
        if(!response.ok) {
            throw new Error(result.message || "Failed to save note");
        }
        toast({ title: "Success", description: "Note saved successfully." });
        setNotes(prev => [result.data, ...prev]);
        noteForm.reset();
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'Medium':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'Low':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getLeakCellColor = (count: number) => {
    if (count > 3) return 'bg-teal-400';
    if (count > 1) return 'bg-teal-500';
    if (count > 0) return 'bg-teal-600';
    return 'bg-gray-700/50';
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b border-border flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-headline">Welcome {user?.name ?? 'Org'}!</h1>
            <p className="text-sm text-muted-foreground">
              Last login 13:00, 12th Jan, 2025
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
          <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8 md:h-9 md:w-9">
            <Moon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8 md:h-9 md:w-9">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8 md:h-9 md:w-9">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 h-9">
                <Calendar className="h-4 w-4" />
                <span className='hidden sm:inline'>Last 30 days</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>Last 90 days</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-primary/90 hover:bg-primary/80 gap-2 h-9">
            <span className='hidden sm:inline'>Report</span>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <Card className="lg:col-span-1 glass-panel">
            <CardHeader>
              <CardTitle>Risk Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] w-full">
              <ResponsiveContainer>
                <LineChart data={riskData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Legend iconType='plainline' />
                  <Line type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="high" stroke="#F97316" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="medium" stroke="#FBBF24" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="low" stroke="#34D399" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 glass-panel">
            <CardHeader>
              <CardTitle>Security Posture</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] flex items-center justify-center">
              <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                        innerRadius="75%" 
                        outerRadius="100%" 
                        data={securityPostureData} 
                        startAngle={180} 
                        endAngle={0}
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar background dataKey='value' cornerRadius={10}>
                           <Cell fill="url(#securityGradient)" />
                        </RadialBar>
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold">80</p>
                    <p className="text-lg text-green-400">Good</p>
                  </div>
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient id="securityGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#34D399" />
                      </linearGradient>
                    </defs>
                  </svg>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-1 glass-panel">
            <CardHeader>
              <CardTitle>Current Risk Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <div className="flex items-center justify-center h-full">
                    <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                        <Pie
                            data={riskStatusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={2}
                        >
                            {riskStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center gap-4">
                  <Card className="bg-border/10 p-3">
                      <div className="flex justify-between items-start">
                        <CardDescription>Vulnerabilities Discovered</CardDescription>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs">View Details</Button>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold">15</p>
                        <Badge variant="destructive" className="gap-1 text-xs"><ArrowUp className="w-3 h-3" /> 12%</Badge>
                      </div>
                  </Card>
                   <Card className="bg-border/10 p-3">
                      <div className="flex justify-between items-start">
                        <CardDescription>Assets Monitored</CardDescription>
                         <Button variant="link" size="sm" className="p-0 h-auto text-xs">View Details</Button>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold">670</p>
                        <Badge variant="destructive" className="gap-1 text-xs"><ArrowUp className="w-3 h-3" /> 12%</Badge>
                      </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2 glass-panel">
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
              <div>
                  <CardTitle>My Issues</CardTitle>
                  <CardDescription>Track and manage all your reported issues.</CardDescription>
              </div>
              <Button size="sm" onClick={handleCreateNewIssue}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Issue
              </Button>
            </CardHeader>
            <CardContent>
                <Tabs value={issueFilter} onValueChange={setIssueFilter}>
                    <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                        <TabsList>
                            <TabsTrigger value="All">All</TabsTrigger>
                            <TabsTrigger value="VAPT">VAPT</TabsTrigger>
                            <TabsTrigger value="Cloud Security">Cloud Security</TabsTrigger>
                            <TabsTrigger value="RedTeam Assessment">RedTeam Assessment</TabsTrigger>
                        </TabsList>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search issues..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        {isLoadingIssues ? (
                             <div className="space-y-2">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                             </div>
                        ) : issues.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead className='w-[40%]'>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {issues.map((issue) => (
                                <TableRow key={issue._id}>
                                    <TableCell className="font-medium">{issue.title}</TableCell>
                                    <TableCell>{issue.type}</TableCell>
                                    <TableCell><Badge variant="outline">{issue.status}</Badge></TableCell>
                                    <TableCell><Badge className={getSeverityBadge(issue.priority || 'Low')}>{issue.priority}</Badge></TableCell>
                                    <TableCell>{format(new Date(issue.createdAt), 'dd MMM yyyy')}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditIssue(issue)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteIssue(issue._id)} className="text-red-500">
                                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        ) : (
                          <div className="text-center py-12">
                              <p className="text-muted-foreground">No issues found.</p>
                          </div>
                        )}
                    </div>
                </Tabs>
            </CardContent>
          </Card>

            <Card className="lg:col-span-1 glass-panel">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Notebook className="w-5 h-5" />
                        My Notes
                    </CardTitle>
                    <CardDescription>Jot down quick notes and reminders.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...noteForm}>
                        <form onSubmit={noteForm.handleSubmit(onNoteFormSubmit)} className="space-y-4">
                            <FormField
                                control={noteForm.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormControl><Input placeholder="Note title..." {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={noteForm.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormControl><Textarea placeholder="Your note..." {...field} rows={3} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" size="sm" disabled={noteForm.formState.isSubmitting}>
                                {noteForm.formState.isSubmitting ? 'Saving...' : 'Save Note'}
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-6 space-y-4 max-h-60 overflow-y-auto pr-2">
                        {isLoadingNotes ? (
                             <div className="space-y-2">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                             </div>
                        ) : notes.length > 0 ? (
                           notes.map(note => (
                            <div key={note._id} className="p-3 rounded-md bg-muted/50 border">
                                <p className="font-semibold text-sm">{note.title}</p>
                                <p className="text-xs text-muted-foreground whitespace-pre-wrap">{note.content}</p>
                                <p className="text-xs text-muted-foreground/50 mt-2">{format(new Date(note.createdAt), 'dd MMM, p')}</p>
                            </div>
                           ))
                        ) : (
                           <p className="text-center text-sm text-muted-foreground py-4">No notes yet.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

          
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Card className="glass-panel h-fit">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Red Team Assessment</CardTitle>
                <Badge variant="destructive">Open issues: 10</Badge>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="bugBounty">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="bugBounty">Bug Bounty</TabsTrigger>
                    <TabsTrigger value="socialEngineering">Social Engineering</TabsTrigger>
                  </TabsList>
                  <TabsContent value="bugBounty">
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                          <div className='flex flex-col items-center justify-center'>
                             <div className="relative w-32 h-32">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                          <Pie data={redTeamDonutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={50} paddingAngle={2} >
                                              {redTeamDonutData.map((entry, index) => (
                                                  <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color}/>
                                              ))}
                                          </Pie>
                                      </PieChart>
                                  </ResponsiveContainer>
                                  <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
                                      <p className='text-xs text-muted-foreground'>59 Received</p>
                                      <p className='text-xs text-muted-foreground'>57 Resolved</p>
                                  </div>
                              </div>
                          </div>
                          <div className='col-span-2 space-y-2 text-sm'>
                              <div className='flex justify-between items-center p-2 rounded-md bg-border/20'>
                                  <p>Total bounty awarded</p>
                                  <p className='font-bold text-primary'>1959$</p>
                              </div>
                               <div className='flex justify-between items-center p-2 rounded-md bg-border/20'>
                                  <p>Hackers Participated</p>
                                  <p className='font-bold'>46</p>
                              </div>
                               <div className='flex justify-between items-center p-2 rounded-md bg-border/20'>
                                  <p>Avg response time</p>
                                  <p className='font-bold'>2hrs</p>
                              </div>
                          </div>
                      </div>
                  </TabsContent>
                  <TabsContent value="socialEngineering">
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                          <div className='space-y-2 text-sm'>
                               <div className='flex justify-between items-center p-2 rounded-md bg-border/20'>
                                  <p>Social Engineering Recognition rate</p>
                                  <p className='font-bold text-primary'>2%</p>
                              </div>
                               <div className='flex justify-between items-center p-2 rounded-md bg-border/20'>
                                  <p>Org Phishing Susceptible score</p>
                                  <p className='font-bold text-red-400'>49%</p>
                              </div>
                          </div>
                          <div className="flex flex-col items-center justify-center p-4 bg-border/20 rounded-md">
                              <p className="text-sm text-muted-foreground">Placeholder for social engineering chart</p>
                          </div>
                      </div>
                  </TabsContent>
                  <div className='flex justify-end gap-4 text-xs text-muted-foreground mt-2'>
                      <span>@ cyber maturity plan</span>
                      <span>@ cyber risk register</span>
                      <span>@ infosec policy</span>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
            <Card className="glass-panel">
                <CardHeader className="flex-col sm:flex-row justify-between items-start sm:items-center">
                <CardTitle>Surface &amp; Dark Web Leaks</CardTitle>
                <p className='text-muted-foreground mt-2 sm:mt-0'>Total Leaks: <span className='font-bold text-foreground'>1273</span></p>
                </CardHeader>
                <CardContent className="flex gap-2 md:gap-4 overflow-x-auto">
                    <div className='text-xs text-muted-foreground space-y-1 py-1'>
                        <p>Cookies</p>
                        <p>MITM</p>
                        <p>H. Passwords</p>
                        <p>Documents</p>
                        <p>P.T. Passwords</p>
                        <p>Generic</p>
                    </div>
                    <div className='flex-1 grid grid-cols-30 gap-1'>
                        {leaksData.map(day => (
                            <div key={day.day} className='space-y-1'>
                                {day.leaks.map(leak => (
                                    <div key={leak.type} className={`w-full h-2 rounded-sm ${getLeakCellColor(leak.count)}`}></div>
                                ))}
                            </div>
                        ))}
                    </div>
                </CardContent>
                <div className='px-6 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4'>
                    <Button variant="link" className="p-0">View All</Button>
                    <div className='flex items-center gap-2 w-full sm:w-auto'>
                        <p className='text-sm text-muted-foreground'>Actionable: 178</p>
                        <div className='flex-1 h-2 bg-gray-700 rounded-full'>
                            <div className='w-1/2 h-full bg-primary rounded-full'></div>
                        </div>
                        <p className='text-sm font-bold'>100</p>
                    </div>
                </div>
            </Card>
          </div>

          <Card className="lg:col-span-1 glass-panel">
            <CardHeader>
              <CardTitle>Cloud Watcher</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center">
                    <div className="relative w-40 h-40">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                                innerRadius="70%" 
                                outerRadius="90%" 
                                data={[{ value: 80 }]} 
                                startAngle={90} 
                                endAngle={-270}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <RadialBar background dataKey='value' cornerRadius={10} fill="#34D399" />
                            </RadialBarChart>
                          </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-3xl font-bold">80%</p>
                            <p className="text-sm text-muted-foreground">Compliance</p>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 text-center">
                        <p><span className="text-green-400">■</span> Compliance Rules Passed: 272</p>
                        <p><span className="text-red-400">■</span> Compliance Rules Failed: 52</p>
                    </div>
                </div>
                <div className='flex flex-col justify-between'>
                    <div>
                        <p className='text-muted-foreground mb-2'>Monitoring:</p>
                        <div className='flex items-center gap-4'>
                            <Image src="https://www.svgrepo.com/show/373458/aws.svg" alt="aws" width={48} height={48} />
                             <Image src="https://www.svgrepo.com/show/353794/google-cloud.svg" alt="gcp" width={40} height={40} />
                             <Image src="https://www.svgrepo.com/show/353448/azure.svg" alt="azure" width={40} height={40} />
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4 mt-4'>
                        <div className='bg-border/20 p-3 rounded-md'>
                            <p className='text-sm text-muted-foreground'>aws accounts monitored</p>
                            <p className='text-xl md:text-2xl font-bold'>100</p>
                        </div>
                         <div className='bg-border/20 p-3 rounded-md'>
                            <p className='text-sm text-muted-foreground'>Open Issues</p>
                            <p className='text-xl md:text-2xl font-bold'>100</p>
                        </div>
                    </div>
                </div>
            </CardContent>
             <CardHeader>
              <CardTitle>Top Most Risky Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource Name</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>AWS Service</TableHead>
                      <TableHead>Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riskyFindings.map((finding, index) => (
                      <TableRow key={index}>
                        <TableCell className='truncate max-w-xs'>{finding.name}</TableCell>
                        <TableCell>{finding.region}</TableCell>
                        <TableCell>{finding.service}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityBadge(finding.severity)}>
                            {finding.severity}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
               <Button variant="link" className="p-0 mt-2">View All...</Button>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Card className="glass-panel h-fit">
              <CardHeader>
                <CardTitle>Domains Scanning</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className='space-y-2 text-sm'>
                      {[
                          {domain: 'apnisec.com:', issue: 'critical open issue', color: 'text-red-500'},
                          {domain: 'apnisec.com:', issue: 'High open issue', color: 'text-orange-500'},
                          {domain: 'apnisec.com:', issue: 'Medium open issue', color: 'text-yellow-500'},
                          {domain: 'apnisec.com:', issue: 'High open issue', color: 'text-orange-500'},
                          {domain: 'apnisec.com:', issue: 'High open issue', color: 'text-orange-500'},
                      ].map((item, i) => (
                          <div key={i} className='flex items-center gap-2'>
                              <span className={`${item.color}`}>●</span>
                              <span className='truncate'>{item.domain}</span>
                              <span className='text-muted-foreground truncate'>{item.issue}</span>
                          </div>
                      ))}
                  </div>
                   <div className="h-24 w-24 mx-auto my-4">
                      <ResponsiveContainer>
                          <PieChart>
                              <Pie data={domainsDonutData} dataKey="value" innerRadius="60%" >
                                  {domainsDonutData.map(d => <Cell key={d.name} fill={d.color} stroke={d.color} />)}
                              </Pie>
                          </PieChart>
                      </ResponsiveContainer>
                  </div>
                   <div className='flex justify-between items-center text-sm'>
                      <Button variant="link" className="p-0">View All</Button>
                      <p className='text-muted-foreground text-right'>Total: <span className='font-bold text-foreground'>100</span></p>
                  </div>
              </CardContent>
            </Card>
            <Card className="glass-panel">
                <CardHeader>
                <CardTitle>Recent SLAs Breached</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Issue Type</TableHead>
                        <TableHead>Standard SLAs</TableHead>
                        <TableHead>Time of Resolution</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {breachedSLAs.map((sla, index) => (
                        <TableRow key={index}>
                            <TableCell>{sla.type}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className='bg-green-500/20 text-green-400 border-none'>{sla.sla}</Badge>
                            </TableCell>
                            <TableCell>
                                <span className={sla.resolutionColor}>{sla.resolution}</span>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
                <Button variant="link" className="p-0 mt-2">View All...</Button>
                </CardContent>
            </Card>
          </div>

        </div>
      </main>

      {isIssueDialogOpen && (
          <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingIssue ? 'Edit Issue' : 'Create New Issue'}</DialogTitle>
                <DialogDescription>
                  {editingIssue ? 'Update the details of your existing issue.' : 'Fill in the details for your new issue.'}
                </DialogDescription>
              </DialogHeader>
              <Form {...issueForm}>
                <form onSubmit={issueForm.handleSubmit(onIssueFormSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={issueForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl><Input placeholder="e.g., Unsecured S3 Bucket" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={issueForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select an issue type" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="VAPT">VAPT</SelectItem>
                            <SelectItem value="Cloud Security">Cloud Security</SelectItem>
                            <SelectItem value="RedTeam Assessment">RedTeam Assessment</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={issueForm.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                             <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select a priority" /></SelectTrigger>
                             </FormControl>
                             <SelectContent>
                              <SelectItem value="Critical">Critical</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                             </SelectContent>
                           </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={issueForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                             <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger>
                             </FormControl>
                             <SelectContent>
                              <SelectItem value="OPEN">Open</SelectItem>
                              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                              <SelectItem value="RESOLVED">Resolved</SelectItem>
                              <SelectItem value="CLOSED">Closed</SelectItem>
                             </SelectContent>
                           </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={issueForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe the issue in detail" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit">Save Issue</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
      )}
      
      {isDeleteDialogOpen && (
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the issue from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => console.log('Modal Closed')}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className='bg-destructive hover:bg-destructive/90'>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      )}

    </div>
  );
}
