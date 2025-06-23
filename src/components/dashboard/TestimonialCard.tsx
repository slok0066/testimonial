import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, XCircle } from 'lucide-react';

interface Testimonial {
  id: string;
  client_name: string;
  client_company?: string;
  rating: number;
  title?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
}

const getBadgeVariant = (status: Testimonial['status']) => {
  switch (status) {
    case 'approved':
      return 'default';
    case 'rejected':
      return 'destructive';
    case 'pending':
    default:
      return 'secondary';
  }
};

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial: t, index, onUpdateStatus }) => {
  return (
    <motion.div
      key={t.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ y: -5 }}
    >
      <Card className="flex flex-col h-full transition-shadow hover:shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < t.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <Badge variant={getBadgeVariant(t.status)}>
              {t.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="font-semibold text-lg mb-2">{t.title ?? 'Untitled'}</p>
          <p className="text-gray-600 text-sm italic">"{t.content}"</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <p className="text-sm text-gray-500 w-full pt-4 border-t">
            - {t.client_name} from {t.client_company ?? 'N/A'}
          </p>
          {t.status === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex space-x-2 w-full"
            >
              <Button size="sm" onClick={() => onUpdateStatus(t.id, 'approved')} className="w-full bg-green-500 hover:bg-green-600">
                <CheckCircle className="h-4 w-4 mr-1" /> Approve
              </Button>
              <Button size="sm" onClick={() => onUpdateStatus(t.id, 'rejected')} variant="destructive" className="w-full">
                <XCircle className="h-4 w-4 mr-1" /> Reject
              </Button>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};
