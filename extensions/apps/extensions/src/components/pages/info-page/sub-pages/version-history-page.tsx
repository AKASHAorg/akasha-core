import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ExtensionHeader from '@akashaorg/design-system-components/lib/components/ExtensionHeader';
import ExtensionVersionInfoCard from '@akashaorg/design-system-components/lib/components/ExtensionVersionInfoCard';
import { mockAppVersionData } from './version-info-page';

type VersionHistoryPageProps = {
  appId: string;
};

export const VersionHistoryPage: React.FC<VersionHistoryPageProps> = ({ appId }) => {
  const { t } = useTranslation('app-extensions');
  // @TODO get version history info from the hook when available

  return (
    <>
      <Card padding="p-4">
        <Stack spacing="gap-y-4">
          <ExtensionHeader appName="Extension Name" packageName="Package name" />
          <Divider />
          {[1, 2, 3].map(i => (
            <Stack key={i} direction="column" spacing="gap-y-4">
              <ExtensionVersionInfoCard
                version={t('Version 2.8.0')}
                versionDate={t('April 2024')}
                releaseNote={t(
                  'All problems from previous version have been fixed. We cannot guarantee that it’ll work 100% well as we are all still working on the fixes. Please feel free to contact us if you are facing any other issue.',
                )}
                viewMoreLabel={t('Read More')}
                newFeaturesTitle={t('New Features')}
                newFeatures={mockAppVersionData.newFeatures}
                bugFixesTitle={t('Bug Fixes')}
                bugFixes={mockAppVersionData.bugFixes}
                releaseNoteTitle={t('Additional Notes')}
              />
              {i <= 2 && <Divider />}
            </Stack>
          ))}
        </Stack>
      </Card>
    </>
  );
};
