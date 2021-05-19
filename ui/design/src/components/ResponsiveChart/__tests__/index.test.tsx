import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import ResponsiveChart from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { chartData } from '../../../utils/dummy-data';

describe('<ResponsiveChart /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(wrapWithTheme(<ResponsiveChart data={chartData} />), {});
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
