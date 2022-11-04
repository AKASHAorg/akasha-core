import { Box, FormField, TextInput } from 'grommet';
import { MarginType } from 'grommet/utils';
import * as React from 'react';
import styled from 'styled-components';
import DropdownMenu from '../../DropdownMenu';

// preserve ENS mapping
export const EnsTxtPresets = {
  DISCORD: 'com.discord',
  GITHUB: 'com.github',
  REDDIT: 'com.reddit',
  TWITTER: 'com.twitter',
  TELEGRAM: 'com.telegram',
  URL: 'url',
  AVATAR: 'avatar',
  DESCRIPTION: 'description',
};

type SocialLinkInputProps = {
  id: number;
  options: { type: string; item: React.ReactElement }[];
  value: string;
  onChange: (id: number, value: string) => void;
  margin?: MarginType;
  selectedOption?: typeof EnsTxtPresets[keyof typeof EnsTxtPresets];
  usedTypes?: string[];
};

const SocialLinkInput: React.FC<SocialLinkInputProps> = props => {
  const handleLinkInputChange = ev => {
    props.onChange(props.id, ev.target.value);
  };

  return (
    <Box direction="row" margin={props.margin} width="100%" flex={true}>
      <DropdownMenu
        options={props.options
          .filter(opt => !props.usedTypes.includes(opt.type))
          .map(opt => ({ id: opt.type, item: opt.item }))}
        selectedOption={{
          id: props.options.find(option => option.type === props.selectedOption).type,
          item: props.options.find(option => option.type === props.selectedOption).item,
        }}
      />
      <FormField width="100%" margin={{ horizontal: 'xsmall' }}>
        <StyledTextInput
          width="100%"
          placeholder={getPlaceholder(props.selectedOption)}
          value={props.value}
          onChange={handleLinkInputChange}
        />
      </FormField>
    </Box>
  );
};

const StyledTextInput = styled(TextInput)`
  padding: 0.5rem;
  border: none;
`;

const getPlaceholder = (linkType: string) => {
  switch (linkType) {
    case EnsTxtPresets.DISCORD:
      return 'Discord link';
    case EnsTxtPresets.GITHUB:
      return 'Github Username';
    case EnsTxtPresets.REDDIT:
      return 'Reddit Username';
    case EnsTxtPresets.TELEGRAM:
      return 'Telegram Group';
    case EnsTxtPresets.TWITTER:
      return 'Twitter Username';
    case EnsTxtPresets.URL:
      return 'Custom URL';
  }
};

export default SocialLinkInput;
