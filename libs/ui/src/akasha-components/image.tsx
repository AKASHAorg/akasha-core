'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/library/utils';

const ImageContext = React.createContext<{
  isLoading: boolean;
  hasError: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
} | null>(null);

const useImageContext = () => {
  const context = React.useContext(ImageContext);
  if (!context) {
    throw new Error('`useImageContext` must be used within an `ImageRoot` component');
  }
  return context;
};

const ImageRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    const [isLoading, setLoading] = React.useState(true);
    const [hasError, setError] = React.useState(false);

    return (
      <ImageContext.Provider value={{ isLoading, hasError, setLoading, setError }}>
        <div ref={ref} {...props}>
          {children}
        </div>
      </ImageContext.Provider>
    );
  },
);

const ImageFallback = React.forwardRef<
  HTMLSpanElement,
  React.ButtonHTMLAttributes<HTMLSpanElement>
>(({ children }, ref) => {
  const { hasError } = useImageContext();
  return hasError ? <span ref={ref}>{children}</span> : null;
});

interface DelayLoadProps {
  children: React.ReactNode;
  loadAfter?: number;
}

export const DelayLoad: React.FC<DelayLoadProps> = ({ children, loadAfter = 300 }) => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, loadAfter);
    return () => clearTimeout(timer);
  }, [loadAfter]);

  return <>{show ? children : null}</>;
};

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  showLoadingIndicator?: boolean;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ alt, showLoadingIndicator, className, onLoad, onError, ...props }, ref) => {
    const { setLoading, setError, isLoading, hasError } = useImageContext();

    React.useEffect(() => {
      setLoading(true);
    }, [setLoading]);

    return (
      <>
        {showLoadingIndicator && isLoading && (
          <DelayLoad>
            <div className={cn('flex items-center justify-center', className)}>
              <Loader2 className={cn('animate-spin text-muted')} />
            </div>
          </DelayLoad>
        )}
        {!hasError && (
          <img
            ref={ref}
            loading="lazy"
            decoding="async"
            onLoad={event => {
              setLoading(false);
              onLoad?.(event);
            }}
            onError={event => {
              setError(true);
              setLoading(false);
              onError?.(event);
            }}
            alt={alt}
            className={cn('object-contain', className)}
            {...props}
          />
        )}
      </>
    );
  },
);

export { ImageRoot, ImageFallback, Image };
