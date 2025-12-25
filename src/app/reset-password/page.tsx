'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError("No reset token provided. Please request a new password reset link.");
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: values.password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to reset password');
      }
      
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <main className="flex items-center justify-center min-h-screen p-4 bg-background">
        <Card className="w-full max-w-md glass-panel">
            <CardHeader>
                <CardTitle className="text-2xl font-bold font-headline text-center">Password Reset Successful</CardTitle>
            </CardHeader>
            <CardContent>
                <Alert>
                    <AlertDescription>
                        Your password has been changed successfully. You will be redirected to the dashboard shortly.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md glass-panel">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline text-center">Reset Your Password</CardTitle>
          <CardDescription className="text-center">Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {!token && !isSuccess && (
                  <div className='text-center text-sm'>
                      <p className='text-destructive mb-2'>{error}</p>
                      <Link href="/forgot-password" className="text-primary hover:underline">
                        Request a new link
                      </Link>
                  </div>
              )}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} disabled={!token} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} disabled={!token} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || !token}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}

    