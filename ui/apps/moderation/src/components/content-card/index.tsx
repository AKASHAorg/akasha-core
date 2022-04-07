import React from 'react';

import DS from '@akashaproject/design-system';
import { usePost, useComment, useGetProfile, mapEntry } from '@akashaproject/ui-awf-hooks';
import { ModerationItemTypes } from '@akashaproject/ui-awf-typings';

import Content from './content';
import { IContentProps } from '../../interfaces';

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
    itemType,
    forLabel,
    andLabel,
    reportedByLabel,
    originallyReportedByLabel,
    entryId,
    reasons,
    reporter,
    reporterAvatar,
    reporterENSName,
    reporterName,
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

  const profileDataQuery = useGetProfile(
    entryId,
    props.user,
    itemType === ModerationItemTypes.ACCOUNT,
  );
  const profile = profileDataQuery.data;

  const postQuery = usePost({ postId: entryId, enabler: itemType === ModerationItemTypes.POST });

  const commentQuery = useComment(
    entryId,
    itemType === ModerationItemTypes.REPLY || itemType === ModerationItemTypes.COMMENT,
  );

  const entryData = React.useMemo(() => {
    if (itemType === ModerationItemTypes.POST) {
      if (postQuery.data) {
        return mapEntry(postQuery.data);
      }
      return undefined;
    }
    if (itemType === ModerationItemTypes.REPLY || itemType === ModerationItemTypes.COMMENT) {
      if (commentQuery.data) {
        return mapEntry(commentQuery.data);
      }
      return undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postQuery.data, commentQuery.data]);

  return (
    <Box margin={{ bottom: '1rem' }}>
      <MainAreaCardBox>
        <Content
          {...props}
          isPending={isPending}
          locale={locale}
          entryData={itemType === ModerationItemTypes.ACCOUNT ? profile : entryData}
          showExplanationsLabel={showExplanationsLabel}
          hideExplanationsLabel={hideExplanationsLabel}
          determinationLabel={determinationLabel}
          determination={determination}
          reportedLabel={reportedLabel}
          itemType={itemType}
          forLabel={forLabel}
          andLabel={andLabel}
          reportedByLabel={reportedByLabel}
          originallyReportedByLabel={originallyReportedByLabel}
          entryId={entryId}
          reasons={reasons}
          reporter={reporter}
          reporterAvatar={reporterAvatar}
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
          singleSpa={props.singleSpa}
          handleButtonClick={props.handleButtonClick}
        />
      </MainAreaCardBox>
    </Box>
  );
};

export default ContentCard;
