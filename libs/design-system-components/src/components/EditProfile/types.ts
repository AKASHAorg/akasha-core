import values from 'lodash/values';
import { Image } from '@akashaorg/typings/lib/ui';
import { FormState } from 'react-hook-form';

export type EditProfileFormValues = {
  name?: string;
  bio?: string;
  nsfw?: boolean;
  links: {
    id: string;
    href: string;
  }[];
  avatar?: Image | File;
  coverImage?: Image | File;
};

export function isFormWithExceptionOfLinksDirty(
  dirtyFields: FormState<EditProfileFormValues>['dirtyFields'],
) {
  const _dirtyFields = { ...dirtyFields };
  delete _dirtyFields.links;
  return values(_dirtyFields).flat().includes(true);
}

export function isFormExcludingAllExceptLinksDirty(
  linkDirtyFields: FormState<EditProfileFormValues>['dirtyFields']['links'],
  currentLinks: EditProfileFormValues['links'],
  defaultLinkValuesLength: number,
) {
  const areAllLinksEmpty =
    currentLinks?.length > 0 &&
    currentLinks.filter(link => !link.href).length === currentLinks.length;
  const isDefaultLinkRemoved =
    defaultLinkValuesLength > currentLinks?.filter(link => link.href)?.length;

  return (
    isDefaultLinkRemoved ||
    (currentLinks?.length > 0 &&
      !areAllLinksEmpty &&
      linkDirtyFields?.map(field => field.href)?.includes(true))
  );
}
