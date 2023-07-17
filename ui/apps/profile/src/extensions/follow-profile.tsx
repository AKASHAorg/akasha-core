import React from 'react';
import ReactDOM from 'react-dom';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import singleSpaReact from 'single-spa-react';
import { withProviders, ThemeWrapper, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { RootExtensionProps } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';

const FollowProfile: React.FC<RootExtensionProps> = props => {
  const { profileId, isIconButton } = props.extensionData;

  const { t } = useTranslation('app-profile');

  const loginQuery = useGetLogin();

  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const isFollowing = false; /*TODO: check if logged in user is following the profile */

  const followId = ''; /*TODO: get follow id for the profile to update follow document */

  const checkAuth = () => {
    if (!loginQuery.data?.id) {
      navigateTo({
        appName: '@akashaorg/app-auth-ewa',
        getNavigationUrl: navRoutes => navRoutes.CONNECT,
      });
      return false;
    }
    return true;
  };

  const handleFollow = (profileId: string) => {
    if (!checkAuth()) return;
    /*TODO: uncomment the following lines when followId and isFollowing are properly computed 
    if (!isFollowing) {
      createFollowMutation.mutate({
        i: { content: { isFollowing: true, profileID: profileData?.id } },
      });
    } else {
      updateFollowMutation.mutate({
        i: {
          id: followId,
          content: { isFollowing: true, profileID: profileData?.id },
        },
      });
    }
    */
  };

  const handleUnfollow = (profileId: string, followId: string) => {
    if (!checkAuth()) return;
    /*TODO: uncomment the following lines when followId is properly computed 
    updateFollowMutation.mutate({
      i: {
        id: followId,
        content: { isFollowing: false, profileID: profileData?.id },
      },
    });
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 5000);
    */
  };

  if (isIconButton) {
    return (
      <>
        {isFollowing ? (
          <Button
            size="sm"
            icon="UserPlusIcon"
            onClick={() => handleUnfollow(String(profileId), followId)}
            variant="primary"
            iconOnly
          />
        ) : (
          <Button
            onClick={() => handleFollow(String(profileId))}
            icon="UsersIcon"
            greyBg
            iconOnly
          />
        )}
      </>
    );
  }

  return (
    <DuplexButton
      inactiveLabel={t('Follow')}
      activeLabel={t('Following')}
      activeHoverLabel={t('Following')}
      onClickInactive={() => handleFollow(String(profileId))}
      onClickActive={() => handleUnfollow(String(profileId), followId)}
      active={!!isFollowing}
      size="sm"
      allowMinimization
    />
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(FollowProfile),
  errorBoundary: (error, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <ErrorLoader
          type="script-error"
          title="Error in share profile modal"
          details={error.message}
        />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
