import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ExtensionVersionBulletPointCard from '../ExtensionVersionBulletPointCard';

export type ExtensionVersionInfoCardProps = {
  version: string;
  versionDate: string;
  releaseNote: string;
  viewMoreLabel: string;
  newFeaturesTitle: string;
  newFeatures: string[];
  bugFixesTitle: string;
  bugFixes: string[];
  releaseNoteTitle: string;
};

const ExtensionVersionInfoCard: React.FC<ExtensionVersionInfoCardProps> = ({
  version,
  versionDate,
  releaseNote,
  viewMoreLabel,
  newFeatures,
  newFeaturesTitle,
  bugFixes,
  bugFixesTitle,
  releaseNoteTitle,
}) => {
  const [showAllReleaseInfo, setShowAllReleaseInfo] = React.useState(false);

  return (
    <Stack spacing="gap-y-4">
      <Stack direction="row" justify="between" align="center">
        <Text variant="h6">{version}</Text>
        <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey6' }}>
          {versionDate}
        </Text>
      </Stack>
      {!showAllReleaseInfo && (
        <Stack direction="row" justify="between" spacing="gap-y-4">
          <Stack direction="row" justify="between" spacing="gap-x-8">
            <Text variant="body2" lineClamp={1} customStyle="sm:w-9/12 w-8/12">
              {releaseNote}
            </Text>
            <Stack customStyle="sm:w-3/12 w-4/12">
              <Button
                size="md"
                customStyle="self-end"
                variant="text"
                label={viewMoreLabel}
                onClick={() => setShowAllReleaseInfo(!showAllReleaseInfo)}
              />
            </Stack>
          </Stack>
        </Stack>
      )}
      {showAllReleaseInfo && (
        <Stack direction="column" spacing="gap-y-4">
          <ExtensionVersionBulletPointCard featureTitle={newFeaturesTitle} itemList={newFeatures} />
          <ExtensionVersionBulletPointCard featureTitle={bugFixesTitle} itemList={bugFixes} />
          <Stack direction="column" spacing="gap-y-4">
            <Text variant="h6">{releaseNoteTitle}</Text>
            <Text variant="body2">{releaseNote}</Text>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default ExtensionVersionInfoCard;
