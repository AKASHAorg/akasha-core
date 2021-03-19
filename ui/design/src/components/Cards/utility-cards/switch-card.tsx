import React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';

import { Button } from '../../Buttons';
import { Icon } from '../../Icon';

import { MainAreaCardBox } from '../common/basic-card-box';

export interface ISwitchCard {
  count: number;
  hasIcon?: boolean;
  countLabel: string;
  activeButton: string;
  buttonLabels: string[];
  buttonValues: string[];
  onIconClick?: () => void;
  wrapperMarginBottom?: string;
  onTabClick: (value: string) => void;
}

export interface IStyledButtonProps {
  readonly first?: boolean;
  readonly last?: boolean;
  readonly removeBorder?: boolean;
}

const SwitchCardButton = styled(Button)`
  width: 100%;
  height: auto;
  padding: 0.5rem 0.6rem;
  border-width: 0.1rem;
`;

const StyledButton = styled(SwitchCardButton)<IStyledButtonProps>`
  border-left-width: ${props => props.removeBorder && '0'};
  border-radius: ${props =>
    props.first ? '0.25rem 0rem 0rem 0.25rem' : props.last ? '0rem 0.25rem 0.25rem 0rem' : '0'};
`;

const SwitchCard: React.FC<ISwitchCard> = props => {
  const {
    count,
    activeButton,
    hasIcon = false,
    countLabel,
    buttonLabels,
    buttonValues,
    onIconClick,
    onTabClick,
    wrapperMarginBottom = '1rem',
  } = props;

  const length = buttonLabels.length;

  const handleIconClick = () => {
    if (onIconClick) {
      onIconClick();
    }
  };

  const handleTabClick = (value: string) => () => {
    onTabClick(value);
  };

  return (
    <Box width="100%" margin={{ bottom: wrapperMarginBottom }}>
      <MainAreaCardBox>
        <Box direction="row" pad="1rem" justify="between" align="center">
          <Box direction="row">
            {hasIcon && (
              <Box margin={{ right: '1.25rem' }}>
                <Icon
                  size="sm"
                  type="arrowLeft"
                  color="secondaryText"
                  primaryColor={true}
                  clickable={true}
                  onClick={handleIconClick}
                />
              </Box>
            )}
            <Text size="large">{`${count} ${countLabel}`}</Text>
          </Box>
          <Box direction="row" width={length > 3 ? '50%' : length > 2 ? '33%' : '25%'}>
            {buttonLabels.map((el, idx) => (
              <StyledButton
                key={idx}
                label={el}
                size="large"
                first={idx === 0}
                removeBorder={idx > 0}
                primary={buttonValues[buttonLabels.indexOf(el)] === activeButton}
                last={idx === length - 1}
                onClick={handleTabClick(el)}
              />
            ))}
          </Box>
        </Box>
      </MainAreaCardBox>
    </Box>
  );
};

export default SwitchCard;
