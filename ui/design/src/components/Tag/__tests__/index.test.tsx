import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import Tag from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<Tag /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(wrapWithTheme(<Tag titleLabel="auto-detected" />), {});
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

    const titleLabel = getByText('auto-detected');

    expect(titleLabel).toBeDefined();
  });
});
