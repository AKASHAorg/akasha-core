import React, { SyntheticEvent, useState } from 'react';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@akashaorg/ui/lib/akasha-components/form';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Textarea } from '@akashaorg/ui/lib/akasha-components/textarea';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ButtonType } from '@akashaorg/design-system-components/lib/components/types/common.types';
import { Header, HeaderProps } from '../extension-edit-step1-form/Header/index';
import { UsefulLinks } from '../extension-edit-step2-form/UsefulLinks';
import { Gallery, GalleryProps } from '../extension-edit-step2-form/Gallery';
import { Image } from '@akashaorg/typings/lib/ui';
import {
  AkashaAppApplicationType,
  AppImageSource,
  AppLinkSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export enum FieldName {
  logoImage = 'logoImage',
  coverImage = 'coverImage',
  description = 'description',
  gallery = 'gallery',
  links = 'links',
}
export type ExtensionEditPublishedFormValues = {
  logoImage?: Image | File | null;
  coverImage?: Image | File | null;
  description?: string;
  gallery?: AppImageSource[];
  links?: (AppLinkSource & {
    _id?: number;
  })[];
};
export type ExtensionEditPublishedFormProps = {
  header: Omit<HeaderProps, 'onLogoImageChange' | 'onCoverImageChange'>;
  defaultValues?: ExtensionEditPublishedFormValues;
  displayOnlyValues?: {
    name: string;
    displayName: string;
    license: string;
    applicationType: AkashaAppApplicationType;
    nsfw: boolean;
  };
  cancelButton: ButtonType;
  nextButton: {
    label: string;
    handleClick: (data: ExtensionEditPublishedFormValues) => void;
  };
  loading?: boolean;
  extensionInformationLabel?: string;
  extensionInformationDescriptionLabel?: string;
  extensionIdLabel?: string;
  extensionDisplayNameLabel?: string;
  extensionLicenseLabel?: string;
  descriptionFieldLabel?: string;
  descriptionPlaceholderLabel?: string;
  usefulLinksFieldLabel?: string;
  usefulLinksDescriptionLabel?: string;
  linkTitleLabel?: string;
  linkPlaceholderLabel?: string;
  handleManageGalleryClick?: (formData: ExtensionEditPublishedFormValues) => void;
} & Omit<GalleryProps, 'handleMediaClick'>;
const ExtensionEditPublishedForm: React.FC<ExtensionEditPublishedFormProps> = props => {
  const {
    header,
    defaultValues,
    displayOnlyValues,
    cancelButton,
    nextButton,
    loading,
    extensionInformationLabel,
    extensionInformationDescriptionLabel,
    extensionIdLabel,
    extensionDisplayNameLabel,
    extensionLicenseLabel,
    descriptionFieldLabel,
    descriptionPlaceholderLabel,
    galleryFieldLabel,
    galleryDescriptionLabel,
    usefulLinksFieldLabel,
    usefulLinksDescriptionLabel,
    linkTitleLabel,
    linkPlaceholderLabel,
    addLabel,
    updateGalleryLabel,
    imagesUploadedLabel,
    images,
    maxGalleryImages,
    handleManageGalleryClick,
  } = props;
  const form = useForm<ExtensionEditPublishedFormValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const {
    control,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = form;
  const isValid = !Object.keys(errors).length;
  const onSave = (event: SyntheticEvent) => {
    event.preventDefault();
    const formValues = getValues();
    if (isValid) {
      nextButton.handleClick({
        ...formValues,
        links: formValues.links
          ?.map(link => {
            if (link.href && link.label) {
              return {
                href: link.href,
                label: link.label,
              };
            }
            return null;
          })
          .filter(link => link),
      });
    }
  };
  const [showAccordion, setShowAccordion] = useState(false);
  const handleToggleAccordion = () => {
    setShowAccordion(!showAccordion);
  };
  return (
    <Form {...form}>
      <form onSubmit={onSave} className={`h-full`}>
        <Stack direction="column" spacing={4}>
          <Stack className="pt-4 px-4">
            <Header
              {...header}
              extensionType={displayOnlyValues.applicationType}
              nsfw={displayOnlyValues.nsfw}
              showExtraInfo={true}
              onLogoImageChange={logoImage => {
                setValue('logoImage', logoImage, {
                  shouldDirty: true,
                });
              }}
              onCoverImageChange={coverImage => {
                setValue('coverImage', coverImage, {
                  shouldDirty: true,
                });
              }}
            />
          </Stack>
          <Stack className="px-4">
            <Divider />
          </Stack>
          <Stack className="px-4">
            <Accordion
              accordionId={extensionInformationLabel}
              open={showAccordion}
              titleNode={
                <Typography variant="h6" bold>
                  {extensionInformationLabel}
                </Typography>
              }
              contentNode={
                <Stack spacing={4}>
                  <Typography variant="xs" className="font-medium text-grey4 dark:text-grey6">
                    {extensionInformationDescriptionLabel}
                  </Typography>
                  <Stack spacing={4}>
                    <Stack spacing={2}>
                      <Typography variant="h6" bold>
                        {extensionIdLabel}
                      </Typography>
                      <Typography variant="sm">{displayOnlyValues?.name}</Typography>
                    </Stack>
                    <Divider />
                    <Stack spacing={2}>
                      <Typography variant="h6" bold>
                        {extensionDisplayNameLabel}
                      </Typography>
                      <Typography variant="sm">{displayOnlyValues?.displayName}</Typography>
                    </Stack>
                    <Divider />
                    <Stack spacing={2}>
                      <Typography variant="h6" bold>
                        {extensionLicenseLabel}
                      </Typography>
                      <Typography variant="sm">{displayOnlyValues?.license}</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              }
              handleClick={handleToggleAccordion}
            />
          </Stack>
          <Stack spacing={4} className="px-4 pb-16">
            <Divider />
            <FormField
              control={control}
              name={FieldName.description}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{descriptionFieldLabel}</FormLabel>
                  <FormControl>
                    <Textarea
                      className="w-0 min-w-full"
                      placeholder={descriptionPlaceholderLabel}
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue={defaultValues.description}
            />
            <Divider />
            <Gallery
              galleryFieldLabel={galleryFieldLabel}
              galleryDescriptionLabel={galleryDescriptionLabel}
              addLabel={addLabel}
              updateGalleryLabel={updateGalleryLabel}
              imagesUploadedLabel={imagesUploadedLabel}
              images={images}
              maxGalleryImages={maxGalleryImages}
              handleMediaClick={() => handleManageGalleryClick(getValues())}
            />
            <Divider />

            <UsefulLinks
              usefulLinksTitleLabel={usefulLinksFieldLabel}
              usefulLinksDescriptionLabel={usefulLinksDescriptionLabel}
              linkElementLabel={linkTitleLabel}
              linkTitlePlaceholderLabel={linkPlaceholderLabel}
              addNewLinkButtonLabel={addLabel}
              control={control}
              onDeleteLink={async () => {
                await trigger();
              }}
            />
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="end" spacing={2} className="px-4 pb-4">
            <Button
              variant="link"
              onClick={cancelButton.handleClick}
              disabled={cancelButton.disabled}
            >
              {cancelButton.label}
            </Button>
            <Button loading={loading} disabled={!isValid || loading} onClick={onSave} type="submit">
              {nextButton.label}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Form>
  );
};
export default ExtensionEditPublishedForm;
const schema = z.object({
  logoImage: z.any().optional(),
  coverImage: z.any().optional(),
  description: z
    .union([
      z
        .string()
        .trim()
        .min(30, {
          message: 'Must be at least 30 characters',
        })
        .max(2000, {
          message: 'Must be less than 2000 characters',
        }),
      z.string().length(0),
    ])
    .optional()
    .transform(e => (e === '' ? undefined : e)),
  links: z
    .array(
      z.object({
        label: z
          .string()
          .trim()
          .min(4, {
            message: 'Must be at least 4 characters',
          })
          .max(24, {
            message: 'Must be less than 24 characters',
          }),
        href: z.string().url({
          message: 'Must be URL',
        }),
      }),
    )
    .max(10, {
      message: 'Maximum 10 links',
    }),
});
