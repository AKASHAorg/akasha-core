import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import MdCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<MdCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(wrapWithTheme(<MdCard mdText="`**Hello**`" />), {});
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct text', () => {
    const { getByText } = componentWrapper;
    const mdText = getByText(/Hello/i);

    expect(mdText).toBeDefined();
  });
});
