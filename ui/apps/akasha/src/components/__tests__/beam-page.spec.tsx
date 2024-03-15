import React from 'react';
import BeamPage from '../pages/entry-page/beam-page';
import * as apolloHooks from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import * as useBeamsHook from '@akashaorg/ui-awf-hooks/lib/use-beams';
import * as useReflectionsHook from '@akashaorg/ui-awf-hooks/lib/use-reflections';

import {
  screen,
  renderWithAllProviders,
  act,
  genAppProps,
  genBeamData,
  genUser,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';

class ResizeObserver {
  observe() {
    return;
  }
  unobserve() {
    return;
  }
  disconnect() {
    return;
  }
}

describe('< BeamPage /> component', () => {
  global.ResizeObserver = ResizeObserver;
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <BeamPage
        beamStream={{}}
        beam={{ node: genBeamData() }}
        beamId={'kjzl6kcym7w8y5coci0at0tquy8zmferlog99ys94oj2qgyjy8soxzpbflmlzey'}
      />
    </AnalyticsProvider>
  );

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  beforeAll(() => {
    (
      jest.spyOn(apolloHooks, 'useGetReflectReflectionsLazyQuery') as unknown as jest.SpyInstance<
        [
          typeof jest.fn,
          {
            data: unknown;
            isLoading: boolean;
          },
        ]
      >
    ).mockReturnValue([
      jest.fn().mockReturnValue({ data: undefined }),
      { data: {}, isLoading: false },
    ]);
    (
      jest.spyOn(apolloHooks, 'useGetMyProfileQuery') as unknown as jest.SpyInstance<{
        data: { viewer: { akashaProfile: ReturnType<typeof genUser> } };
      }>
    ).mockReturnValue({
      data: {
        viewer: {
          akashaProfile: genUser('did:pkh:eip155:5:0xc47a483494db8fe455ba29a53a7f75349dfc02ff'),
        },
      },
    });
    (
      jest.spyOn(useBeamsHook, 'useBeams') as unknown as jest.SpyInstance<{
        data: unknown;
      }>
    ).mockReturnValue({ data: {} });
    (
      jest.spyOn(useReflectionsHook, 'useReflections') as unknown as jest.SpyInstance<{
        reflections: unknown[];
        fetchInitialData: typeof jest.fn;
      }>
    ).mockReturnValue({ reflections: [], fetchInitialData: jest.fn });
  });

  it.skip('should render beam page', async () => {
    expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reflect/i })).toBeInTheDocument();
  });
});
