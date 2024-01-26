import * as React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import SearchBar from '../SearchBar';

export type OnboardingStartCardProps = {
  inputPlaceholderLabel: string;
  titleLabel: string;
  buttonLabel?: string;
  isButtonEnabled?: boolean;
  handleSearch: (val: string) => void;
  handleButtonClick?: () => void;
};

const OnboardingStartCard = ({
  inputPlaceholderLabel,
  titleLabel,
  buttonLabel,
  isButtonEnabled,
  handleSearch,
  handleButtonClick,
}: OnboardingStartCardProps) => {
  const [inputValue, setInputValue] = React.useState<string>('');

  return (
    <Card>
      <Stack align="center" padding="p-4" spacing="gap-y-8" fullWidth={true}>
        <Stack direction="row" justify="between" fullWidth={true}>
          <Text variant="h2">{titleLabel}</Text>
          <Button disabled={!isButtonEnabled} onClick={handleButtonClick} label={buttonLabel} />
        </Stack>

        <SearchBar
          inputValue={inputValue}
          inputPlaceholderLabel={inputPlaceholderLabel}
          onInputChange={ev => setInputValue(ev.target.value)}
          onSearch={handleSearch}
          responsive={false}
        />
      </Stack>
    </Card>
  );
};

export default OnboardingStartCard;
