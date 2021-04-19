import React from 'react';
import { isMobileOnly } from 'react-device-detect';
import { Box, Text } from 'grommet';
import styled from 'styled-components';

import Button from '../../Button';
import { Icon } from '../../Icon';

import { BasicCardBox } from '../common/basic-card-box';

export interface ISwitchCard {
  count?: number;
  loggedEthAddress: string | null;
  hasIcon?: boolean;
  countLabel?: string;
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

const StickyBox = styled(Box)<{ userSignedIn: boolean }>`
  position: sticky;
  top: ${props => (props.userSignedIn ? '3rem' : '6rem')};
  background-color: ${props => props.theme.colors.background};
  z-index: 999;
`;

const SwitchCard: React.FC<ISwitchCard> = props => {
  const {
    count,
    loggedEthAddress,
    activeButton,
    hasIcon = false,
    countLabel,
    buttonLabels,
    buttonValues,
    hasMobileDesign,
    onIconClick,
    onTabClick,
    buttonsWrapperWidth,
  } = props;

  const length = buttonLabels.length;

  const handleTabClick = (value: string) => () => {
    onTabClick(value);
  };

  return (
    <>
      {!(isMobileOnly && hasMobileDesign) && (
        <BasicCardBox margin={{ bottom: 'medium' }}>
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
                    onClick={onIconClick}
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
        </BasicCardBox>
      )}
      {isMobileOnly && hasMobileDesign && (
        <StickyBox userSignedIn={!!loggedEthAddress} direction="row" margin={{ bottom: 'medium' }}>
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
        </StickyBox>
      )}
    </>
  );
};

export default SwitchCard;
