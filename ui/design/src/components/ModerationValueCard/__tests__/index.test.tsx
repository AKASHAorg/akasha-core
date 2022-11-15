import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import ModerationValueCard from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ModerationValueCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const assetName = 'communityresilience';
  const value = 'Community Resilience';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(<ModerationValueCard assetName={assetName} label={value} />),
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

  it('renders correct title and detail', () => {
    const { getByText } = componentWrapper;
    const title = getByText(value);

    expect(title).toBeDefined();
  });

  it('renders an image with correct src', () => {
    const { getByRole } = componentWrapper;
    const image = getByRole('img');

    expect(image).toBeDefined();
    expect(image).toHaveAttribute('src', `/images/${assetName}.webp`);
  });
});
