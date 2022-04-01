import React from 'react';
import { Box, Text } from 'grommet';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import Icon from '../Icon';

export interface InfoProps {
  icon: string;
  title: string;
  explanation?: string;
  suggestion: string;
  noBorder?: boolean;
  noPadding?: boolean;
}

export const StyledBox = styled(Box)<{ noBorder?: boolean; noPadding?: boolean }>`
  background-color: ${props => props.theme.colors.cardBackground};
  border: ${props => !props.noBorder && `1px solid ${props.theme.colors.border}`};
  padding: ${props => !props.noPadding && '1.5rem 7rem'};
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    padding: 2rem 2.5rem;
  }
`;

const InfoCard = ({ icon, title, explanation, suggestion, noBorder, noPadding }: InfoProps) => {
  return (
    <StyledBox align="center" round="xsmall" noBorder={noBorder} noPadding={noPadding}>
      <Icon
        type={icon}
        size={isMobile ? 'xl' : 'xxl'}
        strokeWidth={isMobile ? 0.5 : 0.6}
        accentColor
      />
      <Text size="large" weight={600} textAlign="center" margin={{ top: 'large' }}>
        {title}
      </Text>
      {explanation && (
        <Text size="large" weight={600} textAlign="center" margin={{ top: 'medium' }}>
          {explanation}
        </Text>
      )}
      <Text size="large" textAlign="center" margin={{ vertical: 'large' }}>
        {suggestion}
      </Text>
    </StyledBox>
  );
};

export default InfoCard;
