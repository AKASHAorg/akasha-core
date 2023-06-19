import * as React from 'react';

const AvatarImage = (props: { url?: string; fallbackUrl: string; faded?: boolean }) => {
  const { url, fallbackUrl, faded } = props;
  return (
    <picture style={{ ...(faded && { opacity: '0.5' }) }}>
      <source data-testid="avatar-image" srcSet={url} />
      <img data-testid="avatar-image-fallback" alt="avatar" src={fallbackUrl} />
    </picture>
  );
};

export default AvatarImage;
