import * as React from 'react';
import { Box, BoxExtendedProps, Text } from 'grommet';
import { MarginType } from 'grommet/utils';
import styled from 'styled-components';

import { BasicCardBox } from '../EntryCard/basic-card-box';
import Icon from '../Icon';

export interface IWeb3ConnectCardProps {
  boxMargin?: MarginType;
  titleLabel: string;
  subtitleLabel?: string;
  leftIconType: string;
  iconBackground?: string;
  handleClick: () => void;
}

const StyledIconBox: React.FC<BoxExtendedProps> = styled(Box)`
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    margin-right: 0.5rem;
  }
`;

const Web3ConnectCard: React.FC<IWeb3ConnectCardProps> = props => {
  const { boxMargin, titleLabel, subtitleLabel, leftIconType, iconBackground, handleClick } = props;

  return (
    <BasicCardBox pad="medium" callToAction={true} onClick={handleClick} margin={boxMargin}>
      <Box direction="row" justify="start" align="center">
        {leftIconType && (
          <StyledIconBox
            pad="0.25rem"
            background={iconBackground}
            margin={{ right: 'xsmall' }}
            style={{ borderRadius: '10%' }}
          >
            <Icon type={leftIconType} size="xl" plain={true} />
          </StyledIconBox>
        )}
        <Box direction="column" justify="between" align="start">
          <Text weight={600} size="1rem">
            {titleLabel}
          </Text>
          {subtitleLabel && (
            <Text margin={{ top: 'xsmall' }} color="secondaryText">
              {subtitleLabel}
            </Text>
          )}
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default Web3ConnectCard;
