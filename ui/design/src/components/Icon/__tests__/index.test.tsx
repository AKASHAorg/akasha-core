import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import Icon from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<Icon /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<Icon type="akasha" size="md" testId="akasha-icon" />),
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

  it('receives the test-id passed in the props', () => {
    const { getByTestId } = componentWrapper;
    const icon = getByTestId('akasha-icon');
    expect(icon).toBeDefined();
  });
});
