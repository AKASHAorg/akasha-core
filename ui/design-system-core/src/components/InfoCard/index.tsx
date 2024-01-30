import React, { ReactNode } from 'react';
import Card from '../Card';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';
import { tw } from '@twind/core';

export type InfoCardProps = {
  assetName?: string;
  assetExtension?: string;
  publicImgPath?: string;
  titleLabel: ReactNode;
  bodyLabel?: ReactNode;
  titleVariant?: TextProps['variant'];
  bodyVariant?: TextProps['variant'];
  customWidthStyle?: string;
};

const InfoCard: React.FC<InfoCardProps> = ({
  titleLabel,
  titleVariant = 'h6',
  bodyVariant = 'footnotes2',
  bodyLabel,
  assetName,
  assetExtension = 'webp',
  publicImgPath = '/images',
  customWidthStyle,
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
          className={tw('object-contain h-[11.25rem]')}
          aria-label={assetName}
          src={`${publicImgPath}/${assetName}.${assetExtension}`}
          alt={assetName}
        />
      ) : (
        <Card
          elevation="none"
          radius={20}
          background={{ light: 'grey8', dark: 'grey5' }}
          customStyle="h-32 w-32 sm:h-52 sm:w-52"
        ></Card>
      )}
      <Stack
        direction="column"
        align="center"
        justify="center"
        spacing="gap-y-2"
        customStyle={customWidthStyle}
      >
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
