import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import Sidebar from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<Sidebar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClickMenuItem = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <Sidebar
            bodyMenuItems={[]}
            footerMenuItems={[]}
            allMenuItems={[]}
            onClickMenuItem={handleClickMenuItem}
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
