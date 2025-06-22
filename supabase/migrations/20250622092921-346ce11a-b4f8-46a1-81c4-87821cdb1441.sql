
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_company TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  source TEXT DEFAULT 'direct',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_settings table for testimonial collection settings
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  collection_url_slug TEXT UNIQUE,
  require_email_verification BOOLEAN DEFAULT false,
  allow_photo_uploads BOOLEAN DEFAULT true,
  allow_video_testimonials BOOLEAN DEFAULT false,
  auto_approve BOOLEAN DEFAULT false,
  custom_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for testimonials
CREATE POLICY "Users can view own testimonials" ON public.testimonials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own testimonials" ON public.testimonials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own testimonials" ON public.testimonials
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own testimonials" ON public.testimonials
  FOR DELETE USING (auth.uid() = user_id);

-- Allow public to insert testimonials (for collection form)
CREATE POLICY "Anyone can submit testimonials" ON public.testimonials
  FOR INSERT WITH CHECK (true);

-- RLS Policies for user_settings
CREATE POLICY "Users can view own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email)
  );
  
  -- Create default settings with unique slug
  INSERT INTO public.user_settings (user_id, collection_url_slug)
  VALUES (
    new.id,
    LOWER(REPLACE(COALESCE(new.raw_user_meta_data ->> 'full_name', new.email), ' ', '-')) || '-' || EXTRACT(EPOCH FROM now())::TEXT
  );
  
  RETURN new;
END;
$$;

-- Trigger to create profile and settings on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
