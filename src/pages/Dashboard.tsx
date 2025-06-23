import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Users, 
  Link, 
  LogOut, 
  Copy, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Share2,
  TrendingUp,
  Settings,
  Code
} from 'lucide-react';
import { toast } from 'sonner';

import { motion } from 'framer-motion';
import { SettingsTab } from '@/components/dashboard/SettingsTab';
import { EmbedTab } from '@/components/dashboard/EmbedTab';

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
  useEffect(() => {
    // Always try to process the Supabase OAuth hash on mount
    (supabase.auth as any).getSessionFromUrl().then(({ data, error }) => {
      if (error) {
        console.error('Supabase auth error:', error);
      } else {
        console.log('Session:', data.session);
        // Clean up the URL to remove the access_token fragment
        window.history.replaceState({}, document.title, '/dashboard');
      }
    });
  }, []);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loadingData, setLoadingData] = useState(true);

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
      // Fetch testimonials and user settings in parallel
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
          .maybeSingle() // Use maybeSingle to avoid error on no rows
      ]);

      if (testimonialsRes.error) throw testimonialsRes.error;
      setTestimonials((testimonialsRes.data || []) as Testimonial[]);

      if (settingsRes.error) throw settingsRes.error;

      if (settingsRes.data) {
        setUserSettings(settingsRes.data);
      } else {
        // User settings not found, create them now
        console.log('User settings not found, creating them now via RPC...');
        const { data: newSettings, error: rpcError } = await supabase.rpc('ensure_user_settings');
        if (rpcError) throw rpcError;
        setUserSettings(newSettings[0]); // RPC returns an array
      }

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      toast.error(`Failed to load data: ${error.message}`);
    } finally {
      setLoadingData(false);
    }
  };


  const updateTestimonialStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase.from('testimonials').update({ status }).eq('id', id);
      if (error) throw error;
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      toast.success(`Testimonial ${status}`);
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  };

  const copyToClipboard = (slug: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard) return;
    const url = `${window.location.origin}/collect/${slug}`;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Star className="h-8 w-8 text-yellow-400" />
              <h1 className="text-2xl font-bold text-gray-800">TestimonialHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.user_metadata?.full_name || user?.email}</p>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userSettings && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center"><Link className="h-5 w-5 mr-2" />Your Collection URL</CardTitle>
                <CardDescription className="text-blue-200">Share this link with your clients to collect testimonials.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <div className="flex-1 p-3 bg-white/20 rounded-lg font-mono text-sm truncate">
                  {`${window.location.origin}/collect/${userSettings.collection_url_slug}`}
                </div>
                <Button onClick={() => copyToClipboard(userSettings.collection_url_slug)} size="sm" variant="secondary">
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button onClick={() => window.open(`/collect/${userSettings.collection_url_slug}`, '_blank')} size="sm" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
                  <Eye className="h-4 w-4 mr-2" /> Preview
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.entries(stats).map(([key, value], i) => (
              <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} whileHover={{ y: -4, scale: 1.02 }}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 capitalize">{key.replace('avg', 'Average ')}</CardTitle>
                    {React.createElement([Users, Clock, CheckCircle, Star][i], { className: "h-4 w-4 text-gray-400" })}
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-800">{value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

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
                    <Button onClick={() => userSettings && copyToClipboard(userSettings.collection_url_slug)}>
                      <Share2 className="h-4 w-4 mr-2" /> Copy Link
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                      <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} whileHover={{ y: -5 }}>
                        <Card className="flex flex-col h-full transition-shadow hover:shadow-xl">
                          <CardHeader>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < t.rating ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                                </div>
                                <Badge variant={t.status === 'approved' ? 'default' : t.status === 'rejected' ? 'destructive' : 'secondary'}>{t.status}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="font-semibold text-lg mb-2">{t.title || 'Untitled'}</p>
                            <p className="text-gray-600 text-sm italic">"{t.content}"</p>
                          </CardContent>
                          <CardFooter className="flex flex-col items-start gap-4">
                            <p className="text-sm text-gray-500 w-full pt-4 border-t">- {t.client_name} from {t.client_company || 'N/A'}</p>
                            {t.status === 'pending' && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex space-x-2 w-full"
                              >
                                <Button size="sm" onClick={() => updateTestimonialStatus(t.id, 'approved')} className="w-full bg-green-500 hover:bg-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                </Button>
                                <Button size="sm" onClick={() => updateTestimonialStatus(t.id, 'rejected')} variant="destructive" className="w-full">
                                  <XCircle className="h-4 w-4 mr-1" /> Reject
                                </Button>
                              </motion.div>
                            )}
                          </CardFooter>
                        </Card>
                      </motion.div>
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
