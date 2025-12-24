'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, PlusCircle } from 'lucide-react';

const issueSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  type: z.enum(['Cloud Security', 'Reteam Assessment', 'VAPT']),
  description: z.string().min(1, 'Description is required.'),
});

type Issue = {
  _id: string;
  title: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<z.infer<typeof issueSchema>>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: '',
      type: 'VAPT',
      description: '',
    },
  });

  const fetchIssues = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/issues');
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }
      const data = await response.json();
      setIssues(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  async function onSubmit(values: z.infer<typeof issueSchema>) {
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create issue');
      }
      form.reset();
      setIsFormOpen(false);
      await fetchIssues(); // Refresh the list
    } catch (err: any) {
      // In a real app, you'd show a toast here
      console.error(err.message);
    }
  }
  
  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return 'default';
      case 'IN_PROGRESS':
        return 'secondary';
      default:
        return 'outline';
    }
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-panel">
              <DialogHeader>
                <DialogTitle>Create New Issue</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Unsecured S3 Bucket" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an issue type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Cloud Security">Cloud Security</SelectItem>
                            <SelectItem value="Reteam Assessment">Reteam Assessment</SelectItem>
                            <SelectItem value="VAPT">VAPT</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Provide a detailed description of the issue." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Submit Issue</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading && <p>Loading issues...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {!isLoading && !error && issues.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Issues Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new security issue.</p>
          </div>
        )}
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <Card key={issue._id} className="glass-panel hover:-translate-y-1 transition-transform">
              <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-bold pr-4">{issue.title}</CardTitle>
                    <Badge variant={getStatusVariant(issue.status)}>{issue.status}</Badge>
                </div>
                <CardDescription>{issue.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{issue.description}</p>
                <p className="text-xs text-muted-foreground mt-4">
                  Reported on: {new Date(issue.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
