import * as React from 'react';
import DS from '@akashaproject/design-system';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { useLoginState, useNotifications } from '@akashaproject/ui-awf-hooks';
import useErrorState from '@akashaproject/ui-awf-hooks/lib/use-error-state';

const { Helmet, Box, ErrorLoader, ErrorInfoCard, NotificationsCard } = DS;

interface AppRoutesProps {
  onError?: (err: Error) => void;
  logger: any;
  singleSpa: any;
}

const NotificationsPage: React.FC<AppRoutesProps> = props => {
  const { logger, singleSpa } = props;

  const { t } = useTranslation();

  const [loginState] = useLoginState({
    onError: (err: IAkashaError) => {
      logger.error('useLoginState error %j', err);
    },
  });

  const [notifErrors, notifErrorActions] = useErrorState({ logger });

  const [notificationsState, notificationsActions] = useNotifications({
    onError: notifErrorActions.createError,
    loggedEthAddress: loginState.ethAddress,
  });

  React.useEffect(() => {
    if (loginState.waitForAuth && !loginState.ready) {
      return;
    }
    if (
      (loginState.waitForAuth && loginState.ready) ||
      (loginState.currentUserCalled && loginState.ethAddress)
    ) {
      return notificationsActions.getMessages();
    }
  }, [JSON.stringify(loginState)]);

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
                notifications={notificationsState.notifications}
                notificationsLabel={t('Notifications')}
                followingLabel={t('is now following you')}
                mentionedPostLabel={t('mentioned you in a post')}
                mentionedCommentLabel={t('mentioned you in a comment')}
                replyLabel={t('replied to your post')}
                repostLabel={t('reposted your post')}
                markAsReadLabel={t('Mark as read')}
                emptyTitle={t('All clear')}
                emptySubtitle={t("You don't have any new notifications!")}
                handleMessageRead={notificationsActions.markMessageAsRead}
                handleEntryClick={handlePostClick}
                handleProfileClick={handleAvatarClick}
                handleNavBack={() => {
                  history.back();
                }}
                isFetching={notificationsState.isFetching}
              />
            )}
          </>
        )}
      </ErrorInfoCard>
    </Box>
  );
};

export default NotificationsPage;
