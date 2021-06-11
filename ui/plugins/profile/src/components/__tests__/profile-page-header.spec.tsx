import * as React from 'react';

import { ProfilePageCard } from '../profile-cards/profile-page-header';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  RenderResult,
  renderWithAllProviders,
  globalChannelMock,
  getSDKMocks,
  act,
  genUser,
  genMockOp,
} from '@akashaproject/ui-awf-testing-utils';

const mockLocationValue = {
  pathname: '/profile',
  search: '',
  hash: '',
  state: null,
};

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn().mockImplementation(() => {
    return mockLocationValue;
  }),
}));

describe('<ProfilePageHeader />', () => {
  let renderResult: RenderResult;
  const sdkMocks = getSDKMocks({});
  const mockUser = genUser();
  const profileActions = {
    getProfileData: jest.fn(),
    getEntryAuthor: jest.fn(),
    resetProfileData: jest.fn(),
    optimisticUpdate: jest.fn(),
    updateProfile: jest.fn(),
    resetUpdateStatus: jest.fn(),
    validateUsername: jest.fn(),
    getUsernameTypes: jest.fn(() => ({ available: [] })),
    updateUsernameProvider: jest.fn(),
  };
  const BaseComponent = (
    <Router>
      <ProfilePageCard
        profileId={mockUser.pubKey}
        profileState={mockUser}
        profileUpdateStatus={{
          saving: false,
          uploadingAvatar: false,
          updateComplete: false,
          uploadingCoverImage: false,
          isValidUsername: false,
          isValidating: false,
          tooShort: false,
          notAllowed: false,
        }}
        profileActions={profileActions}
        modalActions={{
          show: jest.fn(),
          showAfterLogin: jest.fn(),
          hide: jest.fn(),
        }}
        modalState={{ login: false }}
        loggedUserEthAddress="asdqwe"
        loginActions={{
          login: jest.fn(),
          logout: jest.fn(),
        }}
        globalChannel={globalChannelMock}
        sdkModules={sdkMocks}
        layout={{
          app: {
            modalSlotId: '',
            loadingFn: () => {},
            pluginSlotId: '',
            name: '',
            rootWidgetSlotId: '',
            title: '',
            topbarSlotId: '',
            widgetSlotId: '',
          },
        }}
        logger={{}}
        singleSpa={{}}
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
    console.log(avatarSrc, '<<<< avatar src');
    expect(avatarSrc).toEqual(mockUser.avatar);
  });
});
