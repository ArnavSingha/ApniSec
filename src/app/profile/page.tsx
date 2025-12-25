'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Mail, User, Cake, Phone, Building, Briefcase, Info, Globe } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email(),
  dob: z.string().optional().refine((val) => {
    if (!val || val === '') return true;
    const date = parse(val, 'dd-MM-yyyy', new Date());
    return isValid(date) && /^\d{2}-\d{2}-\d{4}$/.test(val);
  }, { message: 'Please use DD-MM-YYYY format.' }),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say', '']).optional(),
  phoneNumber: z.string().optional(),
  companyUrl: z.string().url().optional().or(z.literal('')),
  jobTitle: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const defaultValues: ProfileFormValues = {
  name: '',
  email: '',
  dob: '',
  gender: 'Prefer not to say',
  phoneNumber: '',
  companyUrl: '',
  jobTitle: '',
  bio: '',
  country: '',
};

export default function ProfilePage() {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultValues,
  });

  const [originalData, setOriginalData] = useState<ProfileFormValues>(defaultValues);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsFetching(true);
      try {
        const response = await fetch('/api/users/profile');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile.');
        }

        const fetchedData = data.data;
        const profileData = {
          ...defaultValues,
          name: fetchedData.name || '',
          email: fetchedData.email || '',
          dob: fetchedData.dob ? format(new Date(fetchedData.dob), 'dd-MM-yyyy') : '',
          gender: fetchedData.gender || 'Prefer not to say',
          phoneNumber: fetchedData.phoneNumber || '',
          companyUrl: fetchedData.companyUrl || '',
          jobTitle: fetchedData.jobTitle || '',
          bio: fetchedData.bio || '',
          country: fetchedData.country || '',
        };
        
        form.reset(profileData);
        setOriginalData(profileData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, [form]);

  async function onSubmit(values: ProfileFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      const submissionData = {
        ...values,
        dob: values.dob ? parse(values.dob, 'dd-MM-yyyy', new Date()) : null,
      };

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });

      const updatedProfileData = {
        ...defaultValues,
        ...data.data,
        dob: data.data.dob ? format(new Date(data.data.dob), 'dd-MM-yyyy') : '',
      };
      form.reset(updatedProfileData);
      setOriginalData(updatedProfileData);
      setIsEditing(false);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    form.reset(originalData);
    setIsEditing(false);
  }

  const ProfileField = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined | null}) => (
      <div className="flex items-start gap-4">
          <Icon className="w-5 h-5 text-muted-foreground mt-1" />
          <div className='w-full'>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="font-medium">{value || '-'}</p>
          </div>
      </div>
  );

  return (
    <main className="flex justify-center items-start min-h-screen p-4 sm:p-6 md:p-8 bg-background">
       <Button variant="ghost" className="absolute top-4 left-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      <Card className="w-full max-w-2xl glass-panel mt-16">
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold font-headline">Profile</CardTitle>
            <CardDescription>Manage your account settings and personal information.</CardDescription>
          </div>
          {!isEditing && !isFetching && (
             <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-20 w-full" />
                </div>
              <Skeleton className="h-10 w-24" />
            </div>
          ) : isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="your@email.com" {...field} readOnly disabled />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of birth</FormLabel>
                          <FormControl>
                            <Input placeholder="DD-MM-YYYY" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ''}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your gender" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="(123) 456-7890" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. India" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Software Engineer" {...field} value={field.value || ''}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="companyUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Company URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                 <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Tell us a little bit about yourself"
                            className="resize-none"
                            {...field}
                             value={field.value || ''}
                            />
                        </FormControl>
                        <FormDescription>
                            You can @mention other users and organizations to link to them.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                </div>
              </form>
            </Form>
          ) : (
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <ProfileField icon={User} label="Full Name" value={originalData.name} />
                    <ProfileField icon={Mail} label="Email Address" value={originalData.email} />
                    <ProfileField icon={Cake} label="Date of Birth" value={originalData.dob} />
                    <ProfileField icon={User} label="Gender" value={originalData.gender} />
                    <ProfileField icon={Phone} label="Phone Number" value={originalData.phoneNumber} />
                    <ProfileField icon={Globe} label="Country" value={originalData.country} />
                    <ProfileField icon={Briefcase} label="Job Title" value={originalData.jobTitle} />
                    <ProfileField icon={Building} label="Company URL" value={originalData.companyUrl} />
                </div>
                 <div>
                    <ProfileField icon={Info} label="Bio" value={originalData.bio} />
                </div>
             </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
