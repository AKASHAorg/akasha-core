import * as React from 'react';
import EntryCardRenderer from '../entry-renderer';

import {
  RenderResult,
  genEthAddress,
  genPostData,
  renderWithAllProviders,
  act,
} from '@akashaproject/ui-awf-testing-utils';
import { ItemTypes } from '../App';

describe('<EntryCardRenderer /> component', () => {
  let renderResult: RenderResult;
  const mockEth = genEthAddress();
  const itemData = genPostData();

  const BaseComponent = (
    <EntryCardRenderer
      itemData={itemData}
      ethAddress={mockEth}
      onBookmark={jest.fn}
      onNavigate={jest.fn}
      onRepost={jest.fn}
      sharePostUrl=""
      pubKey=""
      locale="en"
      bookmarkState={{
        bookmarks: [],
        isFetching: false,
      }}
      checkIsFollowing={jest.fn()}
      itemType={ItemTypes.ENTRY}
      followedProfiles={[]}
      onFollow={jest.fn()}
      onUnfollow={jest.fn()}
      onReport={jest.fn()}
      singleSpaNavigate={jest.fn}
    />
  );
  act(() => {
    renderResult = renderWithAllProviders(BaseComponent, {});
  });

  it('should render avatar', async () => {
    const avatarNode = await renderResult.findByTestId('avatar-image');
    expect(avatarNode).toBeDefined();
    expect(avatarNode?.getAttribute('src')).toEqual(itemData.author.avatar);
  });
});
