import React from 'react';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import ContentBlock from '@akashaorg/design-system-core/lib/components/ContentBlock';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Menu from '@akashaorg/design-system-core/lib/components/Menu';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import type { Developer, Image } from '@akashaorg/typings/lib/ui';
import {
  ArrowDownIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  InformationCircleIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { ListItem } from '@akashaorg/design-system-core/lib/components/List';
import { DuplexAppButton } from './duplex-app-button';

export type AppInfoProps = {
  integrationName: string;
  packageName: string;
  developers: Developer[];
  descriptionTitle: string;
  descriptionBody: string;
  developersTitle: string;
  latestReleaseTitle: string;
  version: string;
  versionInfo: string;
  versionDate: string;
  versionDescription: string;
  linksAndDocumentationTitle: string;
  licenseTitle: string;
  license: string;
  share: ListItem;
  report: ListItem;
  status: 'installed' | 'not-installed' | 'loading';
  onInstall: () => void;
  onUninstall: () => void;
  onSelectDeveloper: (profileId: string) => void;
  transformSource: (src: Image) => Image;
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
  versionInfo,
  versionDate,
  versionDescription,
  linksAndDocumentationTitle,
  licenseTitle,
  license,
  share,
  report,
  status,
  onInstall,
  onUninstall,
  onSelectDeveloper,
  transformSource,
}) => {
  return (
    <>
      <Card
        elevation="1"
        background="secondaryLight/30"
        radius={{ top: 20 }}
        customStyle="h-[7.3125rem]"
      />
      <Card elevation="1" padding={'p-4'} radius={{ bottom: 20 }}>
        <Stack direction="column" spacing="gap-y-4">
          <Stack direction="column" spacing="gap-y-4">
            <Stack direction="row" align="start" customStyle="relative">
              <Stack
                direction="row"
                align="center"
                spacing="gap-x-2"
                customStyle="h-[4.375rem] -mt-7"
              >
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
              <Stack direction="row" spacing="gap-x-2" customStyle="ml-auto">
                {status === 'not-installed' && (
                  <Button
                    icon={<ArrowDownIcon />}
                    variant="primary"
                    size="xs"
                    iconOnly
                    onClick={onInstall}
                  />
                )}
                {status === 'installed' && <DuplexAppButton onUninstall={onUninstall} />}
                {status === 'loading' && (
                  <AppIcon
                    placeholderIcon={<ArrowPathIcon />}
                    iconColor="white"
                    background="secondaryDark"
                    size="xs"
                  />
                )}
                <Menu
                  anchor={{
                    icon: <EllipsisVerticalIcon />,
                    variant: 'primary',
                    size: 'xs',
                    greyBg: true,
                    iconOnly: true,
                  }}
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
                <Card
                  key={developer.profileId}
                  onClick={() => {
                    if (onSelectDeveloper) onSelectDeveloper(developer.profileId);
                  }}
                  type="plain"
                >
                  <Stack direction="row" align="center">
                    <ProfileAvatarButton
                      profileId={developer.profileId}
                      label={developer.name}
                      size="md"
                      avatar={transformSource(developer?.avatar?.default)}
                      alternativeAvatars={developer?.avatar?.alternatives?.map(alternative =>
                        transformSource(alternative),
                      )}
                    />
                    <Icon
                      icon={<ChevronRightIcon />}
                      size="sm"
                      color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                      customStyle="ml-auto"
                    />
                  </Stack>
                </Card>
              ))}
            </Stack>
          </ContentBlock>
          <ContentBlock blockTitle={latestReleaseTitle}>
            <Stack direction="column" spacing="gap-y-4">
              <Stack direction="column">
                <Stack direction="row" align="center" spacing="gap-x-1">
                  <Text variant="body1" color={{ light: 'grey5', dark: 'grey6' }}>
                    {version}
                  </Text>
                  <Tooltip content={versionInfo} placement="right">
                    <Icon
                      icon={<InformationCircleIcon />}
                      color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                    />
                  </Tooltip>
                </Stack>
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
