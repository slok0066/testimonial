import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { EmbedPreview } from './EmbedPreview';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Copy } from 'lucide-react';

interface UserSettings {
  id: string;
  collection_url_slug: string;
  api_key: string; // Unique API key for widget
  rate_limit: number; // Requests per minute
  timeout: number; // Request timeout in milliseconds
  allowed_ips: string[]; // List of allowed IPs
  cors_origins: string[]; // Allowed CORS origins
  max_testimonials: number; // Maximum testimonials to show
  animation_type: 'fade' | 'slide' | 'none';
  font_size: 'sm' | 'md' | 'lg';
  font_weight: 'normal' | 'medium' | 'bold';
  card_padding: 'sm' | 'md' | 'lg';
  border_style: 'solid' | 'dashed' | 'dotted' | 'none';
  border_width: 'thin' | 'default' | 'thick';
  loading_spinner: 'dots' | 'ring' | 'pulse' | 'none';
}

export const EmbedTab = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState('list');
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#f59e0b');
  const [showStars, setShowStars] = useState(true);
  const [widgetTitle, setWidgetTitle] = useState('What our customers say');
  const [gridColumns, setGridColumns] = useState(3);
  const [borderRadius, setBorderRadius] = useState(8);
  const [cardShadow, setCardShadow] = useState('md');
  const [font, setFont] = useState('sans');
  const [gap] = useState(16);

  const [fontSize, setFontSize] = useState('md');
  const [fontWeight, setFontWeight] = useState('normal');
  const [cardPadding, setCardPadding] = useState('md');
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderWidth, setBorderWidth] = useState('default');
  const [loadingSpinner, setLoadingSpinner] = useState('dots');
  const [activeView, setActiveView] = useState('preview');
  const [maxTestimonials, setMaxTestimonials] = useState(10);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (error) {
          throw error;
        }
        setSettings(data as UserSettings);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
        console.error('Error fetching settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [user]);

  const generateEmbedCode = () => {
    if (!settings) return '';

    // Generate the embed code with all the configuration
    return `<script src="${window.location.origin}/embed.js" 
      data-slug="${settings.collection_url_slug}" 
      data-layout="${layout}" 
      data-theme="${theme}" 
      data-primary-color="${primaryColor}" 
      data-show-stars="${showStars}" 
      data-widget-title="${encodeURIComponent(widgetTitle)}" 
      data-grid-columns="${gridColumns}" 
      data-border-radius="${borderRadius}" 
      data-shadow="${cardShadow}" 
      data-font="${font}" 
      data-gap="${gap}" 
      defer>
    </script>`;
  };

  const embedCode = generateEmbedCode();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied!');
  };

  const previewProps = {
    layout: layout as 'list' | 'grid' | 'carousel' | 'single',
    theme: theme as 'light' | 'dark',
    primaryColor,
    showStars,
    widgetTitle,
    gridColumns,
    borderRadius,
    cardShadow,
    font,
    gap,
  };

  const accordionContentVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.42, 0, 0.58, 1] } },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col space-y-4">
        <div className="text-red-500">{error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customization Section */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Customize Your Widget</CardTitle>
          <p className="text-sm text-gray-500">Adjust settings to match your website's style</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="single" collapsible defaultValue='item-1' className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm font-medium">Layout Settings</AccordionTrigger>
              <AccordionContent>
                <motion.div variants={accordionContentVariants} initial="hidden" animate="visible" className='space-y-4'>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Layout Type</Label>
                    <Select value={layout} onValueChange={(value) => setLayout(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="list">List View</SelectItem>
                        <SelectItem value="grid">Grid View</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                        <SelectItem value="single">Single Testimonial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {layout === 'grid' && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Columns</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="grid-columns" 
                          type="number" 
                          value={gridColumns} 
                          onChange={(e) => setGridColumns(Number(e.target.value))} 
                          min={1} 
                          max={5} 
                          className="w-24"
                          placeholder="3"
                        />
                        <span className="text-sm text-gray-500">columns</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-sm font-medium">Appearance Settings</AccordionTrigger>
              <AccordionContent>
                <motion.div variants={accordionContentVariants} initial="hidden" animate="visible" className='space-y-4'>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Theme</Label>
                      <Select value={theme} onValueChange={(value) => setTheme(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light Mode</SelectItem>
                          <SelectItem value="dark">Dark Mode</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Primary Color</Label>
                      <Input 
                        id="primary-color" 
                        type="color" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)} 
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Font Family</Label>
                      <Select value={font} onValueChange={(value) => setFont(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sans">Sans Serif</SelectItem>
                          <SelectItem value="serif">Serif</SelectItem>
                          <SelectItem value="mono">Monospace</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Font Size</Label>
                      <Select value={fontSize} onValueChange={(value) => setFontSize(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose font size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sm">Small</SelectItem>
                          <SelectItem value="md">Medium</SelectItem>
                          <SelectItem value="lg">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Font Weight</Label>
                      <Select value={fontWeight} onValueChange={(value) => setFontWeight(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose font weight" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Card Padding</Label>
                      <Select value={cardPadding} onValueChange={(value) => setCardPadding(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose padding" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sm">Small</SelectItem>
                          <SelectItem value="md">Medium</SelectItem>
                          <SelectItem value="lg">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Border Style</Label>
                      <Select value={borderStyle} onValueChange={(value) => setBorderStyle(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose border style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="dashed">Dashed</SelectItem>
                          <SelectItem value="dotted">Dotted</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Border Width</Label>
                      <Select value={borderWidth} onValueChange={(value) => setBorderWidth(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose border width" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thin">Thin</SelectItem>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="thick">Thick</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Loading Spinner</Label>
                      <Select value={loadingSpinner} onValueChange={(value) => setLoadingSpinner(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose loading spinner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dots">Dots</SelectItem>
                          <SelectItem value="ring">Ring</SelectItem>
                          <SelectItem value="pulse">Pulse</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-sm font-medium">Security Settings</AccordionTrigger>
              <AccordionContent>
                <motion.div variants={accordionContentVariants} initial="hidden" animate="visible" className='space-y-4'>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">API Key</Label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{settings?.api_key?.slice(0, 6)}...{settings?.api_key?.slice(-4)}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigator.clipboard.writeText(settings?.api_key ?? '')}
                          disabled={!settings?.api_key}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Rate Limit (requests per minute)</Label>
                      <Input 
                        id="rate-limit" 
                        type="number" 
                        value={settings?.rate_limit ?? 60} 
                        onChange={(e) => {
                          const newLimit = Number(e.target.value);
                          if (newLimit >= 1 && newLimit <= 1000) {
                            supabase
                              .from('user_settings')
                              .update({ rate_limit: newLimit })
                              .eq('id', settings?.id);
                          }
                        }}
                        min={1}
                        max={1000}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Request Timeout (ms)</Label>
                      <Input 
                        id="timeout" 
                        type="number" 
                        value={settings?.timeout ?? 5000} 
                        onChange={(e) => {
                          const newTimeout = Number(e.target.value);
                          if (newTimeout >= 1000 && newTimeout <= 30000) {
                            supabase
                              .from('user_settings')
                              .update({ timeout: newTimeout })
                              .eq('id', settings?.id);
                          }
                        }}
                        min={1000}
                        max={30000}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Allowed IPs</Label>
                      <div className="space-y-2">
                        {settings?.allowed_ips?.map((ip) => (
                          <div key={ip} className="flex items-center space-x-2">
                            <span className="text-sm">{ip}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                const newIps = settings?.allowed_ips?.filter((currentIp) => currentIp !== ip) ?? [];
                                supabase
                                  .from('user_settings')
                                  .update({ allowed_ips: newIps })
                                  .eq('id', settings?.id);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Input 
                          placeholder="Add IP address"
                          onChange={(e) => {
                            const newIp = e.target.value;
                            if (newIp && settings?.allowed_ips?.indexOf(newIp) === -1) {
                              const newIps = [...(settings?.allowed_ips ?? []), newIp];
                              supabase
                                .from('user_settings')
                                .update({ allowed_ips: newIps })
                                .eq('id', settings?.id);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">CORS Origins</Label>
                      <div className="space-y-2">
                        {settings?.cors_origins?.map((origin) => (
                          <div key={origin} className="flex items-center space-x-2">
                            <span className="text-sm">{origin}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                const newOrigins = settings?.cors_origins?.filter((currentOrigin) => currentOrigin !== origin) ?? [];
                                supabase
                                  .from('user_settings')
                                  .update({ cors_origins: newOrigins })
                                  .eq('id', settings?.id);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Input 
                          placeholder="Add CORS origin"
                          onChange={(e) => {
                            const newOrigin = e.target.value;
                            if (newOrigin && settings?.cors_origins?.indexOf(newOrigin) === -1) {
                              const newOrigins = [...(settings?.cors_origins ?? []), newOrigin];
                              supabase
                                .from('user_settings')
                                .update({ cors_origins: newOrigins })
                                .eq('id', settings?.id);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Appearance</AccordionTrigger>
              <AccordionContent>
                <motion.div variants={accordionContentVariants} initial="hidden" animate="visible" className='space-y-6'>
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <Input id="primary-color" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10" />
                  </div>
                  <div className="space-y-3 pt-4">
                    <Label htmlFor="border-radius">Border Radius: {borderRadius}px</Label>
                    <Slider id="border-radius" min={0} max={32} step={1} value={[borderRadius]} onValueChange={(value) => setBorderRadius(value[0])} />
                  </div>
                  <div className="space-y-2 pt-4">
                    <Label>Card Shadow</Label>
                    <Select value={cardShadow} onValueChange={(value) => setCardShadow(value)}>
                      <SelectTrigger><SelectValue placeholder="Select shadow" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Content & Typography</AccordionTrigger>
              <AccordionContent>
                <motion.div variants={accordionContentVariants} initial="hidden" animate="visible" className='space-y-6'>
                  <div className="space-y-2">
                    <Label htmlFor="widget-title">Widget Header</Label>
                    <Input id="widget-title" type="text" value={widgetTitle} onChange={(e) => setWidgetTitle(e.target.value)} placeholder='What our customers say' />
                  </div>
                  <div className="space-y-2 pt-4">
                    <Label>Font Family</Label>
                    <Select value={font} onValueChange={(value) => setFont(value)}>
                      <SelectTrigger><SelectValue placeholder="Select font" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sans">Sans-serif</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="mono">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="max-testimonials">Max Testimonials</Label>
                    <Input id="max-testimonials" type="number" value={maxTestimonials} onChange={(e) => setMaxTestimonials(Number(e.target.value))} />
                  </div>
                  <div className="flex items-center space-x-2 pt-4">
                    <Switch id="show-stars" checked={showStars} onCheckedChange={setShowStars} />
                    <Label htmlFor="show-stars">Show Star Ratings</Label>
                  </div>
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Preview/Code Section */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Widget Preview</CardTitle>
          <p className="text-sm text-gray-500">Preview your widget or get the embed code</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <Button 
                size="sm" 
                variant={activeView === 'preview' ? 'default' : 'outline'} 
                onClick={() => setActiveView('preview')}
                className="flex-1"
              >
                <span className="text-sm">Preview</span>
              </Button>
              <Button 
                size="sm" 
                variant={activeView === 'code' ? 'default' : 'outline'} 
                onClick={() => setActiveView('code')}
                className="flex-1"
              >
                <span className="text-sm">Embed Code</span>
              </Button>
            </div>
            <AnimatePresence mode="wait">
              {activeView === 'preview' ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <EmbedPreview {...previewProps} />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full max-w-sm mt-4"
                        onClick={copyToClipboard}
                        disabled={!embedCode}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Embed Code
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <div className="p-4 bg-gray-900 rounded-md font-mono text-sm text-gray-200 relative overflow-auto h-[400px]">
                      <pre><code>{embedCode}</code></pre>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={copyToClipboard}
                      disabled={!embedCode}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
