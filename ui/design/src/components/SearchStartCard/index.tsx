import React, { ReactNode } from 'react';
import { Box, Text } from 'grommet';
import { StyledBox, StyledImage, StyledText } from './styled';
import { SearchBar } from '../SearchBar';
import { BasicCardBox } from '../EntryCard/basic-card-box';

export interface SearchStartProps {
  inputPlaceholderLabel: string;
  title: string;
  description: string;
  handleSearch: (val: string) => void;
  searchKeywordParam: string;
  children?: ReactNode;
}

export const SearchStartCard = ({
  inputPlaceholderLabel,
  title,
  description,
  handleSearch,
  searchKeywordParam,
  children,
}: SearchStartProps) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [shouldMinimize, setShouldMinimize] = React.useState(!!searchKeywordParam?.length);

  return (
    <BasicCardBox
      round={
        shouldMinimize && !!searchKeywordParam.length ? { size: 'xsmall', corner: 'top' } : 'xsmall'
      }
    >
      <Box align="start" fill="horizontal" pad={{ top: 'medium', horizontal: 'medium' }}>
        <Text size="xlarge" weight="bold">
          Search
        </Text>
      </Box>
      <StyledBox shouldMinimize={shouldMinimize} pad={{ horizontal: 'medium' }}>
        <StyledImage src="/images/search-page-start.png" />
        <Text size="large" weight={600} margin={{ top: 'medium' }} textAlign="center">
          {title}
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
        />
      </Box>
      {shouldMinimize && !!searchKeywordParam.length && <Box fill="horizontal">{children}</Box>}
    </BasicCardBox>
  );
};
