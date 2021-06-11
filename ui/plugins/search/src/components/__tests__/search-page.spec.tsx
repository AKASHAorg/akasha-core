import * as React from 'react';
import SearchPage from '../routes/search-page';

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
  pathname: '/search/ethereum%20world',
  search: '',
  hash: '',
  state: null,
};

const mockRouteParams = {
  searchKeyword: 'ethereum%20world',
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

describe('<SearchPage />', () => {
  let renderResult: RenderResult;
  const sdkMocks = getSDKMocks({});
  const mockUser = genUser();
  const BaseComponent = (
    <SearchPage
      globalChannel={globalChannelMock}
      sdkModules={sdkMocks}
      logger={{}}
      singleSpa={{}}
      loginState={{
        ethAddress: mockUser.ethAddress,
        pubKey: mockUser.pubKey,
        currentUserCalled: false,
        ready: { ethAddress: mockUser.ethAddress, pubKey: mockUser.pubKey },
        waitForAuth: null,
      }}
      loggedProfileData={mockUser}
      showLoginModal={jest.fn()}
      modalState={{ login: false }}
      layout={{
        app: {
          loadingFn: jest.fn(),
          modalSlotId: '',
          name: '',
          pluginSlotId: '',
          widgetSlotId: '',
          rootWidgetSlotId: '',
          topbarSlotId: '',
          title: '',
        },
      }}
      modalStateActions={{
        show: jest.fn(),
        hide: jest.fn(),
        showAfterLogin: jest.fn(),
      }}
    />
  );
  beforeEach(() => {
    act(() => {
      renderResult = renderWithAllProviders(BaseComponent, {});
    });
  });
  it('should render with `0 Results` text', async () => {
    const node = await renderResult.findAllByText('0 Results');
    expect(node.length).toBeGreaterThan(0);
  });
});
