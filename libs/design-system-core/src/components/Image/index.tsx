import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

export type ImageProps = PropsWithChildren<
  React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
    customStyle?: string;
    dataTestId?: string;
  }
>;

const Image: React.FC<ImageProps> = props => {
  const { src, customStyle = '', dataTestId, ...rest } = props;

  const className = apply`object-contain ${customStyle}`;

  return (
    <img
      loading="lazy"
      decoding="async"
      alt={src}
      src={src}
      className={tw(className)}
      aria-label={src}
      data-testid={dataTestId}
      {...rest}
    />
  );
};

export default Image;
