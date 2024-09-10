import React from 'react';
import { tw } from '@twind/core';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Label from '@akashaorg/design-system-core/lib/components/Label';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import Stepper from '@akashaorg/design-system-core/lib/components/Stepper';
import { Plugin } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Section from './section';
import { AppInfoPill } from '../AppInfo/info-pill';
import ExtensionImageGallery from '../ExtensionImageGallery';

type ExtensionData = {
  logoImage: AppImageSource;
  coverImage: AppImageSource;
  id: string;
  displayName: string;
  github: string;
  nsfw: boolean;
  applicationType: AkashaAppApplicationType;
  description: string;
  gallery: AppImageSource[];
  links: { label: string; href: string }[];
  contactInfo: string;
  license: { name: string; description: string };
  contributors: {
    label: string;
    profileId: string;
    avatar: { src: string; height: number; width: number };
  }[];
  tags: string[];
};

export type ReviewAndPublishProps = {
  extensionData: ExtensionData;
  title: string;
  subtitle: { part1: string; part2: string };
  pluginLabel: string;
  extensionId: string;
  extensionDisplayName: string;
  sourceFileLabel: string;
  nsfwLabel: string;
  nsfwDescription: string;
  activeAccordionId: string;
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
  onViewGalleryClick: () => void;
  onAccordionClick: () => void;
  onClickBack: () => void;
  onClickPublish: () => void;
};

const ReviewAndPublish: React.FC<ReviewAndPublishProps> = props => {
  const {
    extensionData,
    title,
    subtitle,
    pluginLabel,
    extensionId,
    extensionDisplayName,
    sourceFileLabel,
    nsfwLabel,
    nsfwDescription,
    activeAccordionId,
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
    onViewGalleryClick,
    onAccordionClick,
    onClickBack,
    onClickPublish,
  } = props;

  const getAccordionTitleNode = (title: string, isRequired = true) => {
    return (
      <Stack direction="row" spacing="gap-x-1" align="center">
        <Icon icon={<CheckCircleIcon />} solid={true} color="success" />
        <Label required={isRequired}>{title}</Label>
      </Stack>
    );
  };

  const asteriskStyle = tw(`-top-0.5 left-1 text-base text(errorLight dark:errorDark)`);

  return (
    <>
      <Stack padding="p-4 pb-6" spacing="gap-y-4">
        <Stack spacing="gap-y-4" align="center">
          <Stepper length={2} currentStep={1} />
          <Text variant="h5">{title}</Text>
          <Text as="span" variant="body2" color={{ light: 'grey4', dark: 'grey6' }}>
            {subtitle.part1} <span className={asteriskStyle}>*</span> {subtitle.part2}
          </Text>
        </Stack>
        <Stack spacing="gap-y-3" fullWidth>
          <Stack customStyle="relative h-24 rounded-2xl bg-grey6" fullWidth>
            <Stack customStyle="absolute w-16 h-16 left-4 -bottom-8 rounded-2xl bg-grey8" />
          </Stack>

          {extensionData.applicationType === AkashaAppApplicationType.Plugin && (
            <AppInfoPill
              background={{ light: 'tertiaryLight', dark: 'tertiaryDark' }}
              customStyle="w-fit self-end"
            >
              <Icon
                size="sm"
                icon={<Plugin />}
                color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                solid={true}
              />
              <Text variant="footnotes2" color={{ light: 'secondaryLight', dark: 'white' }}>
                {pluginLabel}
              </Text>
            </AppInfoPill>
          )}
        </Stack>

        <Section title={extensionId} required>
          <Text variant="body2">{extensionData.id}</Text>
        </Section>

        <Section title={extensionDisplayName}>
          <Text variant="body2">{extensionData.displayName}</Text>
        </Section>

        <Section title={sourceFileLabel} required>
          <Link to={extensionData.github} target="_blank">
            <Text variant="body2" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
              {extensionData.github}
            </Text>
          </Link>
        </Section>

        <Section title={nsfwLabel} required hasToggle isToggleChecked={extensionData.nsfw}>
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
            contentNode={<Text variant="body2">{extensionData.description}</Text>}
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
                  images={extensionData.gallery.slice(0, 3).map((image, idx) => ({
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
            titleNode={getAccordionTitleNode(documentationLabel)}
            contentNode={
              <Stack spacing="gap-y-3">
                {extensionData.links.map(link => (
                  <Stack key={`${link.label} ${link.href}`}>
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
                <Text variant="button-md">{extensionData.license.name}</Text>
                <Text variant="body2">{extensionData.license.description}</Text>
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
                {extensionData.contributors.map(el => (
                  <ProfileAvatarButton key={el.label + el.profileId} {...el} />
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
            contentNode={<Text variant="body2">{extensionData.contactInfo}</Text>}
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
                {extensionData.tags.map((tag, idx) => (
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
        <Button variant="text" label={backButtonLabel} onClick={onClickBack} />
        <Button
          variant="primary"
          label={publishButtonLabel}
          onClick={onClickPublish}
          customStyle="w-36"
        />
      </Stack>
    </>
  );
};

export default ReviewAndPublish;
