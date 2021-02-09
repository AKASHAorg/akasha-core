import React from 'react';
import { combineLatest } from 'rxjs';
import DS from '@akashaproject/design-system';
import { useProfile } from '@akashaproject/ui-awf-hooks';

import { IContentProps } from '../../interfaces';

import Content from './content';

import { mapEntry } from '../../services/posting-service';

const { Box, MainAreaCardBox } = DS;

const ContentCard: React.FC<Omit<IContentProps, 'entryData'>> = props => {
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
    otherReporters,
    reportedOnLabel,
    reportedDateTime,
    moderatorDecision,
    moderator,
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

  const [reporterProfileState, reporterProfileActions] = useProfile({
    onError: error => {
      props.logger.error('[content-card.tsx]: useProfile err %j', error.error || '');
    },
    ipfsService: props.sdkModules.commons.ipfsService,
    profileService: props.sdkModules.profiles.profileService,
  });

  const [moderatorProfileState, moderatorProfileActions] = useProfile({
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

  React.useEffect(() => {
    if (reporter) {
      reporterProfileActions.getProfileData({ ethAddress: reporter });
    }
  }, [reporter]);

  React.useEffect(() => {
    if (moderator) {
      moderatorProfileActions.getProfileData({ ethAddress: moderator });
    }
  }, [moderator]);

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
          reporterAvatar={reporterProfileState.avatar}
          reporterName={reporterProfileState.name}
          reporterENSName={reporterProfileState.userName}
          otherReporters={otherReporters}
          reportedOnLabel={reportedOnLabel}
          reportedDateTime={reportedDateTime}
          moderatorDecision={moderatorDecision}
          moderator={moderator}
          moderatorName={moderatorProfileState.name}
          moderatorENSName={moderatorProfileState.userName}
          moderatedByLabel={moderatedByLabel}
          moderatedOnLabel={moderatedOnLabel}
          evaluationDateTime={evaluationDateTime}
          makeADecisionLabel={makeADecisionLabel}
          reviewDecisionLabel={reviewDecisionLabel}
          logger={props.logger}
          sdkModules={props.sdkModules}
          handleButtonClick={props.handleButtonClick}
        />
      </MainAreaCardBox>
    </Box>
  );
};

export default ContentCard;
