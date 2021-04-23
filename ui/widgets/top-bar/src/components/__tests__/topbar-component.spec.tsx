import * as React from 'react';
import TopbarComponent from '../topbar-component';

import {
  RenderResult,
  renderWithAllProviders,
  globalChannelMock,
  getSDKMocks,
  act,
  genMockOp,
} from '@akashaproject/ui-awf-testing-utils';
import { ReplaySubject } from 'rxjs';

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

describe('<TopbarComponent />', () => {
  let renderResult: RenderResult;
  const sdkMocks = getSDKMocks({});
  const BaseComponent = (
    <TopbarComponent
      navigateToUrl={jest.fn()}
      toggleSidebar={jest.fn()}
      getMenuItems={jest.fn().mockImplementation(() => [])}
      loaderEvents={new ReplaySubject()}
      modalSlotId=""
      globalChannel={globalChannelMock}
      logger={{}}
      sdkModules={sdkMocks}
      rxjsOperators={{
        filter: genMockOp({ channelInfo: { method: 'test', servicePath: ['PROFILE_STORE'] } }),
      }}
    />
  );
  beforeEach(() => {
    act(() => {
      renderResult = renderWithAllProviders(BaseComponent, {});
    });
  });
  it('should render brand name', async () => {
    const brandNode = await renderResult.findByText('Ethereum World');
    expect(brandNode).toBeDefined();
  });
});
