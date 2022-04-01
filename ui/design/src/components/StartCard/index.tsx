import React from 'react';
import { Box, Text } from 'grommet';
import { StyledBox, StyledImage, StyledSubtitle, StyledText, WrapperBox } from './styled';

export interface StartProps {
  title: string;
  subtitle?: string;
  heading: string;
  description: string;
  image: string;
  loggedIn?: boolean;
}

export const StartCard = ({
  title,
  subtitle,
  heading,
  description,
  image,
  loggedIn,
}: StartProps) => {
  return (
    <WrapperBox align="center" loggedIn={loggedIn}>
      <Box align="start" fill="horizontal">
        <Text size="xlarge" weight="bold">
          {title}
        </Text>
        <StyledSubtitle size="medium">{subtitle}</StyledSubtitle>
      </Box>
      <StyledBox fill="horizontal" pad={{ horizontal: 'medium' }} loggedIn={loggedIn}>
        <StyledImage src={image} />
        <Text size="large" weight={600} margin={{ top: 'small' }} textAlign="center">
          {heading}
        </Text>
        <StyledText size="large" textAlign="center">
          {description}
        </StyledText>
      </StyledBox>
    </WrapperBox>
  );
};
