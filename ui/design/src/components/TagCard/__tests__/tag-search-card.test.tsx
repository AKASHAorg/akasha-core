import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import { TagSearchCard } from '../tag-search-card';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { trendingTagsData } from '../../../utils/dummy-data';
import userEvent from '@testing-library/user-event';

describe('<TagSearchCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleSubscribeTag = jest.fn();
  const handleUnsubscribeTag = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <TagSearchCard
            tag={trendingTagsData[0]}
            subscribedTags={['Ethereum']}
            tagAnchorLink="/social-app/tags"
            mentionsLabel="posts"
            subscribeLabel="Subscribe"
            subscribedLabel="Subscribed"
            unsubscribeLabel="Unsubscribe"
            handleSubscribeTag={handleSubscribeTag}
            handleUnsubscribeTag={handleUnsubscribeTag}
          />,
        ),
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

  it('has correct tag name', () => {
    const { getByText } = componentWrapper;
    const akashaTag = getByText('AKASHA');

    expect(akashaTag).toBeDefined();
  });

  it('calls handler when clicked', () => {
    const { getByRole } = componentWrapper;
    const notsubscribedButton = getByRole('button', { name: 'Subscribe' });

    // Button is not subscribed, we test for subscribe handler
    expect(handleSubscribeTag).toBeCalledTimes(0);

    userEvent.click(notsubscribedButton);
    expect(handleSubscribeTag).toBeCalledTimes(1);
  });
});
