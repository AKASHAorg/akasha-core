import React from 'react';
import { apply, tw } from '@twind/core';

import { getIpfsImgLink } from '../../utils/get-ipfs-img-link';

export type AvatarImageProps = {
  url?: string;
  alt?: string;
  fallbackUrl: string;
  faded?: boolean;
};

const AvatarImage: React.FC<AvatarImageProps> = props => {
  const { url, alt = 'avatar', fallbackUrl, faded } = props;

  const className = apply`opacity-${faded ? '50' : '100'}`;

  let modifiedUrl: string;

  if (url) {
    modifiedUrl = getIpfsImgLink(url);
  }

  return (
    <picture className={tw(className)}>
      <source srcSet={modifiedUrl} />

      <img data-testid="avatar-image" alt={alt} src={fallbackUrl} />
    </picture>
  );
};

export default AvatarImage;
