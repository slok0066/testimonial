
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

interface UserSettings {
  id: string;
  collection_url_slug: string;
  require_email_verification: boolean;
  allow_photo_uploads: boolean;
  allow_video_testimonials: boolean;
  auto_approve: boolean;
  custom_message?: string;
}

interface SettingsTabProps {
  userSettings: UserSettings | null;
  onSettingsUpdate: (settings: UserSettings) => void;
}

const SettingsTab = ({ userSettings, onSettingsUpdate }: SettingsTabProps) => {
  const [settings, setSettings] = useState<UserSettings | null>(userSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSettings(userSettings);
  }, [userSettings]);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({
          collection_url_slug: settings.collection_url_slug,
          require_email_verification: settings.require_email_verification,
          allow_photo_uploads: settings.allow_photo_uploads,
          allow_video_testimonials: settings.allow_video_testimonials,
          auto_approve: settings.auto_approve,
          custom_message: settings.custom_message,
        })
        .eq('id', settings.id);

      if (error) throw error;

      onSettingsUpdate(settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Collection URL</CardTitle>
          <CardDescription>
            Customize your testimonial collection URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{window.location.origin}/collect/</span>
              <Input
                id="slug"
                value={settings.collection_url_slug}
                onChange={(e) => updateSetting('collection_url_slug', e.target.value)}
                placeholder="your-custom-slug"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Collection Settings</CardTitle>
          <CardDescription>
            Configure how testimonials are collected and processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Email Verification</Label>
              <p className="text-sm text-gray-500">
                Require users to verify their email before submitting
              </p>
            </div>
            <Switch
              checked={settings.require_email_verification}
              onCheckedChange={(checked) => updateSetting('require_email_verification', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Photo Uploads</Label>
              <p className="text-sm text-gray-500">
                Let users upload photos with their testimonials
              </p>
            </div>
            <Switch
              checked={settings.allow_photo_uploads}
              onCheckedChange={(checked) => updateSetting('allow_photo_uploads', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Video Testimonials</Label>
              <p className="text-sm text-gray-500">
                Enable video testimonial submissions
              </p>
            </div>
            <Switch
              checked={settings.allow_video_testimonials}
              onCheckedChange={(checked) => updateSetting('allow_video_testimonials', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-approve Testimonials</Label>
              <p className="text-sm text-gray-500">
                Automatically approve new testimonials without review
              </p>
            </div>
            <Switch
              checked={settings.auto_approve}
              onCheckedChange={(checked) => updateSetting('auto_approve', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Message</CardTitle>
          <CardDescription>
            Personalize the message shown to users on your collection page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="We'd love to hear about your experience! Your feedback helps us improve..."
            value={settings.custom_message || ''}
            onChange={(e) => updateSetting('custom_message', e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </>
        )}
      </Button>
    </div>
  );
};

export default SettingsTab;
