import React from 'react';
import { tw } from 'twind';

export interface IAvatarImageProps {
  url?: string;
  alt?: string;
  fallbackUrl: string;
  faded?: boolean;
}

const AvatarImage: React.FC<IAvatarImageProps> = props => {
  const { url, alt = 'avatar', fallbackUrl, faded } = props;

  const className = `opacity-${faded ? '50' : '100'}`;

  return (
    <picture className={tw`${className}`}>
      <source srcSet={url} />
      <img data-testid="avatar-image" alt={alt} src={fallbackUrl} />
    </picture>
  );
};

export default AvatarImage;
