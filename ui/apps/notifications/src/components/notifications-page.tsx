import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useGetLogin, useFetchNotifications, useMarkAsRead } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { Helmet, Box, ErrorLoader, ErrorInfoCard, NotificationsCard, StartCard } = DS;

const NotificationsPage: React.FC<RootComponentProps> = props => {
  const { singleSpa } = props;

  const { t } = useTranslation('app-notifications');

  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return loginQuery.data?.ethAddress;
  }, [loginQuery.data?.ethAddress]);

  const notifReq = useFetchNotifications(loginQuery.data?.isReady && isLoggedIn);
  const notificationsState = notifReq.data;

  const markAsRead = useMarkAsRead();

  // @todo: extract routes from config
  const handleAvatarClick = (profilePubKey: string) => {
    singleSpa.navigateToUrl(`/profile/${profilePubKey}`);
  };

  const handlePostClick = (entryId: string) => {
    singleSpa.navigateToUrl(`/social-app/post/${entryId}`);
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>{t('My notifications')}</title>
      </Helmet>
      <ErrorInfoCard error={notifReq?.error as Error}>
        {message => (
          <Box gap="medium">
            <StartCard
              title={t('Notifications')}
              subtitle={t('Check latest followers & mentions')}
              heading={t('You won’t miss a thing 🔔')}
              description={t('Here you’ll receive alerts from your apps.')}
              image="images/notification.png"
              loggedIn={!!isLoggedIn}
            />
            {message && (
              <ErrorLoader
                type="script-error"
                title={t('Sorry, we cannot get the notifications this time')}
                details={t('Please try again later!')}
                devDetails={message}
              />
            )}
            {!message && (
              <NotificationsCard
                notifications={notificationsState || []}
                followingLabel={t('is now following you')}
                mentionedPostLabel={t('mentioned you in a post')}
                mentionedCommentLabel={t('mentioned you in a comment')}
                replyLabel={t('replied to your post')}
                repostLabel={t('reposted your post')}
                moderatedPostLabel={t('moderated your post')}
                moderatedReplyLabel={t('moderated your reply')}
                moderatedAccountLabel={t('suspended your account')}
                markAsReadLabel={t('Mark as read')}
                emptyTitle={t('No alerts for you right now 🔔')}
                emptySubtitle={t(
                  'You don’t have any new alerts at the moment, we’ll let you know when you have new followers and mentions.',
                )}
                handleMessageRead={markAsRead.mutate}
                handleEntryClick={handlePostClick}
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
