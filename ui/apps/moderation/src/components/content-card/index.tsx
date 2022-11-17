import React from 'react';

import DS from '@akashaorg/design-system';
import { usePost, useComment, useGetProfile, mapEntry } from '@akashaorg/ui-awf-hooks';

import Content from './content';
import { IContentProps } from '../../interfaces';
import { EntityTypes } from '@akashaorg/typings/ui';

const { Box, MainAreaCardBox } = DS;

const ContentCard: React.FC<Omit<IContentProps, 'entryData'>> = props => {
  const {
    isPending,
    locale,
    incidentLabel,
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
    itemId,
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

  const profileDataQuery = useGetProfile(itemId, props.user, itemType === EntityTypes.PROFILE);
  const profile = profileDataQuery.data;

  const postQuery = usePost({ postId: itemId, enabler: itemType === EntityTypes.POST });

  const commentQuery = useComment(itemId, itemType === EntityTypes.REPLY);

  const entryData = React.useMemo(() => {
    if (itemType === EntityTypes.POST) {
      if (postQuery.data) {
        return mapEntry(postQuery.data);
      }
      return undefined;
    }
    if (itemType === EntityTypes.REPLY) {
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
          entryData={itemType === EntityTypes.PROFILE ? profile : entryData}
          incidentLabel={incidentLabel}
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
          itemId={itemId}
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
