import { Box, Text } from 'grommet';
import * as React from 'react';
import { StyledSelectBox } from '../drop-styled-search-input';

export interface ISearchInputTagsProps {
  tags: any[];
  onClickTag: (tag: string) => void;
}

const SearchInputTags: React.FC<ISearchInputTagsProps> = props => {
  const { tags, onClickTag } = props;

  return (
    <Box
      pad={{
        horizontal: 'xxsmall',
        top: 'small',
        bottom: 'xxsmall',
      }}
    >
      {tags.map((tag: string, index: number) => (
        <StyledSelectBox
          // tslint:disable-next-line: jsx-no-lambda
          onClick={() => onClickTag(tag)}
          key={index}
          round={{ size: 'xxsmall' }}
          height="2.5em"
          justify="center"
        >
          <Box
            margin={{ vertical: 'xsmall' }}
            direction="row"
            align="center"
            gap="xsmall"
            pad={{
              vertical: 'xxsmall',
              horizontal: 'small',
            }}
          >
            <Text>{tag}</Text>
          </Box>
        </StyledSelectBox>
      ))}
    </Box>
  );
};

export default SearchInputTags;
