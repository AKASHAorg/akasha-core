import React from 'react';
import { act, cleanup } from '@testing-library/react';

import EditorToolbar from '..';

import { customRender } from '@akashaorg/design-system-core/lib/test-utils';

describe('<EditorToolbar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<EditorToolbar />, {});
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
