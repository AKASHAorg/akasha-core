import React, { Suspense, useCallback } from 'react';
import routes, { EDIT } from '../../routes';
import FollowButton from './follow-button';
import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import Badge from '@akashaorg/design-system-core/lib/components/Badge';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import {
  FlagIcon,
  LinkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import {
  ProfileHeaderLoading,
  ProfileHeader as ProfileHeaderPresentation,
} from '@akashaorg/design-system-components/lib/components/Profile';
import { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';
import {
  EntityTypes,
  ModalNavigationOptions,
  NotificationEvents,
  NotificationTypes,
} from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import {
  transformSource,
  useValidDid,
  useGetLogin,
  useRootComponentProps,
  hasOwn,
} from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidSuspenseQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

type ProfileHeaderProps = {
  profileId: string;
  plain?: boolean;
  customStyle?: string;
};
const ProfileHeader: React.FC<ProfileHeaderProps> = props => {
  const [activeOverlay, setActiveOverlay] = React.useState<'avatar' | 'coverImage' | null>(null);
  const { profileId, plain, customStyle = '' } = props;
  const { t } = useTranslation('app-profile');
  const { data: loginData } = useGetLogin();
  const { uiEvents, navigateToModal, getRoutingPlugin } = useRootComponentProps();

  const { data, error } = useGetProfileByDidSuspenseQuery({
    fetchPolicy:
      'cache-first' /*data is prefetched during route matching as a result we prefer reading cache first here  */,
    variables: { id: profileId },
  });
  const { validDid, isEthAddress } = useValidDid(profileId, !!data?.node);
  const { akashaProfile: profileData } =
    data?.node && hasOwn(data.node, 'akashaProfile') ? data.node : { akashaProfile: null };

  const showLoginModal = useCallback(
    (redirectTo?: { modal: ModalNavigationOptions }) => {
      navigateToModal({
        name: 'login',
        redirectTo,
      });
    },
    [navigateToModal],
  );

  const isLoggedIn = !!loginData?.id;
  const authenticatedDID = loginData?.id;
  const isViewer = profileData?.did?.id === authenticatedDID;
  const navigateTo = getRoutingPlugin().navigateTo;

  const handleClickAvatar = () => {
    if (!profileData?.avatar) return;
    setActiveOverlay('avatar');
  };

  const handleClickCoverImage = () => {
    if (!profileData?.background) return;
    setActiveOverlay('coverImage');
  };

  const handleCloseOverlay = () => {
    setActiveOverlay(null);
  };

  const handleFlag = React.useCallback(
    (itemId: string, itemType: EntityTypes, user: string) => () => {
      if (!isLoggedIn) {
        return showLoginModal({ modal: { name: 'report-modal', itemId, itemType, user } });
      }
      navigateToModal({ name: 'report-modal', itemId, itemType, user });
    },
    [isLoggedIn, navigateToModal, showLoginModal],
  );

  const handleCopy = () => {
    const profileUrl = new URL(location.pathname, location.origin).href;
    navigator.clipboard.writeText(profileUrl).then(() => {
      uiEvents.next({
        event: NotificationEvents.ShowNotification,
        data: {
          type: NotificationTypes.Success,
          message: t('Profile link copied'),
        },
      });
    });
  };

  const handleClickProfileName = () => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  };

  const handleEdit = () => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}${routes[EDIT]}`,
    });
  };

  const menuItems: MenuProps['items'] = [
    {
      label: t('Copy link'),
      icon: <LinkIcon />,
      onClick: handleCopy,
    },
    ...(!isViewer
      ? ([
          {
            label: t('Report'),
            icon: <FlagIcon />,
            onClick: handleFlag(profileId, EntityTypes.PROFILE, profileData?.name),
            color: { light: 'errorLight', dark: 'errorDark' },
          },
        ] as MenuProps['items'])
      : []),
  ];

  if (error)
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading the profile header')}
        details={t('We cannot show this profile header right now')}
        devDetails={error.message}
      />
    );

  return (
    <ProfileHeaderPresentation
      profileId={profileData?.did?.id ? profileData.did.id : profileId}
      validAddress={profileData ? true : isEthAddress || validDid}
      background={profileData?.background}
      avatar={profileData?.avatar}
      name={profileData?.name}
      ensName={null /*@TODO: integrate ENS when the API is ready */}
      viewerIsOwner={isViewer}
      menuItems={menuItems}
      copyLabel={t('Copy to clipboard')}
      copiedLabel={t('Copied')}
      followElement={
        <Suspense
          fallback={<CircularPlaceholder height="h-8" width="w-8" customStyle="ml-auto shrink-0" />}
        >
          {profileData?.id && (
            <FollowButton profileID={profileData.id} showLoginModal={showLoginModal} />
          )}
        </Suspense>
      }
      metadata={
        profileData?.nsfw && (
          <Tooltip
            content={t('This profile is marked as NSFW')}
            placement="bottom"
            backgroundColor={{ light: 'grey6', dark: 'grey4' }}
          >
            <Badge background={{ light: 'errorLight', dark: 'errorDark' }}>
              {/*@TODO: The following is a placeholder until proper icon is found */}
              <Text
                variant="footnotes2"
                color={{ light: 'white', dark: 'black' }}
                customStyle="leading-[9px] text-[9px]"
              >
                {t('18+')}
              </Text>
            </Badge>
          </Tooltip>
        )
      }
      activeOverlay={activeOverlay}
      onClickAvatar={handleClickAvatar}
      onClickCoverImage={handleClickCoverImage}
      onCloseOverlay={handleCloseOverlay}
      onClickProfileName={handleClickProfileName}
      plain={plain}
      handleEdit={handleEdit}
      transformSource={transformSource}
      customStyle={customStyle}
    />
  );
};

export default (props: ProfileHeaderProps) => (
  <>
    <Suspense fallback={<ProfileHeaderLoading plain={props.plain} />}>
      <ProfileHeader {...props} />
    </Suspense>
  </>
);
