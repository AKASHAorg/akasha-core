import { Color } from '../types/common.types';

export type MeterProps = {
  size: number;
  thickness: number;
  value: number;
  max?: number;
  progressBg?: Color;
  background?: Color;
  customStyle?: string;
};
