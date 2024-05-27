import React from 'react';
import Link from '@akashaorg/design-system-core/lib/components/Link';
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
import StackedAvatar from '@akashaorg/design-system-core/lib/components/StackedAvatar';
import { userData } from '@akashaorg/design-system-core/lib/utils';
import { DuplexAppButton } from './duplex-app-button';
import ImageBlockGallery from '../ImageBlockGallery';

export type AppInfoProps = {
  integrationName: string;
  packageName: string;
  developers: Developer[];
  descriptionTitle: string;
  readMore: string;
  descriptionBody: string;
  developersTitle: string;
  collaboratorsTitle: string;
  galleryTitle: string;
  viewAllGalleryCTA: string;
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
  onCollaboratorsClick: () => void;
  transformSource: (src: Image) => Image;
};

const AppInfo: React.FC<AppInfoProps> = ({
  integrationName,
  packageName,
  developers,
  descriptionTitle,
  readMore,
  descriptionBody,
  galleryTitle,
  viewAllGalleryCTA,
  developersTitle,
  collaboratorsTitle,
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
  onCollaboratorsClick,
  transformSource,
}) => {
  const [showAllDescription, setShowAllDescription] = React.useState(false);

  const imageGalleryImages = [
    {
      src: 'https://placebeard.it/360x360',
      size: { width: 320, height: 320 },
      name: 'sample-1',
    },
    {
      src: 'https://placebeard.it/320x320',
      size: { width: 320, height: 320 },
      name: 'sample-2',
    },
    {
      src: 'https://placebeard.it/350x350',
      size: { width: 320, height: 320 },
      name: 'sample-3',
    },
  ];

  return (
    <>
      <Card background="secondaryLight/30" radius={{ top: 20 }} customStyle="h-[7.3125rem]" />
      <Card padding={'p-4'} radius={{ bottom: 20 }}>
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
          <ContentBlock
            blockTitle={descriptionTitle}
            viewMore={readMore}
            onClickViewMore={() => setShowAllDescription(!showAllDescription)}
          >
            <Stack direction="row" justify="between">
              <Text lineClamp={showAllDescription ? 1000 : 2} variant="body1">
                {descriptionBody}
              </Text>
            </Stack>
          </ContentBlock>
          <ContentBlock
            blockTitle={galleryTitle}
            viewMore={viewAllGalleryCTA}
            //  onClickViewMore={() => setShowAllDescription(!showAllDescription)}
          >
            <Stack direction="row" justify="between">
              <ImageBlockGallery images={imageGalleryImages} gap={3} />
            </Stack>
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
          <ContentBlock blockTitle={collaboratorsTitle}>
            <Stack direction="column" spacing="gap-y-2">
              <Card onClick={onCollaboratorsClick} type="plain">
                <Stack direction="row" align="center">
                  <StackedAvatar
                    userData={userData.map(item => ({ ...item, avatar: item.avatar?.default }))}
                    maxAvatars={4}
                  />
                  <Icon
                    icon={<ChevronRightIcon />}
                    size="sm"
                    color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                    customStyle="ml-auto"
                  />
                </Stack>
              </Card>
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
            <Link to="#">Link</Link>
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
