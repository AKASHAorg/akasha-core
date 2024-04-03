import React from 'react';
import type { Image, Profile } from '@akashaorg/typings/lib/ui';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { XMarkIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import ImageComponent from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Collaborator from './collaborator';
import SearchBar, { SearchBarProps } from '../SearchBar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';

export type ManageCollaboratorsModalProps = Omit<SearchBarProps, 'searchInputSize' | 'iconSize'> & {
  assetName?: string;
  assetExtension?: string;
  publicImgPath?: string;
  titleLabel: string;
  collaborators: Profile[];
  searchResults: Profile[];
  noCollaboratorsLabel: string;
  noSearchItemsLabel: string;
  addButtonLabel: string;
  removeButtonLabel: string;
  closeModal: () => void;
  onClickCollaborator: (profileId: string, action: 'add' | 'remove') => () => void;
  transformSource: (src: Image) => Image;
};

const ManageCollaboratorsModal: React.FC<ManageCollaboratorsModalProps> = props => {
  const {
    assetName = 'no-collaborators',
    assetExtension = 'webp',
    publicImgPath = '/images',
    titleLabel,
    inputValue,
    inputPlaceholderLabel,
    collaborators,
    searchResults,
    noCollaboratorsLabel,
    noSearchItemsLabel,
    addButtonLabel,
    removeButtonLabel,
    onInputChange,
    onSearch,
    closeModal,
    onClickCollaborator,
    transformSource,
  } = props;

  return (
    <Stack
      align="center"
      justify="center"
      customStyle="fixed w-screen h-screen top-0 left-0 z-50 bg-black/60"
    >
      <Stack justify="center" fullWidth={true} customStyle="h-full sm:w-1/2 md:w-1/3 ">
        <Card>
          <Stack
            align="start"
            justify="center"
            direction="row"
            padding="pb-4"
            customStyle="mb-4 border(b grey8 dark:grey3)"
          >
            <Text variant="h3" align="center">
              {titleLabel}
            </Text>
            <Button plain={true} onClick={closeModal}>
              <Icon icon={<XMarkIcon />} />{' '}
            </Button>
          </Stack>

          <Stack spacing="gap-4" customStyle="overflow-y-auto">
            <SearchBar
              inputValue={inputValue}
              inputPlaceholderLabel={inputPlaceholderLabel}
              onInputChange={onInputChange}
              onSearch={onSearch}
              searchInputSize="large"
              iconSize="sm"
            />

            <Stack spacing="gap-4" fullWidth={true}>
              {!searchResults.length && <Text>{noSearchItemsLabel}</Text>}

              {!!searchResults.length &&
                searchResults.map(profile => (
                  <Collaborator
                    key={profile.name + profile.did.id}
                    profile={profile}
                    buttonLabel={addButtonLabel}
                    onClick={onClickCollaborator(profile.did.id, 'add')}
                    transformSource={transformSource}
                  />
                ))}
            </Stack>

            {!collaborators.length && (
              <Stack fullWidth={true} spacing="gap-2">
                <Stack customStyle="w-60 h-60 self-center">
                  <ImageComponent
                    customStyle="object-contain"
                    src={`${publicImgPath}/${assetName}.${assetExtension}`}
                  />
                </Stack>
                <Text variant="h4" align="center">
                  {noCollaboratorsLabel}
                </Text>
              </Stack>
            )}

            {!!collaborators.length && (
              <Stack fullWidth={true} spacing="gap-4">
                {collaborators.map(profile => (
                  <Collaborator
                    key={profile.name + profile.did.id}
                    profile={profile}
                    buttonLabel={removeButtonLabel}
                    isRed={true}
                    onClick={onClickCollaborator(profile.did.id, 'remove')}
                    transformSource={transformSource}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
};

export default ManageCollaboratorsModal;
