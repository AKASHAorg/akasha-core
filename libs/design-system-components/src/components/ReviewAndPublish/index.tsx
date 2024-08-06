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
import Link from '@akashaorg/design-system-core/lib/components/Link';
import { Plugin } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';
import { AppInfoPill } from '../AppInfo/info-pill';
import Stepper from '../Stepper';
import { Color } from '@akashaorg/design-system-core/lib/components/types/common.types';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils';

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
  contributors: string[];
};

export type ReviewAndPublishProps = {
  extensionData: ExtensionData;
  title: string;
  pluginLabel: string;
  extensionId: string;
  extensionDisplayName: string;
  githubRepoLabel: string;
  nsfwLabel: string;
  nsfwDescription: string;
  activeAccordionId: string;
  descriptionLabel: string;
  galleryLabel: string;
  documentationLabel: string;
  licenseLabel: string;
  contributorsLabel: string;
  contactInfoLabel: string;
  backButtonLabel: string;
  publishButtonLabel: string;
  onToggleNSFW: () => void;
  onAccordionClick: () => void;
  onClickBack: () => void;
  onClickPublish: () => void;
};

const ReviewAndPublish: React.FC<ReviewAndPublishProps> = props => {
  const {
    extensionData,
    title,
    pluginLabel,
    extensionId,
    extensionDisplayName,
    githubRepoLabel,
    nsfwLabel,
    nsfwDescription,
    activeAccordionId,
    descriptionLabel,
    galleryLabel,
    documentationLabel,
    licenseLabel,
    contributorsLabel,
    contactInfoLabel,
    backButtonLabel,
    publishButtonLabel,
    onToggleNSFW,
    onAccordionClick,
    onClickBack,
    onClickPublish,
  } = props;

  const asteriskColor: Color = { light: 'errorLight', dark: 'errorDark' };

  const getAccordionTitleNode = (label: string, isRequired = true) => {
    return (
      <Stack direction="row" spacing="gap-x-1" align="center">
        <Icon icon={<CheckCircleIcon />} solid={true} color="success" />
        <Text variant="h6">
          {label}
          {isRequired && (
            <sup
              className={tw(
                `-top-0.5 left-1 text-base ${getColorClasses({ light: 'errorLight', dark: 'errorDark' }, 'text')}`,
              )}
            >
              *
            </sup>
          )}
        </Text>
      </Stack>
    );
  };

  return (
    <Card padding={0}>
      <Stack padding="p-4 pb-6" spacing="gap-y-4">
        <Stack spacing="gap-y-4" align="center">
          <Stepper length={4} currentStep={4} />
          <Text variant="h5">{title}</Text>
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

        <TextField
          type="text"
          readOnly={true}
          required={true}
          id={extensionId}
          name={extensionId}
          label={extensionId}
          value={extensionData.id}
          requiredFieldAsteriskColor={asteriskColor}
        />
        <Divider />

        <TextField
          type="text"
          readOnly={true}
          required={true}
          id={extensionDisplayName}
          name={extensionDisplayName}
          label={extensionDisplayName}
          value={extensionData.displayName}
          requiredFieldAsteriskColor={asteriskColor}
        />
        <Divider />

        <TextField
          type="text"
          readOnly={true}
          required={true}
          id={githubRepoLabel}
          name={githubRepoLabel}
          label={githubRepoLabel}
          value={extensionData.github}
          requiredFieldAsteriskColor={asteriskColor}
        />
        <Divider />

        <Stack spacing="gap-y-2">
          <Stack direction="row" align="center" justify="between">
            <Text variant="h6">{nsfwLabel}</Text>
            <Toggle checked={extensionData.nsfw} onChange={onToggleNSFW} />
          </Stack>
          <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }}>
            {nsfwDescription}
          </Text>
        </Stack>
        <Divider />

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
            contentNode={<Text variant="body2">{extensionData.description}</Text>}
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
              <Stack spacing="gap-y-2">
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
            contentNode={<Text variant="body2">{extensionData.description}</Text>}
            handleClick={onAccordionClick}
          />
        </Stack>
        <Divider />
        <Stack spacing="gap-y-3">
          <Accordion
            accordionId={contactInfoLabel}
            open={contactInfoLabel === activeAccordionId}
            titleNode={getAccordionTitleNode(contactInfoLabel)}
            contentNode={<Text variant="body2">{extensionData.contactInfo}</Text>}
            handleClick={onAccordionClick}
          />
        </Stack>
        <Divider />
      </Stack>

      <Divider />

      <Stack direction="row" padding="p-4" spacing="gap-x-2" align="center" justify="end">
        <Button variant="secondary" label={backButtonLabel} onClick={onClickBack} />
        <Button variant="primary" label={publishButtonLabel} onClick={onClickPublish} />
      </Stack>
    </Card>
  );
};

export default ReviewAndPublish;
