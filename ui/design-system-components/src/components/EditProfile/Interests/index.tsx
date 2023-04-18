import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import AutoComplete from '@akashaorg/design-system-core/lib/components/AutoComplete';
import { ButtonType } from '../types';

export type InterestsProps = {
  title: string;
  description: string;
  moreInterestTitle: string;
  moreInterestDescription: string;
  moreInterestPlaceholder: string;
  myInterests: string[];
  interests: string[];
  cancelButton: ButtonType;
  saveButton: { label: string; handleClick: () => void };
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
}) => {
  return (
    <Stack direction="column" justify="between" spacing="gap-y-4">
      <Stack direction="column">
        <Text variant="h6">{title}</Text>
        <Text variant="subtitle2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
          {description}
        </Text>
        <Stack spacing="gap-2" customStyle="flex-wrap mt-2">
          {myInterests.map(myInterest => (
            <Button
              key={myInterest}
              label={myInterest}
              variant="secondary"
              icon="CheckIcon"
              iconDirection="right"
              active={true}
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
          type="text"
          options={interests}
          placeholder={moreInterestPlaceholder}
          customStyle="grow mt-2"
        />
      </Stack>
      <Stack spacing="gap-x-2" customStyle="ml-auto mt-auto">
        <Button variant="text" label={cancelButton.label} onClick={cancelButton.handleClick} />
        <Button variant="primary" label={saveButton.label} type="submit" />
      </Stack>
    </Stack>
  );
};
