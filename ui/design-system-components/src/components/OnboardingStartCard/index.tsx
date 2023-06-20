import * as React from 'react';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { SearchBar } from '../SearchBar';
import { tw } from '@twind/core';

export interface OnboardingStartCardProps {
  inputPlaceholderLabel: string;
  titleLabel: string;
  buttonLabel?: string;
  isButtonEnabled?: boolean;
  handleSearch: (val: string) => void;
  handleButtonClick?: () => void;
}

export const OnboardingStartCard = ({
  inputPlaceholderLabel,
  titleLabel,
  buttonLabel,
  isButtonEnabled,
  handleSearch,
  handleButtonClick,
}: OnboardingStartCardProps) => {
  const [inputValue, setInputValue] = React.useState<string>('');

  return (
    <BasicCardBox>
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
    </BasicCardBox>
  );
};
