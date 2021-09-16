import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useGetLogin } from '@akashaproject/ui-awf-hooks/lib/use-login.new';
import {
  useFetchNotifications,
  useMarkAsRead,
} from '@akashaproject/ui-awf-hooks/lib/use-notifications.new';
import useErrorState from '@akashaproject/ui-awf-hooks/lib/use-error-state';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { Helmet, Box, ErrorLoader, ErrorInfoCard, NotificationsCard } = DS;

const NotificationsPage: React.FC<RootComponentProps> = props => {
  const { logger, singleSpa } = props;

  const { t } = useTranslation();

  const loginQuery = useGetLogin();

  const [notifErrors] = useErrorState({ logger });

  const notifReq = useFetchNotifications(loginQuery.data.ethAddress);
  const notificationsState = notifReq.data;

  const markAsRead = useMarkAsRead();

  // React.useEffect(() => {
  //   if (loginState.waitForAuth && !loginState.ready) {
  //     return;
  //   }
  //   if (
  //     (loginState.waitForAuth && loginState.ready) ||
  //     (loginState.currentUserCalled && loginState.ethAddress)
  //   ) {
  //     return notificationsActions.getMessages();
  //   }
  // }, [JSON.stringify(loginState)]);

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
      <ErrorInfoCard errors={notifErrors}>
        {(messages, hasCriticalErrors) => (
          <>
            {hasCriticalErrors && (
              <ErrorLoader
                type="script-error"
                title={t('Sorry, we cannot get the notifications this time')}
                details={t('Please try again later!')}
                devDetails={messages}
              />
            )}
            {messages && (
              <ErrorLoader
                type="script-error"
                title={t('Sorry, we cannot get the notifications this time')}
                details={t('Please try again later!')}
                devDetails={messages}
              />
            )}
            {!hasCriticalErrors && (
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
