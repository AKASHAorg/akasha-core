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
}

export const StyledBox = styled(Box)`
  background-color: ${props => props.theme.colors.background};
  border: ${props => `1px solid ${props.theme.colors.lightBackground}`};
  padding: 1.5rem 7rem;
  box-shadow: 0 4px 16px rgba(83, 98, 124, 0.06);
  margin: 0.5rem;
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    padding: 2rem 2.5rem;
  }
`;

const InfoCard = ({ icon, title, explanation, suggestion }: InfoProps) => {
  return (
    <StyledBox align="center">
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
