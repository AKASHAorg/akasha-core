import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import SearchBar from '../SearchBar';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export type SearchStartProps = {
  inputPlaceholderLabel: string;
  handleSearch: (val: string) => void;
  handleTopMenuClick: () => void;
  searchKeyword: string;
  children?: ReactNode;
};

const SearchStartCard: React.FC<SearchStartProps> = ({
  inputPlaceholderLabel,
  handleSearch,
  handleTopMenuClick,
  searchKeyword = '',
  children,
}: SearchStartProps) => {
  const [inputValue, setInputValue] = React.useState<string>(searchKeyword);

  const { t } = useTranslation('app-search');

  React.useEffect(() => {
    setInputValue(searchKeyword);
  }, [searchKeyword]);

  return (
    <>
      <Card radius="rounded-lg" padding="px-4 py-0">
        <Stack justify="between" customStyle="my-3">
          <Text variant="h5" align="center">
            <>{t('Search')}</>
          </Text>
          <Stack>
            <Button customStyle="relative" plain={true} onClick={() => handleTopMenuClick()}>
              <Icon type="Cog8ToothIcon" accentColor={true} />
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
      </Card>
    </>
  );
};

export default SearchStartCard;
