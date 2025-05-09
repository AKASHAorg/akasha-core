import React, { PropsWithChildren } from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';

import { SettingsIcon } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import SearchBar from '@akashaorg/design-system-components/lib/components/SearchBar';
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
      <Stack direction="row" justifyContent="between" className="my-3">
        <Typography variant="h5" className="text-center">
          {titleLabel}
        </Typography>
        <Stack>
          <Button customStyle="relative" plain={true} onClick={() => handleTopMenuClick()}>
            <SettingsIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
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
