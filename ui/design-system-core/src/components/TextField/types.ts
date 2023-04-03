import { IconType } from '@akashaorg/typings/ui';
import { Status } from '../types/common.types';

export type MultlineProps = {
  type?: 'multiline';
} & JSX.IntrinsicElements['textarea'];

export type InputProps = {
  iconLeft?: IconType;
  iconRight?: IconType;
  type?: 'text';
  status?: Status;
} & JSX.IntrinsicElements['input'];

export type LabelProps = {
  required?: boolean;
  disabled?: JSX.IntrinsicElements['input']['disabled'];
};

export type CaptionProps = {
  disabled?: JSX.IntrinsicElements['input']['disabled'];
  status?: Status;
};

export type TextFieldProps = (InputProps | MultlineProps) & {
  label?: string;
  caption?: string;
  status?: Status;
  required?: boolean;
  customStyle?: string;
  inputRef?: InputProps['ref'] & MultlineProps['ref'];
};
