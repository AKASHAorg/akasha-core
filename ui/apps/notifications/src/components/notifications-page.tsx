import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import DSNew from '@akashaorg/design-system-core';
import { EntityTypes, RootComponentProps } from '@akashaorg/typings/ui';
import { useGetLogin, useFetchNotifications, useMarkAsRead } from '@akashaorg/ui-awf-hooks';

const { Helmet, Box, NotificationsCard, StartCard, Spinner } = DS;

const { ErrorLoader, ErrorInfoCard } = DSNew;

const NotificationsPage: React.FC<RootComponentProps> = props => {
  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { t } = useTranslation('app-notifications');

  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return loginQuery.data?.ethAddress;
  }, [loginQuery.data?.ethAddress]);

  const notifReq = useFetchNotifications(loginQuery.data?.isReady && isLoggedIn);
  const notificationsState = notifReq.data;

  const markAsRead = useMarkAsRead();

  const handleAvatarClick = (profilePubKey: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profilePubKey}`,
    });
  };

  const handleEntryClick = (itemId: string, itemType: EntityTypes) => {
    if (itemType === EntityTypes.POST) {
      navigateTo?.({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: navRoutes => `${navRoutes.Post}/${itemId}`,
      });
    } else if (itemType === EntityTypes.REPLY) {
      navigateTo?.({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: navRoutes => `${navRoutes.Reply}/${itemId}`,
      });
    }
  };

  return (
    <Box data-testid="notifications" fill="horizontal">
      <Helmet>
        <title>{t('My notifications')}</title>
      </Helmet>
      <ErrorInfoCard error={notifReq?.error}>
        {message => (
          <Box gap="medium">
            <StartCard
              title={t('Notifications')}
              subtitle={t(
                'Check out the latest development about the topics you are most interested in and people you care about.',
              )}
              heading={t("You won't miss a thing 🔔")}
              description={t("Here you'll receive alerts from your apps.")}
              image="/images/notifications.webp"
              showMainArea={!isLoggedIn}
            />
            {notifReq.isFetching && !notificationsState?.length && (
              <Box pad="large">
                <Spinner />
              </Box>
            )}
            {message && (
              <ErrorLoader
                type="script-error"
                title={t('Sorry, we cannot get the notifications this time')}
                details={t('Please try again later!')}
                devDetails={message}
              />
            )}
            {!message && notificationsState?.length > 0 && (
              <NotificationsCard
                notifications={notificationsState || []}
                followingLabel={t('is now following you')}
                mentionedPostLabel={t('mentioned you in a post')}
                mentionedCommentLabel={t('mentioned you in a comment')}
                replyToPostLabel={t('replied to your post')}
                replyToReplyLabel={t('replied to your reply')}
                repostLabel={t('reposted your post')}
                moderatedPostLabel={t('moderated your post')}
                moderatedReplyLabel={t('moderated your reply')}
                moderatedAccountLabel={t('suspended your account')}
                markAsReadLabel={t('Mark as read')}
                emptyTitle={t('No alerts for you right now 🔔')}
                emptySubtitle={t(
                  "You don't have any new alerts at the moment, we'll let you know when you have new followers and mentions.",
                )}
                handleMessageRead={markAsRead.mutate}
                handleEntryClick={handleEntryClick}
                handleProfileClick={handleAvatarClick}
                loggedIn={!!loginQuery.data?.ethAddress}
                isFetching={notifReq.isFetching}
              />
            )}
          </Box>
        )}
      </ErrorInfoCard>
    </Box>
  );
};

export default NotificationsPage;
