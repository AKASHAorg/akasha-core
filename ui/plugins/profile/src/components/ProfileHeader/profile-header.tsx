import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { styled, ProfileCard, ModalRenderer, ToastProvider, ReportModal, useViewportSize } = DS;

const StyledProfileCard = styled(ProfileCard)`
  height: auto;
  margin-bottom: 0.5em;
`;

export interface IProfileHeaderProps {
  profileId: string;
  profileData: Partial<IProfileData>;
  loggedUserEthAddress?: string;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showLoginModal: () => void;
}

export const ProfilePageHeader = (props: IProfileHeaderProps & RootComponentProps) => {
  const { profileData, loggedUserEthAddress, modalOpen, setModalOpen, showLoginModal } = props;

  const [flagged, setFlagged] = React.useState('');

  const { size } = useViewportSize();

  const { t } = useTranslation();

  const handleEntryFlag = (entryId: string) => () => {
    /* todo */
    if (!loggedUserEthAddress) {
      return showLoginModal();
    }
    setFlagged(entryId);
    setModalOpen(true);
  };

  if (!profileData) {
    return null;
  }

  const cardData = {
    ...profileData,
  };

  return (
    <>
      <ModalRenderer slotId={props.layout.app.modalSlotId}>
        {modalOpen && (
          <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
            <ReportModal
              titleLabel={t('Report a Post')}
              successTitleLabel={t('Thank you for helping us keep Ethereum World Safe! 🙌')}
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
              size={size}
              closeModal={() => {
                setModalOpen(false);
              }}
            />
          </ToastProvider>
        )}
      </ModalRenderer>
      <StyledProfileCard
        onClickApps={() => {}}
        onClickFollowing={() => {}}
        // @ts-ignore
        profileData={cardData}
        onChangeProfileData={() => {}}
        getProfileProvidersData={() => {}}
        descriptionLabel={'About me'}
        actionsLabel={'Actions'}
        editProfileLabel={'Edit profile'}
        changeCoverImageLabel={'Change cover image'}
        cancelLabel={'Cancel'}
        saveChangesLabel={'Save changes'}
        followingLabel={'Following'}
        appsLabel={'Apps'}
        usersLabel={'Users'}
        shareProfileLabel={'Share Profile'}
        flaggable={true}
        flagAsLabel={'Report Profile'}
        onEntryFlag={handleEntryFlag(profileData.ethAddress ? profileData.ethAddress : '')}
      />
    </>
  );
};
