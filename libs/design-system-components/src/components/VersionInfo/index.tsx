import React from 'react';

import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Section from '@akashaorg/design-system-core/lib/components/Section';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type VersionInfoProps = {
  integrationName: string;
  packageName: string;
  versionTitle: string;
  newFeaturesTitle: string;
  bugFixesTitle: string;
  additionalNotesTitle: string;
  additionalNotesBody: string;
};

const VersionInfo: React.FC<VersionInfoProps> = ({
  integrationName,
  packageName,
  versionTitle,
  newFeaturesTitle,
  bugFixesTitle,
  additionalNotesTitle,
  additionalNotesBody,
}) => {
  return (
    <Card className="p-4">
      <Stack direction="column" spacing={4}>
        <Section title={integrationName}>
          <Text variant="footnotes2" weight="normal" color="grey7">
            {packageName}
          </Text>
        </Section>
        <Section title={versionTitle}></Section>
        <Section title={newFeaturesTitle}></Section>
        <Section title={bugFixesTitle}></Section>
        <Section title={additionalNotesTitle} showDivider={false}>
          <Text variant="body2">{additionalNotesBody}</Text>
        </Section>
      </Stack>
    </Card>
  );
};

export default VersionInfo;
