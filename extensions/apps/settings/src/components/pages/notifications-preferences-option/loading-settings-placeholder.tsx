import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import React from 'react';

const LoadingSettingsPlaceholder: React.FC = () => (
  <>
    <Stack className="border-b border-border mb-4 pb-4">
      <Stack direction="row" justifyContent="between" alignItems="center" className="mt-4">
        <TextLine animated={true} width="w-1/4" height="h-[1.5rem]" round="rounded" />
        <TextLine animated={true} width="w-[1.5rem]" height="h-[1.5rem]" round="rounded" />
      </Stack>

      <Text variant="footnotes2" weight="normal" customStyle="dark:text-grey6 text-grey4 mt-2">
        <TextLine animated={true} width="w-2/3" height="h-[1rem]" round="rounded" />
      </Text>
    </Stack>

    <Stack>
      <Stack direction="row" justifyContent="between" alignItems="center" className="mt-4">
        <TextLine animated={true} width="w-1/4" height="h-[1.5rem]" round="rounded" />
        <TextLine animated={true} width="w-[1.5rem]" height="h-[1.5rem]" round="rounded" />
      </Stack>

      <Text variant="footnotes2" weight="normal" customStyle="dark:text-grey6 text-grey4 mt-2">
        <TextLine animated={true} width="w-2/3" height="h-[1rem]" round="rounded" />
      </Text>
    </Stack>
  </>
);

export default LoadingSettingsPlaceholder;
