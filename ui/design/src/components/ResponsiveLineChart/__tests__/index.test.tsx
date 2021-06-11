import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import ResponsiveLineChart from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { chartData } from '../../../utils/dummy-data';

describe('<ResponsiveLineChart /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(wrapWithTheme(<ResponsiveLineChart data={chartData} />), {});
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });
});
