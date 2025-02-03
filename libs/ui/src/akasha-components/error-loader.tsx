import * as React from 'react';

import { Image, ImageFallback, ImageRoot } from '@/akasha-components/image';
import { Button, ButtonProps } from '@/akasha-components/button';
import { Card, CardTitle, CardContent, CardFooter } from '@/components/card';
import { Typography } from '@/akasha-components/typography';
import { cn } from '@/library/utils';
interface ErrorLoaderProps extends React.PropsWithChildren {
  /**
   * Error type
   */
  type: 'no-apps' | 'not-authenticated' | 'script-error' | 'page-not-found' | 'list-not-available';
  /* Path to public folder */
  publicImgPath?: string;
  title: string;
  details?: string;
  className?: string;
}

/**
 * An ErrorLoader serves the purpose of displaying an error card with an image and a messagge
 * explaining to the user the error in detail. It can also have an optional call to action button
 * @param type -  error type
 * @param publicImgPath - (optional) path of the image to be displayed
 * @param title - error title
 * @param details - additional details about the error
 * @param children - optional call to action button
 * @example
 * ```tsx
 *  <ErrorLoader type="script-error" title="Error in akasha app" message={error.message}>
 *    <ErrorLoaderButton>Action</ErrorLoaderButton>
 *  </ErrorLoader>
 * ```
 **/
const ErrorLoader = ({
  title,
  details,
  children,
  publicImgPath = '/images',
  type,
  className,
}: ErrorLoaderProps) => {
  let imagesrc: string;

  switch (type) {
    case 'no-apps':
      imagesrc = `${publicImgPath}/no-apps-error.webp`;
      break;
    case 'not-authenticated':
      imagesrc = `${publicImgPath}/not-authenticated.webp`;
      break;
    case 'page-not-found':
      imagesrc = `${publicImgPath}/new404.webp`;
      break;
    case 'list-not-available':
      imagesrc = `${publicImgPath}/list-not-available.webp`;
      break;
    default:
      imagesrc = `${publicImgPath}/general-error.webp`;
      break;
  }

  let cardButton: React.ReactNode | null = null;

  React.Children.forEach(children, child => {
    if (React.isValidElement(child)) {
      if (child.type === ErrorLoaderButton) {
        if (cardButton) {
          throw new Error('Only one CardButton is allowed');
        }
        cardButton = child;
      } else {
        throw new Error('Invalid child type');
      }
    }
  });

  return (
    <Card
      className={cn('w-full py-5 flex flex-col items-center justify-center rounded-3xl', className)}
    >
      <ImageRoot>
        <Image
          src={imagesrc}
          alt="Error Image"
          className="h-[200px] w-[200px] object-contain rounded-lg"
        />
        <ImageFallback>Failed to load image</ImageFallback>
      </ImageRoot>

      <CardTitle className="flex flex-col items-center justify-center mt-4 mb-2">
        <Typography variant="h5">{title}</Typography>
      </CardTitle>

      {details && (
        <CardContent className="flex flex-col items-center justify-center pb-0">
          <Typography variant="xs" className="text-muted-foreground text-center">
            {details}
          </Typography>
        </CardContent>
      )}

      {cardButton && (
        <CardFooter className="flex flex-col items-center justify-center pt-10 pb-0">
          {cardButton}
        </CardFooter>
      )}
    </Card>
  );
};

const ErrorLoaderButton = ({ ...props }: ButtonProps) => {
  return <Button {...props} />;
};

export { ErrorLoader, ErrorLoaderButton, ErrorLoaderProps };
export default ErrorLoader;
