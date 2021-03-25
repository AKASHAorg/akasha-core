import React from 'react';
import { isMobileOnly } from 'react-device-detect';
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
  hasMobileDesign?: boolean;
  onIconClick?: () => void;
  buttonsWrapperWidth?: string;
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
    hasMobileDesign,
    onIconClick,
    onTabClick,
    wrapperMarginBottom = '1rem',
    buttonsWrapperWidth,
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
      {!(isMobileOnly && hasMobileDesign) && (
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
            <Box
              direction="row"
              width={
                isMobileOnly && buttonsWrapperWidth
                  ? buttonsWrapperWidth
                  : length > 3
                  ? '50%'
                  : length > 2
                  ? '33%'
                  : '30%'
              }
            >
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
      )}
      {isMobileOnly && hasMobileDesign && (
        <Box direction="row">
          {buttonLabels.map((el, idx) => (
            <Box
              key={idx}
              basis="full"
              pad={{ vertical: '0.5rem', horizontal: '0.6rem' }}
              border={{
                ...(buttonValues[buttonLabels.indexOf(el)] === activeButton
                  ? {
                      color: 'accent',
                      side: 'bottom',
                    }
                  : {
                      color: 'border',
                      side: 'bottom',
                    }),
              }}
              onClick={handleTabClick(el)}
            >
              <Text color="secondaryText" textAlign="center">
                {el}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SwitchCard;
