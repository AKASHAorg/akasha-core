import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ModalState, ModalStateActions } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';

import { BASE_FLAG_URL } from '../../services/constants';

const { ProfileCard, ModalRenderer, ToastProvider, ReportModal, useViewportSize } = DS;

export interface IProfileHeaderProps {
  profileId: string;
  profileData: Partial<IProfileData>;
  loggedUserEthAddress: string | null;
  modalState: ModalState;
  modalActions: ModalStateActions;
}

export const ProfilePageCard = (props: IProfileHeaderProps & RootComponentProps) => {
  const { profileData, loggedUserEthAddress } = props;

  const [flagged, setFlagged] = React.useState('');

  const { size } = useViewportSize();

  const { t } = useTranslation();

  const handleEntryFlag = (entryId: string) => () => {
    setFlagged(entryId);
    props.modalActions.showAfterLogin('reportModal');
  };

  const closeReportModal = () => {
    props.modalActions.hide('reportModal');
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
        {props.modalState.reportModal && (
          <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
            <ReportModal
              titleLabel={t('Report a Profile')}
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
              baseUrl={BASE_FLAG_URL}
              size={size}
              closeModal={closeReportModal}
            />
          </ToastProvider>
        )}
      </ModalRenderer>
      <ProfileCard
        onClickApps={() => {}}
        onClickFollowing={() => {}}
        //@ts-ignore
        profileData={cardData}
        descriptionLabel={t('About me')}
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
