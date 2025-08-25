-- Enable RLS
alter table public.testimonials enable row level security;
alter table public.user_settings enable row level security;

-- Public read: only approved testimonials by slug via joining settings (done in API)
-- Per-user protection (logged-in CRUD):
create policy "users can read own testimonials" on public.testimonials
for select using (auth.uid() = user_id);

create policy "users can insert own testimonials" on public.testimonials
for insert with check (auth.uid() = user_id);

create policy "users can update own testimonials" on public.testimonials
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- user_settings policies
create policy "users can read own settings" on public.user_settings
for select using (auth.uid() = user_id);

create policy "users can update own settings" on public.user_settings
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
