import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Star, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const NewTestimonial = () => {
  const { slug } = useParams<{ slug: string }>();
  const [owner, setOwner] = useState<{ id: string, name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      if (!slug) {
        setError('Invalid collection URL.');
        setLoading(false);
        return;
      }

      try {
                const { data, error } = await supabase
          .rpc('get_owner_info_by_slug', { page_slug: slug })
          .single<{ owner_id: string; owner_name: string }>();

        if (error || !data?.owner_id) {
          throw new Error('Could not find the owner of this page. The link may be invalid or the owner account may have been deleted.');
        }

        setOwner({ id: data.owner_id, name: data.owner_name ?? 'this business' });
      } catch (err: any) {
        setError(err.message ?? 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerInfo();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
        toast.error('Please select a rating.');
        return;
    }
    if (!owner) return;

    try {
        const { error } = await supabase.from('testimonials').insert({
            user_id: owner.id,
            client_name: clientName,
            client_email: clientEmail,
            client_company: clientCompany,
            rating,
            title,
            content,
        });

        if (error) throw error;

        setSubmitted(true);
        toast.success('Thank you for your feedback!');
    } catch (err: any) {
        toast.error(err.message ?? 'Failed to submit testimonial.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-red-600">Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error}</p>
                    <Button onClick={() => window.location.href = '/'} className="mt-4">Go Home</Button>
                </CardContent>
            </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">
        
        {/* Left Column - Welcome Message */}
        <div className="hidden lg:flex lg:col-span-2 flex-col justify-center text-left p-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Your opinion matters.</h1>
          <p className="mt-4 text-lg text-gray-600">
            Thank you for taking the time to share your thoughts. Your feedback helps <span className="font-semibold text-indigo-600">{owner?.name ?? 'us'}</span> improve and grow.
          </p>
          <div className="mt-8 w-24 h-1 bg-indigo-500 rounded-full"></div>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="thank-you" 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-8 text-center flex flex-col justify-center items-center h-full"
              >
                <Card className="w-full max-w-lg text-center shadow-none border-none">
                  <CardHeader>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}>
                      <Star className="h-20 w-20 text-yellow-400 mx-auto" fill="currentColor" />
                    </motion.div>
                    <CardTitle className="text-3xl mt-4">Thank You!</CardTitle>
                    <CardDescription className="text-lg mt-2">Your feedback is invaluable to us.</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="w-full shadow-none border-none">
                  <CardHeader className="text-center bg-gray-50 p-6 border-b">
                    <div className="flex justify-center items-center gap-3">
                      <MessageSquare className="h-8 w-8 text-indigo-500" />
                      <CardTitle className="text-3xl">Share Your Experience</CardTitle>
                    </div>
                    <CardDescription className="mt-2 text-gray-600">We'd love to hear from you.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" value={clientName} onChange={e => setClientName(e.target.value)} required placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} required placeholder="john.doe@example.com" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company (Optional)</Label>
                        <Input id="company" value={clientCompany} onChange={e => setClientCompany(e.target.value)} placeholder="Acme Inc." />
                      </div>
                      <div className="space-y-2">
                        <Label>Your Rating</Label>
                        <div className="flex items-center space-x-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} 
                                className={`h-9 w-9 cursor-pointer transition-all duration-200 transform hover:scale-125 ${ (hoverRating || rating) > i ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                onMouseEnter={() => setHoverRating(i + 1)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(i + 1)}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Title (Optional)</Label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., 'Amazing Service!'" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content">Your Testimonial</Label>
                        <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={5} placeholder="Tell us about your experience..." />
                      </div>
                      <Button type="submit" className="w-full text-lg py-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100" disabled={loading}>
                        <Send className="h-5 w-5 mr-3" />
                        Submit Testimonial
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NewTestimonial;
