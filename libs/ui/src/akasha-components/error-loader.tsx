import * as React from 'react';

import { Image, ImageFallback } from '@/akasha-components/image';
import { Card, CardTitle, CardDescription, CardFooter } from '@/akasha-components/card';
import { cn } from '@/library/utils';

const ErrorLoaderTitle = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <CardTitle
      ref={ref}
      data-slot="error-loader-title"
      className={cn('pt-4', className)}
      {...props}
    />
  ),
);

const ErrorLoaderDescription = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <CardDescription
    ref={ref}
    data-slot="error-loader-description"
    className={cn('pt-2', className)}
    {...props}
  />
));

const ErrorLoaderFooter = React.forwardRef<React.ElementRef<'div'>, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <CardFooter
      ref={ref}
      data-slot="error-loader-footer"
      className={cn('justify-center', className)}
      {...props}
    />
  ),
);

const ErrorLoader = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentProps<'div'> & {
    type:
      | 'no-apps'
      | 'not-authenticated'
      | 'script-error'
      | 'page-not-found'
      | 'list-not-available';
    publicImgPath?: string;
  }
>(({ children, publicImgPath = '/images', type, className, ...props }, ref) => {
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
    <Card ref={ref} data-slot="error-loader" className={cn(className)} {...props}>
      <div className={cn('flex justify-center px-6')}>
        <Image
          src={imageSrc}
          alt="Error Image"
          className="size-[12.5rem] object-contain rounded-lg"
        >
          <ImageFallback>Failed to load image</ImageFallback>
        </Image>
      </div>
      {children}
    </Card>
  );
});

export { ErrorLoader, ErrorLoaderTitle, ErrorLoaderDescription, ErrorLoaderFooter };
