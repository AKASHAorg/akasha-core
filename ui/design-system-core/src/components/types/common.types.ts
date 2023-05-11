import { Colors } from '@akashaorg/typings/ui';

export type Status = 'warning' | 'error' | 'success';

export type Color = { light: Colors; dark: Colors } | Status | string;

export type BaseElevation = 'none' | '1' | '2' | '4';

export type Elevation = BaseElevation | { light: BaseElevation; dark: BaseElevation };

export type Radius = number | { top?: number; bottom?: number } | string;

export type Padding = number | { x: number; y: number } | `p${string}`;

export type BasicSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type BasicIconSize = Exclude<BasicSize, 'xl'>;

export type BreakPointSize = { breakPoint: string; size: BasicSize };

export type ImageSrc = { url?: string; fallbackUrl?: string };

export const isStatusType = (type: Color): type is Status => {
  return type === 'warning' || type === 'error' || type === 'success';
};

export const EnsTxtPresets = {
  DISCORD: 'com.discord',
  GITHUB: 'com.github',
  REDDIT: 'com.reddit',
  TWITTER: 'com.twitter',
  TELEGRAM: 'org.telegram',
  URL: 'url',
  AVATAR: 'avatar',
  DESCRIPTION: 'description',
};

export const STATUS_TO_COLOR_CLASSES_MAP: Record<Status, Color> = {
  error: { light: 'errorLight', dark: 'errorDark' },
  success: 'success',
  warning: { light: 'warningLight', dark: 'warningDark' },
};
