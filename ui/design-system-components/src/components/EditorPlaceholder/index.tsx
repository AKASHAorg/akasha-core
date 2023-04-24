import * as React from 'react';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { IProfileData } from '@akashaorg/typings/ui';

export interface IEditorPlaceholder {
  avatar?: IProfileData['avatar'];
  ethAddress: string | null;
  placeholderLabel?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  style?: string;
}

const EditorPlaceholder: React.FC<IEditorPlaceholder> = props => {
  const { avatar, ethAddress, placeholderLabel, onClick, style } = props;
  return (
    <BasicCardBox style={style}>
      <button onClick={onClick}>
        <Box customStyle="flex flex-row items-center px-4 py-2 gap-4">
          {ethAddress && <Avatar src={avatar} ethAddress={ethAddress} size="md" />}
          <Text variant="subtitle2" truncate={true}>
            {placeholderLabel}
          </Text>
        </Box>
      </button>
    </BasicCardBox>
  );
};

EditorPlaceholder.defaultProps = {
  placeholderLabel: 'Share your thoughts',
};

export default EditorPlaceholder;
