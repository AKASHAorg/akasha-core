import React from 'react';
import { act, cleanup } from '@testing-library/react';

import EditorToolbar from '..';

import { customRender } from '@akashaorg/design-system-core/lib/test-utils';

describe('<EditorToolbar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleBoldClick = jest.fn();
  const handleItalicClick = jest.fn();
  const handleUnderlineClick = jest.fn();
  const handleStrikeThroughClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <EditorToolbar
          onBoldClick={handleBoldClick}
          onItalicClick={handleItalicClick}
          onUnderlineClick={handleUnderlineClick}
          onStrikeThroughClick={handleStrikeThroughClick}
        />,

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
