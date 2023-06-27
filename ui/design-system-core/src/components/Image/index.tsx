import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

export type ImageProps = {
  assetName?: string;
  publicImgPath?: string;
  assetExtension?: string;
  customStyle?: string;
  dataTestId?: string;
};

const Image: React.FC<
  PropsWithChildren<
    ImageProps &
      React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
  >
> = props => {
  const {
    src,
    assetName = 'ok',
    publicImgPath = '/images',
    assetExtension = 'webp',
    customStyle,
    dataTestId,
    ...rest
  } = props;

  const className = apply`object-contain ${customStyle}`;

  return (
    <img
      alt={`${assetName}`}
      src={src || `${publicImgPath}/${assetName}.${assetExtension}`}
      className={tw(className)}
      aria-label={`${assetName}`}
      data-testid={dataTestId}
      {...rest}
    />
  );
};

export default Image;
