import * as React from 'react';
import CommonInterface from '../../interfaces/common.interface';
import MarginInterface from '../../interfaces/margin.interface';
import { AvatarSize } from './styled-avatar';
export interface AvatarProps extends CommonInterface<HTMLDivElement> {
  ethAddress: string | null;
  src?: string;
  onClick?: React.MouseEventHandler<any>;
  alt?: string;
  margin?: MarginInterface;
  backgroundColor?: string;
  border?: 'sm' | 'md' | 'lg';
  size?: AvatarSize;
  publicImgPath?: string;
}
export declare const getAvatarFromSeed: (seed: string | null) => number;
declare const Avatar: React.FC<AvatarProps>;
export default Avatar;
