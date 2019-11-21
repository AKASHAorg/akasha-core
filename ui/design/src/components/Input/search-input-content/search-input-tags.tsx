import { Box, Text } from 'grommet';
import * as React from 'react';

import { StyledSelectBox } from '../styled-search-input';

export interface ISearchInputTagsProps {
  tags: any[];
  onClickTag: (tag: string) => void;
}

const SearchInputTags: React.FC<ISearchInputTagsProps> = props => {
  const { tags, onClickTag } = props;

  return (
    <Box
      pad={{
        horizontal: '4px',
        top: '12px',
        bottom: '4px',
      }}
    >
      {tags.map((tag: string, index: number) => (
        <StyledSelectBox
          // tslint:disable-next-line: jsx-no-lambda
          onClick={() => onClickTag(tag)}
          key={index}
          round={{ size: 'xxsmall' }}
          height="40px"
          justify="center"
        >
          <Box
            margin={{ vertical: '8px' }}
            direction="row"
            align="center"
            gap="8px"
            pad={{
              vertical: '4px',
              horizontal: '12px',
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
