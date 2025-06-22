import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { toast } from 'sonner';

const CollectTestimonial = () => {
  const { slug } = useParams<{ slug: string }>();
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');

  // Fetch campaign details
  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ['campaign', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, name')
        .eq('slug', slug)
        .single();
      if (error) throw new Error('Campaign not found or link is invalid.');
      return data;
    },
    enabled: !!slug,
  });

  // Submit testimonial mutation
  const submitTestimonial = useMutation({
    mutationFn: async (testimonial: { name: string; feedback: string }) => {
      const { data, error } = await supabase.from('testimonials').insert([
        {
          campaign_id: campaign?.id,
          name: testimonial.name,
          feedback: testimonial.feedback,
        },
      ]);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success('Thank you for your testimonial!');
      setName('');
      setFeedback('');
    },
    onError: (error) => {
      toast.error(`Submission failed: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && feedback.trim() && campaign) {
      submitTestimonial.mutate({ name, feedback });
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center">Submit a Testimonial for {campaign?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={submitTestimonial.isPending}>
              {submitTestimonial.isPending ? 'Submitting...' : 'Submit Testimonial'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectTestimonial;
