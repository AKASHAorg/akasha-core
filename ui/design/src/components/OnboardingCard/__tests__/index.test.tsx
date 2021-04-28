import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import CustomizeFeedCard from '../';
import { wrapWithTheme } from '../../../test-utils';
import { trendingProfilesData, trendingTagsData } from '../../../utils/dummy-data';

describe('CustomizeFeedCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <CustomizeFeedCard
          profiles={trendingProfilesData}
          tags={trendingTagsData}
          handleFollow={() => null}
          handleUnfollow={() => null}
          handleSubscribe={() => null}
          handleUnsubscribe={() => null}
          handleCreateFeed={() => null}
        />,
      ),
    );
  });
});
