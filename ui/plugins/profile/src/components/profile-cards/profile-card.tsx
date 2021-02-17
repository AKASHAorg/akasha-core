import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';
import { RootComponentProps, IAkashaError } from '@akashaproject/ui-awf-typings';
import { ModalState, ModalStateActions } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';
import { useFollow } from '@akashaproject/ui-awf-hooks';
import { rootRoute } from '../../routes';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://moderation.ethereum.world'
    : 'https://moderation.akasha.network';

export const BASE_FLAG_URL = `${BASE_URL}/flags`;

const {
  styled,
  ProfileCard,
  ModalRenderer,
  ToastProvider,
  ReportModal,
  useViewportSize,
  ShareModal,
} = DS;

export interface IProfileHeaderProps {
  profileId: string;
  profileData?: Partial<IProfileData>;
  loggedUserEthAddress: string | null;
  modalState: ModalState;
  modalActions: ModalStateActions;
}

const Overlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  inset: 0;
  opacity: 1;
  background-color: ${props => props.theme.colors.modalBackground};
  animation: fadeAnimation ease 0.4s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
`;

export const ProfilePageCard = (props: IProfileHeaderProps & RootComponentProps) => {
  const { profileData, loggedUserEthAddress, sdkModules, logger, profileId, globalChannel } = props;

  const [flagged, setFlagged] = React.useState('');

  const { size } = useViewportSize();

  const { t } = useTranslation();

  const [followedProfiles, followActions] = useFollow({
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo.error.message, errorInfo.errorKey);
    },
  });

  React.useEffect(() => {
    if (loggedUserEthAddress) {
      followActions.isFollowing(loggedUserEthAddress, profileId);
    }
  }, [loggedUserEthAddress, profileId]);

  const handleFollow = () => {
    if (profileData?.ethAddress) {
      followActions.follow(profileData.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (profileData?.ethAddress) {
      followActions.unfollow(profileData.ethAddress);
    }
  };

  const handleEntryFlag = (entryId: string) => () => {
    setFlagged(entryId);
    props.modalActions.showAfterLogin('reportModal');
  };

  const closeReportModal = () => {
    props.modalActions.hide('reportModal');
  };

  const showShareModal = () => {
    props.modalActions.show('profileShare');
  };

  const closeShareModal = () => {
    props.modalActions.hide('profileShare');
  };

  const url = `${window.location.origin}${rootRoute}/${profileId}`;

  const handleProfileShare = (service: 'twitter' | 'facebook' | 'reddit' | 'copy', url: string) => {
    let shareUrl;
    switch (service) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'reddit':
        shareUrl = `http://www.reddit.com/submit?url=${url}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
      default:
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  if (!profileData?.ethAddress) {
    return null;
  }

  const cardData = {
    ...profileData,
  };

  return (
    <>
      <ModalRenderer slotId={props.layout.app.modalSlotId}>
        {props.modalState.reportModal && (
          <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
            <ReportModal
              titleLabel={t('Report a Profile')}
              successTitleLabel={t('Thank you for helping us keep Ethereum World safe! 🙌')}
              successMessageLabel={t('We will investigate this post and take appropriate action.')}
              optionsTitleLabel={t('Please select a reason')}
              optionLabels={[
                t('Suspicious, deceptive, or spam'),
                t('Abusive or harmful to others'),
                t('Self-harm or suicide'),
                t('Illegal'),
                t('Nudity'),
                t('Violence'),
              ]}
              descriptionLabel={t('Explanation')}
              descriptionPlaceholder={t('Please explain your reason(s)')}
              footerText1Label={t('If you are unsure, you can refer to our ')}
              footerLink1Label={t('Code of Conduct')}
              footerUrl1={'https://akasha.slab.com/public/ethereum-world-code-of-conduct-e7ejzqoo'}
              footerText2Label={t(' and ')}
              footerLink2Label={t('Terms of Service')}
              footerUrl2={'https://ethereum.world/terms-of-service'}
              cancelLabel={t('Cancel')}
              reportLabel={t('Report')}
              blockLabel={t('Block User')}
              closeLabel={t('Close')}
              user={loggedUserEthAddress ? loggedUserEthAddress : ''}
              contentId={profileData.ethAddress ? profileData.ethAddress : flagged}
              contentType={t('profile')}
              baseUrl={BASE_FLAG_URL}
              size={size}
              closeModal={closeReportModal}
            />
          </ToastProvider>
        )}
        {props.modalState.profileShare && (
          <Overlay>
            <ShareModal
              link={url}
              handleProfileShare={handleProfileShare}
              closeModal={closeShareModal}
            />
          </Overlay>
        )}
      </ModalRenderer>
      <ProfileCard
        onENSChangeClick={() => {}}
        onUpdateClick={() => {}}
        onClickFollowers={() => {}}
        onClickFollowing={() => {}}
        onClickPosts={() => {}}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        handleShareClick={showShareModal}
        isFollowing={followedProfiles.includes(profileData?.ethAddress)}
        loggedEthAddress={loggedUserEthAddress}
        profileData={cardData as any}
        followLabel={t('Follow')}
        unfollowLabel={t('Unfollow')}
        descriptionLabel={t('About me')}
        followingLabel={t('Following')}
        followersLabel={t('Followers')}
        postsLabel={t('Posts')}
        shareProfileLabel={t('Share')}
        flaggable={true}
        flagAsLabel={t('Report Profile')}
        onEntryFlag={handleEntryFlag(profileData.ethAddress ? profileData.ethAddress : '')}
      />
    </>
  );
};
