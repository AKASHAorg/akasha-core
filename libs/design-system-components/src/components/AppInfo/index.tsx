import React from 'react';
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
import type { Developer, Image } from '@akashaorg/typings/lib/ui';
import {
  ArrowDownIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { ListItem } from '@akashaorg/design-system-core/lib/components/List';
import StackedAvatar from '@akashaorg/design-system-core/lib/components/StackedAvatar';
import CopyToClipboard from '@akashaorg/design-system-core/lib/components/CopyToClipboard';
import { userData } from '@akashaorg/design-system-core/lib/utils';
import { DuplexAppButton } from './duplex-app-button';
import ExtensionImageGallery from '../ExtensionImageGallery';

export type AppInfoProps = {
  integrationName: string;
  packageName: string;
  packageNameTitle: string;
  developers: Developer[];
  descriptionTitle: string;
  readMore: string;
  descriptionBody: string;
  developersTitle: string;
  permissionTitle: string;
  collaboratorsTitle: string;
  galleryTitle: string;
  viewAllGalleryCTA: string;
  generalInfoTitle: string;
  latestReleaseTitle: string;
  contactSupportTitle: string;
  languageLabel: string;
  languages: string[];
  version: string;
  versionInfo: string;
  versionDate: string;
  versionDescription: string;
  goToVersionInfoPageLabel: string;
  documentationTitle: string;
  documentationLink: string;
  licenseTitle: string;
  license: string;
  share: ListItem;
  report: ListItem;
  status: 'installed' | 'not-installed' | 'loading';
  onInstall: () => void;
  onUninstall: () => void;
  onSelectDeveloper: (profileId: string) => void;
  onCollaboratorsClick: () => void;
  onAppVersionClick: () => void;
  onLatestUpdateClick: () => void;
  onPermissionInfoClick: () => void;
  onLicenseClick: () => void;
  transformSource: (src: Image) => Image;
};

const AppInfo: React.FC<AppInfoProps> = ({
  integrationName,
  packageName,
  packageNameTitle,
  developers,
  descriptionTitle,
  permissionTitle,
  readMore,
  descriptionBody,
  galleryTitle,
  viewAllGalleryCTA,
  developersTitle,
  collaboratorsTitle,
  generalInfoTitle,
  latestReleaseTitle,
  languageLabel,
  contactSupportTitle,
  languages,
  version,
  versionInfo,
  versionDate,
  versionDescription,
  goToVersionInfoPageLabel,
  documentationTitle,
  documentationLink,
  licenseTitle,
  license,
  share,
  report,
  status,
  onInstall,
  onUninstall,
  onSelectDeveloper,
  onCollaboratorsClick,
  onAppVersionClick,
  onLatestUpdateClick,
  onPermissionInfoClick,
  onLicenseClick,
  transformSource,
}) => {
  const [showAllDescription, setShowAllDescription] = React.useState(false);
  const [showImageGalleryOverlay, setShowImageGalleryOverlay] = React.useState(false);

  const imageGalleryImages = [
    {
      src: 'https://placebeard.it/800x800',
      size: { width: 320, height: 320 },
      name: 'sample-1',
    },
    {
      src: 'https://placebeard.it/800x800',
      size: { width: 320, height: 320 },
      name: 'sample-2',
    },
    {
      src: 'https://placebeard.it/800x800',
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
            viewMoreLabel={readMore}
            onClickviewMoreLabel={() => setShowAllDescription(!showAllDescription)}
          >
            <Stack direction="row" justify="between">
              <Text lineClamp={showAllDescription ? 0 : 2} variant="body1">
                {descriptionBody}
              </Text>
            </Stack>
          </ContentBlock>
          <ContentBlock
            blockTitle={galleryTitle}
            viewMoreLabel={viewAllGalleryCTA}
            onClickviewMoreLabel={() => {
              setShowImageGalleryOverlay(!showImageGalleryOverlay);
            }}
          >
            <Stack direction="row" justify="between">
              <ExtensionImageGallery
                images={imageGalleryImages}
                showOverlay={showImageGalleryOverlay}
                toggleOverlay={() => setShowImageGalleryOverlay(!showImageGalleryOverlay)}
              />
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
          <ContentBlock blockTitle={generalInfoTitle}>
            <Stack direction="column" spacing="gap-y-2">
              <Stack direction="row" justify="between">
                <Text variant="body2" color={{ light: 'grey4', dark: 'grey7' }}>
                  {latestReleaseTitle}
                </Text>
                <Button
                  variant="text"
                  size="md"
                  label={versionDate}
                  onClick={onLatestUpdateClick}
                />
              </Stack>
              <Divider />
              <Stack direction="row" justify="between">
                <Text variant="body2" color={{ light: 'grey4', dark: 'grey7' }}>
                  {languageLabel}
                </Text>
                <Text variant="body2">
                  {languages.map((language, idx) =>
                    idx < languages.length - 1 ? language + ', ' : language,
                  )}
                </Text>
              </Stack>
              <Divider />

              <Stack direction="row" justify="between">
                <Text variant="body2" color={{ light: 'grey4', dark: 'grey7' }}>
                  {documentationTitle}
                </Text>
                <CopyToClipboard value={documentationLink}>
                  <Button variant="text" size="md" label={documentationLink} />
                </CopyToClipboard>
              </Stack>
              <Divider />

              <Stack direction="row" justify="between">
                <Text variant="body2" color={{ light: 'grey4', dark: 'grey7' }}>
                  {permissionTitle}
                </Text>
                <Button variant="text" size="md" label={'View'} onClick={onPermissionInfoClick} />
              </Stack>
              <Divider />

              <Stack direction="row" justify="between">
                <Text variant="body2" color={{ light: 'grey4', dark: 'grey7' }}>
                  {licenseTitle}
                </Text>
                <Button variant="text" size="md" label={license} onClick={onLicenseClick} />
              </Stack>
            </Stack>
          </ContentBlock>

          <ContentBlock blockTitle={packageNameTitle}>
            <Text variant="body1">{packageName}</Text>
          </ContentBlock>

          <ContentBlock
            blockTitle={versionInfo}
            viewMoreLabel={goToVersionInfoPageLabel}
            onClickviewMoreLabel={onAppVersionClick}
          >
            <Stack direction="column" spacing="gap-y-4">
              <Stack direction="column">
                <Text variant="body1">{version}</Text>
                <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey7' }}>
                  {versionDate}
                </Text>
              </Stack>
              <Text lineClamp={2} variant="body1">
                {versionDescription}
              </Text>
            </Stack>
          </ContentBlock>

          <ContentBlock
            blockTitle={contactSupportTitle}
            viewMoreIcon={<ChevronRightIcon />}
            showDivider={false}
            //  onClickviewMoreLabel={() => setShowAllDescription(!showAllDescription)}
          ></ContentBlock>
        </Stack>
      </Card>
    </>
  );
};

export default AppInfo;
