import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoggedIn, useMarkAsRead, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import List, { ListProps } from '@akashaorg/design-system-core/lib/components/List';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import NotificationsCard from '@akashaorg/design-system-components/lib/components/NotificationsCard';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Tab from '@akashaorg/design-system-core/lib/components/Tab';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { EntityTypes, EventTypes } from '@akashaorg/typings/lib/ui';
import routes, { SETTINGS_PAGE, CUSTOMIZE_NOTIFICATION_WELCOME_PAGE } from '../../routes';

export type Notification = {
  id: string;
  [key: string]: unknown;
};

const NotificationsPage: React.FC<unknown> = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // check if user has gone through onboarding steps before
  let savedPreferences;
  if (window.localStorage) {
    savedPreferences = JSON.parse(localStorage.getItem('notification-preference'));
  }

  useEffect(() => {
    /* @TODO:  uncomment this part when backend data becomes available */
    // redirect to sign in page if not logged in
    // if (loginQuery.isSuccess && !loginQuery.data?.pubKey) {
    //   navigateTo?.({
    //     appName: '@akashaorg/app-auth-ewa',
    //     getNavigationUrl: navRoutes => navRoutes.Connect,
    //   });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t } = useTranslation('app-notifications');
  const { getRoutingPlugin, uiEvents } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const { isLoggedIn } = useLoggedIn();

  const _uiEvents = useRef(uiEvents);

  // mock data used for displaying something. Change when there's real data
  const allNotifications: Notification[] = [
    {
      id: '1',
      body: {
        value: {
          author: {
            name: 'Dr. Flynn',
            userName: 'thedrflynn',
            ethAddress: '0x003410490050000320006570034567114572000',
            avatar: { url: 'https://placebeard.it/360x360' },
          },
          follower: {
            name: 'Dr. Flynn',
            userName: 'thedrflynn',
            ethAddress: '0x003410490050000320006570034567114572000',
            avatar: { url: 'https://placebeard.it/360x360' },
          },
          postID: '01f3st44m5g3tc6419b92zyd21',
        },
        property: 'POST_MENTION',
      },
      createdAt: Date.now(),
    },
    {
      id: '2',
      body: {
        value: {
          author: {
            name: 'Dr. Cat',
            userName: 'thedrCat',
            ethAddress: '0x003410490050000320006570034567114572000',
            avatar: { url: 'https://placebeard.it/360x360' },
          },
          follower: {
            name: 'Dr. Flynn',
            userName: 'thedrflynn',
            ethAddress: '0x003410490050000320006570034567114572000',
            avatar: { url: 'https://placebeard.it/360x360' },
          },
          postID: '01f3st44m5g3tc6419b92zyd21',
        },
        property: 'POST_MENTION',
      },
      createdAt: Date.now(),
    },
    {
      id: '3',
      body: {
        value: {
          author: {
            name: 'Dr. Cat',
            userName: 'thedrCat',
            ethAddress: '0x003410490050000320006570034567114572000',
            avatar: { url: 'https://placebeard.it/360x360' },
          },
          follower: {
            name: 'Dr. Flynn',
            userName: 'thedrflynn',
            ethAddress: '0x003410490050000320006570034567114572000',
            avatar: { url: 'https://placebeard.it/360x360' },
          },
          postID: '01f3st44m5g3tc6419b92zyd21',
        },
        property: 'POST_MENTION',
      },
      createdAt: Date.now(),
      read: true,
    },
  ]; // notifReq.data;

  const unreadNotifications = allNotifications?.filter(notif => notif.read === undefined);

  const markAsRead = useMarkAsRead();

  const handleAvatarClick = (profilePubKey: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profilePubKey}`,
    });
  };

  const handleEntryClick = (itemId: string, itemType: EntityTypes) => {
    if (itemType === EntityTypes.BEAM) {
      navigateTo?.({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: navRoutes => `${navRoutes.Post}/${itemId}`,
      });
    } else if (itemType === EntityTypes.REFLECT) {
      navigateTo?.({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: navRoutes => `${navRoutes.Reply}/${itemId}`,
      });
    }
  };

  const labels = ['New', 'All'];

  const handleTopMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const markAllAsRead = () => {
    // do something
    unreadNotifications.map(notif => {
      //  markAsRead.mutate(notif.id);
      if (notif.read === undefined) {
        markAsRead.mutate(notif.id);
      }
    });
    setShowMenu(!showMenu);

    _uiEvents.current.next({
      event: EventTypes.ShowNotification,
      data: {
        name: 'success',
        message: 'Marked all as read successfully.',
      },
    });
  };

  const redirectToSettingsPage = () => {
    // go to customization page
    return navigateTo?.({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: () => routes[SETTINGS_PAGE],
    });
  };

  const dropDownActions: ListProps['items'] = [
    {
      label: 'Mark all as read',
      icon: 'CheckCircleIcon',
      onClick: () => markAllAsRead(),
    },
    {
      label: 'Settings',
      icon: 'Cog8ToothIcon',
      onClick: () => redirectToSettingsPage(),
    },
  ];

  if (!isLoggedIn || !savedPreferences) {
    return navigateTo?.({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: () => routes[CUSTOMIZE_NOTIFICATION_WELCOME_PAGE],
    });
  }

  return (
    <>
      <Card elevation={'1'} radius={16} padding={'py-2'} customStyle="pb-16">
        <Stack customStyle="py-4 relative w-full" direction="column">
          <Text variant="h5" align="center">
            <>{t('Notifications')}</>
          </Text>
          <Stack direction="column" spacing="gap-y-1" customStyle="absolute right-4 top-5">
            <Button customStyle="relative" plain={true} onClick={handleTopMenuClick}>
              <Icon type="EllipsisHorizontalIcon" accentColor={true} />
            </Button>
            {showMenu && (
              <List items={dropDownActions} customStyle="absolute right-0 top-7 w-max" />
            )}
          </Stack>
        </Stack>
        <Tab value={activeTab} onChange={setActiveTab} labels={labels}>
          <NotificationsCard
            notifications={unreadNotifications || []}
            followingLabel={'is now following you'}
            mentionedPostLabel={'mentioned you in a post'}
            mentionedCommentLabel={'mentioned you in a comment'}
            replyToPostLabel={'replied to your post'}
            replyToReplyLabel={'replied to your reply'}
            repostLabel={'reposted your post'}
            moderatedPostLabel={'moderated your post'}
            moderatedReplyLabel={'moderated your reply'}
            moderatedAccountLabel={'suspended your account'}
            markAsReadLabel={'Mark as read'}
            emptyTitle={'Looks like you don’t have any new notifications yet!'}
            handleMessageRead={markAsRead.mutate}
            handleEntryClick={handleEntryClick}
            handleProfileClick={handleAvatarClick}
            // loggedIn={!!loginQuery.data?.ethAddress}
            loggedIn={true}
            isFetching={false}
            // isFetching={notifReq.isFetching}
          />
          <div>
            <NotificationsCard
              notifications={allNotifications || []}
              followingLabel={'is now following you'}
              mentionedPostLabel={'mentioned you in a post'}
              mentionedCommentLabel={'mentioned you in a comment'}
              replyToPostLabel={'replied to your post'}
              replyToReplyLabel={'replied to your reply'}
              repostLabel={'reposted your post'}
              moderatedPostLabel={'moderated your post'}
              moderatedReplyLabel={'moderated your reply'}
              moderatedAccountLabel={'suspended your account'}
              markAsReadLabel={'Mark as read'}
              emptyTitle={'Looks like you don’t have any new notifications yet!'}
              handleMessageRead={markAsRead.mutate}
              handleEntryClick={handleEntryClick}
              handleProfileClick={handleAvatarClick}
              //loggedIn={!!loginQuery.data?.ethAddress}
              loggedIn={true}
              isFetching={false}
              // isFetching={notifReq.isFetching}
            />
          </div>
        </Tab>
      </Card>
    </>
  );
};
export default NotificationsPage;
