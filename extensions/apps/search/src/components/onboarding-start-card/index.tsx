import * as React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import SearchBar from '@akashaorg/design-system-components/lib/components/SearchBar';

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
    <Card className="shadow-none">
      <Stack alignItems="center" spacing={8} className="w-full">
        <Stack direction="row" justifyContent="between" className="w-full">
          <Typography variant="h5">{titleLabel}</Typography>
          {buttonLabel && (
            <Button disabled={!isButtonEnabled} onClick={handleButtonClick} label={buttonLabel} />
          )}
        </Stack>

        <SearchBar
          inputValue={inputValue}
          inputPlaceholderLabel={inputPlaceholderLabel}
          onInputChange={ev => setInputValue(ev.target.value)}
          onSearch={handleSearch}
          fullWidth={false}
        />
      </Stack>
    </Card>
  );
};

export default OnboardingStartCard;
