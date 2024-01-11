import React, { ReactNode } from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Cog8ToothIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import SearchBar from '../SearchBar';

export type SearchStartProps = {
  titleLabel: string;
  inputPlaceholderLabel: string;
  handleSearch: (val: string) => void;
  handleTopMenuClick: () => void;
  searchKeyword: string;
  children?: ReactNode;
};

const SearchStartCard: React.FC<SearchStartProps> = ({
  titleLabel,
  inputPlaceholderLabel,
  handleSearch,
  handleTopMenuClick,
  searchKeyword = '',
  children,
}: SearchStartProps) => {
  const [inputValue, setInputValue] = React.useState<string>(searchKeyword);

  React.useEffect(() => {
    setInputValue(searchKeyword);
  }, [searchKeyword]);

  return (
    <>
      <Stack direction="row" justify="between" customStyle="my-3">
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>
        <Stack>
          <Button customStyle="relative" plain={true} onClick={() => handleTopMenuClick()}>
            <Icon icon={<Cog8ToothIcon />} accentColor={true} />
          </Button>
        </Stack>
      </Stack>
      <SearchBar
        inputValue={inputValue}
        inputPlaceholderLabel={inputPlaceholderLabel}
        onInputChange={ev => setInputValue(ev.target.value)}
        onSearch={handleSearch}
        responsive={true}
      />
      <div>{children}</div>
    </>
  );
};

export default SearchStartCard;
