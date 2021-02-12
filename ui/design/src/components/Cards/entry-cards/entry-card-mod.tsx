import * as React from 'react';
import { MainAreaCardBox } from '../common/basic-card-box';
import { IEntryBoxModProps, EntryBoxMod } from './entry-box-mod';
import { Box } from 'grommet';

export interface IEntryCardProps extends IEntryBoxModProps {
  // labels
  repostedThisLabel?: string;
  andLabel?: string;
  othersLabel?: string;
  // external css
  className?: string;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
}

const EntryCardMod: React.FC<IEntryCardProps> = props => {
  const {
    entryData,

    repliesLabel,
    repostsLabel,
    locale,
    style,
    className,
    rootNodeRef,
    onClickAvatar,
    onContentClick,
  } = props;

  return (
    <MainAreaCardBox className={className} style={style} rootNodeRef={rootNodeRef}>
      <Box pad={{ horizontal: 'medium' }}>
        <EntryBoxMod
          entryData={entryData}
          repostsLabel={repostsLabel}
          repliesLabel={repliesLabel}
          locale={locale}
          onClickAvatar={onClickAvatar}
          onContentClick={onContentClick}
        />
      </Box>
    </MainAreaCardBox>
  );
};

EntryCardMod.defaultProps = {
  repostsLabel: 'Reposts',
};

export { EntryCardMod };
