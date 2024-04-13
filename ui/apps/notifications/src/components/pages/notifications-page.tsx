import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useMarkAsRead,
  useRootComponentProps,
  useGetSettings,
  transformSource,
  useGetLogin,
} from '@akashaorg/ui-awf-hooks';
import Menu, { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';
import {
  CheckCircleIcon,
  Cog8ToothIcon,
  EllipsisHorizontalIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import NotificationsCard from '@akashaorg/design-system-components/lib/components/NotificationsCard';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import DropDownFilter from '@akashaorg/design-system-components/lib/components/DropDownFilter';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { EntityTypes, NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import routes, { SETTINGS_PAGE, CUSTOMIZE_NOTIFICATION_WELCOME_PAGE } from '../../routes';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';

export type Notification = {
  id: string;
  [key: string]: unknown;
};

const NotificationsPage: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);

  const loginData = useGetLogin();
  const isLoggedIn = !!loginData.data?.id;

  const { data, isLoading } = useGetSettings('@akashaorg/app-notifications');

  const { t } = useTranslation('app-notifications');
  const { getRoutingPlugin, uiEvents } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

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
  const readNotifications = allNotifications?.filter(notif => notif.read === true);

  const { markAsRead } = useMarkAsRead();

  const handleAvatarClick = (id: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${id}`,
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

  const dropDownMenuItems = [
    { id: '0', title: t('All') },
    { id: '1', title: t('Unread') },
    { id: '2', title: t('Read') },
  ];

  const [selectedOption, setSelectedOption] = React.useState(dropDownMenuItems[0]);

  const handleResetClick = () => {
    setSelectedOption(dropDownMenuItems[0]);
  };

  const markAllAsRead = () => {
    // do something
    unreadNotifications.map(notif => {
      if (notif.read === undefined) {
        markAsRead(notif.id);
      }
    });
    setShowMenu(!showMenu);

    _uiEvents.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Success,
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

  const dropDownActions: MenuProps['items'] = [
    {
      label: 'Mark all as read',
      icon: <CheckCircleIcon />,
      onClick: () => markAllAsRead(),
    },
    {
      label: 'Settings',
      icon: <Cog8ToothIcon />,
      onClick: () => redirectToSettingsPage(),
    },
  ];

  if (isLoading) return <Spinner />;

  if (!isLoggedIn || !data) {
    return navigateTo?.({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: () => routes[CUSTOMIZE_NOTIFICATION_WELCOME_PAGE],
    });
  }

  const filterShownNotifications = (selectedOption: number) => {
    switch (selectedOption) {
      case 0:
        return allNotifications;
      case 1:
        return unreadNotifications;
      case 2:
        return readNotifications;
      default:
        return null;
    }
  };

  return (
    <>
      <Stack direction="column" customStyle="pb-32 h-[calc(100vh-88px)]">
        <Stack customStyle="py-4 relative w-full" direction="row">
          <Text variant="h5" align="center">
            <>{t('Notifications')}</>
          </Text>
          <Stack direction="column" spacing="gap-y-1" customStyle="absolute right-0 top-5">
            <Menu
              anchor={{
                icon: <EllipsisHorizontalIcon />,
                variant: 'primary',
                greyBg: true,
                iconOnly: true,
                'aria-label': 'settings',
              }}
              items={dropDownActions}
              customStyle="w-max z-99"
            />
          </Stack>
        </Stack>
        <Stack direction="column">
          <DropDownFilter
            dropdownMenuItems={dropDownMenuItems}
            selected={selectedOption}
            setSelected={setSelectedOption}
            resetLabel={t('Reset')}
            resetHandler={handleResetClick}
          />
        </Stack>
        <NotificationsCard
          notifications={filterShownNotifications(Number(selectedOption.id))}
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
          handleMessageRead={markAsRead}
          handleEntryClick={handleEntryClick}
          handleProfileClick={handleAvatarClick}
          transformSource={transformSource}
          loggedIn={true}
          isFetching={false}
        />
      </Stack>
    </>
  );
};
export default NotificationsPage;
