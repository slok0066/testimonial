import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Eye, Link } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface CollectionURLCardProps {
  collectionUrlSlug: string;
}

export const CollectionURLCard: React.FC<CollectionURLCardProps> = ({ collectionUrlSlug }) => {
  const collectionUrl = `${window.location.origin}/collect/${collectionUrlSlug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(collectionUrl);
    toast.success('Link copied to clipboard!');
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Link className="h-5 w-5 mr-2" />Your Collection URL</CardTitle>
          <CardDescription className="text-blue-200">Share this link with your clients to collect testimonials.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center space-x-2">
          <div className="flex-1 p-3 bg-white/20 rounded-lg font-mono text-sm truncate">
            {collectionUrl}
          </div>
          <Button onClick={copyToClipboard} size="sm" variant="secondary">
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
          <Button onClick={() => window.open(collectionUrl, '_blank')} size="sm" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20">
            <Eye className="h-4 w-4 mr-2" /> Preview
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
