import * as React from 'react';
import EntryCardRenderer from '../feed-page/entry-card-renderer';
import { from } from 'rxjs';

import {
  RenderResult,
  genEthAddress,
  genPostData,
  renderWithAllWrappers,
  act,
} from '@akashaproject/ui-awf-testing-utils';

describe('<ContentCard /> component', () => {
  let renderResult: RenderResult;
  const mockEth = genEthAddress();
  const itemData = genPostData();
  const mockObs = from(['test']);
  const globalChannel = { pipe: () => ({ subscribe: () => {}, unsubscribe: () => {} }) };

  const Base = (
    <EntryCardRenderer
      sdkModules={{
        profiles: { profileService: { isFollowing: () => mockObs } },
      }}
      itemData={itemData}
      logger={{ log: console.log }}
      globalChannel={globalChannel}
      ethAddress={mockEth}
      onBookmark={jest.fn}
      onAvatarClick={jest.fn}
      onMentionClick={jest.fn}
      onNavigate={jest.fn}
      onRepost={jest.fn}
      onTagClick={jest.fn}
      onFlag={jest.fn}
      onLinkCopy={jest.fn}
      sharePostUrl=""
      rxjsOperators={{
        filter: (cb: (payload: any) => boolean) =>
          cb({ channelInfo: { method: 'test', servicePath: ['PROFILE_STORE'] } }),
      }}
      singleSpaNavigate={jest.fn}
    />
  );
  act(() => {
    renderResult = renderWithAllWrappers(Base, {});
  });

  it('should render avatar', async () => {
    const avatarNode = await renderResult.findByTestId('avatar-image');
    expect(avatarNode).toBeDefined();
    expect(avatarNode?.getAttribute('src')).toEqual(itemData.author.avatar);
  });
});
