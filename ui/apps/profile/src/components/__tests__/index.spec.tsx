import * as React from 'react';
import Index from '../pages';
import * as hooks from '@akashaorg/ui-awf-hooks/lib/use-profile';

import {
  renderWithAllProviders,
  act,
  screen,
  genAppProps,
  genLoggedUser,
  genUser,
} from '@akashaorg/af-testing';
import { Profile } from '@akashaorg/typings/ui';

const mockLocationValue = {
  pathname: '/@akashaorg/app-profile',
  search: '',
  hash: '',
  state: null,
};

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ pubKey: '' })),
  useSearchParams: jest.fn(() => [{ get: () => '' }, () => '']),
  useLocation: jest.fn().mockImplementation(() => {
    return mockLocationValue;
  }),
}));

describe('< Index />', () => {
  const BaseComponent = <Index {...genAppProps()} loggedProfileData={genLoggedUser()} />;

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  beforeAll(() => {
    (
      jest.spyOn(hooks, 'useGetProfile') as unknown as jest.SpyInstance<{
        data: Profile;
        status: 'success' | 'error';
      }>
    ).mockReturnValue({ data: genUser(), status: 'success' });
  });
  // @TODO after fixing app with new hooks
  it.skip('should render profile page', async () => {
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
  });
});
