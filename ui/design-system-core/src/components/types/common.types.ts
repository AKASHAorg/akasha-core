export type Status = 'warning' | 'error' | 'success';

export type Color = { light: string; dark: string } | Status | string;

export type Elevation = 'none' | '1';

export type Radius = number | { top?: number; bottom?: number } | string;

export type Padding = number | { x: number; y: number } | string;

export const isStatusType = (type: Color): type is Status => {
  return type === 'warning' || type === 'error' || type === 'success';
};

export const STATUS_TO_COLOR_MAP: Record<Status, Color> = {
  error: 'error',
  warning: 'warning',
  success: 'success',
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
