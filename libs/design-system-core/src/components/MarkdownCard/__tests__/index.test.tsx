import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import MarkdownCard from '..';
import { customRender } from '../../../test-utils';

describe('<MarkdownCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<MarkdownCard mdText="`**Hello**`" />, {});
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
