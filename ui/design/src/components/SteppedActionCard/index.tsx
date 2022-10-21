import * as React from 'react';
import styled from 'styled-components';
import { Box, Text } from 'grommet';
import { EdgeSizeType } from 'grommet/utils';
import { isMobile, isMobileOnly } from 'react-device-detect';

import Icon from '../Icon';
import StepIndicator, { IStepIndicatorProps } from '../StepIndicator';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';

export interface ISteppedActionCardProps extends IStepIndicatorProps {
  className?: string;
  titleLabel: string;
  extraStepLabel?: string;
  children: React.ReactNode;
  bottomMargin?: EdgeSizeType;
  handleIconClick: () => void;
}

const BoldText = styled(Text)`
  font-weight: 600;
  @media screen and (max-width: ${props => props.theme.breakpoints.small.value}px) {
    font-size: 0.938rem;
  }
`;

const SteppedActionCard: React.FC<ISteppedActionCardProps> = props => {
  const {
    className,
    titleLabel,
    extraStepLabel = '',
    stepLabels,
    activeIndex,
    verticalMargin,
    bottomMargin = 'xlarge',
    children,
    handleIconClick,
  } = props;
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
          {/* title Box */}
          <Box direction="row" margin={{ vertical: '0', horizontal: 'auto' }}>
            <BoldText size="xlarge">{titleLabel}</BoldText>
            <BoldText size="xlarge" margin={{ horizontal: 'xsmall' }}>
              •
            </BoldText>
            <BoldText size="xlarge">
              {activeIndex !== stepLabels.length ? stepLabels[activeIndex] : extraStepLabel}
            </BoldText>
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
          margin={{ bottom: bottomMargin }}
          border={{ side: 'bottom', color: 'border', size: 'xsmall' }}
        >
          <StepIndicator
            stepLabels={stepLabels}
            activeIndex={activeIndex}
            verticalMargin={verticalMargin}
          />
        </Box>
        <Box>{children}</Box>
      </Box>
    </MainAreaCardBox>
  );
};

export default SteppedActionCard;
