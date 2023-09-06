import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
          <Stack
            key={`${tag}${idx}`}
            direction="row"
            spacing="gap-0.5"
            customStyle={'rounded-lg m-0.5 px-1 py-0.5 border(grey8 dark:grey3)'}
          >
            <Text variant="body1">{tag}</Text>
            <Icon type="XMarkIcon" />
          </Stack>
        </button>
      ))}
    </>
  );
};

export default InputTags;
