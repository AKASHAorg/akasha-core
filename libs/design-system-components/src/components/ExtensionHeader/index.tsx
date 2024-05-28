import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ExtensionHeaderProps = {
  pageTitle?: string;
  appName: string;
  packageName?: string;
  appType?: string;
  nsfw?: boolean;
  description?: string;
};

const ExtensionHeader: React.FC<ExtensionHeaderProps> = ({
  pageTitle,
  appName,
  packageName,
  appType,
  nsfw,
  description,
}) => {
  return (
    <Stack spacing="gap-y-4">
      {pageTitle && <Text variant="h5">{pageTitle}</Text>}
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
      {!!description && (
        <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey7' }}>
          {description}
        </Text>
      )}
    </Stack>
  );
};

export default ExtensionHeader;
