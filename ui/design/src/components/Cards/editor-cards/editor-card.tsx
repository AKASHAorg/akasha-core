import { Box, Text } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { Avatar } from '../../Avatar/index';
import { Icon } from '../../Icon/index';
import { EditorModal } from '../../Modals/index';
import { MainAreaCardBox } from '../common/basic-card-box';

export interface IEditorCard {
  className?: string;
  avatar?: string;
  ethAddress: string;
  publishLabel: string;
  placeholderLabel: string;
  onPublish: any;
}

const StyledDiv = styled.div`
  padding-right: ${props => `${props.theme.shapes.baseSpacing}px`};
  color: ${props => props.theme.colors.accent};
  opacity: 0.4;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

const EditorCard: React.FC<IEditorCard> = props => {
  const { className, avatar, ethAddress, publishLabel, placeholderLabel, onPublish } = props;

  const [modalOpen, setModalOpen] = React.useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <MainAreaCardBox className={className}>
      {modalOpen && (
        <EditorModal
          closeModal={closeModal}
          avatar={avatar}
          ethAddress={ethAddress}
          onPublish={onPublish}
          publishLabel={publishLabel}
          placeholderLabel={placeholderLabel}
        />
      )}
      <Box direction="row" pad="medium" gap="medium" align="center" onClick={openModal}>
        <Avatar src={avatar} ethAddress={ethAddress} />
        <Text color="secondaryText" size="large">
          {placeholderLabel}
        </Text>
      </Box>
      <Box
        direction="row"
        justify="between"
        fill="horizontal"
        pad={{ horizontal: 'medium', vertical: 'xsmall' }}
      >
        <Box direction="row" gap="xsmall" align="center">
          <Icon type="addAppDark" clickable={true} />
          <Icon type="quote" clickable={true} />
          <Icon type="image" clickable={true} />
          <Icon type="emoji" clickable={true} />
        </Box>
        <StyledDiv>
          <Text size="large">{publishLabel}</Text>
        </StyledDiv>
      </Box>
    </MainAreaCardBox>
  );
};

export default EditorCard;
