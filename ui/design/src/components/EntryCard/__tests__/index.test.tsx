import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import EntryCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

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
import userEvent from '@testing-library/user-event';
import { IEntryData } from '@akashaproject/ui-awf-typings/lib/entry';

describe('<EntryCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleRepost = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <EntryCard
            modalSlotId={''}
            style={{ height: 'auto' }}
            isBookmarked={false}
            entryData={entryData as IEntryData}
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
            showMore={true}
            profileAnchorLink={'/profile'}
            repliesAnchorLink={'/social-app/post'}
            sharePostUrl={'https://ethereum.world'}
            repostWithCommentLabel={'Repost with comment'}
            shareTextLabel={'Share this post with your friends'}
            loggedProfileEthAddress={'0x003410499401674320006570047391024572000'}
            onRepost={handleRepost}
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

  it('has correct author name', () => {
    const { getByText } = componentWrapper;
    const authorName = getByText(/Gilbert The Bearded/i);

    expect(authorName).toBeDefined();
  });

  it('triggers the handlers on the action buttons', () => {
    const { getByText } = componentWrapper;
    const repostButton = getByText(/11 Reposts/i);
    expect(repostButton).toBeDefined();

    expect(handleRepost).toBeCalledTimes(0);

    userEvent.click(repostButton);
    expect(handleRepost).toBeCalledTimes(1);
  });
});
