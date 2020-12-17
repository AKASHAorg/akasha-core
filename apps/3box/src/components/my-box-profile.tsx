import * as React from 'react';
import { getProfileStore, IUpdateProfilePayload, ProfileStateModel } from '../state';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { ActionMapper, StateMapper } from 'easy-peasy';

const { BoxFormCard, Box, ErrorInfoCard, ErrorLoader } = DS;

export interface IMyBoxProfileProps {
  globalChannel?: any;
  sdkModules: any;
  logger: any;
}

const MyBoxProfile: React.FC<IMyBoxProfileProps> = () => {
  // const [state, actions] = useBoxProfile(sdkModules, globalChannel, logger);
  const Profile = getProfileStore();
  const stateData = Profile.useStoreState((s: StateMapper<ProfileStateModel, ''>) => s.data);
  const getLoggedEthAddress = Profile.useStoreActions(
    (a: ActionMapper<ProfileStateModel, ''>) => a.getLoggedEthAddress,
  );
  const fetchCurrent = Profile.useStoreActions(
    (a: ActionMapper<ProfileStateModel, ''>) => a.fetchCurrent,
  );
  const updateProfileData = Profile.useStoreActions(
    (a: ActionMapper<ProfileStateModel, ''>) => a.updateProfileData,
  );
  const { t } = useTranslation();
  const { isLoading, isSaving } = stateData;

  React.useEffect(() => {
    getLoggedEthAddress();
  }, []);

  React.useEffect(() => {
    if (stateData.ethAddress) {
      fetchCurrent(stateData.ethAddress);
    }
  }, [stateData.ethAddress]);

  const onFormSubmit = (data: IUpdateProfilePayload) => {
    const { providerName, avatar, coverImage, name, description } = data;
    let updatedAvatar;
    let updatedCoverImage;
    if (
      !stateData.profileData.avatar ||
      (avatar && avatar.src !== stateData.profileData.avatar?.src) ||
      avatar === null
    ) {
      updatedAvatar = avatar;
    }
    if (
      !stateData.profileData.coverImage ||
      (coverImage && coverImage.src !== stateData.profileData.coverImage.src) ||
      coverImage === null
    ) {
      updatedCoverImage = coverImage;
    }
    updateProfileData({
      providerName,
      name,
      description,
      avatar: updatedAvatar,
      coverImage: updatedCoverImage,
      ethAddress: stateData.ethAddress || '',
    });
  };
  return (
    <Box fill="horizontal">
      <DS.Helmet>
        <title>3Box | {t('Edit 3Box profile')}</title>
      </DS.Helmet>
      <Box fill="horizontal" flex={true} align="center">
        <ErrorInfoCard errors={stateData.errors}>
          {(messages, hasCriticalErrors) => (
            <>
              {messages && (
                <ErrorLoader
                  type="script-error"
                  title={t('There was an error loading your 3Box profile')}
                  details={t('We cannot show this profile right now')}
                  devDetails={messages}
                />
              )}
              {!hasCriticalErrors && (
                <>
                  {isLoading && <Box>{t('Loading profile data')}</Box>}
                  {isSaving && (
                    <Box>
                      {t('Saving profile')}
                      {t('Please wait!')}
                    </Box>
                  )}
                  <BoxFormCard
                    titleLabel={t('Ethereum Address')}
                    avatarLabel={t('Avatar')}
                    nameLabel={t('Name')}
                    coverImageLabel={t('Cover Image')}
                    descriptionLabel={t('Description')}
                    uploadLabel={t('Upload')}
                    urlLabel={t('By url')}
                    cancelLabel={t('Cancel')}
                    saveLabel={t('Save')}
                    deleteLabel={t('Delete')}
                    nameFieldPlaceholder={t('Type your name here')}
                    descriptionFieldPlaceholder={t('Add a description about you here')}
                    ethAddress={stateData.ethAddress || ''}
                    providerData={stateData.profileData}
                    onSave={onFormSubmit}
                    updateStatus={{}}
                  />
                </>
              )}
            </>
          )}
        </ErrorInfoCard>
      </Box>
    </Box>
  );
};

export default MyBoxProfile;
