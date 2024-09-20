import React, { useMemo } from 'react';
import { tw } from '@twind/core';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Label from '@akashaorg/design-system-core/lib/components/Label';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import {
  Plugin,
  App,
  Widget,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Section from './section';
import { AppInfoPill } from '../AppInfo/info-pill';
import ExtensionImageGallery from '../ExtensionImageGallery';
import { Extension, Image } from '@akashaorg/typings/lib/ui';
import AppAvatar from '@akashaorg/design-system-core/lib/components/AppAvatar';
import { getImageFromSeed } from '@akashaorg/design-system-core/lib/utils';

export type ExtensionReviewAndPublishProps = {
  extensionData: Extension;
  title: string;
  subtitle: { part1: string; part2: string };
  extensionNameLabel: string;
  extensionDisplayNameLabel: string;
  nsfwLabel: string;
  nsfwDescription: string;
  descriptionLabel: string;
  galleryLabel: string;
  imageUploadedLabel: string;
  viewAllLabel: string;
  documentationLabel: string;
  licenseLabel: string;
  contributorsLabel: string;
  contactInfoLabel: string;
  tagsLabel: string;
  backButtonLabel: string;
  publishButtonLabel: string;
  publicImagePath?: string;
  onViewGalleryClick?: () => void;
  onClickCancel: () => void;
  onClickSubmit: () => void;
  transformSource: (src: Image) => Image;
};

const ExtensionReviewAndPublish: React.FC<ExtensionReviewAndPublishProps> = props => {
  const {
    extensionData,
    subtitle,
    extensionNameLabel,
    extensionDisplayNameLabel,
    nsfwLabel,
    nsfwDescription,
    descriptionLabel,
    galleryLabel,
    imageUploadedLabel,
    viewAllLabel,
    documentationLabel,
    licenseLabel,
    contributorsLabel,
    contactInfoLabel,
    tagsLabel,
    backButtonLabel,
    publishButtonLabel,
    publicImagePath = '/images',
    onViewGalleryClick,
    onClickCancel,
    onClickSubmit,
    transformSource,
  } = props;

  const [activeAccordionId, setActiveAccordionId] = React.useState(null);

  const transformedCoverImage = transformSource(extensionData?.coverImage);
  const seed = getImageFromSeed(extensionData?.id, 3);
  const coverImageFallback = `${publicImagePath}/extension-cover-desktop-${seed}.webp`;
  const backgroundUrl = transformedCoverImage?.src ?? coverImageFallback;

  const disablePublish = useMemo(
    () =>
      !extensionData?.applicationType ||
      !extensionData?.displayName ||
      !extensionData?.name ||
      !extensionData?.license ||
      !extensionData?.description,
    [extensionData],
  );

  const onAccordionClick = accordionId => {
    if (activeAccordionId === accordionId) {
      setActiveAccordionId(null);
    } else {
      setActiveAccordionId(accordionId);
    }
  };

  const getAccordionTitleNode = (title: string, isRequired = true) => {
    return (
      <Stack direction="row" spacing="gap-x-1" align="center">
        <Icon icon={<CheckCircleIcon />} solid={true} color="success" />
        <Label required={isRequired}>{title}</Label>
      </Stack>
    );
  };

  const getApplicationIconByType = (type: AkashaAppApplicationType) => {
    switch (type) {
      case AkashaAppApplicationType.App:
        return <App />;
      case AkashaAppApplicationType.Plugin:
        return <Plugin />;
      case AkashaAppApplicationType.Widget:
        return <Widget />;
      default:
        return <App />;
    }
  };

  const asteriskStyle = tw(`-top-0.5 left-1 text-base text(errorLight dark:errorDark)`);

  return (
    <>
      <Stack padding={16} spacing="gap-y-4">
        <Text as="span" variant="body2" color={{ light: 'grey4', dark: 'grey6' }}>
          {subtitle.part1} <span className={asteriskStyle}>*</span> {subtitle.part2}
        </Text>

        <Stack spacing="gap-y-3" fullWidth>
          <Stack
            customStyle={`relative h-24 rounded-2xl  bg(center no-repeat cover [url(${backgroundUrl})])`}
            fullWidth
          >
            <AppAvatar
              appType={extensionData?.applicationType}
              avatar={transformSource(extensionData?.logoImage)}
              extensionId={extensionData?.id}
              customStyle="absolute left-4 -bottom-8"
            />
          </Stack>

          <AppInfoPill
            background={{ light: 'tertiaryLight', dark: 'tertiaryDark' }}
            customStyle="w-fit self-end"
          >
            <Icon
              size="sm"
              icon={getApplicationIconByType(extensionData?.applicationType)}
              color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
              solid={true}
            />
            <Text variant="footnotes2" color={{ light: 'secondaryLight', dark: 'white' }}>
              {extensionData?.applicationType}
            </Text>
          </AppInfoPill>
        </Stack>

        <Section title={extensionNameLabel} required>
          <Text variant="body2">{extensionData?.name}</Text>
        </Section>

        <Section title={extensionDisplayNameLabel}>
          <Text variant="body2">{extensionData?.displayName}</Text>
        </Section>

        <Section title={nsfwLabel} required hasToggle isToggleChecked={extensionData?.nsfw}>
          <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }}>
            {nsfwDescription}
          </Text>
        </Section>

        {/* wrap each accordion in a Stack to guard against the main wrapper's spacing */}
        <Stack spacing="gap-y-3">
          <Accordion
            accordionId={descriptionLabel}
            open={descriptionLabel === activeAccordionId}
            titleNode={getAccordionTitleNode(descriptionLabel)}
            contentNode={<Text variant="body2">{extensionData?.description}</Text>}
            handleClick={onAccordionClick}
          />
        </Stack>
        <Divider />

        <Stack spacing="gap-y-3">
          <Accordion
            accordionId={galleryLabel}
            open={galleryLabel === activeAccordionId}
            titleNode={getAccordionTitleNode(galleryLabel, false)}
            contentNode={
              <Stack spacing="gap-y-3">
                <ExtensionImageGallery
                  images={extensionData?.gallery?.slice(0, 3).map((image, idx) => ({
                    src: image.src,
                    size: { width: image.width, height: image.height },
                    name: image.src + idx,
                  }))}
                  showOverlay={false}
                  toggleOverlay={() => ({})}
                />
                <Stack direction="row" align="center" justify="between">
                  <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey7' }}>
                    {imageUploadedLabel}
                  </Text>
                  <Button variant="text" label={viewAllLabel} onClick={onViewGalleryClick} />
                </Stack>
              </Stack>
            }
            handleClick={onAccordionClick}
          />
        </Stack>
        <Divider />

        <Stack spacing="gap-y-3">
          <Accordion
            accordionId={documentationLabel}
            open={documentationLabel === activeAccordionId}
            titleNode={getAccordionTitleNode(documentationLabel, false)}
            contentNode={
              <Stack spacing="gap-y-3">
                {extensionData?.links?.map((link, index) => (
                  <Stack key={index}>
                    <Text variant="button-md">{link.label}</Text>
                    <Link to={link.href} target="_blank">
                      <Text
                        variant="body2"
                        color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                      >
                        {link.href}
                      </Text>
                    </Link>
                  </Stack>
                ))}
              </Stack>
            }
            handleClick={onAccordionClick}
          />
        </Stack>
        <Divider />

        <Stack spacing="gap-y-3">
          <Accordion
            accordionId={licenseLabel}
            open={licenseLabel === activeAccordionId}
            titleNode={getAccordionTitleNode(licenseLabel)}
            contentNode={
              <Stack>
                <Text variant="button-md">{extensionData?.license}</Text>
              </Stack>
            }
            handleClick={onAccordionClick}
          />
        </Stack>
        <Divider />

        <Stack spacing="gap-y-3">
          <Accordion
            accordionId={contributorsLabel}
            open={contributorsLabel === activeAccordionId}
            titleNode={getAccordionTitleNode(contributorsLabel, false)}
            contentNode={
              <Stack spacing="gap-y-4">
                {extensionData?.contributors?.map((el, index) => (
                  // @TODO: provide also the avatar and name for profiles
                  <ProfileAvatarButton key={index} profileId={el} />
                ))}
              </Stack>
            }
            handleClick={onAccordionClick}
          />
        </Stack>
        <Divider />

        <Stack spacing="gap-y-3">
          <Accordion
            accordionId={contactInfoLabel}
            open={contactInfoLabel === activeAccordionId}
            titleNode={getAccordionTitleNode(contactInfoLabel, false)}
            contentNode={<Text variant="body2">{extensionData?.contactInfo}</Text>}
            handleClick={onAccordionClick}
          />
        </Stack>
        <Divider />

        <Stack spacing="gap-y-3">
          <Accordion
            accordionId={tagsLabel}
            open={tagsLabel === activeAccordionId}
            titleNode={getAccordionTitleNode(tagsLabel)}
            contentNode={
              <Stack direction="row" spacing="gap-2" customStyle="flex-wrap">
                {extensionData?.keywords?.map((tag, idx) => (
                  <Pill key={tag + idx} label={tag} type="action" />
                ))}
              </Stack>
            }
            handleClick={onAccordionClick}
          />
        </Stack>
      </Stack>

      <Divider />

      <Stack direction="row" padding="p-4" spacing="gap-x-2" align="center" justify="end">
        <Button variant="text" label={backButtonLabel} onClick={onClickCancel} />
        <Button
          variant="primary"
          disabled={disablePublish}
          label={publishButtonLabel}
          onClick={onClickSubmit}
          customStyle="w-36"
        />
      </Stack>
    </>
  );
};

export default ExtensionReviewAndPublish;
