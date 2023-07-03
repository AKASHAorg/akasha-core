import React, { useEffect, useState } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import AutoComplete from '@akashaorg/design-system-core/lib/components/AutoComplete';
import { ButtonType } from '../types';
import { apply, tw } from '@twind/core';

const MAX_INTERESTS = 10;

export type InterestsProps = {
  title: string;
  description: string;
  moreInterestTitle: string;
  moreInterestDescription: string;
  moreInterestPlaceholder: string;
  myInterests: string[];
  interests: string[];
  cancelButton: ButtonType;
  saveButton: { label: string; loading?: boolean; handleClick: (interets: string[]) => void };
  customStyle?: string;
  onFormValid?: (valid: boolean) => void;
};

export const Interests: React.FC<InterestsProps> = ({
  title,
  description,
  moreInterestTitle,
  moreInterestDescription,
  moreInterestPlaceholder,
  myInterests,
  interests,
  cancelButton,
  saveButton,
  customStyle = '',
  onFormValid,
}) => {
  const [query, setQuery] = useState('');
  const [newInterests, setNewInterests] = useState(myInterests);
  const [myInterestsMap, setMyInterestsMap] = useState(new Map());

  const allMyInteretstsAreActive = !Array.from(myInterestsMap.values()).includes(false);

  const updateMyInterestMap = (k: string, v: boolean) => {
    setMyInterestsMap(new Map(myInterestsMap.set(k, v)));
  };

  const interestExists = (interests: string[], interest: string) =>
    interests.find(_interest => _interest.toLocaleLowerCase() === interest.toLocaleLowerCase());

  const onSave = (interets: string[]) => {
    saveButton.handleClick(
      interets.filter(interest =>
        myInterestsMap.has(interest) ? myInterestsMap.get(interest) : true,
      ),
    );
  };

  const validForm = allMyInteretstsAreActive && newInterests.length === myInterests.length;

  useEffect(() => {
    if (onFormValid) onFormValid(validForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validForm]);

  return (
    <form className={tw(apply`h-full ${customStyle}`)}>
      <Stack direction="column" justify="between" spacing="gap-y-11" customStyle="h-full">
        <Stack direction="column">
          <Text variant="h6">{title}</Text>
          <Text variant="subtitle2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
            {description}
          </Text>
          <Stack spacing="gap-2" customStyle="flex-wrap mt-2">
            {newInterests.map(myInterest => (
              <Pill
                key={myInterest}
                label={myInterest}
                icon="CheckIcon"
                iconDirection="right"
                active={true}
                onPillClick={active => updateMyInterestMap(myInterest, !active)}
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
            options={interests}
            placeholder={moreInterestPlaceholder}
            customStyle="grow mt-2"
            onSelected={(interest: string) => {
              setNewInterests(interests =>
                interestExists(interests, interest) ? interests : [...interests, interest],
              );
              setQuery('');
            }}
            onChange={setQuery}
            disabled={newInterests.length >= MAX_INTERESTS}
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
            onClick={() => onSave(newInterests)}
            disabled={validForm}
            type="submit"
          />
        </Stack>
      </Stack>
    </form>
  );
};
