import React from 'react';
import { IconType } from '../../Icon/icon';
export interface ISubtitleTextIcon {
  className?: string;
  iconType?: IconType;
  iconSize?: string;
  label: string | number;
  labelColor?: string;
  labelSize?: 'small' | 'large';
  subtitle: string;
  subtitleColor?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  gap?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';
}
declare const SubtitleTextIcon: React.FC<ISubtitleTextIcon>;
export default SubtitleTextIcon;
