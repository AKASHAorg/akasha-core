import React, { ChangeEvent, SetStateAction, useState } from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { AkashaProfile, Image } from '@akashaorg/typings/lib/ui';
import SearchBar from '../../SearchBar';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import { TrashIcon } from '@heroicons/react/24/outline';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

export type CollaboratorsProps = {
  contributorsFieldLabel: string;
  contributorsDescriptionLabel: string;
  extensionContributorsLabel: string;
  addButtonLabel: string;
  contributorsSearchPlaceholderLabel: string;
  customStyle?: string;
  contributors: AkashaProfile[];
  handleGetContributors: (query: string) => void;
  transformSource: (src: Image) => Image;
  addedContributors: AkashaProfile[];
  setAddedContributors: React.Dispatch<SetStateAction<AkashaProfile[]>>;
};

export const Collaborators: React.FC<CollaboratorsProps> = ({
  contributorsFieldLabel,
  contributorsDescriptionLabel,
  contributorsSearchPlaceholderLabel,
  extensionContributorsLabel,
  addButtonLabel,
  customStyle,
  contributors,
  handleGetContributors,
  transformSource,
  addedContributors,
  setAddedContributors,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autoCompleteRef = useCloseActions(() => {
    setShowSuggestions(false);
  });

  const [searchValue, setSearchValue] = useState('');

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const query = ev.currentTarget.value;
    setSearchValue(query);
    handleGetContributors(query);
    setShowSuggestions(true);
  };

  const handleAddContributor = (profile: AkashaProfile) => {
    if (addedContributors?.length < 16) {
      setAddedContributors(prev => {
        const res = Array.from(new Set([...prev, profile]));
        return res;
      });
      setSearchValue('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveContributor = (profile: AkashaProfile) => {
    setAddedContributors(prev => prev.filter(addedProfile => profile.id !== addedProfile?.id));
  };

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle={customStyle}>
      <Stack spacing="gap-y-1" direction="column">
        <Stack direction="row" spacing="gap-x-2" justify="between" align="center">
          <Text variant="h6">{contributorsFieldLabel}</Text>
        </Stack>
        <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
          {contributorsDescriptionLabel}
        </Text>
      </Stack>
      <Stack
        direction="column"
        justify="center"
        spacing="gap-y-2"
        customStyle={customStyle}
        ref={autoCompleteRef}
      >
        <SearchBar
          inputPlaceholderLabel={contributorsSearchPlaceholderLabel}
          fullWidth
          inputValue={searchValue}
          onInputChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
        />
        {showSuggestions && contributors?.length > 0 && searchValue?.length > 1 && (
          <Stack direction="row" customStyle={'relative'}>
            <Card
              radius={20}
              padding={16}
              elevation="2"
              customStyle="absolute max-h-96 w-full overflow-y-auto scrollbar z-10"
            >
              <Stack direction="column" spacing="gap-2">
                {contributors?.map((profile, index) => (
                  <Stack key={index} direction="row" justify="between" align="center">
                    <ProfileAvatarButton
                      profileId={profile?.did?.id}
                      label={profile?.name}
                      avatar={transformSource(profile?.avatar?.default)}
                      alternativeAvatars={profile?.avatar?.alternatives?.map(alternative =>
                        transformSource(alternative),
                      )}
                    />
                    <Button label={addButtonLabel} onClick={() => handleAddContributor(profile)} />
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Stack>
        )}
        {addedContributors?.length > 0 && (
          <Stack spacing="gap-4">
            <Text variant="h6">{extensionContributorsLabel}</Text>
            <Stack direction="column" spacing="gap-4">
              {addedContributors?.map((profile, index) => (
                <Stack key={index} direction="row" justify="between" align="center" spacing="gap-2">
                  <ProfileAvatarButton
                    profileId={profile?.did?.id}
                    label={profile?.name}
                    avatar={transformSource(profile?.avatar?.default)}
                    alternativeAvatars={profile?.avatar?.alternatives?.map(alternative =>
                      transformSource(alternative),
                    )}
                  />
                  <Button plain onClick={() => handleRemoveContributor(profile)}>
                    <Icon
                      icon={<TrashIcon />}
                      solid={false}
                      size="md"
                      color={{ light: 'errorLight', dark: 'errorDark' }}
                    />
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
