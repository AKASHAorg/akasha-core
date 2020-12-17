import * as React from 'react';
import { Avatar } from '../../Avatar/index';
import { BasicCardBox } from '../common/basic-card-box';
import { Box, Text } from 'grommet';

export interface IEditorPlaceholder {
  avatar?: string;
  ethAddress: string | null;
  placeholderLabel?: string;
  onClick?: any;
  style?: React.CSSProperties;
}

const EditorPlaceholder: React.FC<IEditorPlaceholder> = props => {
  const { avatar, ethAddress, placeholderLabel, onClick, style } = props;
  return (
    <BasicCardBox style={style}>
      <Box direction="row" align="center" pad="medium" gap="small" onClick={onClick}>
        {ethAddress && <Avatar src={avatar} ethAddress={ethAddress} size="md" />}
        <Text size="large" color="secondaryText">
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
