import React from 'react';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

export interface IInputTagsProps {
  values: string[];
  onClickTag: (tag: string) => () => void;
}

const InputTags: React.FC<IInputTagsProps> = props => {
  const { values, onClickTag } = props;
  return (
    <>
      {values.map((tag, idx) => (
        <button onClick={onClickTag(tag)}>
          <Box
            key={`${tag}${idx}`}
            customStyle={
              'flex flex-row rounded-lg gap-0.5 m-0.5 px-1 py-0.5 border(grey8 dark:grey3)'
            }
          >
            <Text variant="body1">{tag}</Text>
            <Icon type="XMarkIcon" />
          </Box>
        </button>
      ))}
    </>
  );
};

export default InputTags;
