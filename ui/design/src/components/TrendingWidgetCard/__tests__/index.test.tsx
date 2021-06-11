import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import TrendingWidgetCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { trendingProfilesData, trendingTagsData } from '../../../utils/dummy-data';

describe('<TrendingWidgetCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});
  const handleClickProfile = jest.fn();
  const handleClickTag = jest.fn();
  const handleFollowProfile = jest.fn();
  const handleUnfollowProfile = jest.fn();

  const handleSubscribeTag = jest.fn();
  const handleUnsubscribeTag = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <TrendingWidgetCard
            titleLabel="Trending Right Now"
            topicsLabel="Topics"
            profilesLabel="Profiles"
            tagAnchorLink="/social-app/tags"
            profileAnchorLink="/profile"
            tags={trendingTagsData}
            profiles={trendingProfilesData}
            subscribedTags={[]}
            followedProfiles={[]}
            onClickTag={handleClickTag}
            onClickProfile={handleClickProfile}
            handleSubscribeTag={handleSubscribeTag}
            handleFollowProfile={handleFollowProfile}
            handleUnsubscribeTag={handleUnsubscribeTag}
            handleUnfollowProfile={handleUnfollowProfile}
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

  it('has correct title', () => {
    const { getByText } = componentWrapper;
    const title = getByText(/trending right now/i);
    expect(title).toBeDefined();
  });
});
