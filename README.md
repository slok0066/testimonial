# 🎉 Testimania - Testimonial Management Platform

A powerful, modern testimonial collection and management platform that helps businesses gather, organize, and showcase customer feedback effortlessly.

## ✨ Features

### 🔐 **Authentication & User Management**
- Secure user authentication with Google OAuth and email/password
- Profile management with customizable settings
- Protected routes and role-based access

### 📝 **Testimonial Collection**
- **Custom Collection URLs**: Generate unique, shareable links for testimonial collection
- **Rich Media Support**: Accept text, photos, and video testimonials
- **Mobile-Optimized Forms**: Responsive design for easy submission on any device
- **Rating System**: 5-star rating system with visual feedback

### 📊 **Management Dashboard**
- **Smart Dashboard**: Organized view with filters and search functionality
- **Approval Workflow**: Review, approve, or reject testimonials before publishing
- **Analytics**: Track testimonial statistics and engagement metrics
- **Bulk Operations**: Manage multiple testimonials efficiently

### 🎨 **Customizable Embeds**
- **Multiple Layouts**: List, grid, carousel, and single testimonial views
- **Theme Options**: Light and dark themes with custom color schemes
- **Responsive Design**: Automatically adapts to any website layout
- **Easy Integration**: Simple JavaScript embed code

### 🛠️ **Developer Features**
- **REST API**: Full API access for custom integrations
- **Webhook Support**: Real-time notifications for new testimonials
- **Export Options**: Download testimonials in various formats
- **Custom Styling**: Advanced customization options for developers

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
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Run the Supabase migrations:
   ```bash
   npx supabase db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

## 🏗️ Build & Deploy

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
The project is configured for easy deployment to Vercel:
```bash
vercel deploy
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui component library
│   └── dashboard/      # Dashboard-specific components
├── contexts/           # React context providers
├── lib/               # Utility functions and configurations
├── pages/             # Application pages/routes
└── types/             # TypeScript type definitions

public/
├── embed.js           # Embeddable widget script
└── robots.txt         # SEO configuration

supabase/
└── migrations/        # Database schema and migrations
```

## 🎯 Usage Guide

### For Business Owners

1. **Sign Up**: Create an account using Google or email
2. **Configure Settings**: Set up your collection URL and customize appearance
3. **Share Collection Link**: Send the unique URL to customers
4. **Manage Testimonials**: Review and approve submissions in your dashboard
5. **Embed Testimonials**: Add the widget to your website with generated embed code

### For Developers

#### API Endpoints
```javascript
// Get testimonials for a specific user
GET /api/testimonials?slug={user_slug}

// Submit a new testimonial
POST /api/testimonials
```

#### Embed Widget Usage
```html
<!-- Add to your website -->
<div id="testimania-widget"></div>
<script 
  src="https://your-domain.com/embed.js" 
  data-slug="your-custom-slug"
  data-layout="grid"
  data-theme="light"
  data-max-items="6">
</script>
```

#### Widget Configuration Options
- `data-slug`: Your unique collection slug (required)
- `data-layout`: `list` | `grid` | `carousel` | `single`
- `data-theme`: `light` | `dark`
- `data-primary-color`: Custom primary color (hex)
- `data-max-items`: Maximum number of testimonials to display
- `data-grid-columns`: Number of columns for grid layout
- `data-show-stars`: Show/hide star ratings

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React component library
- **Framer Motion** - Smooth animations and transitions

### Backend & Services
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security** - Secure data access patterns
- **Real-time subscriptions** - Live updates
- **File storage** - Media upload capabilities

### Development Tools
- **ESLint** - Code linting and quality
- **TypeScript** - Static type checking
- **React Query** - Server state management
- **React Router** - Client-side routing

## 🎨 Customization

### Themes and Styling
The platform supports extensive customization through CSS variables and Tailwind configuration:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* Add your custom colors */
}
```

### Component Customization
All UI components are built with shadcn/ui and can be easily customized:

```tsx
import { Button } from "@/components/ui/button"

// Customize variants and styles
<Button variant="outline" size="lg">
  Custom Button
</Button>
```

## 📈 Analytics & Insights

Track important metrics through the dashboard:
- Total testimonials collected
- Approval rates and response times
- Customer satisfaction scores
- Engagement analytics for embedded widgets

## 🔒 Security & Privacy

- **End-to-end encryption** for sensitive data
- **GDPR compliant** data handling
- **Row Level Security** in Supabase
- **Input sanitization** and validation
- **Rate limiting** on API endpoints

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Visit our [docs](https://docs.testimania.com)
- **Community**: Join our [Discord server](https://discord.gg/testimania)
- **Email**: support@testimania.com
- **Issues**: [GitHub Issues](https://github.com/slok0066/testimonial/issues)

## 🚀 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Video testimonial processing
- [ ] AI-powered testimonial insights
- [ ] White-label solutions
- [ ] Mobile app for iOS/Android

## ⭐ Show Your Support

If you found this project helpful, please give it a star on GitHub!

---

Made with ❤️ by the Testimania team