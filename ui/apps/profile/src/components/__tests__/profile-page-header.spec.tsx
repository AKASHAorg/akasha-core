import * as React from 'react';

import { ProfilePageHeader } from '../profile-cards/profile-page-header';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  renderWithAllProviders,
  act,
  genUser,
  genLoggedInState,
  genWorldConfig,
} from '@akashaproject/ui-awf-testing-utils';

const mockLocationValue = {
  pathname: '/profile',
  search: '',
  hash: '',
  state: null,
};

jest.mock('react-router', () => ({
  useLocation: jest.fn().mockImplementation(() => {
    return mockLocationValue;
  }),
}));

jest.mock('@akashaproject/awf-sdk', () => jest.fn());

describe('<ProfilePageHeader />', () => {
  let renderResult;
  const mockUser = genUser();
  const BaseComponent = (
    <Router>
      <ProfilePageHeader
        profileId={mockUser.pubKey}
        profileData={mockUser}
        modalSlotId="modal-slot"
        loginState={genLoggedInState()}
        activeModal={null}
        worldConfig={genWorldConfig()}
        parseQueryString={jest.fn()}
        navigateToModal={jest.fn()}
        uiEvents={null}
        layoutConfig={null}
        logger={{
          info: () => {
            /*  */
          },
          warn: () => {
            /*  */
          },
          error: () => {
            /*  */
          },
          setLevel: () => {
            /*  */
          },
        }}
        singleSpa={null}
      />
    </Router>
  );
  beforeEach(() => {
    act(() => {
      renderResult = renderWithAllProviders(BaseComponent, {});
    });
  });
  it('should render an avatar', async () => {
    const avatarNode = await renderResult.findByTestId('avatar-image');
    const avatarSrc = avatarNode.getAttribute('src');
    //console.log(avatarSrc, '<<<< avatar src');
    expect(avatarSrc).toEqual(mockUser.avatar);
  });
});
