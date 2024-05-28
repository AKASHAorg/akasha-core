import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
    <Stack direction="column" spacing="gap-y-4">
      <Stack direction="column" spacing="gap-y-2">
        <Text variant="h6">{featureTitle}</Text>
        <ul className="ml-5 list-disc dark:text-white text-black">
          {itemList.map((item, idx) => (
            <Stack key={idx} direction="column" spacing="gap-y-1">
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
