import React from 'react';
import DS from '@akashaproject/design-system';
import { usePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { useComment } from '@akashaproject/ui-awf-hooks/lib/use-comments.new';
import { useGetProfile } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
import { mapEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';

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

  const profileDataQuery = useGetProfile(entryId, props.user, itemType === 'account');
  const profile = profileDataQuery.data;

  const postQuery = usePost({ postId: entryId, enabler: itemType === 'post' });
  const commentQuery = useComment(entryId, itemType === 'reply' || itemType === 'comment');

  const entryData = React.useMemo(() => {
    if (itemType === 'post') {
      if (postQuery.data) {
        return mapEntry(postQuery.data);
      }
      return undefined;
    }
    if (['reply', 'comment'].includes(itemType)) {
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
          isPending={isPending}
          locale={locale}
          entryData={itemType === 'account' ? profile : entryData}
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
