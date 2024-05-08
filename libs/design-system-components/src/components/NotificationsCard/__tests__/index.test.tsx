import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import { customRender } from '@akashaorg/design-system-core/lib/test-utils';

import NotificationsCard from '../';

describe('<NotificationsCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleMessageRead = jest.fn();
  const handleEntryClick = jest.fn();
  const handleProfileClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <NotificationsCard
          notifications={[
            {
              body: {
                value: {
                  author: {
                    name: 'Dr. Flynn',
                    userName: 'thedrflynn',
                    ethAddress: '0x003410490050000320006570034567114572000',
                    avatar: {
                      url: 'https://placebeard.it/360x360',
                      fallbackUrl: 'https://placebeard.it/360x360',
                    },
                  },
                  follower: {
                    name: 'Dr. Flynn',
                    userName: 'thedrflynn',
                    ethAddress: '0x003410490050000320006570034567114572000',
                    avatar: {
                      url: 'https://placebeard.it/360x360',
                      fallbackUrl: 'https://placebeard.it/360x360',
                    },
                  },
                  postID: '01f3st44m5g3tc6419b92zyd21',
                },
                property: 'POST_MENTION',
              },
            },
          ]}
          isFetching={false}
          emptyTitle={'All clear'}
          markAsReadLabel={'Mark as read'}
          repostLabel={'reposted your post'}
          replyToPostLabel={'replied to your post'}
          replyToReplyLabel={'replied to your reply'}
          followingLabel={'is now following you'}
          mentionedPostLabel={'mentioned you in a post'}
          mentionedCommentLabel={'mentioned you in a comment'}
          emptySubtitle={"You don't have any new notifications!"}
          handleMessageRead={handleMessageRead}
          handleEntryClick={handleEntryClick}
          handleProfileClick={handleProfileClick}
          transformSource={() => ({
            src: 'https://placebeard.it/360x360',
            width: 360,
            height: 360,
          })}
          loggedIn
        />,

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

  it('renders correct profile avatar', () => {
    const { getByRole } = componentWrapper;

    const avatar = getByRole('img');
    expect(avatar).toHaveAttribute('src', expect.stringMatching(/avatar-/));
  });

  it('has correct label based on type (POST_MENTION)', () => {
    const { getByText } = componentWrapper;

    const mentionedInAPostLabel = getByText(/mentioned you in a post/i);
    expect(mentionedInAPostLabel).toBeDefined();
  });
});
