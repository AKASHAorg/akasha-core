import * as React from 'react';
import TrendingWidgetComponent from '../trending-widget-component';

import { RenderResult, renderWithAllProviders, act, genAppProps } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';

describe('<TrendingWidgetComponent /> component', () => {
  let renderResult: RenderResult;

  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <TrendingWidgetComponent />
    </AnalyticsProvider>
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
