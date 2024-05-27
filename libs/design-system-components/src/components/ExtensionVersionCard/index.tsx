import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ExtensionVersionCardProps = {
  version: string;
  versionDate: string;
  releaseNote: string;
  viewMoreLabel: string;
};

const ExtensionVersionCard: React.FC<ExtensionVersionCardProps> = ({
  version,
  versionDate,
  releaseNote,
  viewMoreLabel,
}) => {
  const [showAllReleaseNote, setShowAllReleaseNote] = React.useState(false);

  return (
    <Stack direction="column" spacing="gap-y-4">
      <Stack direction="row" justify="between">
        <Text variant="h6">{version}</Text>
        <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey6' }}>
          {versionDate}
        </Text>
      </Stack>
      <Stack direction="row" justify="between">
        <Text variant="body2" lineClamp={showAllReleaseNote ? 1000 : 1}>
          {releaseNote}
        </Text>
        <Button
          size="md"
          variant="text"
          label={viewMoreLabel}
          onClick={() => setShowAllReleaseNote(!showAllReleaseNote)}
        />
      </Stack>
    </Stack>
  );
};

export default ExtensionVersionCard;
