import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Code, Share2 } from 'lucide-react';
import { toast } from 'sonner';

import { SettingsTab } from '@/components/dashboard/SettingsTab';
import { EmbedTab } from '@/components/dashboard/EmbedTab';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CollectionURLCard } from '@/components/dashboard/CollectionURLCard';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { TestimonialCard } from '@/components/dashboard/TestimonialCard';

interface Testimonial {
  id: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  rating: number;
  title?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface UserSettings {
  id: string;
  collection_url_slug: string;
}

const Dashboard = () => {
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Wait for Supabase to process the OAuth hash if present
  useEffect(() => {
    if (window.location.hash.includes('access_token')) {
      let isMounted = true;
      const waitForSession = async () => {
        for (let i = 0; i < 30; i++) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && isMounted) {
            window.location.hash = '';
            break;
          }
          await new Promise(res => setTimeout(res, 100));
        }
      };
      waitForSession();
      return () => { isMounted = false; };
    }
  }, [location]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [testimonialsRes, settingsRes] = await Promise.all([
        supabase
          .from('testimonials')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      if (testimonialsRes.error) throw testimonialsRes.error;
      setTestimonials((testimonialsRes.data || []) as Testimonial[]);

      if (settingsRes.error) throw settingsRes.error;

      if (settingsRes.data) {
        setUserSettings(settingsRes.data);
      } else {
        const { data: newSettings, error: rpcError } = await supabase.rpc('ensure_user_settings');
        if (rpcError) throw rpcError;
        setUserSettings(newSettings[0]);
      }

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      toast.error(`Failed to load data: ${error.message}`);
    } finally {
      setLoadingData(false);
    }
  };

  const updateTestimonialStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase.from('testimonials').update({ status }).eq('id', id);
      if (error) throw error;
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      toast.success(`Testimonial ${status}`);
    } catch (error: any) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  };

  const copyCollectionLink = () => {
    if (!userSettings) return;
    const url = `${window.location.origin}/collect/${userSettings.collection_url_slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    approved: testimonials.filter(t => t.status === 'approved').length,
    avgRating: testimonials.length > 0
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : '0'
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">You must be logged in to view the dashboard.</p>
      </div>
    );
  }

  if (!userSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">Loading your settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} onSignOut={signOut} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CollectionURLCard collectionUrlSlug={userSettings.collection_url_slug} />
        
        <StatsGrid stats={stats} />

        <Tabs defaultValue="testimonials">
          <TabsList className="mb-4">
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="h-4 w-4 mr-2" />Settings</TabsTrigger>
            <TabsTrigger value="embed"><Code className="h-4 w-4 mr-2" />Embed</TabsTrigger>
          </TabsList>

          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <CardTitle>Your Testimonials</CardTitle>
                <CardDescription>Review and manage the feedback you've received.</CardDescription>
              </CardHeader>
              <CardContent>
                {testimonials.length === 0 ? (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-semibold mb-2">No testimonials yet!</h3>
                    <p className="text-gray-500 mb-4">Share your collection link to get started.</p>
                    <Button onClick={copyCollectionLink}>
                      <Share2 className="h-4 w-4 mr-2" /> Copy Link
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                      <TestimonialCard
                        key={t.id}
                        testimonial={t}
                        index={i}
                        onUpdateStatus={updateTestimonialStatus}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
          <TabsContent value="embed">
            <EmbedTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
