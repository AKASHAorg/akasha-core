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

  return (
    <picture className={tw(className)}>
      <source srcSet={url} />

      <img data-testid="avatar-image" alt={alt} src={fallbackUrl} />
    </picture>
  );
};

export default AvatarImage;
