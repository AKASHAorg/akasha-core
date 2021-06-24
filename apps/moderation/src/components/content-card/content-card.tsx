import React from 'react';
import DS from '@akashaproject/design-system';
import { useProfile } from '@akashaproject/ui-awf-hooks';
import getSDK from '@akashaproject/awf-sdk';
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

  const sdk = getSDK();

  const [entryData, setEntryData] = React.useState<any>(null);

  const [profile, profileActions] = useProfile({
    onError: error => {
      props.logger.error('[content-card.tsx]: useProfile err %j', error.error || '');
    },
  });

  const [reporterProfile, reporterProfileActions] = useProfile({
    onError: error => {
      props.logger.error('[content-card.tsx]: useProfile err %j', error.error || '');
    },
  });

  const [moderatorProfile, moderatorProfileActions] = useProfile({
    onError: error => {
      props.logger.error('[content-card.tsx]: useProfile err %j', error.error || '');
    },
  });

  React.useEffect(() => {
    if (contentType === 'post') {
      const entryCall = sdk.api.entries.getEntry(entryId);
      const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;

      entryCall.subscribe((resp: any) => {
        const entry = resp.data?.getPost;
        if (entry) {
          const mappedEntry = mapEntry(entry, ipfsGateway);
          setEntryData(mappedEntry);
        }
      });
    }
    if (contentType === 'account') {
      profileActions.getProfileData({ ethAddress: entryId });
    }
  }, [entryId]);

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
          entryData={contentType === 'account' ? profile : entryData}
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
          reporterAvatar={reporterProfile.avatar}
          reporterName={reporterProfile.name}
          reporterENSName={reporterProfile.userName}
          otherReporters={otherReporters}
          reportedOnLabel={reportedOnLabel}
          reportedDateTime={reportedDateTime}
          moderatorDecision={moderatorDecision}
          moderator={moderator}
          moderatorName={moderatorProfile.name}
          moderatorENSName={moderatorProfile.userName}
          moderatedByLabel={moderatedByLabel}
          moderatedOnLabel={moderatedOnLabel}
          evaluationDateTime={evaluationDateTime}
          makeADecisionLabel={makeADecisionLabel}
          reviewDecisionLabel={reviewDecisionLabel}
          logger={props.logger}
          singleSpa={props.singleSpa}
          handleButtonClick={props.handleButtonClick}
        />
      </MainAreaCardBox>
    </Box>
  );
};

export default ContentCard;
