import React, { useCallback, useEffect, useState } from 'react';
import AutoComplete from '@akashaorg/design-system-core/lib/components/AutoComplete';
import {
  CheckIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { apply, tw } from '@twind/core';
import { ButtonType } from '../types/common.types';
import { AkashaProfileInterestsLabeled } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type EditInterestsProps = {
  title: string;
  subTitle: string;
  description: string;
  moreInterestTitle: string;
  moreInterestDescription: string;
  moreInterestPlaceholder: string;
  myInterests: AkashaProfileInterestsLabeled[];
  interests: AkashaProfileInterestsLabeled[];
  labelType: string;
  maxInterestsErrorMessage: string;
  cancelButton: ButtonType;
  saveButton: {
    label: string;
    loading?: boolean;
    handleClick: (interests: AkashaProfileInterestsLabeled[]) => void;
  };
  maxInterests: number;
  customStyle?: string;
  onFormDirty?: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditInterests: React.FC<EditInterestsProps> = ({
  title,
  subTitle,
  description,
  moreInterestTitle,
  moreInterestDescription,
  moreInterestPlaceholder,
  myInterests,
  interests,
  labelType,
  maxInterestsErrorMessage,
  cancelButton,
  saveButton,
  maxInterests,
  customStyle = '',
  onFormDirty,
}) => {
  const [query, setQuery] = useState('');
  const [myActiveInterests, setMyActiveInterests] = useState(new Set(myInterests));
  const [allMyInterests, setAllMyInterests] = useState(new Set(myInterests));
  const [tags, setTags] = useState(new Set<string>());

  React.useEffect(() => {
    setMyActiveInterests(new Set(myInterests));
    setAllMyInterests(new Set(myInterests));
  }, [myInterests]);

  const updateMyActiveInterests = (interest: AkashaProfileInterestsLabeled, remove?: boolean) => {
    const newMyActiveInterests = new Set(myActiveInterests);
    if (remove) {
      newMyActiveInterests.delete(interest);
      setMyActiveInterests(newMyActiveInterests);
      return;
    }
    setMyActiveInterests(newMyActiveInterests.add(interest));
  };

  const updateAllMyInterests = (interest: AkashaProfileInterestsLabeled) => {
    setAllMyInterests(new Set(allMyInterests).add(interest));
  };

  const onSave = (interests: AkashaProfileInterestsLabeled[]) => {
    saveButton.handleClick(interests);
    setTags(null);
    setQuery('');
  };

  const tagsSize = tags?.size || 0;

  const isFormDirty =
    allMyInterests.size !== myInterests.length ||
    myActiveInterests.size !== myInterests.length ||
    tagsSize > 0 ||
    !!query;

  useEffect(() => {
    if (onFormDirty) onFormDirty(isFormDirty);
  }, [isFormDirty, onFormDirty]);

  const findInterest = useCallback(
    (value: string) => {
      return [...allMyInterests].find(
        interest => interest.value.toLowerCase() === value.toLocaleLowerCase(),
      );
    },
    [allMyInterests],
  );
  const getNewInterest = useCallback(() => {
    if (query) {
      const foundInterest = findInterest(query);
      if (!foundInterest) {
        return { value: query, labelType };
      }
    }
    return null;
  }, [query, labelType, findInterest]);

  const maximumInterestsSelected = myActiveInterests.size + tagsSize >= maxInterests;

  return (
    <form className={tw(apply`h-full ${customStyle}`)}>
      <Stack direction="column" justify="between" spacing="gap-y-11" customStyle="h-full">
        <Stack direction="column">
          <Stack direction="row" align="center" spacing="gap-x-1">
            <Text variant="h6">{title}</Text>
            <Text variant="footnotes2" color="grey7">
              {subTitle}
            </Text>
          </Stack>
          <Text variant="subtitle2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
            {description}
          </Text>
          <Stack direction="row" spacing="gap-2" customStyle="flex-wrap mt-2">
            {[...allMyInterests].map((interest, index) => (
              <Pill
                key={`${index}-${interest.value}`}
                label={interest.value}
                icon={myActiveInterests.has(interest) ? <CheckIcon /> : null}
                iconDirection="right"
                active={myActiveInterests.has(interest)}
                hover={
                  myActiveInterests.has(interest) ? { icon: <XMarkIcon />, active: false } : null
                }
                onPillClick={active => {
                  if (active) {
                    updateMyActiveInterests(interest);
                    return;
                  }
                  updateMyActiveInterests(interest, true);
                }}
                type="action"
              />
            ))}
          </Stack>
        </Stack>
        <Stack direction="column">
          <Text variant="h6">{moreInterestTitle}</Text>
          <Text variant="subtitle2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
            {moreInterestDescription}
          </Text>
          <AutoComplete
            value={query}
            options={interests.map(interest => interest.value)}
            placeholder={moreInterestPlaceholder}
            tags={tags}
            separators={['Comma', 'Space', 'Enter']}
            customStyle="grow mt-2"
            caption={maximumInterestsSelected ? maxInterestsErrorMessage : null}
            status={maximumInterestsSelected ? 'error' : null}
            onSelected={({ index }) => {
              updateMyActiveInterests(interests[index]);
              updateAllMyInterests(interests[index]);
              setQuery('');
            }}
            onChange={value => {
              if (typeof value === 'string') {
                setQuery(value);
                return;
              }
              setTags(new Set(value));
            }}
            disabled={maximumInterestsSelected}
            multiple
          />
        </Stack>
        <Stack direction="row" spacing="gap-x-2" customStyle="ml-auto mt-auto">
          <Button
            variant="text"
            label={cancelButton.label}
            onClick={cancelButton.handleClick}
            disabled={cancelButton.disabled}
          />
          <Button
            variant="primary"
            loading={saveButton.loading}
            label={saveButton.label}
            onClick={event => {
              event.preventDefault();
              const newInterest = getNewInterest();
              const newTags = tags
                ? [...tags]
                    .filter(tag => !findInterest(tag))
                    .map(tag => ({ value: tag, labelType }))
                : [];
              onSave(
                newInterest
                  ? [...myActiveInterests, ...newTags, newInterest]
                  : [...myActiveInterests, ...newTags],
              );
            }}
            disabled={!isFormDirty}
            type="submit"
          />
        </Stack>
      </Stack>
    </form>
  );
};

export default EditInterests;
