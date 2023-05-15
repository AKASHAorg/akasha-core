import React, { ReactNode } from 'react';
import { tw } from '@twind/core';
import { useTranslation } from 'react-i18next';
import { SearchBar } from '../SearchBar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

export interface SearchStartProps {
  inputPlaceholderLabel: string;
  titleLabel: string;
  introLabel: string;
  description: string;
  handleSearch: (val: string) => void;
  handleTopMenuClick: () => void;
  searchKeyword: string;
  children?: ReactNode;
}

export const SearchStartCard = ({
  inputPlaceholderLabel,
  titleLabel,
  introLabel,
  description,
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
    <BasicCardBox round="rounded-lg">
      <div className={tw('py-4 w-full')}>
        <Text variant="h5" align="center">
          <>{t('Search')}</>
        </Text>
        <Stack direction="column" spacing="gap-y-1" customStyle="">
          <Button customStyle="relative" plain={true} onClick={handleTopMenuClick}>
            <Icon type="Cog8ToothIcon" accentColor={true} />
          </Button>
        </Stack>
      </div>
      <SearchBar
        inputValue={inputValue}
        inputPlaceholderLabel={inputPlaceholderLabel}
        onInputChange={ev => setInputValue(ev.target.value)}
        onSearch={handleSearch}
        responsive={true}
      />
    </BasicCardBox>
  );
};
