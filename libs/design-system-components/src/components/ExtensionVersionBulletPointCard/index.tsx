import * as React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';

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
        <Text variant="h6">{featureTitle}</Text>
        <ul className="ml-5 list-disc dark:text-white text-black">
          {itemList.map((item, idx) => (
            <Stack key={idx} direction="column" spacing={1}>
              <li>
                <Text variant="body2">{item}</Text>
              </li>
            </Stack>
          ))}
        </ul>
      </Stack>
      <Divider />
    </Stack>
  );
};

export default ExtensionVersionBulletPointCard;
