import React, { ReactNode } from 'react';
import Card from '../Card';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';
import { tw } from '@twind/core';

export type InfoCardProps = {
  titleLabel: ReactNode;
  titleVariant?: TextProps['variant'];
  bodyVariant?: TextProps['variant'];
  bodyLabel?: ReactNode;
  assetName?: string;
};

const InfoCard: React.FC<InfoCardProps> = ({
  titleLabel,
  titleVariant = 'h6',
  bodyVariant = 'footnotes2',
  bodyLabel,
  assetName,
}) => {
  return (
    <Stack
      direction="column"
      align="center"
      justify="center"
      spacing="gap-y-3"
      customStyle="sm:gap-y-4"
    >
      {assetName ? (
        <img
          className={tw('object-contain h-56')}
          aria-label={assetName}
          src={`/images/${assetName}.webp`}
          alt={assetName}
        />
      ) : (
        <Card
          radius={20}
          background={{ light: 'grey8', dark: 'grey5' }}
          customStyle="h-32 w-32 sm:h-52 sm:w-52"
        ></Card>
      )}
      <Stack direction="column" align="center" justify="center" spacing="gap-y-2">
        <Text variant={titleVariant}>{titleLabel}</Text>
        {bodyLabel && (
          <Text
            variant={bodyVariant}
            color={{ light: 'grey5', dark: 'grey6' }}
            weight="normal"
            align="center"
          >
            {bodyLabel}
          </Text>
        )}
      </Stack>
    </Stack>
  );
};

export default InfoCard;
