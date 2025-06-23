import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle, Star } from 'lucide-react';

interface StatsGridProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    avgRating: string;
  };
}

const ICONS = [Users, Clock, CheckCircle, Star];

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(stats).map(([key, value], i) => (
          <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} whileHover={{ y: -4, scale: 1.02 }}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 capitalize">{key.replace('avg', 'Average ')}</CardTitle>
                {React.createElement(ICONS[i], { className: "h-4 w-4 text-gray-400" })}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">{value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
