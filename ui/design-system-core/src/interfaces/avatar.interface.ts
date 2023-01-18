export type AvatarSrc = { url?: string; fallbackUrl?: string };

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type AvatarBorderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type AvatarBorderColor = 'white' | 'darkerBlue' | 'accent';

export interface IAvatarProps {
  ethAddress?: string | null;
  alt?: string;
  publicImgPath?: string;
  backgroundColor?: string;
  src?: AvatarSrc;
  size?: AvatarSize;
  border?: AvatarBorderSize;
  borderColor?: AvatarBorderColor;
  faded?: boolean;
  active?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
}
