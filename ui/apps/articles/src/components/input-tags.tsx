import React from 'react';

import DS from '@akashaorg/design-system';

const { Box, Icon, Text } = DS;

export interface IInputTagsProps {
  values: string[];
  onClickTag: (tag: string) => () => void;
}

const InputTags: React.FC<IInputTagsProps> = props => {
  const { values, onClickTag } = props;
  return (
    <>
      {values.map((tag, idx) => (
        <Box
          key={`${tag}${idx}`}
          direction="row"
          round="1rem"
          gap="xxsmall"
          margin="xxsmall"
          pad={{
            horizontal: 'xsmall',
            vertical: '1.5px',
          }}
          border={{
            color: 'primaryText',
          }}
          onClick={onClickTag(tag)}
        >
          <Text color={'primaryText'}>{tag}</Text>
          <Icon type="close" />
        </Box>
      ))}
    </>
  );
};

export default InputTags;
