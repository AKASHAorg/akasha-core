import * as React from 'react';
import TrendingWidgetComponent from '../trending-widget-component';

import {
  RenderResult,
  renderWithAllProviders,
  globalChannelMock,
  mockSDK,
  act,
} from '@akashaproject/tests';

describe('<TrendingWidgetComponent /> component', () => {
  let renderResult: RenderResult;
  const sdkMocks = mockSDK({});
  const BaseComponent = (
    <TrendingWidgetComponent
      logger={{}}
      globalChannel={globalChannelMock}
      sdkModules={sdkMocks}
      layout={{ app: { modalSlotId: '' } }}
      singleSpa={{}}
    />
  );
  beforeEach(() => {
    act(() => {
      renderResult = renderWithAllProviders(BaseComponent, {});
    });
  });
  it('should render `Trending Right Now` title', async () => {
    const titleNode = await renderResult.findByText('Trending Right Now');
    expect(titleNode).toBeDefined();
  });
});
