import React from 'react';
import { apply, tw } from '@twind/core';

export type AvatarImageProps = {
  url?: string;
  alt?: string;
  fallbackUrl: string;
  faded?: boolean;
};

const AvatarImage: React.FC<AvatarImageProps> = props => {
  const { url, alt = 'avatar', fallbackUrl, faded } = props;

  const className = apply`opacity-${faded ? '50' : '100'}`;

  const Image = React.createElement('img', {
    src: fallbackUrl,
    fetchpriority: 'high',
    loading: 'lazy',
    decoding: 'async',
    'data-testid': 'avatar-image',
    alt: alt,
  });

  return (
    <picture className={tw(className)}>
      <source srcSet={url} />
      {Image}
    </picture>
  );
};

export default AvatarImage;
