import React, { ReactNode, useMemo } from 'react';
import routes, { EDIT } from '../routes';
import FollowProfileButton from './follow-profile-button';
import {
  ProfileHeader,
  ProfileHeaderLoading,
} from '@akashaorg/design-system-components/lib/components/Profile';
import { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';
import { EntityTypes, ModalNavigationOptions, NavigateToParams } from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import {
  useGetFollowDocumentsQuery,
  useGetProfileByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { hasOwn, useGetLogin, useValidDid } from '@akashaorg/ui-awf-hooks';

type ProfileHeaderViewProps = {
  handleFeedback: () => void;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  navigateToModal: (opts: ModalNavigationOptions) => void;
  navigateTo: (args: NavigateToParams) => void;
};

const ProfileHeaderView: React.FC<ProfileHeaderViewProps> = props => {
  const { t } = useTranslation('app-profile');
  const { handleFeedback, showLoginModal, navigateToModal, navigateTo } = props;
  const { profileId } = useParams<{ profileId: string }>();

  const loginQuery = useGetLogin();
  const profileDataReq = useGetProfileByDidQuery(
    {
      id: profileId,
    },
    {
      select: response => response.node,
      enabled: !!profileId,
    },
  );

  const { isViewer, akashaProfile: profileData } =
    profileDataReq.data && hasOwn(profileDataReq.data, 'isViewer')
      ? profileDataReq.data
      : { isViewer: null, akashaProfile: null };

  const { validDid, isEthAddress } = useValidDid(profileId, !!profileData);
  const isLoggedIn = useMemo(() => {
    return !!loginQuery.data?.id;
  }, [loginQuery.data]);
  const handleFlag = React.useCallback(
    (itemId: string, itemType: EntityTypes, user: string) => () => {
      if (!isLoggedIn) {
        return showLoginModal({ modal: { name: 'report-modal', itemId, itemType, user } });
      }
      navigateToModal({ name: 'report-modal', itemId, itemType, user });
    },
    [isLoggedIn, navigateToModal, showLoginModal],
  );
  const followDocuments = useGetFollowDocumentsQuery(
    {
      following: [profileData?.id],
      last: 1,
    },
    { select: response => response.viewer },
  );

  const followDocument = followDocuments.data?.akashaFollowList?.edges[0];

  const profileNotFound = !profileData && !validDid;

  if (profileDataReq.status === 'loading' || followDocuments.status === 'loading')
    return <ProfileHeaderLoading />;

  if (profileDataReq.status === 'error' || followDocuments.status === 'error' || profileNotFound)
    return null;

  const handleCopy = () => {
    const profileUrl = new URL(location.pathname, location.origin).href;
    navigator.clipboard.writeText(profileUrl).then(() => {
      handleFeedback();
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
      icon: 'LinkIcon',
      onClick: handleCopy,
    },
    ...(!isViewer
      ? ([
          {
            label: t('Report'),
            icon: 'FlagIcon',
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
        <FollowProfileButton
          profileID={profileData?.id}
          isLoggedIn={!!loginQuery.data?.id}
          followId={followDocument?.node?.id}
          isFollowing={followDocument?.node?.isFollowing}
          showLoginModal={showLoginModal}
          iconOnly={true}
        />
      }
      handleEdit={handleEdit}
    />
  );
};

export const withProfileHeader = <T extends ProfileHeaderViewProps>(
  wrappedComponent: ReactNode,
) => {
  return (props: T) => {
    return (
      <>
        <ProfileHeaderView {...props} />
        {wrappedComponent}
      </>
    );
  };
};

export default withProfileHeader;
