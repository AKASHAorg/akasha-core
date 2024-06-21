import React, { PropsWithChildren } from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Cog8ToothIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import SearchBar from '../SearchBar';

export type SearchStartProps = PropsWithChildren<{
  titleLabel: string;
  inputPlaceholderLabel: string;
  handleSearch: (val: string) => void;
  handleTopMenuClick: () => void;
  searchKeyword: string;
}>;

/**
 * Component used as a header in the search app
 * Renders a title, a menu icon, a search input and children
 * @param titleLabel - text for the title
 * @param inputPlaceholderLabel - placeholder for the search input
 * @param handleSearch - handler for the search input
 * @param handleTopMenuClick - handler for the menu icon
 * @param searchKeyword - initial search input value
 */
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
        fullWidth={true}
      />
      <div>{children}</div>
    </>
  );
};

export default SearchStartCard;
