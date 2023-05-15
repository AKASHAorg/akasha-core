import * as React from 'react';
import Avatar from '../Avatar';
import { BasicCardBox } from '../EntryCard/basic-card-box';
import { Box, Text } from 'grommet';
import { Profile } from '@akashaorg/typings/ui';

export interface IEditorPlaceholder {
  avatar?: Profile['avatar'];
  profileId: string | null;
  placeholderLabel?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
}

const EditorPlaceholder: React.FC<IEditorPlaceholder> = props => {
  const { avatar, profileId, placeholderLabel, onClick, style } = props;
  return (
    <BasicCardBox style={style}>
      <Box
        direction="row"
        align="center"
        pad={{ horizontal: 'medium', vertical: 'small' }}
        gap="small"
        onClick={onClick}
      >
        {profileId && <Avatar avatar={avatar} profileId={profileId} size="md" />}
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
