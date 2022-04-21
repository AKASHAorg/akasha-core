import React from 'react';
import { Box, Text } from 'grommet';
import { StyledBox, StyledImage, StyledSubtitle, StyledText } from './styled';
import { BasicCardBox } from '../EntryCard/basic-card-box';

export interface StartProps {
  title?: string;
  subtitle?: string;
  heading: string;
  description: string;
  image?: string;
  icon?: JSX.Element;
  loggedIn?: boolean;
  noBorder?: boolean;
  noBorderRadius?: boolean;
}

export const StartCard = ({
  title,
  subtitle,
  heading,
  description,
  image,
  icon,
  loggedIn,
  noBorder,
  noBorderRadius,
}: StartProps) => {
  return (
    <BasicCardBox noBorder={noBorder} noBorderRadius={noBorderRadius} pad="medium">
      <Box align="start" fill="horizontal">
        {!!title && (
          <Text size="xlarge" weight="bold">
            {title}
          </Text>
        )}
        {!!subtitle && <StyledSubtitle size="medium">{subtitle}</StyledSubtitle>}
      </Box>
      <StyledBox fill="horizontal" pad={{ horizontal: 'medium' }} loggedIn={loggedIn}>
        {!!image && <StyledImage src={image} />}
        {!!icon && icon}
        <Text size="large" weight={600} margin={{ top: 'small' }} textAlign="center">
          {heading}
        </Text>
        <StyledText size="large" textAlign="center">
          {description}
        </StyledText>
      </StyledBox>
    </BasicCardBox>
  );
};
