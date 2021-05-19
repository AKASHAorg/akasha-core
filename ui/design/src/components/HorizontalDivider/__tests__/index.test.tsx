import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import HorizontalDivider from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<HorizontalDivider /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(wrapWithTheme(<HorizontalDivider />), {});
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
