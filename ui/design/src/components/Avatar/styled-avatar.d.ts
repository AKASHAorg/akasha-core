import MarginInterface from '../../interfaces/margin.interface';
export declare type AvatarSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export interface AvatarProps {
  size: AvatarSize;
  isClickable: boolean;
  margin?: MarginInterface;
  backgroundColor?: string;
  border?: 'sm' | 'md' | 'lg';
}
declare const StyledAvatar: import('styled-components').StyledComponent<
  'div',
  any,
  AvatarProps,
  never
>;
export declare const StyleFileInput: import('styled-components').StyledComponent<
  'input',
  any,
  {},
  never
>;
export default StyledAvatar;
