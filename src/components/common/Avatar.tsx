import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
  showTooltip?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  color = '#5e6ad2',
  showTooltip = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const initials = (name || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizePx = {
    xs: 20,
    sm: 24,
    md: 30,
    lg: 38,
    xl: 52,
  }[size];

  const fontPx = {
    xs: '0.625rem',
    sm: '0.6875rem',
    md: '0.75rem',
    lg: '0.875rem',
    xl: '1.125rem',
  }[size];

  return (
    <div
      title={showTooltip ? name : undefined}
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 select-none ${className}`}
      style={{
        width: sizePx,
        height: sizePx,
        backgroundColor: color,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span
          style={{
            fontSize: fontPx,
            fontWeight: 600,
            color: '#ffffff',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {initials}
        </span>
      )}
    </div>
  );
};
