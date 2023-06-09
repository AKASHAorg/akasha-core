import * as React from 'react';
import ProfilePage from '../pages/profile-page';
import * as hooks from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

import { renderWithAllProviders, act, screen, genAppProps, genUser } from '@akashaorg/af-testing';
import { Profile } from '@akashaorg/typings/ui';

const mockLocationValue = {
  pathname: '/@akashaorg/app-profile',
  search: '',
  hash: '',
  state: null,
};

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ profileId: '' })),
  useSearchParams: jest.fn(() => [{ get: () => '' }, () => '']),
  useLocation: jest.fn().mockImplementation(() => {
    return mockLocationValue;
  }),
}));

/*TODO: enhance test */
describe('< Profile />', () => {
  const BaseComponent = <ProfilePage {...genAppProps()} />;

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  beforeAll(() => {
    (
      jest.spyOn(hooks, 'useGetProfileByDidQuery') as unknown as jest.SpyInstance<{
        data: {
          isViewer: boolean;
          profile: Profile;
        };
        status: 'success' | 'error';
      }>
    ).mockReturnValue({ data: { isViewer: true, profile: genUser() }, status: 'success' });
  });
  it.skip('should render profile page', async () => {
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
  });
});
