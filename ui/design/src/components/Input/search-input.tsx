import { Tabs } from 'grommet';
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon/index';
import { SearchInputApps, SearchInputTags, SearchInputUsers } from './search-input-content';
import {
  StyledDrop,
  StyledResultsLink,
  StyledSearchBox,
  StyledTab,
  StyledTextInput,
} from './styled-input';

export interface ICustomSearchInput {
  className?: string;
  getData: () => void;
  dataSource: any;
  placeholder: string;
  resultsTitle: string;
  usersTitle: string;
  tagsTitle: string;
  appsTitle: string;
  onClickUser: (name: string) => void;
  onClickTag: (tag: string) => void;
  onClickApp: (name: string) => void;
}

const SearchInput: React.FC<ICustomSearchInput> = props => {
  const {
    className,
    dataSource,
    placeholder,
    resultsTitle,
    usersTitle,
    tagsTitle,
    appsTitle,
    getData,
    onClickUser,
    onClickTag,
    onClickApp,
  } = props;
  const [inputValue, setInputValue] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any>({ users: [], tags: [], apps: [] });

  const boxRef: React.Ref<any> = useRef();

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions({ users: [], tags: [], apps: [] });
    } else {
      setSuggestions(dataSource);
    }
    // eslint-disable-next-line
  }, [inputValue]);

  const onChange = (event: any) => {
    setInputValue(event.target.value);
    getData();
    setDropOpen(event.target.value !== '');
  };

  const handleClick = (content: string) => {
    setInputValue(content);
    setDropOpen(false);
  };

  const handleClickUser = (name: string) => {
    handleClick(name);
    onClickUser(name);
  };

  const handleClickTag = (tag: string) => {
    handleClick(tag);
    onClickTag(tag);
  };

  const handleClickApp = (name: string) => {
    handleClick(name);
    onClickApp(name);
  };

  const closeDrop = () => {
    setDropOpen(false);
  };

  return (
    <>
      <StyledSearchBox
        fill="horizontal"
        ref={boxRef}
        direction="row"
        align="center"
        pad={{ horizontal: 'medium', vertical: 'small' }}
        round="small"
        elevation="styleGuideShadow"
        border={{
          side: 'all',
          color: 'border',
        }}
        className={className}
        gap="xsmall"
      >
        <Icon type="search" />
        <StyledTextInput
          plain={true}
          value={inputValue}
          onChange={onChange}
          placeholder={placeholder}
          dropTarget={boxRef.current}
        />
        {inputValue.trim() && <StyledResultsLink href="#">{resultsTitle}</StyledResultsLink>}
      </StyledSearchBox>

      {boxRef.current && dropOpen && (
        <StyledDrop
          overflow="hidden"
          target={boxRef.current}
          align={{ top: 'bottom' }}
          onClickOutside={closeDrop}
          onEsc={closeDrop}
        >
          <Tabs>
            <StyledTab title={usersTitle}>
              <SearchInputUsers users={suggestions.users} onClickUser={handleClickUser} />
            </StyledTab>
            <StyledTab title={tagsTitle}>
              <SearchInputTags tags={suggestions.tags} onClickTag={handleClickTag} />
            </StyledTab>
            <StyledTab title={appsTitle}>
              <SearchInputApps apps={suggestions.apps} onClickApp={handleClickApp} />
            </StyledTab>
          </Tabs>
        </StyledDrop>
      )}
    </>
  );
};

export default SearchInput;
