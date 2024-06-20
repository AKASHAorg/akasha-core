import * as React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import SearchBar from '../SearchBar';

export type OnboardingStartCardProps = {
  inputPlaceholderLabel: string;
  titleLabel: string;
  buttonLabel: string;
  isButtonEnabled: boolean;
  handleSearch: (val: string) => void;
  handleButtonClick?: () => void;
};

/**
 * Component used in the search app onboarding page to allow the user to search
 * @param inputPlaceholderLabel - placeholder of search input
 * @param titleLabel - title of the card
 * @param buttonLabel - text of the button to navigate user to his feed
 * @param isButtonEnabled - to enable or disable the nav button
 * @param handleSearch - handler for the search function
 * @param handleButtonClick - handler to navigate user to his feed
 */
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
      <Stack align="center" spacing="gap-y-8" fullWidth={true}>
        <Stack direction="row" justify="between" fullWidth={true}>
          <Text variant="h5">{titleLabel}</Text>
          {buttonLabel && (
            <Button disabled={!isButtonEnabled} onClick={handleButtonClick} label={buttonLabel} />
          )}
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
