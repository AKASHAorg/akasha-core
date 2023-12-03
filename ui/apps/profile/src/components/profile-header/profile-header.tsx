import React, { Suspense } from 'react';
import routes, { EDIT } from '../../routes';
import FollowButton from './follow-button';
import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
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
import { hasOwn, useLoggedIn, useValidDid } from '@akashaorg/ui-awf-hooks';

export type ProfileHeaderViewProps = {
  handleCopyFeedback: () => void;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  navigateToModal: (opts: ModalNavigationOptions) => void;
  navigateTo: (args: NavigateToParams) => void;
};

const ProfileHeaderView: React.FC<ProfileHeaderViewProps> = props => {
  const { t } = useTranslation('app-profile');
  const { handleCopyFeedback, showLoginModal, navigateToModal, navigateTo } = props;
  const { profileId } = useParams<{ profileId: string }>();

  const { isLoggedIn, authenticatedDID } = useLoggedIn();
  const { data, error } = useGetProfileByDidSuspenseQuery({
    fetchPolicy: 'cache-and-network',
    variables: { id: profileId },
  });

  const { akashaProfile: profileData } =
    data.node && hasOwn(data.node, 'akashaProfile') ? data.node : { akashaProfile: null };

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

  if (profileNotFound) return null;

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
      handleEdit={handleEdit}
    />
  );
};

export default ProfileHeaderView;
