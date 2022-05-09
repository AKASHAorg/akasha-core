import * as React from 'react';
import Avatar from '../Avatar';
import { BasicCardBox } from '../EntryCard/basic-card-box';
import { Box, Text } from 'grommet';
import { IProfileData } from '@akashaorg/ui-awf-typings/lib/profile';

export interface IEditorPlaceholder {
  avatar?: IProfileData['avatar'];
  ethAddress: string | null;
  placeholderLabel?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
}

const EditorPlaceholder: React.FC<IEditorPlaceholder> = props => {
  const { avatar, ethAddress, placeholderLabel, onClick, style } = props;
  return (
    <BasicCardBox style={style}>
      <Box
        direction="row"
        align="center"
        pad={{ horizontal: 'medium', vertical: 'small' }}
        gap="small"
        onClick={onClick}
      >
        {ethAddress && <Avatar src={avatar} ethAddress={ethAddress} size="md" />}
        <Text size="large" color="secondaryText" truncate={true}>
          {placeholderLabel}
        </Text>
      </Box>
    </BasicCardBox>
  );
};

EditorPlaceholder.defaultProps = {
  placeholderLabel: 'Share your thoughts',
};

export { EditorPlaceholder };
