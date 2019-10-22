import { Box, Drop, Image, Text, TextInput } from 'grommet';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Icon from '../Icon/index';

const StyledSelectBox = styled(Box)`
  ${props =>
    `&:hover {
        background-color: ${props.theme.colors.lightBackground};
        cursor: pointer;
      }
    `}
`;

const StyledDrop = styled(Drop)`
  margin-top: 5px;
  border-radius: ${props => props.theme.shapes.largeBorderRadius};
`;

interface ICustomSearchInput {
  getData: () => void;
  dataSource: any;
  placeholder: string;
  usersTitle: string;
  tagsTitle: string;
  appsTitle: string;
}

const CustomSearchInput: React.FC<ICustomSearchInput> = props => {
  const { dataSource, placeholder, usersTitle, tagsTitle, appsTitle, getData } = props;
  const [inputValue, setInputValue] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any>({ users: [], tags: [], apps: [] });

  const boxRef: React.Ref<any> = useRef();

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions({ users: [], tags: [], apps: [] });
      setDropOpen(false);
    } else {
      setSuggestions(dataSource);
      setDropOpen(true);
    }
  }, [inputValue]);

  const onChange = (event: any) => {
    setInputValue(event.target.value);
    getData(event.target.value);
  };

  const onSelect = (event: any) => setInputValue(event.suggestion.inputValue);

  const renderSuggestions = () => {
    return suggestions.users
      .filter(
        ({ name }: { name: string }) =>
          (name as string).toLowerCase().indexOf(inputValue.toLowerCase()) >= 0,
      )
      .map(
        ({ name, imageUrl }: { name: string; imageUrl: string }, index: number, list: any[]) => ({
          label: (
            <Box direction="row" align="center" gap="small" pad="small">
              <Image width="32px" src={imageUrl} style={{ borderRadius: '100%' }} />
              <Text>{name}</Text>
            </Box>
          ),
          inputValue: name,
        }),
      );
  };

  const renderDropContent = () => {
    const slicedUsers = suggestions.users.slice(0, 2);
    const slicedTags = suggestions.tags.slice(0, 2);
    const slicedApps = suggestions.apps.slice(0, 2);

    const onClickContent = (value: string) => {
      setInputValue(value);
      setDropOpen(false);
    };

    const renderUsers = (
      <Box pad={{ bottom: 'small' }}>
        <Text color="secondaryText" size="small" margin={{ bottom: 'xsmall', horizontal: 'small' }}>
          {usersTitle}
        </Text>
        {slicedUsers.map(
          ({ name, imageUrl }: { name: string; imageUrl: string }, index: number) => (
            <StyledSelectBox
              onClick={() => onClickContent(name)}
              key={index}
              round={{ size: 'xxsmall' }}
              height="40px"
              justify="center"
            >
              <Box
                margin={{ vertical: 'xsmall', horizontal: 'small' }}
                direction="row"
                align="center"
                gap="small"
              >
                <Image width="32px" height="32px" src={imageUrl} style={{ borderRadius: '100%' }} />
                <Text size="large">{name}</Text>
              </Box>
            </StyledSelectBox>
          ),
        )}
      </Box>
    );
    const renderApps = (
      <Box pad={{ bottom: 'small' }}>
        <Text
          color="#secondaryText"
          size="small"
          margin={{ bottom: 'xsmall', horizontal: 'small' }}
        >
          {appsTitle}
        </Text>
        {slicedApps.map(({ name, imageUrl }: { name: string; imageUrl: string }, index: number) => (
          <StyledSelectBox
            onClick={() => onClickContent(name)}
            key={index}
            round={{ size: 'xxsmall' }}
            height="40px"
            justify="center"
          >
            <Box
              margin={{ vertical: 'xsmall', horizontal: 'small' }}
              direction="row"
              align="center"
              gap="small"
            >
              <Image width="32px" height="32px" src={imageUrl} style={{ borderRadius: '100%' }} />
              <Text size="large">{name}</Text>
            </Box>
          </StyledSelectBox>
        ))}
      </Box>
    );
    const renderTags = (
      <Box pad={{ bottom: 'small' }}>
        <Text color="secondaryText" size="small" margin={{ bottom: 'xsmall', horizontal: 'small' }}>
          {tagsTitle}
        </Text>
        {slicedTags.map((tag: string, index: number) => (
          <StyledSelectBox
            onClick={() => onClickContent(tag)}
            key={index}
            round={{ size: 'xxsmall' }}
            height="40px"
            justify="center"
          >
            <Box
              margin={{ vertical: 'xsmall', horizontal: '12px' }}
              direction="row"
              align="center"
              gap="small"
            >
              <Text>{tag}</Text>
            </Box>
          </StyledSelectBox>
        ))}
      </Box>
    );
    return (
      <Box pad={{ top: 'medium', horizontal: 'xxsmall' }}>
        {slicedUsers.length && renderUsers}
        {slicedTags.length && renderTags}
        {slicedApps.length && renderApps}
      </Box>
    );
  };

  return (
    <Box
      fill="horizontal"
      ref={boxRef}
      direction="row"
      align="center"
      pad={{ horizontal: 'small', vertical: 'xsmall' }}
      round="small"
      elevation="styleGuideShadow"
      border={{
        side: 'all',
        color: 'border',
      }}
    >
      <Icon type="search" />
      <TextInput
        // type="search"
        plain={true}
        value={inputValue}
        onChange={onChange}
        placeholder={placeholder}
        dropTarget={boxRef.current}
        // onSelect={onSelect}
        // suggestions={renderSuggestions()}
        // onSuggestionsOpen={() => setDropOpen(true)}
        // onSuggestionsClose={() => setDropOpen(false)}
      />
      {boxRef.current && dropOpen && (
        <StyledDrop
          overflow="hidden"
          target={boxRef.current}
          align={{ top: 'bottom' }}
          onClickOutside={() => setDropOpen(false)}
          onEsc={() => setDropOpen(false)}
        >
          {renderDropContent()}
        </StyledDrop>
      )}
    </Box>
  );
};

export { CustomSearchInput };
