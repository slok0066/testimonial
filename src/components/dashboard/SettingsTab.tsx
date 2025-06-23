import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const SettingsTab = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        toast.error('Could not fetch user information.');
      } else if (data.user) {
        setUser(data.user);
        setFullName(data.user.user_metadata?.full_name ?? '');
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    if (error) toast.error('Failed to update name.');
    else toast.success('Name updated successfully!');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        toast.error('Password must be at least 6 characters long.');
        return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) toast.error('Failed to update password.');
    else {
        toast.success('Password updated successfully!');
        setPassword('');
        setConfirmPassword('');
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNameUpdate} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium">Full Name</label>
              <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1" />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Choose a new password for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label htmlFor="password">New Password</label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1" />
            </div>
            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
