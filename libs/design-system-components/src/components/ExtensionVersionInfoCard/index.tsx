import * as React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
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
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="between" alignItems="center">
        <Text variant="h6">{version}</Text>
        <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey6' }}>
          {versionDate}
        </Text>
      </Stack>
      {!showAllReleaseInfo && (
        <Stack direction="row" justifyContent="between" spacing={4}>
          <Stack direction="row" justifyContent="between" spacing={8}>
            <Text variant="body2" lineClamp={1} customStyle="sm:w-9/12 w-8/12">
              {releaseNote}
            </Text>
            <Stack className="sm:w-3/12 w-4/12">
              <Button
                variant="link"
                onClick={() => setShowAllReleaseInfo(!showAllReleaseInfo)}
                className="self-end"
              >
                {viewMoreLabel}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      )}
      {showAllReleaseInfo && (
        <Stack direction="column" spacing={4}>
          <ExtensionVersionBulletPointCard featureTitle={newFeaturesTitle} itemList={newFeatures} />
          <ExtensionVersionBulletPointCard featureTitle={bugFixesTitle} itemList={bugFixes} />
          <Stack direction="column" spacing={4}>
            <Text variant="h6">{releaseNoteTitle}</Text>
            <Text variant="body2">{releaseNote}</Text>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default ExtensionVersionInfoCard;
