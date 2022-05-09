import * as React from 'react';
import { Box, Text } from 'grommet';
import { SearchBar } from '../SearchBar';
import { BasicCardBox } from '../EntryCard/basic-card-box';
import Button from '../Button';

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
      <Box fill="horizontal" pad="medium" align="center" gap="large">
        <Box justify="between" direction="row" fill="horizontal">
          <Text size="xlarge" weight="bold">
            {titleLabel}
          </Text>
          <Button disabled={!isButtonEnabled} onClick={handleButtonClick} label={buttonLabel} />
        </Box>

        <SearchBar
          inputValue={inputValue}
          inputPlaceholderLabel={inputPlaceholderLabel}
          onInputChange={ev => setInputValue(ev.target.value)}
          onSearch={handleSearch}
          responsive={false}
        />
      </Box>
    </BasicCardBox>
  );
};
