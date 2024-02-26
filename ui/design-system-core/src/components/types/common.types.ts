import { Colors } from '@akashaorg/typings/lib/ui';

export type Status = 'warning' | 'error' | 'success';

export type Color =
  | { light: Colors; dark: Colors }
  | { gradient: 'gradient-to-b' | 'gradient-to-r'; from: Colors; via?: Colors; to: Colors }
  | Status
  | Colors;

export type BaseElevation = 'none' | '1' | '2' | '3' | '4';

export type Elevation = BaseElevation | { light: BaseElevation; dark: BaseElevation };

export type Radius = number | { top?: number; bottom?: number } | string;

export type Padding = number | { x?: number; y?: number } | `p${string}`;

export type BasicSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type BasicIconSize = BasicSize | { width?: string | number; height?: string | number };

export type BreakPointSize = { breakPoint: string; size: BasicSize };

export type ImageSrc = { url?: string; fallbackUrl?: string };

export const isStatusType = (type: Color): type is Status => {
  return type === 'warning' || type === 'error' || type === 'success';
};

export const STATUS_TO_COLOR_CLASSES_MAP: Record<Status, Color> = {
  error: { light: 'errorLight', dark: 'errorDark' },
  success: 'success',
  warning: { light: 'warningLight', dark: 'warningDark' },
};
