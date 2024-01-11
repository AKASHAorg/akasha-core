import React, { Suspense } from 'react';
import routes, { EDIT } from '../../routes';
import FollowButton from './follow-button';
import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Badge from '@akashaorg/design-system-core/lib/components/Badge';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  FlagIcon,
  LinkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { ProfileHeader } from '@akashaorg/design-system-components/lib/components/Profile';
import { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';
import { EntityTypes, ModalNavigationOptions, NavigateToParams } from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useGetProfileByDidSuspenseQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { transformSource, hasOwn, useValidDid, useGetLogin } from '@akashaorg/ui-awf-hooks';

export type ProfileHeaderViewProps = {
  showNSFW?: boolean;
  handleCopyFeedback: () => void;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  navigateToModal: (opts: ModalNavigationOptions) => void;
  navigateTo: (args: NavigateToParams) => void;
};

const ProfileHeaderView: React.FC<ProfileHeaderViewProps> = props => {
  const { t } = useTranslation('app-profile');
  const { showNSFW, handleCopyFeedback, showLoginModal, navigateToModal, navigateTo } = props;
  const { profileId } = useParams<{ profileId: string }>();
  const { data: loginData } = useGetLogin();
  const { data, error } = useGetProfileByDidSuspenseQuery({
    fetchPolicy: 'cache-and-network',
    variables: { id: profileId },
  });
  const { akashaProfile: profileData } =
    data.node && hasOwn(data.node, 'akashaProfile') ? data.node : { akashaProfile: null };
  const authenticatedDID = loginData?.id;
  const isLoggedIn = !!loginData?.id;
  const isViewer = profileData?.did?.id === authenticatedDID;

  const { validDid, isEthAddress } = useValidDid(profileId, !!profileData);

  const handleFlag = React.useCallback(
    (itemId: string, itemType: EntityTypes, user: string) => () => {
      if (!isLoggedIn) {
        return showLoginModal({ modal: { name: 'report-modal', itemId, itemType, user } });
      }
      navigateToModal({ name: 'report-modal', itemId, itemType, user });
    },
    [isLoggedIn, navigateToModal, showLoginModal],
  );

  const profileNotFound = !profileData && !validDid;

  if (
    profileNotFound ||
    (profileData?.nsfw && !showNSFW && authenticatedDID !== profileData.did.id)
  )
    return null;

  if (error)
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading the profile header')}
        details={t('We cannot show this profile header right now')}
        devDetails={error.message}
      />
    );

  const handleCopy = () => {
    const profileUrl = new URL(location.pathname, location.origin).href;
    navigator.clipboard.writeText(profileUrl).then(() => {
      handleCopyFeedback();
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

  return (
    <ProfileHeader
      did={profileData ? profileData.did : { id: profileId }}
      validAddress={profileData ? true : isEthAddress || validDid}
      background={profileData?.background}
      avatar={profileData?.avatar}
      name={profileData?.name}
      ensName={null /*@TODO: integrate ENS when the API is ready */}
      viewerIsOwner={isViewer}
      menuItems={menuItems}
      copyLabel={t('Copy to clipboard')}
      copiedLabel={t('Copied')}
      publicImagePath="/images"
      followElement={
        <Suspense
          fallback={<CircularPlaceholder height="h-8" width="w-8" customStyle="ml-auto shrink-0" />}
        >
          <FollowButton profileID={profileData?.id} showLoginModal={showLoginModal} />
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
      handleEdit={handleEdit}
      transformSource={transformSource}
    />
  );
};

export default ProfileHeaderView;
