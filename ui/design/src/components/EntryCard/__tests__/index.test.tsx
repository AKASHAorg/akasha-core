import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import EntryCard from '../';
import { wrapWithTheme } from '../../../test-utils';
import {
  entryData,
  shareLabel,
  flagAsLabel,
  repliesLabel,
  repostsLabel,
  bookmarkLabel,
  copyLinkLabel,
  bookmarkedLabel,
} from '../../../utils/dummy-data';

describe('<EntryCard /> component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <EntryCard
          style={{ height: 'auto' }}
          isBookmarked={false}
          entryData={entryData}
          shareLabel={shareLabel}
          flagAsLabel={flagAsLabel}
          isFollowingAuthor={false}
          repostsLabel={repostsLabel}
          repliesLabel={repliesLabel}
          bookmarkLabel={bookmarkLabel}
          copyLinkLabel={copyLinkLabel}
          bookmarkedLabel={bookmarkedLabel}
          locale={'en'}
          repostLabel={'Repost'}
          sharePostLabel={'Share Post'}
          profileAnchorLink={'/profile'}
          repliesAnchorLink={'/social-app/post'}
          sharePostUrl={'https://ethereum.world'}
          repostWithCommentLabel={'Repost with comment'}
          shareTextLabel={'Share this post with your friends'}
          loggedProfileEthAddress={'0x003410499401674320006570047391024572000'}
        />,
      ),
    );
  });
});
