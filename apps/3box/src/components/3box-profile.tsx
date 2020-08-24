import * as React from 'react';
import * as H from 'history';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useBoxProfile } from '../state';
import { useTranslation } from 'react-i18next';

const { Avatar, Box, MainAreaCardBox, Text, isBase64, styled } = DS;

export interface IMyProfileProps {
  history: H.History;
  location: H.Location;
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
  return `//ipfs.io/ipfs/${boxImage}`;
};

const BoxProfile: React.FC<IMyProfileProps> = props => {
  const [state, actions] = useBoxProfile(props.sdkModules, props.globalChannel, props.logger);
  const { profileId } = useParams<{ profileId: string }>();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (profileId) {
      actions.getProfile(profileId);
    }
  }, [profileId]);

  return (
    <>
      <DS.Helmet>
        <title>3Box | {profileId} Profile Page</title>
      </DS.Helmet>
      <Box fill="horizontal">
        <Box fill="horizontal" align="center">
          {!Object.keys(state.data.visitingProfile).length && <Box>{t('Loading Profile')}</Box>}
          <MainAreaCardBox>
            <Box
              height="9em"
              background={{
                image: getImageSrc(state.data.visitingProfile.coverPhoto),
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
                src={getImageSrc(state.data.visitingProfile.image)}
              />
              <Box pad={{ vertical: 'small', left: 'xsmall' }}>
                <Text size="xlarge" weight="bold" color="primaryText">
                  {state.data.visitingProfile.name} {state.data.visitingProfile.emoji}
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
              <Text color="primaryText">{state.data.visitingProfile.description}</Text>
            </Box>
          </MainAreaCardBox>
        </Box>
      </Box>
    </>
  );
};

export default BoxProfile;
