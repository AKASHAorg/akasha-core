import * as React from 'react';
import { MainAreaCardBox } from '../common/basic-card-box';
import { IEntryBoxProps, EntryBox } from './entry-box';
import { Box } from 'grommet';

export interface IFullEntryCardProps extends IEntryBoxProps {
  // external css
  className?: string;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
}

const FullEntryCard: React.FC<IFullEntryCardProps> = props => {
  const {
    entryData,
    locale,
    onClickAvatar,
    onClickReplies,
    toggleBookmark,
    reportEntry,
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
      {entryData.replies?.map((reply, index) => (
        <Box
          key={index}
          margin={{ horizontal: 'medium' }}
          border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'top' }}
        >
          <EntryBox
            entryData={reply}
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
      ))}
    </MainAreaCardBox>
  );
};

FullEntryCard.defaultProps = {
  repostLabel: 'Repost',
  repostWithCommentLabel: 'Repost With Comment',
  copyLinkLabel: 'Copy Link',
  reportLabel: 'Report',
  shareOnLabel: 'Share On',
};

export { FullEntryCard };
