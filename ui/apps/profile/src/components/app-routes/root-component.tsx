import React, { Suspense } from 'react';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { Outlet, ScrollRestoration } from '@tanstack/react-router';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : React.lazy(() =>
        import('@tanstack/router-devtools').then(res => ({
          default: res.TanStackRouterDevtools,
        })),
      );

const RootComponent = () => {
  const { t } = useTranslation('app-profile');
  const { logger } = useRootComponentProps();

  const errorBoundaryProps: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: t('script-error'),
      title: t('Error in profile app'),
    },
    logger,
  };

  return (
    <>
      <ScrollRestoration getKey={location => location.pathname} />
      <Suspense fallback={null}>
        <TanStackRouterDevtools />
      </Suspense>
      <ErrorBoundary {...errorBoundaryProps}>
        <Outlet />
      </ErrorBoundary>
    </>
  );
};

export default RootComponent;
