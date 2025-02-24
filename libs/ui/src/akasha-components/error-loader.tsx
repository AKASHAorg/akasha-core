import * as React from 'react';

import { Image, ImageFallback, ImageRoot } from '@/akasha-components/image';
import { Card, CardTitle, CardDescription, CardFooter } from '@/akasha-components/card';
import { cn } from '@/library/utils';

const ErrorLoaderTitle = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <CardTitle data-slot="error-loader-title" className={cn('pt-4', className)} {...props} />
);

const ErrorLoaderDescription = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <CardDescription
    data-slot="error-loader-description"
    className={cn('pt-2', className)}
    {...props}
  />
);

const ErrorLoaderFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <CardFooter
    data-slot="error-loader-footer"
    className={cn('justify-center', className)}
    {...props}
  />
);

const ErrorLoader = ({
  children,
  publicImgPath = '/images',
  type,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  type: 'no-apps' | 'not-authenticated' | 'script-error' | 'page-not-found' | 'list-not-available';
  publicImgPath?: string;
}) => {
  let imageSrc: string;

  switch (type) {
    case 'no-apps':
      imageSrc = `${publicImgPath}/no-apps-error.webp`;
      break;
    case 'not-authenticated':
      imageSrc = `${publicImgPath}/not-authenticated.webp`;
      break;
    case 'page-not-found':
      imageSrc = `${publicImgPath}/new404.webp`;
      break;
    case 'list-not-available':
      imageSrc = `${publicImgPath}/list-not-available.webp`;
      break;
    default:
      imageSrc = `${publicImgPath}/general-error.webp`;
      break;
  }

  return (
    <Card data-slot="error-loader" className={cn(className)} {...props}>
      <ImageRoot className={cn('flex justify-center px-6')}>
        <Image
          src={imageSrc}
          alt="Error Image"
          className="size-[12.5rem] object-contain rounded-lg"
        />
        <ImageFallback>Failed to load image</ImageFallback>
      </ImageRoot>
      {children}
    </Card>
  );
};

export { ErrorLoader, ErrorLoaderTitle, ErrorLoaderDescription, ErrorLoaderFooter };
