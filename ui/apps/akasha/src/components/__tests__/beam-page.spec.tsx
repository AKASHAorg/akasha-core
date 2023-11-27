import React from 'react';
import BeamPage from '../pages/entry-page/beam-page';
import * as hooks from '@akashaorg/ui-awf-hooks/lib/generated';

import {
  screen,
  renderWithAllProviders,
  act,
  genAppProps,
  genBeamData,
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

describe('< BeamPage /> component', () => {
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
      jest.spyOn(hooks, 'useGetBeamByIdQuery') as unknown as jest.SpyInstance<{
        data: AkashaBeam;
        status: 'success' | 'error' | 'loading';
      }>
    ).mockReturnValue({ data: genBeamData(), status: 'success' });
  });

  it('should render beam page', async () => {
    expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reflect/i })).toBeInTheDocument();
  });
});
