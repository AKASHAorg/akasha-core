import React from 'react';
import { Anchor, Box, Text, Image } from 'grommet';

import { BasicCardBox } from '../EntryCard/basic-card-box';
import { useViewportSize } from '../Providers/viewport-dimension';

export interface IModerationValueCardProps {
  publicImgPath?: string;
  assetName: string;
  label: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  isMini?: boolean;
  onClick?: () => void;
}

const ModerationValueCard: React.FC<IModerationValueCardProps> = props => {
  const {
    publicImgPath = '/images',
    assetName,
    label,
    description,
    ctaLabel,
    ctaUrl,
    isMini = false,
    onClick,
  } = props;

  const { size } = useViewportSize();

  return (
    <BasicCardBox
      height="inherit"
      border={{ ...(isMini && { color: 'accent' }) }}
      // works only when onClick is specified
      hoverIndicator={{ ...(isMini && { background: 'hoverBackground' }) }}
      onClick={onClick}
    >
      <Box
        fill="vertical"
        align="center"
        justify="evenly"
        pad={isMini ? 'small' : 'medium'}
        gap={isMini ? 'xxsmall' : 'small'}
      >
        <Box width={isMini ? '4.25rem' : '17.5rem'} height={isMini ? '3.75rem' : '15.45rem'}>
          <Image fit="contain" src={`${publicImgPath}/${assetName}.webp`} />
        </Box>
        <Text
          size={size === 'small' ? 'medium' : isMini ? 'large' : 'xlarge'}
          textAlign="center"
          weight="bold"
          style={{ ...(isMini && { textTransform: 'uppercase' }) }}
        >
          {label}
        </Text>
        {!isMini && (
          <Box fill="horizontal">
            {description && <Text size="large">{description}</Text>}
            {ctaLabel && (
              <Anchor
                href={ctaUrl}
                size="large"
                weight="normal"
                target="_blank"
                color="accentText"
                margin={{ vertical: 'small' }}
                style={{ textDecoration: 'none', textAlign: 'end' }}
              >
                {ctaLabel}
              </Anchor>
            )}
          </Box>
        )}
      </Box>
    </BasicCardBox>
  );
};

export default ModerationValueCard;
