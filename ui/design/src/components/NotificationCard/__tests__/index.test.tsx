import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import NotificationsCard from '../';
import { wrapWithTheme } from '../../../test-utils';

describe('NotificationsCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <NotificationsCard
          notifications={[
            {
              body: {
                value: {
                  author: {
                    name: 'Dr. Flynn',
                    userName: 'thedrflynn',
                    ethAddress: '0x003410490050000320006570034567114572000',
                    avatar: 'https://placebeard.it/360x360',
                  },
                  follower: {
                    name: 'Dr. Flynn',
                    userName: 'thedrflynn',
                    ethAddress: '0x003410490050000320006570034567114572000',
                    avatar: 'https://placebeard.it/360x360',
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
          replyLabel={'replied to your post'}
          notificationsLabel={'Notifications'}
          followingLabel={'is now following you'}
          mentionedPostLabel={'mentioned you in a post'}
          mentionedCommentLabel={'mentioned you in a comment'}
          emptySubtitle={"You don't have any new notifications!"}
          handleMessageRead={() => null}
          handleEntryClick={() => null}
          handleProfileClick={() => null}
          handleNavBack={() => null}
        />,
      ),
    );
  });
});
