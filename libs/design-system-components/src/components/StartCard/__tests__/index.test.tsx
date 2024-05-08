import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import { customRender } from '@akashaorg/design-system-core/src/test-utils';

import StartCard from '../';

describe('<StartCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <StartCard
          title="List"
          heading="✨ Save what inspires you ✨"
          image={null}
          description="To create your unique feed view, subscribe to your favourite topics and find wonderful people to follow in our community."
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
  it('contains title', () => {
    const { getByText } = componentWrapper;
    const title = getByText('List');
    expect(title).toBeDefined();
  });
  it('contains heading', () => {
    const { getByText } = componentWrapper;
    const heading = getByText(/Save what inspires you/i);
    expect(heading).toBeDefined();
  });
  it('contains description', () => {
    const { getByText } = componentWrapper;
    const description = getByText(/To create your unique feed view/i);
    expect(description).toBeDefined();
  });
});
