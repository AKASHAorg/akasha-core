import * as React from 'react';
import { getEditableImageFieldHandlers } from '../../utils/get-editable-field-handlers';
import Avatar, { AvatarProps } from './avatar';
import { AvatarSize, StyleFileInput } from './styled-avatar';

export interface EditableAvatarProps extends Omit<AvatarProps, 'onClick'> {
  onChange: (newSrc: string) => void;
}

const EditableAvatar: React.FC<EditableAvatarProps & Partial<typeof defaultProps>> = props => {
  const { src, onChange } = props;
  const inputRef = React.useRef(null);
  const [newAvatar, setNewAvatar] = React.useState(src);

  const { handleClick, handleChange } = getEditableImageFieldHandlers(
    true,
    inputRef,
    setNewAvatar,
    onChange,
  );

  return (
    <>
      <Avatar {...props} src={newAvatar} onClick={handleClick} />
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
Avatar.defaultProps = defaultProps;

export default EditableAvatar;
