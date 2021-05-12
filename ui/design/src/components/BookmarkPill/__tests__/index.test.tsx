import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import BookmarkPill from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<BookmarkPill /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<BookmarkPill infoLabel="Bookmark successfully saved" />),
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

  it('has correct label', () => {
    const { getByText } = componentWrapper;
    const label = getByText(/Bookmark successfully saved/i);
    expect(label).toBeDefined();
  });
});
