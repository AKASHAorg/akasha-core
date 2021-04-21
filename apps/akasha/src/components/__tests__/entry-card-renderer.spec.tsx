import * as React from 'react';
import EntryCardRenderer from '../feed-page/entry-card-renderer';
import { from } from 'rxjs';

import {
  RenderResult,
  act,
  genEthAddress,
  genPostData,
  renderWithAllWrappers,
} from '@akashaproject/ui-awf-testing-utils';

describe('<ContentCard /> component', () => {
  let componentWrapper: RenderResult;
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
    componentWrapper = renderWithAllWrappers(Base, {});
  });

  it('should render avatar', () => {
    act(() => {
      componentWrapper.rerender(Base);
      // const avatar = componentWrapper.findByTestId('avatar-image');
      // console.log(avatar);
    });
    // componentWrapper.debug(document.body);
    const avatarNode = componentWrapper.container.querySelector("[data-testid='avatar-image']");
    expect(avatarNode).toBeDefined();
    expect(avatarNode?.getAttribute('src')).toEqual(itemData.author.avatar);
  });
});
