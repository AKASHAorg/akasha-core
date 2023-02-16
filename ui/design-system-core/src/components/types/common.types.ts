export type Status = 'warning' | 'error' | 'success';

export type Color = { light: string; dark: string } | Status | string;

export const isStatusType = (type: Color): type is Status => {
  return type === 'warning' || type === 'error' || type === 'success';
};

export const STATUS_TO_COLOR_MAP: Record<Status, Color> = {
  error: 'error',
  warning: 'warning',
  success: 'success',
};
