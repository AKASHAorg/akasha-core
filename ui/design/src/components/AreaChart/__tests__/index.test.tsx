import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import AreaChart from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { chartData } from '../../../utils/dummy-data';

describe('<AreaChart /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <AreaChart
            data={chartData}
            margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
            height={85}
            width={320}
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
});
