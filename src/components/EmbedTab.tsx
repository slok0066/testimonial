
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Code, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface UserSettings {
  id: string;
  collection_url_slug: string;
  require_email_verification: boolean;
  allow_photo_uploads: boolean;
  allow_video_testimonials: boolean;
  auto_approve: boolean;
  custom_message?: string;
}

interface EmbedTabProps {
  userSettings: UserSettings | null;
}

const EmbedTab = ({ userSettings }: EmbedTabProps) => {
  const [embedType, setEmbedType] = useState<'iframe' | 'link'>('iframe');

  if (!userSettings) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading embed code...</p>
      </div>
    );
  }

  const collectionUrl = `${window.location.origin}/collect/${userSettings.collection_url_slug}`;

  const iframeCode = `<iframe 
  src="${collectionUrl}" 
  width="100%" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
</iframe>`;

  const linkCode = `<a href="${collectionUrl}" target="_blank" rel="noopener noreferrer" 
   style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #6366f1); 
          color: white; padding: 12px 24px; text-decoration: none; 
          border-radius: 8px; font-weight: 600;">
  Leave a Testimonial
</a>`;

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Embed Your Collection Form</CardTitle>
          <CardDescription>
            Choose how you want to embed your testimonial collection form on your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex space-x-4">
            <Button
              variant={embedType === 'iframe' ? 'default' : 'outline'}
              onClick={() => setEmbedType('iframe')}
            >
              <Code className="h-4 w-4 mr-2" />
              iFrame Embed
            </Button>
            <Button
              variant={embedType === 'link' ? 'default' : 'outline'}
              onClick={() => setEmbedType('link')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Link Button
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">
                {embedType === 'iframe' ? 'iFrame Code' : 'Link Button Code'}
              </h4>
              <Button
                size="sm"
                onClick={() => copyToClipboard(embedType === 'iframe' ? iframeCode : linkCode)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
            </div>

            <Textarea
              value={embedType === 'iframe' ? iframeCode : linkCode}
              readOnly
              rows={embedType === 'iframe' ? 6 : 4}
              className="font-mono text-sm bg-gray-50"
            />

            <div className="text-sm text-gray-600">
              {embedType === 'iframe' ? (
                <p>
                  This code will embed your testimonial collection form directly on your website. 
                  The iframe will display the full form and handle submissions automatically.
                </p>
              ) : (
                <p>
                  This code creates a styled button that links to your testimonial collection page. 
                  When clicked, it will open your form in a new tab.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Direct Link</CardTitle>
          <CardDescription>
            Share this direct link with your clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-3 bg-gray-50 rounded-lg border font-mono text-sm">
              {collectionUrl}
            </div>
            <Button onClick={() => copyToClipboard(collectionUrl)} size="sm">
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => window.open(collectionUrl, '_blank')}
              size="sm"
              variant="outline"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmbedTab;
