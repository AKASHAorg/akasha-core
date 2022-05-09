import React from 'react';
import { Box, Text } from 'grommet';
import { StyledBox, StyledImage, StyledSubtitle, StyledText } from './styled';
import { BasicCardBox } from '../EntryCard/basic-card-box';
import Button from '../Button';

export interface StartProps {
  title?: string;
  subtitle?: string;
  heading: string;
  description: string;
  secondaryDescription?: string;
  image?: string;
  icon?: JSX.Element;
  showMainArea?: boolean;
  hideMainAreaOnMobile?: boolean;
  showSecondaryArea?: boolean;
  noBorder?: boolean;
  noBorderRadius?: boolean;
  onClickCTA?: () => void;
  CTALabel?: string;
}

export const StartCard = ({
  title,
  subtitle,
  heading,
  description,
  secondaryDescription,
  image,
  icon,
  showMainArea = true,
  hideMainAreaOnMobile = true,
  showSecondaryArea,
  noBorder,
  noBorderRadius,
  onClickCTA,
  CTALabel,
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
      {showMainArea && (
        <StyledBox
          fill="horizontal"
          pad={{ horizontal: 'medium' }}
          hideOnMobile={hideMainAreaOnMobile}
        >
          {!!image && <StyledImage src={image} />}
          {!!icon && icon}
          <Text size="large" weight={600} margin={{ top: 'small' }} textAlign="center">
            {heading}
          </Text>
          <StyledText size="large" textAlign="center">
            {description}
          </StyledText>
          {onClickCTA && (
            <Box pad="medium" align="center" justify="center">
              <Button primary={true} label={CTALabel} onClick={onClickCTA} />
            </Box>
          )}
        </StyledBox>
      )}
      {showSecondaryArea && (
        <Box pad={{ vertical: 'medium' }}>
          <Text>{secondaryDescription}</Text>
        </Box>
      )}
    </BasicCardBox>
  );
};
