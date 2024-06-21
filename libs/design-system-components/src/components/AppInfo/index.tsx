import React, { useState } from 'react';
import { type Developer, type Image } from '@akashaorg/typings/lib/ui';
import { type Color } from '@akashaorg/design-system-core/lib/components/types/common.types';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import CopyToClipboard from '@akashaorg/design-system-core/lib/components/CopyToClipboard';
import ContentBlock from '@akashaorg/design-system-core/lib/components/ContentBlock';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { ChevronRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import StackedAvatar from '@akashaorg/design-system-core/lib/components/StackedAvatar';
import { AppInfoHeader, AppInfoHeaderProps } from './header';
import { AppInfoNotificationCards, AppInfoNotificationCardsProps } from './notification-cards';
import ExtensionImageGallery from '../ExtensionImageGallery';
import { userData } from '@akashaorg/design-system-core/lib/utils';

export type AppInfoProps = AppInfoHeaderProps &
  AppInfoNotificationCardsProps & {
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
    extensionIdTitle: string;
    extensionId: string;
    licenseTitle: string;
    license: string;
    onAppDescriptionClick: () => void;
    onSelectDeveloper: (profileId: string) => void;
    onCollaboratorsClick: () => void;
    onAppVersionClick: () => void;
    onLatestUpdateClick: () => void;
    onPermissionInfoClick: () => void;
    onLicenseClick: () => void;
    onContactSupportClick: () => void;
    transformSource: (src: Image) => Image;
  };

const AppInfo: React.FC<AppInfoProps> = ({
  integrationName,
  integrationType,
  nsfw,
  nsfwLabel,
  pluginLabel,
  share,
  report,
  status,
  notification,
  versionLabel,
  updateButtonLabel,
  packageName,
  packageNameTitle,
  developers,
  descriptionTitle,
  permissionTitle,
  documentationTitle,
  documentationLink,
  extensionIdTitle,
  extensionId,
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
  licenseTitle,
  license,
  onInstall,
  onUninstall,
  onAppDescriptionClick,
  onSelectDeveloper,
  onCollaboratorsClick,
  onAppVersionClick,
  onLatestUpdateClick,
  onPermissionInfoClick,
  onLicenseClick,
  onContactSupportClick,
  transformSource,
}) => {
  const [showImageGalleryOverlay, setShowImageGalleryOverlay] = useState(false);

  const imageGalleryImages = [
    {
      src: 'https://bafkreia4a6262sy5l6jqduyrdplynavybdlj6gww6srstnpc5swtmijdnq.ipfs.w3s.link',
      size: { width: 640, height: 448 },
      name: 'sample-1',
    },
    {
      src: 'https://bafkreiebphfg3neceldflksm3medufm2himfkbegtidcevmr3pork5vbcm.ipfs.w3s.link',
      size: { width: 640, height: 539 },
      name: 'sample-2',
    },
    {
      src: 'https://bafkreia4a6262sy5l6jqduyrdplynavybdlj6gww6srstnpc5swtmijdnq.ipfs.w3s.link',
      size: { width: 640, height: 448 },
      name: 'sample-3',
    },
  ];

  const greyTextColor = { light: 'grey4', dark: 'grey7' } as Color;

  return (
    <>
      <Card background="secondaryLight/30" radius={{ top: 20 }} customStyle="h-[7.3125rem]" />
      <Card padding="p-4" margin="mb-2" radius={{ bottom: 20 }}>
        <Stack spacing="gap-y-4">
          <AppInfoHeader
            integrationName={integrationName}
            integrationType={integrationType}
            nsfw={nsfw}
            nsfwLabel={nsfwLabel}
            pluginLabel={pluginLabel}
            share={share}
            report={report}
            status={status}
            onInstall={onInstall}
            onUninstall={onUninstall}
          />
          <AppInfoNotificationCards
            notification={notification}
            version={version}
            versionLabel={versionLabel}
            updateButtonLabel={updateButtonLabel}
          />
          <Divider />
          <ContentBlock
            blockTitle={descriptionTitle}
            viewMoreLabel={readMore}
            onClickviewMoreLabel={onAppDescriptionClick}
          >
            <Text lineClamp={2} variant="body1">
              {descriptionBody}
            </Text>
          </ContentBlock>
          <ContentBlock
            blockTitle={galleryTitle}
            viewMoreLabel={viewAllGalleryCTA}
            onClickviewMoreLabel={() => {
              setShowImageGalleryOverlay(!showImageGalleryOverlay);
            }}
          >
            <ExtensionImageGallery
              images={imageGalleryImages}
              showOverlay={showImageGalleryOverlay}
              toggleOverlay={() => setShowImageGalleryOverlay(!showImageGalleryOverlay)}
            />
          </ContentBlock>
          <ContentBlock blockTitle={developersTitle}>
            <Stack spacing="gap-y-2">
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
            <Stack spacing="gap-y-2">
              <Card onClick={onCollaboratorsClick} type="plain">
                <Stack direction="row" align="center">
                  <StackedAvatar
                    userData={userData.map(item => ({ ...item, avatar: item.avatar?.default }))}
                    maxAvatars={4}
                    size="xs"
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
            <Stack spacing="gap-y-2">
              <Stack direction="row" justify="between">
                <Text variant="body2" color={greyTextColor}>
                  {packageNameTitle}
                </Text>
                <Button variant="text" size="md" label={packageName} />
              </Stack>
              <Stack direction="row" justify="between">
                <Text variant="body2" color={greyTextColor}>
                  {extensionIdTitle}
                </Text>
                <Button variant="text" size="md" label={extensionId} />
              </Stack>
              <Stack direction="row" justify="between">
                <Text variant="body2" color={greyTextColor}>
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
                <Text variant="body2" color={greyTextColor}>
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
                <Text variant="body2" color={greyTextColor}>
                  {permissionTitle}
                </Text>
                <Button variant="text" size="md" label={'View'} onClick={onPermissionInfoClick} />
              </Stack>

              <Divider />

              <Stack direction="row" justify="between">
                <Text variant="body2" color={greyTextColor}>
                  {licenseTitle}
                </Text>
                <Button variant="text" size="md" label={license} onClick={onLicenseClick} />
              </Stack>
            </Stack>
          </ContentBlock>

          <ContentBlock blockTitle={documentationTitle}>
            <Stack customStyle="flex-wrap">
              <CopyToClipboard value={documentationLink}>
                <Button
                  variant="text"
                  size="md"
                  label={documentationLink}
                  onClick={onLicenseClick}
                />
              </CopyToClipboard>
            </Stack>
          </ContentBlock>
          <ContentBlock
            blockTitle={versionInfo}
            viewMoreLabel={goToVersionInfoPageLabel}
            onClickviewMoreLabel={onAppVersionClick}
          >
            <Stack spacing="gap-y-4">
              <Stack>
                <Text variant="body1">{version}</Text>
                <Text variant="footnotes2" color={greyTextColor}>
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
            onClickviewMoreLabel={onContactSupportClick}
          />
        </Stack>
      </Card>
    </>
  );
};

export default AppInfo;
