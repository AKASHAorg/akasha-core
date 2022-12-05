import * as React from 'react';
import TrendingWidgetComponent from '../trending-widget-component';

import { RenderResult, renderWithAllProviders, genAppProps, act } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';

describe('<TrendingWidgetComponent /> component', () => {
  let renderResult: RenderResult;
  const appProps = genAppProps();
  const BaseComponent = (
    <AnalyticsProvider {...appProps}>
      <TrendingWidgetComponent {...appProps} />
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
