import * as React from 'react';
import Profile from '../profile';

import {
  renderWithAllProviders,
  act,
  genUser,
  genLoggedInState,
  genAppProps,
  genWorldConfig,
} from '@akashaorg/af-testing';

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

describe('< Profile />', () => {
  let renderResult;
  const mockUser = genUser();
  const BaseComponent = (
    <Profile
      {...genAppProps()}
      profileId={mockUser.pubKey}
      profileData={mockUser}
      loginState={genLoggedInState()}
      worldConfig={genWorldConfig()}
    />
  );
  beforeEach(async () => {
    await act(async () => {
      renderResult = renderWithAllProviders(BaseComponent, {});
    });
  });
  it('should render profile cards', async () => {
    const avatarNode = await renderResult.findByTestId('avatar-image');
    const avatarSrc = avatarNode.getAttribute('src');
    //console.log(avatarSrc, '<<<< avatar src');
    expect(avatarSrc).toEqual(mockUser.avatar?.url);
  });
});
