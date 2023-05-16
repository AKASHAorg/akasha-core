import React, { ReactNode } from 'react';
import { tw } from '@twind/core';
import { useTranslation } from 'react-i18next';
import { SearchBar } from '../SearchBar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
// import Dropdown, {
//   DropdownMenuItemType,
// } from '@akashaorg/design-system-core/lib/components/Dropdown';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Tab from '@akashaorg/design-system-core/lib/components/Tab';

export interface SearchStartProps {
  inputPlaceholderLabel: string;
  titleLabel: string;
  introLabel: string;
  description: string;
  handleSearch: (val: string) => void;
  handleTopMenuClick: () => void;
  searchKeyword: string;
  children?: ReactNode;
  //tab labels for search filtering
  tabLabels: string[];
}

const SearchStartCard: React.FC<SearchStartProps> = ({
  inputPlaceholderLabel,
  titleLabel,
  introLabel,
  description,
  handleSearch,
  handleTopMenuClick,
  searchKeyword = '',
  tabLabels,
  children,
}: SearchStartProps) => {
  const [inputValue, setInputValue] = React.useState<string>(searchKeyword);

  // const [selected, setSelected] = React.useState<DropdownMenuItemType | null>();

  const Content = (
    <div>
      <p>Accordion content</p>
      <p>Accordion content</p>
      <p>Accordion content</p>
    </div>
  );

  const { t } = useTranslation('app-search');

  React.useEffect(() => {
    setInputValue(searchKeyword);
  }, [searchKeyword]);

  return (
    <>
      <BasicCardBox round="rounded-lg" pad="px-4 py-0">
        <Stack justify="between" customStyle="my-3">
          <Text variant="h5" align="center">
            <>{t('Search')}</>
          </Text>
          <Stack>
            <Button customStyle="relative" plain={true} onClick={handleTopMenuClick}>
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
        <Tab labels={tabLabels} customStyle="gap-y-0 mt-4">
          <div></div>
          <div></div>
          <div></div>
        </Tab>
      </BasicCardBox>
      <div className={tw('w-1/6 mt-6')}>
        <Accordion titleNode="All" contentNode={Content} />
      </div>
    </>
  );
};

export default SearchStartCard;
