import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

export type ImageProps = PropsWithChildren<
  React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
    customStyle?: string;
    dataTestId?: string;
  }
>;

/**
 * The Image component offers a simple yet efficient way to include an image in your app.
 * The component makes use of lazy loading and async decoding so that the browser will
 * only load your image when needed and decode it asyncronously so as to avoid blocking
 * other elements from rendering.
 * The Image component accepts all the props a normal HTML <img> tag accepts, plus more:
 * @param customStyle - (optional) apply your custom styling (Make sure to use standard Tailwind classes)
 * @param dataTestId - (optional) useful when writing tests for the component
 * @example
 * ```tsx
 *   <Image
 *      customStyle="object-contain rounded-2xl"
 *      src={`${publicImgPath}/${imageName}`}
 *   />
 * ```
 **/
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
