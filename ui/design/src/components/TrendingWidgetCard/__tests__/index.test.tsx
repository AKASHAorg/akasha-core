import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render, waitFor } from '@testing-library/react';

import TrendingWidgetCard from '../';
import { wrapWithTheme } from '../../../test-utils';
import { trendingProfilesData, trendingTagsData } from '../../../utils/dummy-data';

describe('TrendingWidgetCard component', () => {
  it('renders correctly', async () => {
    const trendingWidget = render(
      wrapWithTheme(
        <TrendingWidgetCard
          titleLabel={'Trending Right Now'}
          topicsLabel={'Topics'}
          profilesLabel={'Profiles'}
          tagAnchorLink={'/social-app/tags'}
          profileAnchorLink={'/profile'}
          tags={trendingTagsData}
          profiles={trendingProfilesData}
          followedProfiles={[]}
          subscribedTags={[]}
          onClickProfile={() => null}
          onClickTag={() => null}
          handleFollowProfile={() => null}
          handleUnfollowProfile={() => null}
          handleSubscribeTag={() => null}
          handleUnsubscribeTag={() => null}
        />,
      ),
    );
    await waitFor(() => expect(trendingWidget).toBeDefined());
  });
});
