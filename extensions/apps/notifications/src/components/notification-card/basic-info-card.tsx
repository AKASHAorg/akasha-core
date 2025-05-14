import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Image } from '@akashaorg/ui/lib/akasha-components/image';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type BasicInfoCardProps = {
  titleLabel: string;
  subtitleLabel?: string;
  image?: string;
  customStyle?: string;
};
const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  titleLabel,
  subtitleLabel,
  image,
  customStyle = '',
}) => {
  return (
    <Card className={`p-2 border-none ${customStyle}`}>
      <Stack direction="column" alignItems="center" justifyContent="center" className="mb-32">
        {image ? (
          <Image src={image} className="w-[11.25rem] h-[11.25rem] m-auto my-4" />
        ) : (
          <Card className="bg-grey8 dark:bg-grey5 w-[11.25rem] h-[11.25rem] m-auto my-4 rounded-xl" />
        )}
        <Stack className="w-[70%] m-auto gap-4">
          {titleLabel && (
            <Typography variant="h6" className="text-center">
              {titleLabel}
            </Typography>
          )}

          {subtitleLabel && (
            <Typography variant="sm" className="font-light text-center">
              {subtitleLabel}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};
export default BasicInfoCard;
