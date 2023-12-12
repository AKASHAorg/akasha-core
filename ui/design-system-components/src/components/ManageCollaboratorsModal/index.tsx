import React from 'react';
import { tw } from '@twind/core';

import type { Image, Profile } from '@akashaorg/typings/lib/ui';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { XMarkIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import ImageComponent from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import Collaborator from './collaborator';
import SearchBar, { SearchBarProps } from '../SearchBar';

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
    <div
      className={tw(
        `fixed w-screen h-screen top-0 left-0 z-50 bg-black/60 flex justify-center items-center`,
      )}
    >
      <div className={tw(`w-full sm:w-1/2 md:w-1/3 flex h-full justify-center`)}>
        <Card>
          <div
            className={tw(`flex flex-row mt-1 items-start px-4 pt-2 border(b grey8 dark:grey3)`)}
          >
            <Text variant="h2" customStyle="mb-4 mx-auto">
              {titleLabel}
            </Text>
            <button onClick={closeModal}>
              <Icon icon={<XMarkIcon />} />{' '}
            </button>
          </div>
          <div className={tw(`flex p-4 gap-4 overflow-y-auto block`)}>
            <SearchBar
              inputValue={inputValue}
              inputPlaceholderLabel={inputPlaceholderLabel}
              onInputChange={onInputChange}
              onSearch={onSearch}
              searchInputSize="large"
              iconSize="sm"
            />

            <div className={tw(`flex w-full p-4 gap-4`)}>
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
            </div>

            {!collaborators.length && (
              <div className={tw(`flex w-full gap-2`)}>
                <div className={tw(`w-60 h-60 self-center`)}>
                  <ImageComponent
                    customStyle="object-contain"
                    src={`${publicImgPath}/${assetName}.${assetExtension}`}
                  />
                </div>
                <Text variant="h4" align="center">
                  {noCollaboratorsLabel}
                </Text>
              </div>
            )}
            {!!collaborators.length && (
              <div className={tw(`flex w-full gap-4`)}>
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
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManageCollaboratorsModal;
