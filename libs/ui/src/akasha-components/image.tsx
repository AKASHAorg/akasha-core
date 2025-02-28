import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/library/utils';

const ImageContext = React.createContext<{
  hasError: boolean;
} | null>(null);

const useImageContext = () => {
  const context = React.useContext(ImageContext);
  if (!context) {
    throw new Error('`useImageContext` must be used within an `Image` component');
  }
  return context;
};

const ImageFallback = ({ children }: React.ComponentProps<'span'>) => {
  const { hasError } = useImageContext();
  return hasError && <span data-slot="image-fallback">{children}</span>;
};

const DelayLoad = ({
  children,
  loadAfter = 300,
}: {
  children: React.ReactNode;
  loadAfter?: number;
}) => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShow(true), loadAfter);
    return () => clearTimeout(timer);
  }, [loadAfter]);

  return show ? <>{children}</> : null;
};

const Image = ({
  src,
  alt,
  showLoadingIndicator,
  className,
  children,
  onLoad,
  onError,
  ...props
}: React.ComponentProps<'img'> & {
  showLoadingIndicator?: boolean;
}) => {
  const [loading, setLoading] = React.useState(true);
  const [hasError, setError] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
  }, [setLoading]);

  return (
    <ImageContext.Provider value={{ hasError }}>
      <div data-slot="image-container" className="relative">
        {showLoadingIndicator && loading && (
          <DelayLoad>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted" />
            </div>
          </DelayLoad>
        )}
        {!hasError && (
          <img
            data-slot="image"
            src={src}
            alt={alt}
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
            className={cn('object-contain', className)}
            {...props}
          />
        )}
        {children}
      </div>
    </ImageContext.Provider>
  );
};

export { Image, ImageFallback };
