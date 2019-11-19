import * as React from 'react';
import Avatar, { AvatarProps } from './avatar';
import { AvatarSize, StyleFileInput } from './styled-avatar';

export interface EditableAvatarProps extends Omit<AvatarProps, 'onClick'> {
  onChange: (newSrc: string) => void;
}

const EditableAvatar: React.FC<EditableAvatarProps & Partial<typeof defaultProps>> = props => {
  const { src, onChange } = props;
  const inputRef: React.MutableRefObject<HTMLInputElement> = React.useRef();

  const [avatarImg, setNewAvatarImg] = React.useState(src);

  const clickHandler: React.EventHandler<React.SyntheticEvent<HTMLDivElement, MouseEvent>> = e => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!(e.target.files && e.target.files[0])) {
      onChange('');

      return;
    }

    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      const result = fileReader.result as string;
      setNewAvatarImg(result);
      onChange(result);
    });

    fileReader.readAsDataURL(file);
  };

  return (
    <>
      <Avatar {...props} onClick={clickHandler} src={avatarImg} />
      <StyleFileInput type="file" ref={inputRef} onChange={changeHandler} />
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
