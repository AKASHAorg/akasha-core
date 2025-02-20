import React from 'react';

import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

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
      <Stack direction="column" align="center" justify="center" customStyle="mb-32">
        {image ? (
          <Image src={image} customStyle="w-[11.25rem] h-[11.25rem] m-auto my-4" />
        ) : (
          <Card className="bg-grey8 dark:bg-grey5 w-[11.25rem] h-[11.25rem] m-auto my-4 rounded-xl" />
        )}
        <Stack customStyle="w-[70%] m-auto gap-4">
          {titleLabel && (
            <Text variant="h6" align="center">
              {titleLabel}
            </Text>
          )}

          {subtitleLabel && (
            <Text variant="subtitle2" align="center">
              {subtitleLabel}
            </Text>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};
export default BasicInfoCard;
