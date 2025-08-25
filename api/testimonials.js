import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const slug = typeof req.query.slug === 'string' ? req.query.slug : '';
  if (!slug) return res.status(400).json({ error: 'Missing slug' });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return res.status(500).json({ error: 'Supabase env not configured' });

  const supabase = createClient(url, key);

  const { data: settings, error: sErr } = await supabase
    .from('user_settings')
    .select('user_id')
    .eq('collection_url_slug', slug)
    .maybeSingle();
  if (sErr || !settings) return res.status(404).json({ error: 'Collection not found' });

  const { data, error } = await supabase
    .from('testimonials')
    .select('client_name, rating, title, content, created_at')
    .eq('user_id', settings.user_id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data || []);
}
