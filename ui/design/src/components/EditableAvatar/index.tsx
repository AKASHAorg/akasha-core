import * as React from 'react';
import { getEditableImageFieldHandlers } from '../../utils/get-editable-field-handlers';
import Avatar, { AvatarProps } from '../Avatar';
import { AvatarSize, StyleFileInput } from '../Avatar/styled-avatar';
import { Profile } from '@akashaorg/typings/ui';

export interface EditableAvatarProps extends Omit<AvatarProps, 'onClick'> {
  onChange: (newSrc: Profile['avatar']) => void;
}

const EditableAvatar: React.FC<EditableAvatarProps & Partial<typeof defaultProps>> = props => {
  const { avatar, onChange } = props;
  const inputRef = React.useRef(null);
  const [newAvatar, setNewAvatar] = React.useState(avatar);

  const { handleClick, handleChange } = getEditableImageFieldHandlers(
    true,
    inputRef,
    setNewAvatar,
    onChange,
  );

  return (
    <>
      <Avatar {...props} avatar={newAvatar} onClick={handleClick} />
      <StyleFileInput
        data-testid="avatar-file-input"
        type="file"
        ref={inputRef}
        onChange={handleChange}
      />
    </>
  );
};

const defaultProps = {
  size: 'md' as AvatarSize,
  withBorder: false,
  seed: '0x0000000000000000000000000000000',
};
EditableAvatar.defaultProps = defaultProps;

export default EditableAvatar;
