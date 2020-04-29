import * as React from 'react';
import { MainAreaCardBox } from '../common/basic-card-box';
import { ISocialData, SocialBox } from './social-box';
import { IEntryBoxProps, EntryBox } from './entry-box';
import { Box } from 'grommet';

export interface IEntryCardProps extends IEntryBoxProps {
  // data
  socialData?: ISocialData;
  // labels
  repostedThisLabel?: string;
  andLabel?: string;
  othersLabel?: string;
  // external css
  className?: string;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
}

const EntryCard: React.FC<IEntryCardProps> = props => {
  const {
    entryData,
    socialData,
    locale,
    onClickAvatar,
    onClickReplies,
    toggleBookmark,
    reportEntry,
    repostedThisLabel,
    andLabel,
    othersLabel,
    repostLabel,
    repostWithCommentLabel,
    copyLinkLabel,
    reportLabel,
    shareOnLabel,
    className,
    style,
    rootNodeRef,
  } = props;

  return (
    <MainAreaCardBox className={className} style={style} rootNodeRef={rootNodeRef}>
      {socialData && socialData.users.length > 0 && (
        <SocialBox
          socialData={socialData}
          repostedThisLabel={repostedThisLabel}
          andLabel={andLabel}
          othersLabel={othersLabel}
        />
      )}
      <Box pad={{ horizontal: 'medium' }}>
        <EntryBox
          entryData={entryData}
          locale={locale}
          onClickAvatar={onClickAvatar}
          onClickReplies={onClickReplies}
          toggleBookmark={toggleBookmark}
          reportEntry={reportEntry}
          repostLabel={repostLabel}
          repostWithCommentLabel={repostWithCommentLabel}
          copyLinkLabel={copyLinkLabel}
          reportLabel={reportLabel}
          shareOnLabel={shareOnLabel}
        />
      </Box>
    </MainAreaCardBox>
  );
};

EntryCard.defaultProps = {
  repostLabel: 'Repost',
  repostWithCommentLabel: 'Repost With Comment',
  copyLinkLabel: 'Copy Link',
  reportLabel: 'Report',
  shareOnLabel: 'Share On',
};

export { EntryCard };
