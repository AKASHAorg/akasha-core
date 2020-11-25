import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { getProfileStore, ProfileStateModel } from '../state';
import { useTranslation } from 'react-i18next';
import { ActionMapper, StateMapper } from 'easy-peasy';

const { Avatar, Box, MainAreaCardBox, Text, isBase64, styled } = DS;

export interface IMyProfileProps {
  sdkModules: any;
  globalChannel?: any;
  logger: any;
}

const BoxAvatar = styled(Avatar)`
  top: -1.875em;
`;

const getImageSrc = (boxImage: any) => {
  if (!boxImage) {
    return '';
  }
  if (isBase64(boxImage)) {
    return boxImage;
  }
  return `//gateway.ipfs.io/ipfs/${boxImage}`;
};

const BoxProfile: React.FC<IMyProfileProps> = () => {
  const Profile = getProfileStore();
  const profileStateData = Profile.useStoreState(
    (state: StateMapper<ProfileStateModel, ''>) => state.data,
  );
  const getProfile = Profile.useStoreActions(
    (act: ActionMapper<ProfileStateModel, ''>) => act.getProfile,
  );
  const { profileId } = useParams<{ profileId: string }>();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (profileId) {
      getProfile(profileId);
    }
  }, [profileId]);

  return (
    <>
      <DS.Helmet>
        <title>3Box | {profileId} Profile Page</title>
      </DS.Helmet>
      <Box fill="horizontal">
        <Box fill="horizontal" align="center">
          {!Object.keys(profileStateData.visitingProfile).length && (
            <Box>{t('Loading Profile')}</Box>
          )}
          <MainAreaCardBox>
            <Box
              height="9em"
              background={{
                image: getImageSrc(profileStateData.visitingProfile.coverPhoto),
                color: '#c5d7f2',
              }}
              pad="none"
              round={{ corner: 'top', size: 'xsmall' }}
            />
            <Box
              direction="row"
              border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
              margin="0 1em"
            >
              <BoxAvatar
                ethAddress={profileId || ''}
                border="lg"
                size="xl"
                src={getImageSrc(profileStateData.visitingProfile.image)}
              />
              <Box pad={{ vertical: 'small', left: 'xsmall' }}>
                <Text size="xlarge" weight="bold" color="primaryText">
                  {profileStateData.visitingProfile.name} {profileStateData.visitingProfile.emoji}
                </Text>
                <Box direction="row" gap="xsmall">
                  <Text size="medium" color="secondaryText">
                    {profileId}
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box direction="column" pad="medium" gap="medium">
              <Box direction="row" gap="xsmall" align="center">
                <Text size="large" weight="bold" color="primaryText">
                  {t('About')}
                </Text>
              </Box>
              <Text color="primaryText">{profileStateData.visitingProfile.description}</Text>
            </Box>
          </MainAreaCardBox>
        </Box>
      </Box>
    </>
  );
};

export default BoxProfile;
