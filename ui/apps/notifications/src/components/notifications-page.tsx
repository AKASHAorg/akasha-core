import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useGetLogin, useFetchNotifications, useMarkAsRead } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { Helmet, Box, ErrorLoader, ErrorInfoCard, NotificationsCard } = DS;

const NotificationsPage: React.FC<RootComponentProps> = props => {
  const { singleSpa } = props;

  const { t } = useTranslation('app-notifications');

  const loginQuery = useGetLogin();

  const notifReq = useFetchNotifications(loginQuery.data?.ethAddress);
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
          <>
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
                notificationsLabel={t('Notifications')}
                followingLabel={t('is now following you')}
                mentionedPostLabel={t('mentioned you in a post')}
                mentionedCommentLabel={t('mentioned you in a comment')}
                replyLabel={t('replied to your post')}
                repostLabel={t('reposted your post')}
                moderatedPostLabel={t('moderated your post')}
                moderatedReplyLabel={t('moderated your reply')}
                moderatedAccountLabel={t('suspended your account')}
                markAsReadLabel={t('Mark as read')}
                emptyTitle={t('All clear')}
                emptySubtitle={t("You don't have any new notifications!")}
                handleMessageRead={markAsRead.mutate}
                handleEntryClick={handlePostClick}
                handleProfileClick={handleAvatarClick}
                handleNavBack={() => {
                  history.back();
                }}
                isFetching={notifReq.isFetching}
              />
            )}
          </>
        )}
      </ErrorInfoCard>
    </Box>
  );
};

export default NotificationsPage;
