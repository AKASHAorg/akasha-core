import * as React from 'react';
import { tw } from '@twind/core';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
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
      <div className={tw(`flex w-ull p-4 items-center gap-8`)}>
        <div className={tw(`flex flex-row justify-between w-full`)}>
          <Text variant="h2">{titleLabel}</Text>
          <Button disabled={!isButtonEnabled} onClick={handleButtonClick} label={buttonLabel} />
        </div>

        <SearchBar
          inputValue={inputValue}
          inputPlaceholderLabel={inputPlaceholderLabel}
          onInputChange={ev => setInputValue(ev.target.value)}
          onSearch={handleSearch}
          responsive={false}
        />
      </div>
    </Card>
  );
};

export default OnboardingStartCard;
