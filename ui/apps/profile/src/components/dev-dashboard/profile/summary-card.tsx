import React from 'react';
import DS from '@akashaorg/design-system';

const { Box, Button, HorizontalDivider, Text, Icon, Image } = DS;

export interface ISummaryCardProps {
  assetName?: string;
  publicImgPath?: string;
  titleLabel: string;
  subtitleLabel: string;
  paragraph1TitleLabel: string;
  paragraph1Content?: string | Uint8Array;
  paragraph2TitleLabel: string;
  paragraph2Content?: string;
  doneButtonLabel: string;
  onButtonClick?: () => void;
}

const SummaryCard: React.FC<ISummaryCardProps> = props => {
  const {
    assetName = 'ok',
    publicImgPath = '/images',
    titleLabel,
    subtitleLabel,
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
      <Box gap="small">
        <Box height="13rem" width="16rem" margin={{ bottom: 'medium' }} alignSelf="center">
          <Image fit="contain" src={`${publicImgPath}/${assetName}.png`} />
        </Box>
        {titleLabel && (
          <Text size="large" weight="bold" textAlign="center">
            {titleLabel}
          </Text>
        )}
        <Text size="large" textAlign="center">
          {subtitleLabel}
        </Text>
      </Box>

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
