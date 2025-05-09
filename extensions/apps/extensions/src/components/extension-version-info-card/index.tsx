import * as React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import ExtensionVersionBulletPointCard from '../extension-version-bullet-point-card';
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
        <Typography variant="h6">{version}</Typography>
        <Typography variant="xs" className="font-medium text-grey4 dark:text-grey6">
          {versionDate}
        </Typography>
      </Stack>
      {!showAllReleaseInfo && (
        <Stack direction="row" justifyContent="between" spacing={4}>
          <Stack direction="row" justifyContent="between" spacing={8}>
            <Typography variant="sm" className="line-clamp-1 sm:w-9/12 w-8/12">
              {releaseNote}
            </Typography>
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
            <Typography variant="h6">{releaseNoteTitle}</Typography>
            <Typography variant="sm">{releaseNote}</Typography>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
export default ExtensionVersionInfoCard;
