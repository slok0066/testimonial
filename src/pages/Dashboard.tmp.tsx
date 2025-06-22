import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [campaignName, setCampaignName] = useState('');
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Fetch campaigns
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user?.id);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  // Create campaign mutation
  const createCampaign = useMutation({
    mutationFn: async (name: string) => {
      const slug = name.toLowerCase().replace(/\s+/g, '-').slice(0, 50);
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{ name, slug, user_id: user?.id }])
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign created successfully!');
      setDialogOpen(false);
      setCampaignName('');
    },
    onError: (error) => {
      toast.error(`Failed to create campaign: ${error.message}`);
    },
  });

  const handleCreateCampaign = () => {
    if (campaignName.trim()) {
      createCampaign.mutate(campaignName.trim());
    }
  };

  const copyToClipboard = (slug: string) => {
    const url = `${window.location.origin}/collect/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <Button onClick={signOut} variant="outline">Sign Out</Button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Campaigns</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create New Campaign</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Testimonial Campaign</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input id="campaign-name" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} />
                </div>
                <Button onClick={handleCreateCampaign} disabled={createCampaign.isPending}>
                  {createCampaign.isPending ? 'Creating...' : 'Create Campaign'}
                </Button>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading campaigns...</p>
            ) : campaigns && campaigns.length > 0 ? (
              <ul className="space-y-4">
                {campaigns.map((campaign) => (
                  <li key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="font-medium">{campaign.name}</span>
                    <Button variant="secondary" onClick={() => copyToClipboard(campaign.slug)}>Copy Link</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No campaigns yet. Create one to get started!</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
