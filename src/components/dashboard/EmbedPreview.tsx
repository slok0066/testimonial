import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface EmbedPreviewProps {
  layout: 'list' | 'grid' | 'carousel' | 'single';
  theme: 'light' | 'dark';
  primaryColor: string;
  showStars: boolean;
  widgetTitle: string;
  gridColumns?: number;
  borderRadius?: number;
  cardShadow?: string;
  font?: string;
  gap?: number;
}

const SampleTestimonial = ({ primaryColor, showStars, isDark, borderRadius, cardShadow }: { primaryColor: string, showStars: boolean, isDark: boolean, borderRadius?: number, cardShadow?: string }) => {
  const shadowVariants: { [key: string]: string } = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const cardClasses = `p-4 ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-800'} ${shadowVariants[cardShadow ?? 'md']}`;

  return (
    <div className={cardClasses} style={{ borderRadius: `${borderRadius}px` }}>
      {showStars && (
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => <Star key={`star-preview-${i}`} className="h-5 w-5" style={{ color: primaryColor }} fill="currentColor" />)}
        </div>
      )}
      <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-black'}`}>"A Game Changer!"</h3>
      <p className="mb-3 text-sm">This is a sample testimonial to preview the design.</p>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">JD</span>
          </div>
        </div>
        <div className="ml-3">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-500">CEO, Acme Inc.</p>
        </div>
      </div>
    </div>
  );
};


export const EmbedPreview: React.FC<EmbedPreviewProps> = ({
  layout,
  theme,
  primaryColor,
  showStars,
  widgetTitle,
  gridColumns = 3,
  borderRadius = 8,
  cardShadow = 'md',
  font = 'sans',
  gap = 16,
}) => {
  const isDark = theme === 'dark';
  const fontVariants: { [key: string]: string } = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  };
  const containerClass = `font-sans rounded-lg p-4 transition-colors duration-300 w-full ${isDark ? 'bg-gray-900' : 'bg-white'} ${fontVariants[font] ?? 'font-sans'}`;

  const renderContent = () => {
    switch (layout) {
      case 'grid':
        return (
          <div className="grid" style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)`, gap: `${gap}px` }}>
            <SampleTestimonial {...{ primaryColor, showStars, isDark, borderRadius, cardShadow }} />
            <SampleTestimonial {...{ primaryColor, showStars, isDark, borderRadius, cardShadow }} />
          </div>
        );
      case 'carousel':
        return (
          <div className="relative flex items-center justify-center">
            <ChevronLeft className={`absolute left-0 h-8 w-8 p-1 rounded-full bg-black/20 ${isDark ? 'text-white' : 'text-gray-800'}`} />
            <div className="w-full px-8">
                <SampleTestimonial {...{ primaryColor, showStars, isDark, borderRadius, cardShadow }} />
            </div>
            <ChevronRight className={`absolute right-0 h-8 w-8 p-1 rounded-full bg-black/20 ${isDark ? 'text-white' : 'text-gray-800'}`} />
          </div>
        );
      case 'list':
        return (
          <div className="flex flex-col" style={{ gap: `${gap}px` }}>
            <SampleTestimonial {...{ primaryColor, showStars, isDark, borderRadius, cardShadow }} />
            <SampleTestimonial {...{ primaryColor, showStars, isDark, borderRadius, cardShadow }} />
          </div>
        );
      case 'single':
      default:
        return <SampleTestimonial {...{ primaryColor, showStars, isDark, borderRadius, cardShadow }} />;
    }
  };

  return (
    <div className={containerClass}>
      {widgetTitle && <h2 className={`text-xl font-bold text-center mb-4 ${isDark ? 'text-white' : 'text-black'}`}>{widgetTitle}</h2>}
      {renderContent()}
    </div>
  );
};
