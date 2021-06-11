import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import CustomizeFeedCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { trendingProfilesData, trendingTagsData } from '../../../utils/dummy-data';
import userEvent from '@testing-library/user-event';

describe('<CustomizeFeedCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleFollow = jest.fn();
  const handleUnfollow = jest.fn();
  const handleSubscribe = jest.fn();
  const handleUnsubscribe = jest.fn();
  const handleCreateFeed = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <CustomizeFeedCard
            profiles={trendingProfilesData}
            tags={trendingTagsData}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
            handleSubscribe={handleSubscribe}
            handleUnsubscribe={handleUnsubscribe}
            handleCreateFeed={handleCreateFeed}
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

  it('has correct number of subscribed and not subscribed tags', () => {
    const { getAllByRole } = componentWrapper;

    const subscribedButtons = getAllByRole('button', { name: 'Subscribed' });
    const notSubscribedButtons = getAllByRole('button', { name: 'Subscribe' });

    expect(subscribedButtons).toHaveLength(2);
    expect(notSubscribedButtons).toHaveLength(3);
  });

  it('goes to next step when clicked and calls handler', () => {
    const { getByText } = componentWrapper;

    const nextStep = getByText('Next Step');
    userEvent.click(nextStep);

    const createMyFeed = getByText('Create My Feed');
    expect(createMyFeed).toBeDefined();

    expect(handleCreateFeed).toBeCalledTimes(0);
    userEvent.click(createMyFeed);

    expect(handleCreateFeed).toBeCalledTimes(1);
  });
});
