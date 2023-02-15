import React from 'react';
import { IconName } from '../Icon';
import { Status } from '../types/common.types';

export type InputProps = {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  caption?: string;
  iconLeft?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  status?: Status;
  onChange?: React.EventHandler<React.ChangeEvent<HTMLInputElement>>;
};

export type LabelProps = {
  disabled?: InputProps['disabled'];
};

export type CaptionProps = {
  disabled?: InputProps['disabled'];
  status?: InputProps['status'];
};

export type TextFieldProps = InputProps;
