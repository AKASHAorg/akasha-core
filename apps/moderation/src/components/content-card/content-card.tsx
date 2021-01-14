import React from 'react';
import { combineLatest } from 'rxjs';
import DS from '@akashaproject/design-system';
import { useProfile } from '@akashaproject/ui-awf-hooks';

import { IContentCardProps } from '../../interfaces';

import Content from './content';

import { mapEntry } from '../../services/posting-service';

const { Box, MainAreaCardBox } = DS;

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
      if (profileState) {
        setEntryData(profileState);
      }
    }
  }, [entryId, profileState]);

  return (
    <Box margin={{ bottom: '1rem' }}>
      <MainAreaCardBox>
        <Content
          isPending={isPending}
          locale={locale}
          entryData={entryData}
          showExplanationsLabel={showExplanationsLabel}
          hideExplanationsLabel={hideExplanationsLabel}
          determinationLabel={determinationLabel}
          determination={determination}
          reportedLabel={reportedLabel}
          contentType={contentType}
          forLabel={forLabel}
          andLabel={andLabel}
          reportedByLabel={reportedByLabel}
          originallyReportedByLabel={originallyReportedByLabel}
          entryId={entryId}
          reasons={reasons}
          reporter={reporter}
          reporterName={reporterName}
          reporterENSName={reporterENSName}
          otherReporters={otherReporters}
          reportedOnLabel={reportedOnLabel}
          reportedDateTime={reportedDateTime}
          moderatorDecision={moderatorDecision}
          moderator={moderator}
          moderatorName={moderatorName}
          moderatorENSName={moderatorENSName}
          moderatedByLabel={moderatedByLabel}
          moderatedOnLabel={moderatedOnLabel}
          evaluationDateTime={evaluationDateTime}
          makeADecisionLabel={makeADecisionLabel}
          reviewDecisionLabel={reviewDecisionLabel}
          logger={props.logger}
          handleButtonClick={props.handleButtonClick}
        />
      </MainAreaCardBox>
    </Box>
  );
};

export default ContentCard;
