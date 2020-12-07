import React from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';

import { ILocale } from '@akashaproject/design-system/lib/utils/time';

import { StyledBox } from './styled';

const { Box, Icon, Text, Avatar, Button, EntryCardMod, ProfileCardMod, MainAreaCardBox } = DS;

export interface IContentCardProps {
  isPending: boolean;
  entryData: any;
  repliesLabel: string;
  repostsLabel: string;
  locale: ILocale;

  determinationLabel?: string;
  reportedLabel: string;
  contentType: string;
  forLabel: string;
  additionalDescLabel: string;
  additionalDescContent?: string;
  reportedByLabel: string;
  ethAddress?: string;
  reasons: string[];
  reporterName?: string;
  reporterENSName?: string;
  reportedOnLabel?: string;
  reportedDateTime: string;
  moderatorName?: string;
  moderatorENSName?: string;
  moderatedByLabel?: string;
  moderatedOnLabel?: string;
  evaluationDateTime?: string;
  keepContentLabel?: string;
  delistContentLabel?: string;
  handleButtonClick: (
    param1: string,
    param2: string,
    param3: string,
    param4: string[],
    param5: any,
  ) => void;
}

const ContentCard: React.FC<IContentCardProps> = props => {
  const {
    isPending,
    entryData,
    repostsLabel,
    repliesLabel,
    locale,
    determinationLabel,
    reportedLabel,
    contentType,
    forLabel,
    additionalDescLabel,
    additionalDescContent,
    reportedByLabel,
    ethAddress,
    reasons,
    reporterName,
    reporterENSName,
    reportedOnLabel,
    reportedDateTime,
    moderatorName,
    moderatorENSName,
    moderatedByLabel,
    moderatedOnLabel,
    evaluationDateTime,
    keepContentLabel,
    delistContentLabel,
    handleButtonClick,
  } = props;

  const { t } = useTranslation();

  const handleClick = (action: string) => () => {
    if (ethAddress) {
      handleButtonClick(ethAddress, action, contentType, reasons, entryData);
    }
  };

  return (
    <Box margin={{ bottom: '1rem' }}>
      <MainAreaCardBox>
        <Box pad="1rem">
          <MainAreaCardBox>
            {contentType === 'post' ? (
              <EntryCardMod
                entryData={entryData}
                repostsLabel={repostsLabel}
                repliesLabel={repliesLabel}
                locale={locale}
                style={{ height: 'auto' }}
                onClickAvatar={() => null}
                onClickReplies={() => null}
                onContentClick={() => null}
              />
            ) : contentType === 'profile' ? (
              <ProfileCardMod
                onClickApps={() => null}
                onClickFollowing={() => null}
                profileData={entryData}
                onChangeProfileData={() => null}
                getProfileProvidersData={() => null}
                descriptionLabel={t('About me')}
                actionsLabel={t('Actions')}
                editProfileLabel={t('Edit profile')}
                changeCoverImageLabel={t('Change cover image')}
                followingLabel={t('Following')}
                appsLabel={t('Apps')}
                usersLabel={t('Users')}
                shareProfileLabel={t('Share Profile')}
                onEntryFlag={() => null}
              />
            ) : null}
          </MainAreaCardBox>
          {!isPending && (
            <Text
              size="small"
              margin={{ top: 'large' }}
              color="secondaryText"
              style={{ textTransform: 'uppercase' }}
            >
              {determinationLabel}
            </Text>
          )}
          <Box
            direction="row"
            margin={{ top: isPending ? 'large' : 'medium' }}
            wrap={true}
            align="center"
          >
            <Icon type="error" size="md" accentColor={true} />
            <Text
              margin={{ left: '0.2rem', bottom: '0.2rem' }}
            >{`${reportedLabel} ${contentType} ${forLabel}`}</Text>
            {reasons.map((reason, idx) => (
              <StyledBox
                key={idx}
                margin={{ left: '0.2rem', bottom: '0.2rem' }}
                pad={{ horizontal: '0.2rem' }}
                round={'0.125rem'}
              >
                <Text as="span" color="accentText">
                  {reason}
                </Text>
              </StyledBox>
            ))}
          </Box>
          <Text margin={{ top: 'large', bottom: 'xsmall' }}>{additionalDescLabel}:</Text>
          {additionalDescContent && <Text>{additionalDescContent}</Text>}
          {!isPending && (
            <>
              <Text
                margin={{ top: 'large' }}
              >{`${moderatedByLabel} ${moderatorName} (${moderatorENSName})`}</Text>
              <Text color="secondaryText">{`${moderatedOnLabel} ${moment(evaluationDateTime).format(
                'D MMM yyyy・hh:mm',
              )}`}</Text>
            </>
          )}
          <Box
            direction="row"
            margin={{ top: 'medium' }}
            pad={{ top: 'medium' }}
            align="center"
            border={{ side: 'top', color: 'border', style: 'solid' }}
          >
            <Box width={isPending ? '65%' : '100%'}>
              <Box direction="row">
                <Text color={!isPending ? 'secondaryText' : 'intial'}>{reportedByLabel}</Text>
                <Avatar
                  ethAddress={ethAddress || ''}
                  src="https://placebeard.it/360x360"
                  size="xs"
                  margin={{ left: '0.2rem' }}
                  backgroundColor={'lightBackground'}
                  border="sm"
                />
                {reporterName && (
                  <Text margin={{ left: '0.2rem' }} color="accentText">
                    {reporterName}
                  </Text>
                )}
                {reporterENSName && (
                  <Text
                    margin={{ left: '0.2rem' }}
                    color={!isPending ? 'secondaryText' : 'intiial'}
                  >
                    ({reporterENSName})
                  </Text>
                )}
                {!isPending && (
                  <Text
                    margin={{ left: '0.2rem' }}
                    color="secondaryText"
                  >{`${reportedOnLabel} ${moment(reportedDateTime).format('D MMM yyyy')}.`}</Text>
                )}
              </Box>
              {isPending && (
                <Text color="secondaryText">{`${reportedOnLabel} ${moment(reportedDateTime).format(
                  'D MMM yyyy・HH:mm',
                )}`}</Text>
              )}
            </Box>
            {isPending && (
              <Box direction="row" width="35%" justify="end">
                <Button
                  margin={{ right: 'xsmall' }}
                  label={keepContentLabel}
                  onClick={handleClick('Keep')}
                />
                <Button primary={true} label={delistContentLabel} onClick={handleClick('Delist')} />
              </Box>
            )}
          </Box>
        </Box>
      </MainAreaCardBox>
    </Box>
  );
};

export default ContentCard;
