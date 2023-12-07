import React from 'react';
import BeamPage from '../pages/entry-page/beam-page';
import * as hooks from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

import {
  screen,
  renderWithAllProviders,
  act,
  genAppProps,
  genBeamData,
  genUser,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { AkashaBeam } from '@akashaorg/typings/lib/sdk/graphql-types-new';

const mockLocationValue = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
};

const mockRouteParams = {
  beamId: 'kjzl6kcym7w8y7r2ej5n3oaq3l6bp4twqxmcvjoa3dlf86mvdb4vv7ryv1pkewr',
};

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn().mockImplementation(() => {
    return mockLocationValue;
  }),
  useParams: jest.fn().mockImplementation(() => {
    return mockRouteParams;
  }),
}));

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
      <BeamPage />
    </AnalyticsProvider>
  );

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  beforeAll(() => {
    (
      jest.spyOn(hooks, 'useGetBeamByIdSuspenseQuery') as unknown as jest.SpyInstance<{
        data: { node: AkashaBeam };
        isLoading: boolean;
      }>
    ).mockReturnValue({ data: { node: genBeamData() }, isLoading: true });
    (
      jest.spyOn(hooks, 'useGetMyProfileQuery') as unknown as jest.SpyInstance<{
        data: { viewer: { akashaProfile: ReturnType<typeof genUser> } };
      }>
    ).mockReturnValue({ data: { viewer: { akashaProfile: genUser() } } });
  });

  it('should render beam page', async () => {
    expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reflect/i })).toBeInTheDocument();
  });
});
