import { IconType } from '@akashaorg/typings/ui';
import { Status } from '../types/common.types';

export type InputProps = {
  iconLeft?: IconType;
  iconRight?: IconType;
  status?: Status;
} & JSX.IntrinsicElements['input'];

export type LabelProps = {
  disabled?: InputProps['disabled'];
};

export type CaptionProps = {
  disabled?: InputProps['disabled'];
  status?: InputProps['status'];
};

export type TextFieldProps = InputProps & { label?: string; caption?: string };
