Environment Setup

Create a `.env` file in the project root based on `.env.example`:

VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

Notes
- Vite only exposes variables prefixed with `VITE_` to the client.
- `.env*` files are git-ignored; commit `.env.example` only.
- Configure these variables in your hosting provider (Vercel/Render) as environment variables too.
