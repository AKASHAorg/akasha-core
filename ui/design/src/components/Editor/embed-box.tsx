import { Box } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import ProfileAvatarButton from '../ProfileAvatarButton';
import { IEntryData } from '../Cards/entry-cards/entry-box';
import { ReadOnlyEditor } from './index';

const StyledBox = styled(Box)`
  background-color: ${props => props.theme.colors.ultraLightGrey};
`;

export interface IEmbedEntryBox {
  embedEntryData: IEntryData;
}

const EmbedBox: React.FC<IEmbedEntryBox> = props => (
  <StyledBox
    pad="medium"
    gap="medium"
    round="xsmall"
    border={{
      color: 'border',
      size: 'xsmall',
      style: 'solid',
      side: 'all',
    }}
  >
    <ProfileAvatarButton
      label={props.embedEntryData.author?.name}
      info={props.embedEntryData.author?.userName && `@${props.embedEntryData.author?.userName}`}
      avatarImage={props.embedEntryData.author?.avatar}
      ethAddress={props.embedEntryData.author?.ethAddress}
    />

    <Box>
      <ReadOnlyEditor content={props.embedEntryData.content} />
    </Box>
  </StyledBox>
);

export { EmbedBox };
