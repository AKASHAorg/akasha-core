import { Box, Layer, Text } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { formatDate, ILocale } from '../../utils/time';
import { ProfileAvatarButton } from '../IconButton/index';
import { TextIcon } from '../TextIcon/index';

interface IlistModal {
  className?: string;
  list: any[];
  label: string;
  secondaryLabel: string;
  closeModal: () => void;
  // @Todo: fix this :D
  onClickAvatar: any;
  locale: ILocale;
}

const StyledLayerElemDiv = styled.div`
  border-radius: ${props => props.theme.shapes.borderRadius}
  padding: ${props => `${props.theme.shapes.baseSpacing * 3}px`}
  border: 1px solid ${props => props.theme.colors.border}
  margin-bottom: ${props => `${props.theme.shapes.baseSpacing * 3}px`}
`;

const ListModal: React.FC<IlistModal> = props => {
  const { closeModal, label, list, className, secondaryLabel, onClickAvatar, locale } = props;
  const listNumberLabel = `${list.length} ${secondaryLabel}`;
  const handleClickAvatar = (ethAddress: string) => () => {
    onClickAvatar(ethAddress);
  };
  return (
    <Layer onEsc={closeModal} onClickOutside={closeModal} modal={true} className={className}>
      <Box pad="none" width="579px" height="386px">
        <Box pad="medium" justify="between" direction="row" align="center">
          <TextIcon iconType="quoteDark" label={label} margin={{ right: '40px' }} />
          <Text size="large" color="secondaryText">
            {listNumberLabel}
          </Text>
        </Box>
        <Box pad={{ horizontal: 'medium' }} overflow="scroll">
          {list.map((elem, index) => (
            <StyledLayerElemDiv key={index}>
              <ProfileAvatarButton
                info={formatDate(elem.time, locale)}
                label={elem.name}
                avatarImage={elem.avatar}
                onClick={handleClickAvatar(elem.ethAddress)}
                // @Todo: fix this :D
                seed={''}
              />
            </StyledLayerElemDiv>
          ))}
        </Box>
      </Box>
    </Layer>
  );
};

export default ListModal;
