import React, { Suspense } from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
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
      <Suspense fallback={<></>}>
        <Stack className="fixed">
          <TanStackRouterDevtools />
        </Stack>
      </Suspense>
      <TopbarComponent />
    </>
  );
};

export default RootComponent;
