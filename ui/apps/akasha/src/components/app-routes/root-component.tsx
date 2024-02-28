import React, { Suspense } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
  return (
    <>
      <ScrollRestoration getKey={location => location.pathname} />
      <Suspense fallback={null}>
        <Stack customStyle="fixed">
          <TanStackRouterDevtools />
        </Stack>
      </Suspense>
      <Outlet />
    </>
  );
};

export default RootComponent;
