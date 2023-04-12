import React, { ReactNode } from 'react';
import Card from '../Card';
import Stack from '../Stack';
import Text from '../Text';

export type InfoCardProps = {
  titleLabel: ReactNode;
  subTitleLabel?: ReactNode;
};

const InfoCard: React.FC<InfoCardProps> = ({ titleLabel, subTitleLabel }) => {
  return (
    <Stack
      direction="column"
      align="center"
      justify="center"
      spacing="gap-y-3"
      customStyle="sm:gap-y-4"
    >
      <Card
        radius={20}
        background={{ light: 'grey8', dark: 'grey5' }}
        customStyle="h-32 w-32 sm:h-52 sm:w-52"
      ></Card>
      <Stack direction="column" align="center" justify="center">
        <Text variant="h6">{titleLabel}</Text>
        {subTitleLabel && (
          <Text
            variant="footnotes2"
            color={{ light: 'grey5', dark: 'grey6' }}
            weight="normal"
            align="center"
          >
            {subTitleLabel}
          </Text>
        )}
      </Stack>
    </Stack>
  );
};

export default InfoCard;
