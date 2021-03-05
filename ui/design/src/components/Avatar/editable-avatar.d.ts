import * as React from 'react';
import { AvatarProps } from './avatar';
export interface EditableAvatarProps extends Omit<AvatarProps, 'onClick'> {
  onChange: (newSrc: string) => void;
}
declare const EditableAvatar: React.FC<EditableAvatarProps & Partial<typeof defaultProps>>;
declare const defaultProps: {
  size: 'sm' | 'xxs' | 'xs' | 'md' | 'lg' | 'xl';
  withBorder: boolean;
  seed: string;
};
export default EditableAvatar;
