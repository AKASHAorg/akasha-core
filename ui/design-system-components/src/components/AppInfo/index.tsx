import React from 'react';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import AvatarBlock from '@akashaorg/design-system-core/lib/components/AvatarBlock';
import ContentBlock from '@akashaorg/design-system-core/lib/components/ContentBlock';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Menu from '@akashaorg/design-system-core/lib/components/Menu';
import { Item } from '@akashaorg/design-system-core/lib/components/List';
import { Developer } from '../types/common.types';

export type AppInfoProps = {
  integrationName: string;
  packageName: string;
  developers: Developer[];
  descriptionTitle: string;
  descriptionBody: string;
  developersTitle: string;
  latestReleaseTitle: string;
  version: string;
  versionDate: string;
  versionDescription: string;
  linksAndDocumentationTitle: string;
  licenseTitle: string;
  license: string;
  share: Item;
  report: Item;
  onSelectDeveloper?: (profileId: string) => void;
};

const AppInfo: React.FC<AppInfoProps> = ({
  integrationName,
  packageName,
  developers,
  descriptionTitle,
  descriptionBody,
  developersTitle,
  latestReleaseTitle,
  version,
  versionDate,
  versionDescription,
  linksAndDocumentationTitle,
  licenseTitle,
  license,
  share,
  report,
  onSelectDeveloper,
}) => {
  return (
    <>
      <Card
        elevation="1"
        background="secondaryLight/30"
        radius={{ top: 20 }}
        customStyle="h-[7.3125rem]"
      />
      <Card elevation="1" padding={16} radius={{ bottom: 20 }}>
        <Stack direction="column" spacing="gap-y-4">
          <Stack direction="column" spacing="gap-y-4">
            <Stack align="start" customStyle="relative">
              <Stack align="center" spacing="gap-x-2" customStyle="h-[4.375rem] -mt-7">
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
                    {integrationName}
                  </Text>
                  <Text variant="footnotes2" weight="normal" color="grey7">
                    {packageName}
                  </Text>
                </Stack>
              </Stack>
              <Stack spacing="gap-x-2" customStyle="ml-auto">
                <Button icon="ArrowDownIcon" size="xs" iconOnly />
                <Menu
                  anchorElement={<Button icon="EllipsisVerticalIcon" size="xs" greyBg iconOnly />}
                  items={[share, report]}
                />
              </Stack>
            </Stack>
            <Divider />
          </Stack>
          <ContentBlock blockTitle={descriptionTitle}>
            <Text lineClamp={4}>{descriptionBody}</Text>
          </ContentBlock>
          <ContentBlock blockTitle={developersTitle}>
            <Stack direction="column" spacing="gap-y-2">
              {developers.map(developer => (
                <Button
                  key={developer.profileId}
                  onClick={() => {
                    if (onSelectDeveloper) onSelectDeveloper(developer.profileId);
                  }}
                  plain
                >
                  <Stack align="center">
                    <AvatarBlock
                      profileId={developer.profileId}
                      avatar={developer.avatar}
                      name={developer.name}
                      userName={developer.userName}
                    />
                    <Icon
                      type="ChevronRightIcon"
                      size="sm"
                      color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                      customStyle="ml-auto"
                    />
                  </Stack>
                </Button>
              ))}
            </Stack>
          </ContentBlock>
          <ContentBlock blockTitle={latestReleaseTitle}>
            <Stack direction="column" spacing="gap-y-4">
              <Stack direction="column">
                <Text variant="body1" color={{ light: 'grey5', dark: 'grey6' }}>
                  {version}
                </Text>
                <Text variant="footnotes2" color="grey7">
                  {versionDate}
                </Text>
              </Stack>
              <Text variant="body1" truncate>
                {versionDescription}
              </Text>
            </Stack>
          </ContentBlock>
          <ContentBlock blockTitle={linksAndDocumentationTitle}>
            <Anchor href="#">Link</Anchor>
          </ContentBlock>
          <ContentBlock blockTitle={licenseTitle} showDivider={false}>
            <Text variant="body1">{license}</Text>
          </ContentBlock>
        </Stack>
      </Card>
    </>
  );
};

export default AppInfo;
