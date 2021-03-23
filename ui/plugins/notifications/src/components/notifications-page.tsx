import * as React from 'react';
import DS from '@akashaproject/design-system';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { useLoginState, useNotifications } from '@akashaproject/ui-awf-hooks';
import useErrorState from '@akashaproject/ui-awf-hooks/lib/use-error-state';

const { Helmet, Box, ErrorLoader, ErrorInfoCard, NotificationsCard } = DS;

interface AppRoutesProps {
  onError?: (err: Error) => void;
  sdkModules: any;
  logger: any;
  globalChannel: any;
  singleSpa: any;
}

const NotificationsPage: React.FC<AppRoutesProps> = props => {
  const { sdkModules, logger, globalChannel, singleSpa } = props;

  const { t } = useTranslation();

  const [loginState] = useLoginState({
    globalChannel: globalChannel,
    onError: (err: IAkashaError) => {
      logger.error('useLoginState error %j', err);
    },
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
  });

  const [notifErrors, notifErrorActions] = useErrorState({ logger });

  const [notificationsState, notificationsActions] = useNotifications({
    onError: notifErrorActions.createError,
    globalChannel: globalChannel,
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
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
    singleSpa.navigateToUrl(`/AKASHA-app/post/${entryId}`);
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
                mentionedLabel={t('mentioned you in a post')}
                replyLabel={t('replied to your post')}
                repostLabel={t('reposted your post')}
                markAsReadLabel={t('Mark as read')}
                handleMessageRead={notificationsActions.markMessageAsRead}
                handleEntryClick={handlePostClick}
                handleProfileClick={handleAvatarClick}
                handleNavBack={() => null}
                isFetching={notificationsState.isFetching}
                errorLoader={
                  <ErrorLoader
                    type="missing-notifications"
                    title={t('All clear')}
                    details={t("You don't have any new notifications!")}
                  />
                }
              />
            )}
          </>
        )}
      </ErrorInfoCard>
    </Box>
  );
};

export default NotificationsPage;
