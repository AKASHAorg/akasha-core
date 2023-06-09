import { Box } from 'grommet';
import * as React from 'react';
import ProfileAvatarButton from '../ProfileAvatarButton';
import { IEntryData } from '@akashaorg/typings/ui';
import ReadOnlyEditor from '../ReadOnlyEditor';

export interface IEmbedEntryBox {
  embedEntryData: IEntryData;
}

const EmbedBox: React.FC<IEmbedEntryBox> = props => (
  <Box
    pad="medium"
    gap="medium"
    round="xsmall"
    background="embedBackground"
    border={{
      color: 'border',
      size: 'xsmall',
      style: 'solid',
      side: 'all',
    }}
    data-testid="embed-box"
  >
    <ProfileAvatarButton
      label={props.embedEntryData.author?.name}
      info={props.embedEntryData.author?.name}
      avatarImage={props.embedEntryData.author?.avatar}
      profileId={props.embedEntryData.author?.did.id}
    />

    <Box>
      <ReadOnlyEditor content={props.embedEntryData.slateContent} />
    </Box>
  </Box>
);

export default EmbedBox;
