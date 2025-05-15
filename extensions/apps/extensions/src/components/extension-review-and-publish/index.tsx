import React, { ReactElement, useMemo } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@akashaorg/ui/lib/components/accordion';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { ExtensionTypeIcon } from '@akashaorg/ui/lib/akasha-components/extension-type-icon';

import Label from '@akashaorg/design-system-core/lib/components/Label';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import Section from './section';
import { AppInfoPill } from '../app-info/info-pill';
import ExtensionImageGallery from '../extension-image-gallery';
import { Extension, Image } from '@akashaorg/typings/lib/ui';
import AppAvatar from '@akashaorg/design-system-core/lib/components/AppAvatar';
import { getImageFromSeed } from '@akashaorg/design-system-core/lib/utils';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { cssVars } from '@akashaorg/ui/lib/library/to-css-var';
export type ExtensionReviewAndPublishProps = {
  extensionData: Extension;
  title: string;
  subtitle: {
    part1: string;
    part2: string;
  };
  extensionNameLabel: string;
  extensionDisplayNameLabel: string;
  nsfwLabel: string;
  nsfwDescription: string;
  descriptionLabel: string;
  galleryLabel: string;
  imageUploadedLabel: string;
  imageNotLoadedLabel: string;
  viewAllLabel: string;
  usefulLinksLabel: string;
  licenseLabel: string;
  contributorsLabel: string;
  tagsLabel: string;
  backButtonLabel: string;
  publishButtonLabel: string;
  duplicateExtNameErrLabel?: string;
  publicImagePath?: string;
  loading?: boolean;
  isDuplicateExtName?: boolean;
  contributorsUi: ReactElement;
  needToMakeChangesLabel: string;
  editExtension: {
    handleClick: () => void;
    label;
  };
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
    imageNotLoadedLabel,
    viewAllLabel,
    usefulLinksLabel,
    licenseLabel,
    contributorsLabel,
    tagsLabel,
    backButtonLabel,
    publishButtonLabel,
    duplicateExtNameErrLabel,
    publicImagePath = '/images',
    loading,
    isDuplicateExtName,
    contributorsUi,
    needToMakeChangesLabel,
    editExtension,
    onViewGalleryClick,
    onClickCancel,
    onClickSubmit,
    transformSource,
  } = props;
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
      !extensionData?.description ||
      extensionData?.keywords?.length === 0 ||
      isDuplicateExtName,
    [extensionData, isDuplicateExtName],
  );

  const getAccordionTitleNode = (title: string, fieldHasData: boolean, isRequired = true) => {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        {fieldHasData ? (
          <CheckCircleIcon className="h-5 w-5 [&>*]:fill-success" />
        ) : (
          <XCircleIcon className="h-5 w-5 [&>*]:stroke-warningLight dark:[&>*]:stroke-warningDark" />
        )}
        <Label required={isRequired}>{title}</Label>
      </Stack>
    );
  };
  const galleryImagesWithSource = useMemo(
    () => extensionData?.gallery?.map(img => transformSource(img)) || [],
    [extensionData?.gallery, transformSource],
  );
  const asteriskStyle = `-top-0.5 left-1 text-base text-errorLight dark:text-errorDark`;
  return (
    <>
      <Stack spacing={4} className="p-4 mb-4 w-full">
        <Typography variant="sm" className="text-grey4 dark:text-grey6">
          {subtitle.part1} <span className={asteriskStyle}>*</span> {subtitle.part2}
        </Typography>

        <Stack spacing={3} className="w-full">
          <Stack
            style={cssVars({
              '--background-url': `url('${backgroundUrl}')`,
            })}
            className={`relative h-24 rounded-2xl  bg-center bg-no-repeat bg-cover bg-(image:--background-url)`}
          >
            <AppAvatar
              appType={extensionData?.applicationType}
              avatar={transformSource(extensionData?.logoImage)}
              extensionId={extensionData?.id}
              customStyle="absolute left-4 -bottom-8"
            />
          </Stack>

          <AppInfoPill customStyle="w-fit self-end bg-tertiaryLight dark:bg-tertiaryDark">
            <ExtensionTypeIcon extensionType={extensionData?.applicationType} />
            <Typography variant="xs" className="font-medium text-secondaryLight dark:text-white">
              {extensionData?.applicationType}
            </Typography>
          </AppInfoPill>
        </Stack>

        <Section title={extensionNameLabel} required>
          <Typography variant="sm" className="truncate">
            {extensionData?.name}
          </Typography>
          {isDuplicateExtName && (
            <Typography variant="sm" className="text-errorLight dark:text-errorDark">
              {duplicateExtNameErrLabel}
            </Typography>
          )}
        </Section>

        <Section title={extensionDisplayNameLabel} required>
          <Typography variant="sm" className="truncate">
            {extensionData?.displayName}
          </Typography>
        </Section>

        <Section title={nsfwLabel} required hasToggle isToggleChecked={extensionData?.nsfw}>
          <Typography variant="sm" className="text-grey4 dark:text-grey6">
            {nsfwDescription}
          </Typography>
        </Section>

        {/* wrap each accordion in a Stack to guard against the main wrapper's spacing */}
        <Stack spacing={3}>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={descriptionLabel} disabled={!extensionData?.description}>
              <AccordionTrigger className="hover:no-underline py-2">
                {getAccordionTitleNode(descriptionLabel, !!extensionData?.description)}
              </AccordionTrigger>
              <AccordionContent>
                <Typography variant="sm" className="break-all">
                  {extensionData?.description}
                </Typography>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Stack>
        <Separator />

        <Stack spacing={3}>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={galleryLabel} disabled={!galleryImagesWithSource?.length}>
              <AccordionTrigger className="hover:no-underline py-2">
                {getAccordionTitleNode(galleryLabel, galleryImagesWithSource?.length > 0, false)}
              </AccordionTrigger>
              <AccordionContent>
                <Stack spacing={3}>
                  <ExtensionImageGallery
                    imageNotLoadedLabel={imageNotLoadedLabel}
                    images={galleryImagesWithSource?.slice(0, 3).map((image, idx) => ({
                      src: image?.src,
                      size: {
                        width: image?.width,
                        height: image?.height,
                      },
                      name: image?.src + idx,
                    }))}
                    showOverlay={false}
                    toggleOverlay={() => ({})}
                  />
                  <Stack direction="row" alignItems="center" justifyContent="between">
                    <Typography variant="xs" className="font-medium text-grey4 dark:text-grey7">
                      {`${galleryImagesWithSource?.length} ${imageUploadedLabel}`}
                    </Typography>
                    <Button variant="link" onClick={onViewGalleryClick}>
                      {viewAllLabel}
                    </Button>
                  </Stack>
                </Stack>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Stack>
        <Separator />

        <Stack spacing={3}>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={usefulLinksLabel} disabled={!extensionData?.links?.length}>
              <AccordionTrigger className="hover:no-underline py-2">
                {getAccordionTitleNode(usefulLinksLabel, extensionData?.links?.length > 0, false)}
              </AccordionTrigger>
              <AccordionContent>
                <Stack spacing={3}>
                  {extensionData?.links?.map((link, index) => (
                    <Stack key={index}>
                      <Typography variant="sm" bold>
                        {link.label}
                      </Typography>
                      <Link to={link.href} target="_blank">
                        <Typography
                          variant="sm"
                          className="text-secondaryLight dark:text-secondaryDark"
                        >
                          {link.href}
                        </Typography>
                      </Link>
                    </Stack>
                  ))}
                </Stack>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Stack>
        <Separator />

        <Stack spacing={3}>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={licenseLabel} disabled={!extensionData?.license}>
              <AccordionTrigger className="hover:no-underline py-2">
                {getAccordionTitleNode(licenseLabel, !!extensionData?.license)}
              </AccordionTrigger>
              <AccordionContent>
                <Stack>
                  <Typography variant="sm" bold>
                    {extensionData?.license}
                  </Typography>
                </Stack>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Stack>
        <Separator />

        <Stack spacing={3}>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value={contributorsLabel}
              disabled={!extensionData?.contributors?.length}
            >
              <AccordionTrigger className="hover:no-underline py-2">
                {getAccordionTitleNode(
                  contributorsLabel,
                  extensionData?.contributors?.length > 0,
                  false,
                )}
              </AccordionTrigger>
              <AccordionContent>{contributorsUi}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Stack>
        <Separator />

        <Stack spacing={3}>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={tagsLabel} disabled={!extensionData?.keywords?.length}>
              <AccordionTrigger className="hover:no-underline py-2">
                {getAccordionTitleNode(tagsLabel, extensionData?.keywords?.length > 0)}
              </AccordionTrigger>
              <AccordionContent>
                <Stack direction="row" spacing={2} className="flex-wrap">
                  {extensionData?.keywords?.map((tag, idx) => (
                    <Pill key={tag + idx} label={tag} type="action" />
                  ))}
                </Stack>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Stack>
        <Card className="p-3 bg-nested-card">
          <Stack alignItems="center" direction="row" spacing={2}>
            <Typography variant="xs" bold>
              {needToMakeChangesLabel}
            </Typography>
            <Button
              variant="outline"
              size="sm"
              onClick={editExtension.handleClick}
              className="ml-auto"
            >
              {editExtension.label}
            </Button>
          </Stack>
        </Card>
      </Stack>

      <Separator />

      <Stack direction="row" spacing={2} alignItems="center" justifyContent="end" className="p-4">
        <Button variant="link" onClick={onClickCancel}>
          {backButtonLabel}
        </Button>
        <Button
          loading={loading}
          disabled={disablePublish || loading}
          onClick={onClickSubmit}
          className="w-36"
        >
          {publishButtonLabel}
        </Button>
      </Stack>
    </>
  );
};
export default ExtensionReviewAndPublish;
