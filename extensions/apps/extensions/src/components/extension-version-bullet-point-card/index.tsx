import * as React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Separator } from '@akashaorg/ui/lib/components/separator';
export type ExtensionVersionBulletPointCardProps = {
  featureTitle: string;
  itemList: string[];
};
const ExtensionVersionBulletPointCard: React.FC<ExtensionVersionBulletPointCardProps> = ({
  featureTitle,
  itemList,
}) => {
  return (
    <Stack direction="column" spacing={4}>
      <Stack direction="column" spacing={2}>
        <Typography variant="h6">{featureTitle}</Typography>
        <ul className="ml-5 list-disc dark:text-white text-black">
          {itemList.map((item, idx) => (
            <Stack key={idx} direction="column" spacing={1}>
              <li>
                <Typography variant="sm">{item}</Typography>
              </li>
            </Stack>
          ))}
        </ul>
      </Stack>
      <Separator />
    </Stack>
  );
};
export default ExtensionVersionBulletPointCard;
