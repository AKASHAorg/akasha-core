import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ExtensionHeaderProps = {
  appName: string;
  packageName?: string;
  appType?: string;
  nsfw?: boolean;
};

const ExtensionHeader: React.FC<ExtensionHeaderProps> = ({
  appName,
  packageName,
  appType,
  nsfw,
}) => {
  return (
    <Stack direction="row" align="center" spacing="gap-x-2">
      <Card
        elevation="none"
        radius={10}
        background={{
          light: 'grey8',
          dark: 'grey5',
        }}
        customStyle="w-[4.375rem] h-[4.375rem]"
      />
      <Stack direction="column" spacing="gap-y-1">
        <Text variant="body1" weight="semibold">
          {appName}
        </Text>
        <Text
          variant="footnotes2"
          weight="normal"
          color={{ light: 'grey4', dark: 'grey7' }}
          truncate={true}
        >
          {packageName}
        </Text>
      </Stack>
    </Stack>
  );
};

export default ExtensionHeader;
