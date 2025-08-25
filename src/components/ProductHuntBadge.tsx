import React, { useState, useMemo } from 'react';

type ProductHuntBadgeProps = {
  postId?: string | number;
  theme?: 'light' | 'dark';
  width?: number;
  height?: number;
  href?: string;
};

export function ProductHuntBadge({
  postId = '1009308',
  theme = 'light',
  width = 250,
  height = 54,
  href = 'https://www.producthunt.com/products/testimonialshub?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-testimonialshub',
}: ProductHuntBadgeProps) {
  const [failed, setFailed] = useState(false);

  const src = useMemo(() => (
    `https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${postId}&theme=${theme}`
  ), [postId, theme]);

  if (failed) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="View on Product Hunt"
      >
        <span className="mr-2">🔗</span>
        See us on Product Hunt
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View Testimonial Hub on Product Hunt"
      className="inline-block"
    >
      <img
        src={src}
        alt="testimonialshub - Collect and showcase testimonials with ease. | Product Hunt"
        style={{ width, height }}
        width={width}
        height={height}
        onError={() => setFailed(true)}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </a>
  );
}

export default ProductHuntBadge;
