import { Box } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { formatDate } from '../../utils/time';
import { ProfileAvatarButton } from '../Buttons/index';
import { IEntryData } from '../Cards/entry-cards/old-entry-cards/entry-box';

const StyledBox = styled(Box)`
  background-color: #fbfcfd;
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
      label={props.embedEntryData.name}
      info={formatDate(props.embedEntryData.time)}
      avatarImage={props.embedEntryData.avatar}
      ethAddress={props.embedEntryData.ethAddress}
    />

    <div>{props.embedEntryData.content}</div>
  </StyledBox>
);

export default EmbedBox;
