import React, { ReactNode } from 'react';
import { Box, Text } from 'grommet';
import { StyledBox, StyledImage, StyledText } from './styled';
import { SearchBar } from '../SearchBar';
import { BasicCardBox } from '../EntryCard/basic-card-box';

export interface SearchStartProps {
  inputPlaceholderLabel: string;
  titleLabel: string;
  introLabel: string;
  description: string;
  handleSearch: (val: string) => void;
  searchKeyword: string;
  children?: ReactNode;
}

export const SearchStartCard = ({
  inputPlaceholderLabel,
  titleLabel,
  introLabel,
  description,
  handleSearch,
  searchKeyword = '',
  children,
}: SearchStartProps) => {
  const [inputValue, setInputValue] = React.useState<string>(searchKeyword);
  const [shouldMinimize, setShouldMinimize] = React.useState(!!searchKeyword?.length);

  React.useEffect(() => {
    setInputValue(searchKeyword);
  }, [searchKeyword]);

  return (
    <BasicCardBox
      round={
        shouldMinimize && !!searchKeyword.length ? { size: 'xsmall', corner: 'top' } : 'xsmall'
      }
    >
      <Box align="start" fill="horizontal" pad={{ top: 'medium', horizontal: 'medium' }}>
        <Text size="xlarge" weight="bold">
          {titleLabel}
        </Text>
      </Box>
      <StyledBox shouldMinimize={shouldMinimize} pad={{ horizontal: 'medium' }}>
        <StyledImage src="/images/search.webp" />
        <Text size="large" weight={600} margin={{ top: 'medium' }} textAlign="center">
          {introLabel}
        </Text>
        <StyledText size="large" textAlign="center">
          {description}
        </StyledText>
      </StyledBox>
      <Box
        fill="horizontal"
        pad="large"
        margin={{ bottom: 'medium' }}
        align="center"
        onFocus={() => setShouldMinimize(true)}
      >
        <SearchBar
          inputValue={inputValue}
          inputPlaceholderLabel={inputPlaceholderLabel}
          onInputChange={ev => setInputValue(ev.target.value)}
          onSearch={handleSearch}
          responsive={true}
        />
      </Box>
      {shouldMinimize && !!searchKeyword.length && <Box fill="horizontal">{children}</Box>}
    </BasicCardBox>
  );
};
