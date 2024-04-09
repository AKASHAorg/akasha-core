import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import SearchBar from '@akashaorg/design-system-components/lib/components/SearchBar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Cog6ToothIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

export type DashboardHeaderProps = {
  titleLabel: string;
  inputPlaceholderLabel: string;
  buttonLabel: string;
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = props => {
  const { titleLabel, inputPlaceholderLabel, buttonLabel } = props;
  const [inputValue, setInputValue] = React.useState<string>('');

  return (
    <Stack spacing="gap-y-4">
      <Stack direction="row" justify="between">
        <Text variant="h5">{titleLabel}</Text>

        <Button
          aria-label="settings"
          icon={<Cog6ToothIcon />}
          variant="primary"
          onClick={() => {
            /** */
          }}
          greyBg
          iconOnly
        />
      </Stack>

      <Stack direction="row" justify="between" spacing="gap-x-4">
        <SearchBar
          responsive={true}
          inputValue={inputValue}
          inputPlaceholderLabel={inputPlaceholderLabel}
          onInputChange={ev => setInputValue(ev.target.value)}
          onSearch={() => {
            /** */
          }}
        />

        <Button variant="secondary" label={buttonLabel} />
      </Stack>
    </Stack>
  );
};
