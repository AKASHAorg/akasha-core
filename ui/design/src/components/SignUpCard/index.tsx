import * as React from 'react';
import styled from 'styled-components';
import { Box, Text } from 'grommet';
import { isMobile, isMobileOnly } from 'react-device-detect';

import Icon from '../Icon';
import StepIndicator, { IStepIndicatorProps } from '../StepIndicator';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';

export interface ISignUpCardProps extends IStepIndicatorProps {
  className?: string;
  titleLabel: string;
  children: React.ReactNode;
  handleIconClick: () => void;
}

const BoldText = styled(Text)`
  font-weight: 600;
  @media screen and (max-width: ${props => props.theme.breakpoints.small.value}px) {
    font-size: 0.938rem;
  }
`;

const SignUpCard: React.FC<ISignUpCardProps> = props => {
  const { className, titleLabel, stepLabels, activeIndex, children, handleIconClick } = props;
  return (
    <MainAreaCardBox
      style={{ height: isMobile ? '100%' : 'auto', overflowY: 'auto' }}
      className={className}
      // props to handle mobile styles
      noBorder={isMobileOnly}
      noBorderRadius={isMobileOnly}
      elevation={isMobileOnly ? 'none' : 'shadow'}
    >
      <Box
        direction="column"
        pad={isMobileOnly ? 'medium' : 'xlarge'}
        height={{ min: 'fit-content' }}
      >
        <Box direction="row">
          {/* back icon */}
          {/* <Icon
            type="arrowLeft"
            size="sm"
            accentColor={true}
            clickable={true}
            onClick={handleIconClick}
            style={{ position: 'absolute' }} // allows proper centering of title box
          /> */}
          {/* title Box */}
          <Box direction="row" margin={{ vertical: '0', horizontal: 'auto' }}>
            <BoldText size="xlarge">{titleLabel}</BoldText>
            <BoldText size="xlarge" margin={{ horizontal: 'xsmall' }}>
              •
            </BoldText>
            <BoldText size="xlarge">{stepLabels[activeIndex]}</BoldText>
          </Box>
          {/* close icon */}
          <Icon
            type="close"
            size="sm"
            accentColor={true}
            clickable={true}
            onClick={handleIconClick}
            style={{ position: 'absolute' }} // allows proper centering of title box
          />
        </Box>
        <Box
          direction="row"
          justify="center"
          margin={{ bottom: 'xlarge' }}
          border={{ side: 'bottom', color: 'border', size: 'xsmall' }}
        >
          <StepIndicator stepLabels={stepLabels} activeIndex={activeIndex} margin="large" />
        </Box>
        <Box>{children}</Box>
      </Box>
    </MainAreaCardBox>
  );
};

export default SignUpCard;
