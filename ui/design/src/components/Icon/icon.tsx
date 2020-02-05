import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import CommonInterface from '../../interfaces/common.interface';
import * as icons from './new-icons';

export type IconType =
  | 'activity'
  | 'addAppDark'
  | 'addAppGrey'
  | 'addCard'
  | 'announcement'
  | 'app'
  | 'arrowDown'
  | 'arrowLeft'
  | 'arrowRight'
  | 'bold'
  | 'bookmark'
  | 'calendar'
  | 'comments'
  | 'close'
  | 'code'
  | 'coins'
  | 'document'
  | 'editSimple'
  | 'edit'
  | 'emoji'
  | 'eye'
  | 'ethereumWorldLogo'
  | 'heart'
  | 'home'
  | 'hotTopics'
  | 'image'
  | 'italic'
  | 'link'
  | 'media'
  | 'moreDark'
  | 'moreGrey'
  | 'notifications'
  | 'payment'
  | 'person'
  | 'pin'
  | 'plusDark'
  | 'plusGrey'
  | 'quote'
  | 'reload'
  | 'reply'
  | 'report'
  | 'search'
  | 'settings'
  | 'share'
  | 'stopwatch'
  | 'shareSmallBlue'
  | 'shareSmallDark'
  | 'shareSmallGrey'
  | 'thumbsDownGrey'
  | 'thumbsDownWhite'
  | 'thumbsUpGrey'
  | 'thumbsUpWhite'
  | 'transfer'
  | 'trendingApps'
  | 'underline'
  | 'upload'
  | 'wallet';

export const iconTypes: IconType[] = [
  'activity',
  'addAppGrey',
  'addAppDark',
  'addCard',
  'announcement',
  'app',
  'arrowDown',
  'arrowLeft',
  'arrowRight',
  'bold',
  'bookmark',
  'calendar',
  'comments',
  'close',
  'code',
  'coins',
  'document',
  'editSimple',
  'edit',
  'emoji',
  'eye',
  'ethereumWorldLogo',
  'heart',
  'home',
  'hotTopics',
  'image',
  'italic',
  'link',
  'media',
  'moreDark',
  'moreGrey',
  'notifications',
  'payment',
  'person',
  'pin',
  'plusDark',
  'quote',
  'reload',
  'reply',
  'report',
  'search',
  'settings',
  'share',
  'stopwatch',
  'shareSmallBlue',
  'shareSmallDark',
  'shareSmallGrey',
  'thumbsDownGrey',
  'thumbsDownWhite',
  'thumbsUpGrey',
  'thumbsUpWhite',
  'transfer',
  'trendingApps',
  'underline',
  'upload',
  'wallet',
];

export interface IconProps extends CommonInterface<any> {
  color?: string;
  className?: string;
  type: IconType;
  clickable?: boolean;
  default?: boolean;
}

const IconBase: React.FC<IconProps> = ({ color, className, type, clickable, ...props }) => {
  const Component = (icons as any)[type];
  const iconClass = classNames('icon', className);
  return <Component className={iconClass} {...props} />;
};

const Icon: React.FC<IconProps> = styled(IconBase)`
  ${props =>
    props.color &&
    `
      & * {
        stroke: ${props.color};
      }`}
  ${props =>
    props.default &&
    `
      & * {
        stroke: ${props.theme.colors.primaryText};
      }`}
  ${props =>
    props.clickable &&
    `
      cursor: pointer;
      &: hover {
        & * {
          stroke: ${props.theme.colors.accent};
        }
      }
    `}
`;

export { Icon };
