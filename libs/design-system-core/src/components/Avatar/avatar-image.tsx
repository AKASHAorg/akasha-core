import React from 'react';

export type AvatarImageProps = {
  url?: string;
  alt?: string;
  fallbackUrl: string;
  faded?: boolean;
};

const AvatarImage: React.FC<AvatarImageProps> = props => {
  const { url, alt = 'avatar', fallbackUrl, faded } = props;

  const className = faded ? 'opacity-50' : 'opacity-100';

  const Image = React.createElement('img', {
    src: fallbackUrl,
    fetchpriority: 'high',
    loading: 'lazy',
    decoding: 'async',
    'data-testid': 'avatar-image',
    alt: alt,
  });

  return (
    <picture className={className}>
      <source data-testid="avatar-source" srcSet={url} />
      {Image}
    </picture>
  );
};

export default AvatarImage;
