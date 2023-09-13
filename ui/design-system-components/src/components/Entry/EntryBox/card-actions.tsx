import * as React from 'react';
import { tw } from '@twind/core';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { SyntheticEvent } from 'react';
import { AkashaBeam } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import type { EntryBoxProps } from './index';

export type CardActionProps = {
  // data
  entryData: EntryBoxProps['entryData'];
  // anchor link
  repliesAnchorLink?: string;
  // handlers
  onRepost: () => void;
  handleRepliesClick: (ev: SyntheticEvent) => void;
  disableActions?: boolean;
  disableReposting?: boolean;
  hideRepost?: boolean;
  isModerated?: boolean;
  actionsRightExt?: React.ReactNode;
};

const CardActions: React.FC<CardActionProps> = props => {
  const {
    // data
    entryData,
    repliesAnchorLink,
    // handlers
    onRepost,
    handleRepliesClick,
    disableReposting,
    hideRepost,
    disableActions,
    isModerated,
    actionsRightExt,
  } = props;

  // const repostsBtnText = `${entryData.reposts || ''}`;
  // const repliesBtnText = `${entryData.replies || 0}`;

  if (isModerated) {
    return (
      <div
        className={tw(`flex flex-row items-center justify-end space-x-4 w-3/4 self-center py-4`)}
      >
        <button onClick={handleRepliesClick} className={tw(`flex flex-row items-center space-x-2`)}>
          <Icon type="ChatBubbleLeftRightIcon" accentColor={true} />
          {/*<Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>{repliesBtnText}</Text>*/}
        </button>
        <button
          onClick={onRepost}
          className={tw(`flex flex-row items-center space-x-2`)}
          disabled={disableReposting}
        >
          <Icon type="ArrowPathIcon" accentColor={true} />
          {/*<Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>{repostsBtnText}</Text>*/}
        </button>
      </div>
    );
  }

  return (
    <Stack direction="row" align="center" justify="end" spacing="gap-x-4" customStyle="p-4">
      <>{actionsRightExt}</>
      <Anchor
        href={`${repliesAnchorLink}/${entryData.id}`}
        customStyle="no-underline"
        onClick={e => {
          e.preventDefault();
          return false;
        }}
      >
        <button
          onClick={handleRepliesClick}
          className={tw(`flex flex-row items-center space-x-2`)}
          disabled={disableActions}
        >
          <Icon type="ChatBubbleLeftRightIcon" accentColor={true} />
          {/*<Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>{repliesBtnText}</Text>*/}
        </button>
      </Anchor>

      {!hideRepost && (
        <button
          onClick={onRepost}
          className={tw(`flex flex-row items-center space-x-2`)}
          disabled={disableReposting || disableActions}
        >
          <Icon type="ArrowPathIcon" accentColor={true} />
          {/*<Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>{repostsBtnText}</Text>*/}
        </button>
      )}
    </Stack>
  );
};

export default CardActions;
