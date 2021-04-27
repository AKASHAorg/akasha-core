import * as React from 'react';
import NotificationsPage from '../notifications-page';

import {
  RenderResult,
  renderWithAllProviders,
  globalChannelMock,
  getSDKMocks,
} from '@akashaproject/ui-awf-testing-utils';
import { act } from 'react-dom/test-utils';

describe('< NotificationsPage /> component', () => {
  let renderResult: RenderResult;
  const sdkMocks = getSDKMocks({});
  const BaseComponent = (
    <NotificationsPage
      sdkModules={sdkMocks}
      globalChannel={globalChannelMock}
      rxjsOperators={{
        filter: (cb: (payload: any) => boolean) =>
          cb({ channelInfo: { method: 'test', servicePath: ['PROFILE_STORE'] } }),
      }}
      logger={{}}
      singleSpa={{}}
    />
  );
  beforeEach(() => {
    act(() => {
      renderResult = renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should display a loading spinner', async () => {
    const spinnerElement = renderResult.container.querySelector('svg > circle');
    expect(spinnerElement).toBeDefined();
  });
});
