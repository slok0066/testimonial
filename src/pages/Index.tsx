
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Users, 
  Shield, 
  Zap, 
  Link, 
  BarChart3, 
  Smartphone,
  Globe,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-yellow-500 fill-current" />
              <span className="text-2xl font-bold text-gray-900">TestimonialHub</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/auth')}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
              ✨ Collect, Manage & Showcase Testimonials
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Turn Customer Love Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Business Growth</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The easiest way to collect, manage, and display customer testimonials. 
              Build trust, increase conversions, and grow your business with authentic social proof.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-6">
                Start Collecting Testimonials
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Testimonials
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From collection to display, we've got you covered with powerful features designed for modern businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Shareable Links */}
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Link className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Shareable Collection Links</CardTitle>
                <CardDescription>
                  Generate unique URLs to collect testimonials. Share via email, WhatsApp, QR codes, or social media.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Secure Collection */}
            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Secure & Verified</CardTitle>
                <CardDescription>
                  Collect testimonials with optional email verification to prevent spam and ensure authenticity.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Rich Media */}
            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Rich Media Support</CardTitle>
                <CardDescription>
                  Accept text, photos, and video testimonials. Mobile-optimized forms for easy submission.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Dashboard */}
            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Smart Dashboard</CardTitle>
                <CardDescription>
                  Organized view with filters, approval workflow, search, and analytics to manage all testimonials.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Website Integration */}
            <Card className="border-2 hover:border-indigo-200 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Website Integration</CardTitle>
                <CardDescription>
                  Embed testimonials on your website with customizable widgets. Auto-updates when new ones are approved.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Fast Setup */}
            <Card className="border-2 hover:border-yellow-200 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Quick Setup</CardTitle>
                <CardDescription>
                  Get started in minutes. No technical knowledge required. Start collecting testimonials immediately.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start collecting testimonials in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Collection Link</h3>
              <p className="text-gray-600">
                Sign up and get your unique testimonial collection URL instantly. Customize your message and settings.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Share & Collect</h3>
              <p className="text-gray-600">
                Share your link with customers via email, SMS, WhatsApp, or QR codes. They submit testimonials easily.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Display & Grow</h3>
              <p className="text-gray-600">
                Review, approve, and showcase testimonials on your website. Watch your credibility and sales grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Collecting Testimonials?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses using TestimonialHub to build trust and grow their revenue.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Star className="h-6 w-6 text-yellow-500 fill-current" />
              <span className="text-xl font-bold">TestimonialHub</span>
            </div>
            <div className="text-gray-400">
              © 2024 TestimonialHub. Built with ❤️ for growing businesses.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
