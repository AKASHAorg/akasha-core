import React from 'react';

import { Status, Radius } from '../types/common.types';
import { StackProps } from '../Stack';

export type MultlineProps = {
  type: 'multiline';
  status?: Status;
  radius?: Radius;
} & JSX.IntrinsicElements['textarea'];

export type InputProps = {
  iconLeft?: React.ReactElement;
  iconRight?: React.ReactElement;
  type: 'text';
  status?: Status;
  radius?: Radius;
  altBg?: boolean;
  fullWidth?: boolean;
} & JSX.IntrinsicElements['input'];

export type LabelProps = {
  id?: string;
  required?: boolean;
  disabled?: JSX.IntrinsicElements['input']['disabled'];
};

export type CaptionProps = {
  status?: Status;
  justifyContents?: StackProps['justify'];
};

export type TextFieldProps = (InputProps | MultlineProps) & {
  label?: string;
  caption?: string;
  status?: Status;
  required?: boolean;
  justifyCaption?: CaptionProps['justifyContents'];
  customStyle?: string;
  inputRef?: InputProps['ref'] & MultlineProps['ref'];
};
