import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import { customRender } from '@akashaorg/design-system-core/src/test-utils';

import StartCard from '..';

describe('<StartCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <StartCard
          assetName="news-feed"
          heading="Add some magic to your feed 🪄"
          description="Personalize your antenna! Pick favorite topics, and enjoy beams tailored to your interests. Don't miss a thing!"
          secondaryDescription="Your customized view of AKASHA World"
          isMinified={true}
          ctaLabel="Customize My Feed"
          onClickCTA={jest.fn()}
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
  it('contains heading', () => {
    const { getByText } = componentWrapper;
    const heading = getByText(/Add some magic/i);
    expect(heading).toBeDefined();
  });
  it('contains description', () => {
    const { getByText } = componentWrapper;
    const description = getByText(/Personalize your antenna/i);
    expect(description).toBeDefined();
  });
});
