import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Star } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: User | null;
  onSignOut: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onSignOut }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Star className="h-8 w-8 text-yellow-400" />
            <h1 className="text-2xl font-bold text-gray-800">TestimonialHub</h1>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600 hidden sm:block">
              Welcome, {user?.user_metadata?.full_name ?? user?.email}
            </p>
            <Button variant="outline" size="sm" onClick={onSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
