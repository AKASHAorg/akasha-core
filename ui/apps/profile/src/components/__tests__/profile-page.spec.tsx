import * as React from 'react';
import ProfilePage from '../routes/profile-page';
import * as hooks from '@akashaorg/ui-awf-hooks/lib/use-profile';

import {
  renderWithAllProviders,
  act,
  screen,
  genLoggedInState,
  genAppProps,
  genLoggedUser,
  genUser,
} from '@akashaorg/af-testing';
import { IProfileData } from '@akashaorg/typings/ui';

const mockLocationValue = {
  pathname: '/@akashaorg/app-profile',
  search: '',
  hash: '',
  state: null,
};

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({ pubKey: '' })),
  useSearchParams: jest.fn(() => ['', () => '']),
  useLocation: jest.fn().mockImplementation(() => {
    return mockLocationValue;
  }),
}));

describe('< ProfilePage />', () => {
  const BaseComponent = (
    <ProfilePage
      {...genAppProps()}
      loggedProfileData={genLoggedUser()}
      loginState={genLoggedInState()}
    />
  );

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  beforeAll(() => {
    (
      jest.spyOn(hooks, 'useGetProfile') as unknown as jest.SpyInstance<{
        data: IProfileData;
        status: 'success' | 'error';
      }>
    ).mockReturnValue({ data: genUser(), status: 'success' });
  });

  it('should render profile page', async () => {
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
  });
});
