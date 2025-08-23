# TestimonialHub

A modern, full-featured testimonial collection and management platform built with React, TypeScript, and Supabase. Easily collect, manage, and showcase customer testimonials to build trust and grow your business.

## ✨ Features

### 🔗 Collection & Management
- **Shareable Collection Links**: Generate unique URLs to collect testimonials via email, WhatsApp, QR codes, or social media
- **Smart Dashboard**: Organized view with filters, approval workflow, search, and analytics
- **Rich Media Support**: Accept text, photos, and video testimonials with mobile-optimized forms
- **Secure & Verified**: Optional email verification to prevent spam and ensure authenticity

### 🎨 Customizable Display
- **Embeddable Widgets**: Seamlessly integrate testimonials into any website with customizable widgets
- **Multiple Layouts**: Choose from list, grid, carousel, or single testimonial layouts
- **Theme Options**: Light/dark themes with customizable colors, fonts, and styling
- **Responsive Design**: Mobile-first design that looks great on all devices

### 📊 Analytics & Management
- **Approval Workflow**: Review and approve testimonials before they go live
- **Status Tracking**: Monitor pending, approved, and rejected testimonials
- **Star Ratings**: Collect and display star ratings alongside testimonials
- **Client Information**: Capture client names, emails, and company information

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/slok0066/testimonial.git
   cd testimonial
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
   
   > Note: Vite only exposes variables prefixed with `VITE_` to the client.

4. **Database Setup**
   
   Set up your Supabase database with the required tables. The application expects:
   - `testimonials` table for storing testimonial data
   - `user_settings` table for user configuration
   - Authentication enabled

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

## 🛠️ Build & Deploy

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 📦 Deployment

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automatically on push to main branch

### Deploy to Render
1. Connect your GitHub repository to Render
2. Use the included `render.yaml` configuration
3. Set environment variables in Render dashboard

## 🎯 Usage

### For Business Owners

1. **Sign Up**: Create an account and access your dashboard
2. **Get Collection URL**: Generate a unique link for collecting testimonials
3. **Share Link**: Send via email, social media, or QR codes to your customers
4. **Manage Testimonials**: Review, approve, and organize testimonials in your dashboard
5. **Embed Widget**: Add testimonials to your website using the embed code

### For Customers

1. **Access Collection Link**: Click the link shared by the business
2. **Submit Testimonial**: Fill out the simple form with your feedback
3. **Add Details**: Include your name, company, rating, and testimonial text
4. **Submit**: Your testimonial will be reviewed and published by the business

## 🎨 Embed Widget

### Basic Implementation
```html
<!-- Add this div where you want testimonials to appear -->
<div id="testimonia-widget"></div>

<!-- Add the script with your configuration -->
<script
  data-slug="your-collection-slug"
  data-layout="list"
  data-theme="light"
  data-primary-color="#f59e0b"
  data-max-items="10"
  src="https://your-domain.com/embed.js">
</script>
```

### Configuration Options
- `data-slug`: Your unique collection slug (required)
- `data-layout`: `list`, `grid`, `carousel`, or `single`
- `data-theme`: `light` or `dark`
- `data-primary-color`: Hex color for accents
- `data-max-width`: Maximum width of the widget
- `data-max-items`: Maximum number of testimonials to show
- `data-show-stars`: Show/hide star ratings (`true`/`false`)
- `data-grid-columns`: Number of columns for grid layout
- `data-border-radius`: Border radius for cards
- `data-shadow`: Shadow style (`none`, `sm`, `md`, `lg`)
- `data-font`: Font family (`sans`, `serif`, `mono`)

## 🗂️ Project Structure

```
├── public/
│   ├── embed.js          # Embeddable widget script
│   └── robots.txt        # SEO configuration
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   └── dashboard/   # Dashboard-specific components
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # External service integrations
│   ├── lib/             # Utility functions and configurations
│   ├── pages/           # Page components
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── vite.config.ts       # Vite configuration
```

## 🛡️ Security & Privacy

- **Secure Authentication**: Powered by Supabase Auth with OAuth and email/password options
- **Data Validation**: Client and server-side validation for all inputs
- **Spam Protection**: Optional email verification for testimonial submissions
- **Privacy Controls**: Users control testimonial approval and visibility
- **HTTPS Only**: All communications encrypted in transit

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and environment setup guide
- **Issues**: Open an issue on GitHub for bug reports or feature requests
- **Discussions**: Use GitHub Discussions for questions and community support

## 🔧 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui, Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel, Render

---

Made with ❤️ for businesses who value customer feedback