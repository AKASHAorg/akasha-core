import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import ContentBlock from '@akashaorg/design-system-core/lib/components/ContentBlock';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
    <Card elevation="1" padding={'p-4'} radius={20}>
      <Stack direction="column" spacing="gap-y-4">
        <ContentBlock blockTitle={integrationName}>
          <Text variant="footnotes2" weight="normal" color="grey7">
            {packageName}
          </Text>
        </ContentBlock>
        <ContentBlock blockTitle={versionTitle}></ContentBlock>
        <ContentBlock blockTitle={newFeaturesTitle}></ContentBlock>
        <ContentBlock blockTitle={bugFixesTitle}></ContentBlock>
        <ContentBlock blockTitle={additionalNotesTitle} showDivider={false}>
          <Text variant="body2">{additionalNotesBody}</Text>
        </ContentBlock>
      </Stack>
    </Card>
  );
};

export default VersionInfo;
