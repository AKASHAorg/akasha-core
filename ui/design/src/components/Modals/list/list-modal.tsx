import { Box, Text } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { formatDate, ILocale } from '../../../utils/time';
import ProfileAvatarButton from '../../ProfileAvatarButton';
import { IconType } from '../../Icon';
import { TextIcon } from '../../TextIcon/index';
import { StyledLayer } from '../common/styled-modal';

export interface IlistModal {
  className?: string;
  list: IListElem[];
  label: string;
  secondaryLabel: string;
  closeModal: () => void;
  // @Todo: fix this :D
  onClickAvatar: React.EventHandler<any>;
  locale: ILocale;
  iconType: IconType;
}

interface IListElem {
  name?: string;
  time: string;
  ethAddress: string;
  avatar?: string;
}

const StyledLayerElemDiv = styled.div`
  border-radius: ${props => props.theme.shapes.borderRadius};
  padding: ${props => `${props.theme.shapes.baseSpacing * 3}px`};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: ${props => `${props.theme.shapes.baseSpacing * 3}px`};
`;

const ListModal: React.FC<IlistModal> = props => {
  const {
    closeModal,
    label,
    list,
    className,
    secondaryLabel,
    onClickAvatar,
    locale,
    iconType,
  } = props;
  const handleClickAvatar = (ethAddress: string) => () => {
    onClickAvatar(ethAddress);
  };
  return (
    <StyledLayer onEsc={closeModal} onClickOutside={closeModal} modal={true} className={className}>
      <Box pad="none" width="36em" height="24em">
        <Box pad="medium" justify="between" direction="row" align="center">
          <TextIcon iconType={iconType} label={label} margin={{ right: '2.5em' }} />
          <Text size="large" color="secondaryText">
            {secondaryLabel}
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
                ethAddress={elem.ethAddress}
              />
            </StyledLayerElemDiv>
          ))}
        </Box>
      </Box>
    </StyledLayer>
  );
};

export default ListModal;
