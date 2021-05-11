import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import AppsWidgetCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { appsDataSource } from '../../../utils/dummy-data';

describe('<AppsWidgetCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <AppsWidgetCard
            dataSource={appsDataSource}
            margin={{ margin: '0px' }}
            iconType={'trendingApps'}
            label={'Trending Apps'}
            labelColor={'#132540'}
            onClick={() => null}
            onAppClick={() => null}
          />,
        ),
        {},
      );
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct title', () => {
    const { getByText } = componentWrapper;
    const title = getByText(/trending apps/i);
    expect(title).toBeDefined();
  });

  it('has at least one app from dataSource', () => {
    const { getByText } = componentWrapper;
    const title = getByText(/Gitcoin/i);
    expect(title).toBeDefined();
  });
});
