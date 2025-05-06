import React, { SyntheticEvent } from 'react';
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
import { AppImageSource, AppLinkSource } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { ButtonType } from '@akashaorg/design-system-components/lib/components/types/common.types';
import { NSFW } from '@akashaorg/design-system-components/lib/components/NSFW';
import { UsefulLinks } from './UsefulLinks';
import { Gallery, GalleryProps } from './Gallery';

export enum FieldName {
  nsfw = 'nsfw',
  description = 'description',
  gallery = 'gallery',
  links = 'links',
}

export type ExtensionEditStep2FormValues = {
  nsfw?: boolean;
  description?: string;
  gallery?: AppImageSource[];
  links?: (AppLinkSource & { _id?: number })[];
};

export type ExtensionEditStep2FormProps = {
  nsfwFieldLabel?: string;
  nsfwDescriptionLabel?: string;
  descriptionFieldLabel?: string;
  descriptionPlaceholderLabel?: string;
  usefulLinksFieldLabel?: string;
  usefulLinksDescriptionLabel?: string;
  linkTitleLabel?: string;
  linkPlaceholderLabel?: string;
  defaultValues?: ExtensionEditStep2FormValues;
  cancelButton: ButtonType;
  nextButton: {
    label: string;
    handleClick: (formData: ExtensionEditStep2FormValues) => void;
  };
  handleManageGalleryClick?: (formData: ExtensionEditStep2FormValues) => void;
} & Omit<GalleryProps, 'handleMediaClick'>;

const ExtensionEditStep2Form: React.FC<ExtensionEditStep2FormProps> = props => {
  const {
    defaultValues,
    cancelButton,
    nextButton,
    nsfwFieldLabel,
    nsfwDescriptionLabel,
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

  const form = useForm<ExtensionEditStep2FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const {
    control,
    getValues,
    trigger,
    formState: { errors },
  } = form;

  const isValid = !Object.keys(errors)?.length;

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

  return (
    <Form {...form}>
      <form onSubmit={onSave} className={`h-full`}>
        <Stack direction="column" spacing={4}>
          <Stack spacing={4} className="px-4 pb-16">
            <NSFW
              control={control}
              name={'nsfw'}
              nsfw={{ label: nsfwDescriptionLabel, initialValue: defaultValues.nsfw }}
              nsfwFieldLabel={nsfwFieldLabel}
              defaultValue={defaultValues.nsfw}
            />
            <Divider />

            <FormField
              control={control}
              name={FieldName.description}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{descriptionFieldLabel}</FormLabel>
                  <FormControl>
                    <Textarea
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
            <Button disabled={!isValid} onClick={onSave} type="submit">
              {nextButton.label}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Form>
  );
};

export default ExtensionEditStep2Form;

const schema = z.object({
  description: z
    .union([
      z
        .string()
        .trim()
        .min(30, { message: 'Must be at least 30 characters' })
        .max(2000, { message: 'Must be less than 2000 characters' }),
      z.string().length(0),
    ])
    .optional()
    .transform(e => (e === '' ? undefined : e)),
  nsfw: z.boolean().optional(),
  links: z
    .array(
      z.object({
        label: z
          .string()
          .trim()
          .min(4, { message: 'Must be at least 4 characters' })
          .max(24, { message: 'Must be less than 24 characters' }),
        href: z.string().url({ message: 'Must be URL' }),
      }),
    )
    .max(10, { message: 'Maximum 10 links' }),
});
