import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import LineChart from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { chartData } from '../../../utils/dummy-data';

describe('<LineChart /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <LineChart
            data={chartData}
            margin={{ top: 16, bottom: 16, left: 40, right: 16 }}
            height={165}
            width={580}
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
