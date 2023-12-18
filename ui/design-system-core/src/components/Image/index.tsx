import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

export type ImageProps = {
  customStyle?: string;
  dataTestId?: string;
};

const Image: React.FC<
  PropsWithChildren<
    ImageProps &
      React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
  >
> = props => {
  const { src, customStyle = '', dataTestId, ...rest } = props;

  const className = apply`object-contain ${customStyle}`;

  return (
    <img
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
