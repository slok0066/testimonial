import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Star, Send } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
        {submitted ? (
            <motion.div key="thank-you" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <Card className="w-full max-w-lg text-center shadow-2xl">
                    <CardHeader>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}>
                            <Star className="h-20 w-20 text-yellow-400 mx-auto" fill="currentColor" />
                        </motion.div>
                        <CardTitle className="text-3xl mt-4">Thank You!</CardTitle>
                        <CardDescription className="text-lg">Your feedback is invaluable to us.</CardDescription>
                    </CardHeader>
                </Card>
            </motion.div>
        ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <Card className="w-full max-w-lg shadow-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl">Share Your Experience</CardTitle>
                        <CardDescription>Your feedback helps {owner?.name ?? 'us'} grow.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" value={clientName} onChange={e => setClientName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company (Optional)</Label>
                                <Input id="company" value={clientCompany} onChange={e => setClientCompany(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Your Rating</Label>
                                <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} 
                                            className={`h-8 w-8 cursor-pointer transition-colors ${ (hoverRating || rating) > i ? 'text-yellow-400' : 'text-gray-300'}`}
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
                            <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
                                <Send className="h-5 w-5 mr-2" />
                                Submit Testimonial
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
};

export default NewTestimonial;
