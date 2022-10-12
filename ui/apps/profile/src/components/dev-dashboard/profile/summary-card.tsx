import React from 'react';
import DS from '@akashaorg/design-system';
import HeroImageCard, { IHeroImageCard } from './hero-image-card';

const { Box, Button, HorizontalDivider, Text, Icon } = DS;

export interface ISummaryCardProps extends IHeroImageCard {
  paragraph1TitleLabel: string;
  paragraph1Content?: string | Uint8Array;
  paragraph2TitleLabel: string;
  paragraph2Content?: string;
  doneButtonLabel: string;
  onButtonClick?: () => void;
}

const SummaryCard: React.FC<ISummaryCardProps> = props => {
  const {
    paragraph1TitleLabel,
    paragraph1Content,
    paragraph2TitleLabel,
    paragraph2Content,
    doneButtonLabel,
    onButtonClick,
  } = props;

  const handleCopy = (value: string) => () => {
    navigator.clipboard.writeText(value);
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <Box gap="large">
      <HeroImageCard {...props} />

      <Box round="xsmall" pad="xsmall" gap="small" border={{ color: 'border' }}>
        <Box direction="row" gap="xsmall">
          <Text size="large" weight="bold">
            {paragraph1TitleLabel}
          </Text>
          <Icon
            type="copy"
            color="secondaryText"
            style={{ cursor: 'pointer' }}
            onClick={handleCopy(paragraph1Content as string)}
          />
        </Box>
        {paragraph1Content && (
          <Text size="large" wordBreak="break-word">
            {paragraph1Content}
          </Text>
        )}

        <HorizontalDivider />

        <Box direction="row" gap="xsmall">
          <Text size="large" weight="bold">
            {paragraph2TitleLabel}
          </Text>
          <Icon
            type="copy"
            color="secondaryText"
            style={{ cursor: 'pointer' }}
            onClick={handleCopy(paragraph2Content as string)}
          />
        </Box>
        {paragraph2Content && (
          <Text size="large" wordBreak="break-word">
            {paragraph2Content}
          </Text>
        )}
      </Box>

      <Box direction="row" justify="end">
        <Button primary={true} label={doneButtonLabel} onClick={handleButtonClick} />
      </Box>
    </Box>
  );
};

export default SummaryCard;
