import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import CommonInterface from '../../interfaces/common.interface';
import * as icons from './new-icons';

export type IconType =
  | 'addAppDark'
  | 'addAppGrey'
  | 'app'
  | 'arrowDown'
  | 'arrowLeft'
  | 'arrowRight'
  | 'bookmark'
  | 'comments'
  | 'close'
  | 'edit'
  | 'emoji'
  | 'heart'
  | 'home'
  | 'hotTopics'
  | 'link'
  | 'media'
  | 'moreDark'
  | 'moreGrey'
  | 'notifications'
  | 'person'
  | 'plusDark'
  | 'plusGrey'
  | 'quoteDark'
  | 'quoteGrey'
  | 'reply'
  | 'report'
  | 'search'
  | 'share'
  | 'shareSmallBlue'
  | 'shareSmallDark'
  | 'shareSmallGrey'
  | 'thumbsDownGrey'
  | 'thumbsDownWhite'
  | 'thumbsUpGrey'
  | 'thumbsUpWhite'
  | 'trendingApps'
  | 'wallet';

export const iconTypes: IconType[] = [
  'addAppGrey',
  'addAppDark',
  'app',
  'arrowDown',
  'arrowLeft',
  'arrowRight',
  'bookmark',
  'comments',
  'close',
  'edit',
  'emoji',
  'heart',
  'home',
  'hotTopics',
  'link',
  'media',
  'moreDark',
  'moreGrey',
  'notifications',
  'person',
  'plusDark',
  'quoteDark',
  'quoteGrey',
  'reply',
  'report',
  'search',
  'share',
  'shareSmallBlue',
  'shareSmallDark',
  'shareSmallGrey',
  'thumbsDownGrey',
  'thumbsDownWhite',
  'thumbsUpGrey',
  'thumbsUpWhite',
  'trendingApps',
  'wallet',
];

export interface IconProps extends CommonInterface<any> {
  color?: string;
  className?: string;
  type: IconType;
}

const IconBase: React.FC<IconProps> = ({ color, className, type, ...props }) => {
  const Component = (icons as any)[type];
  const iconClass = classNames('icon', className);
  return <Component className={iconClass} {...props} />;
};

const Icon: React.FC<IconProps> = styled(IconBase)`
  ${props => props.color && `stroke: ${props.color};`}
`;

export default Icon;
