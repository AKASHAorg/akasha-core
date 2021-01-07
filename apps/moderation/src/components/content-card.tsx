import React from 'react';
import moment from 'moment';
import { combineLatest } from 'rxjs';
import DS from '@akashaproject/design-system';
import { useProfile } from '@akashaproject/ui-awf-hooks';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';

import { mapEntry } from '../services/posting-service';

import EntryDataCard from './entry-data-card';
import ExplanationsCard from './explanations-box';

import { StyledBox } from './styled';

const { Box, Icon, Text, Avatar, Button, MainAreaCardBox } = DS;

export interface IContentCardProps {
  isPending: boolean;
  locale: ILocale;

  showExplanationsLabel: string;
  hideExplanationsLabel: string;
  determinationLabel?: string;
  determination?: string;
  reportedLabel: string;
  contentType: string;
  forLabel: string;
  andLabel?: string;
  reportedByLabel: string;
  originallyReportedByLabel: string;
  entryId: string;
  reasons: string[];
  reporter?: string;
  reporterName?: string;
  reporterENSName?: string;
  otherReporters?: string;
  reportedOnLabel?: string;
  reportedDateTime: string;
  moderatorDecision?: string;
  moderator?: string;
  moderatorName?: string;
  moderatorENSName?: string;
  moderatedByLabel?: string;
  moderatedOnLabel?: string;
  evaluationDateTime?: string;
  makeADecisionLabel?: string;
  reviewDecisionLabel?: string;
  logger: any;
  sdkModules: any;
  handleButtonClick: (param1: string, param2: string) => void;
}

const ContentCard: React.FC<IContentCardProps> = props => {
  const {
    isPending,
    locale,
    showExplanationsLabel,
    hideExplanationsLabel,
    determinationLabel,
    determination,
    reportedLabel,
    contentType,
    forLabel,
    andLabel,
    reportedByLabel,
    originallyReportedByLabel,
    entryId,
    reasons,
    reporter,
    reporterName,
    reporterENSName,
    otherReporters,
    reportedOnLabel,
    reportedDateTime,
    moderatorDecision,
    moderator,
    moderatorName,
    moderatorENSName,
    moderatedByLabel,
    moderatedOnLabel,
    evaluationDateTime,
    makeADecisionLabel,
    reviewDecisionLabel,
  } = props;

  const [entryData, setEntryData] = React.useState<any>(null);
  const [profileState, profileActions] = useProfile({
    onError: error => {
      props.logger.error('[content-card.tsx]: useProfile err %j', error.error || '');
    },
    ipfsService: props.sdkModules.commons.ipfsService,
    profileService: props.sdkModules.profiles.profileService,
  });

  const [showExplanations, setShowExplanations] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (contentType === 'post') {
      const entryCall = props.sdkModules.posts.entries.getEntry({ entryId });
      const ipfsGatewayCall = props.sdkModules.commons.ipfsService.getSettings({});
      const getEntryCall = combineLatest([ipfsGatewayCall, entryCall]);
      getEntryCall.subscribe((resp: any) => {
        const ipfsGateway = resp[0].data;
        const entry = resp[1].data?.getPost;
        if (entry) {
          const mappedEntry = mapEntry(entry, ipfsGateway);
          setEntryData(mappedEntry);
        }
      });
    }
    if (contentType === 'profile') {
      profileActions.getProfileData({ ethAddress: entryId });
    }
  }, [entryId]);

  React.useEffect(() => {
    if (profileState) {
      setEntryData(profileState);
    }
  }, [profileState]);

  const handleClick = () => () => {
    if (entryId) {
      props.handleButtonClick(entryId, contentType);
    }
  };

  return (
    <Box margin={{ bottom: '1rem' }}>
      <MainAreaCardBox>
        <Box pad="1rem">
          <EntryDataCard entryData={entryData} contentType={contentType} locale={locale} />
          <Box
            direction="row"
            margin={{ top: isPending ? 'large' : 'medium' }}
            wrap={true}
            align="center"
          >
            <Icon type="error" size="md" accentColor={true} />
            <Text
              margin={{ left: '0.2rem', bottom: '0.2rem' }}
              style={{ fontWeight: 'bold' }}
            >{`${contentType[0].toUpperCase()}${contentType.slice(
              1,
            )} ${reportedLabel}  ${forLabel}`}</Text>

            {reasons.map((reason, idx) => (
              <>
                {/* show 'and' at the appropriate position, if more than one reason */}
                {reasons.length > 1 && idx === reasons.length - 1 && (
                  <Text
                    margin={{ left: '0.2rem', bottom: '0.2rem' }}
                    style={{ fontWeight: 'bold' }}
                  >
                    {andLabel}
                  </Text>
                )}
                <StyledBox
                  key={idx}
                  margin={{ left: '0.2rem', bottom: '0.2rem' }}
                  pad={{ horizontal: '0.2rem' }}
                  round={'0.125rem'}
                >
                  <Text as="span" color="accentText" style={{ fontWeight: 'bold' }}>
                    {reason}
                  </Text>
                </StyledBox>
              </>
            ))}
          </Box>

          <Text
            as="a"
            color="accentText"
            margin={{ top: 'large' }}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowExplanations(!showExplanations)}
          >
            {showExplanations ? hideExplanationsLabel : showExplanationsLabel}
          </Text>
          {showExplanations && (
            <ExplanationsCard
              entryId={entryId}
              reportedByLabel={reportedByLabel}
              forLabel={forLabel}
              logger={props.logger}
            />
          )}
          <Box
            direction="row"
            margin={{ top: 'medium' }}
            pad={{ top: isPending ? 'medium' : '0rem' }}
            align="center"
            border={isPending ? { side: 'top', color: 'border', style: 'solid' } : { size: '0rem' }}
          >
            <Box width={isPending ? '75%' : '100%'}>
              <Box direction="row">
                <Text>{originallyReportedByLabel}</Text>
                <Avatar
                  ethAddress={reporter || ''}
                  src="https://placebeard.it/360x360"
                  size="xs"
                  margin={{ left: '0.2rem' }}
                  backgroundColor={'lightBackground'}
                  border="sm"
                />
                {reporter && (
                  <Text margin={{ left: '0.2rem' }} color="accentText">
                    {`${reporter.slice(0, 6)}...${reporter.slice(reporter.length - 4)}`}
                  </Text>
                )}
                {reporterName && (
                  <Text margin={{ left: '0.2rem' }} color="accentText">
                    {reporterName}
                  </Text>
                )}
                {reporterENSName && (
                  <Text
                    margin={{ left: '0.2rem' }}
                    color={!isPending ? 'secondaryText' : 'initial'}
                  >
                    ({reporterENSName})
                  </Text>
                )}
                {otherReporters && !!otherReporters.length && (
                  <>
                    <Text margin={{ left: '0.2rem' }}>{andLabel}</Text>
                    <Text margin={{ left: '0.2rem' }} color="accentText">
                      {otherReporters}
                    </Text>
                  </>
                )}
              </Box>
              <Text color="secondaryText">{`${reportedOnLabel} ${moment(reportedDateTime).format(
                'D MMM yyyy・h:mm a',
              )}`}</Text>
            </Box>
            {isPending && (
              <Box direction="row" width="25%" justify="end">
                <Button primary={true} label={makeADecisionLabel} onClick={handleClick()} />
              </Box>
            )}
          </Box>
          {!isPending && (
            <Box
              margin={{ top: 'medium' }}
              border={{ side: 'top', color: 'border', style: 'solid' }}
            >
              {!isPending && (
                <>
                  <Text margin={{ top: 'large' }} style={{ fontWeight: 'bold' }}>
                    {determinationLabel}
                    {': '}
                    <Text as="span" color="accentText">
                      {determination}
                    </Text>
                  </Text>
                  <Text margin={{ top: 'xsmall' }}>{moderatorDecision}</Text>
                </>
              )}
              <Box direction="row" margin={{ top: 'large' }} justify="between" align="end">
                <Box>
                  <Text>
                    {moderator
                      ? `${moderatedByLabel} ${moderator.slice(0, 6)}...${moderator.slice(
                          moderator.length - 5,
                          moderator.length - 1,
                        )}`
                      : `${moderatedByLabel} ${moderatorName} (${moderatorENSName})`}
                  </Text>
                  <Text color="secondaryText">{`${moderatedOnLabel} ${moment(
                    evaluationDateTime,
                  ).format('D MMM yyyy・h:mm a')}`}</Text>
                </Box>
                <Box direction="row" width="35%" justify="end">
                  <Button label={reviewDecisionLabel} onClick={() => null} />
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </MainAreaCardBox>
    </Box>
  );
};

export default ContentCard;
