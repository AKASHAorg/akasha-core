import React, { useCallback, useEffect, useState } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import AutoComplete from '@akashaorg/design-system-core/lib/components/AutoComplete';
import { InterestsLabeled } from '@akashaorg/typings/sdk/graphql-types-new';
import { ButtonType } from '../types';
import { apply, tw } from '@twind/core';

const MAX_INTERESTS = 10;

export type InterestsProps = {
  title: string;
  description: string;
  moreInterestTitle: string;
  moreInterestDescription: string;
  moreInterestPlaceholder: string;
  myInterests: InterestsLabeled[];
  interests: InterestsLabeled[];
  labelType: string;
  cancelButton: ButtonType;
  saveButton: {
    label: string;
    loading?: boolean;
    handleClick: (interests: InterestsLabeled[]) => void;
  };
  customStyle?: string;
  onFormDirty?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Interests: React.FC<InterestsProps> = ({
  title,
  description,
  moreInterestTitle,
  moreInterestDescription,
  moreInterestPlaceholder,
  myInterests,
  interests,
  labelType,
  cancelButton,
  saveButton,
  customStyle = '',
  onFormDirty,
}) => {
  const [query, setQuery] = useState('');
  const [myActiveInterests, setMyActiveInterests] = useState(new Set(myInterests));
  const [allMyInterests, setAllMyInterests] = useState(new Set(myInterests));

  React.useEffect(() => {
    setMyActiveInterests(new Set(myInterests));
    setAllMyInterests(new Set(myInterests));
  }, [myInterests]);

  const updateMyActiveInterests = (interest: InterestsLabeled, remove?: boolean) => {
    const newMyActiveInterests = new Set(myActiveInterests);
    if (remove) {
      newMyActiveInterests.delete(interest);
      setMyActiveInterests(newMyActiveInterests);
      return;
    }
    setMyActiveInterests(newMyActiveInterests.add(interest));
  };

  const updateAllMyInterests = (interest: InterestsLabeled) => {
    setAllMyInterests(new Set(allMyInterests).add(interest));
  };

  const onSave = (interests: InterestsLabeled[]) => {
    saveButton.handleClick(interests);
    setQuery('');
  };

  const isFormDirty =
    allMyInterests.size !== myInterests.length ||
    myActiveInterests.size !== myInterests.length ||
    !!query;

  useEffect(() => {
    if (onFormDirty) onFormDirty(isFormDirty);
  }, [isFormDirty, onFormDirty]);

  const getNewInterest = useCallback(() => {
    if (query) {
      const foundInterest = [...allMyInterests].find(
        interest => interest.value.toLowerCase() === query.toLocaleLowerCase(),
      );
      if (!foundInterest) {
        return { value: query, labelType };
      }
    }
    return null;
  }, [query, labelType, allMyInterests]);

  return (
    <form className={tw(apply`h-full ${customStyle}`)}>
      <Stack direction="column" justify="between" spacing="gap-y-11" customStyle="h-full">
        <Stack direction="column">
          <Text variant="h6">{title}</Text>
          <Text variant="subtitle2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
            {description}
          </Text>
          <Stack spacing="gap-2" customStyle="flex-wrap mt-2">
            {[...allMyInterests].map(interest => (
              <Pill
                key={interest.value}
                label={interest.value}
                icon="CheckIcon"
                iconDirection="right"
                active={myActiveInterests.has(interest)}
                onPillClick={active => {
                  if (active) {
                    updateMyActiveInterests(interest);
                    return;
                  }
                  updateMyActiveInterests(interest, true);
                }}
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
            customStyle="grow mt-2"
            onSelected={({ index }) => {
              updateMyActiveInterests(interests[index]);
              updateAllMyInterests(interests[index]);
              setQuery('');
            }}
            onChange={setQuery}
            disabled={allMyInterests.size >= MAX_INTERESTS}
          />
        </Stack>
        <Stack spacing="gap-x-2" customStyle="ml-auto mt-auto">
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
              onSave(newInterest ? [...myActiveInterests, newInterest] : [...myActiveInterests]);
            }}
            disabled={!isFormDirty}
            type="submit"
          />
        </Stack>
      </Stack>
    </form>
  );
};
