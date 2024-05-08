import React, { Suspense } from 'react';
import { ScrollRestoration } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TopbarComponent from '../topbar-component';

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
      <Suspense fallback={<></>}>
        <Stack customStyle="fixed">
          <TanStackRouterDevtools />
        </Stack>
      </Suspense>
      <TopbarComponent />
    </>
  );
};

export default RootComponent;
