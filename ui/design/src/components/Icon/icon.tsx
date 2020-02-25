import classNames from 'classnames';
import React from 'react';
import styled, { css } from 'styled-components';
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
  | 'facebook'
  | 'heart'
  | 'home'
  | 'hotTopics'
  | 'image'
  | 'italic'
  | 'info'
  | 'link'
  | 'media'
  | 'menu'
  | 'moreDark'
  | 'moreGrey'
  | 'notifications'
  | 'payment'
  | 'person'
  | 'pin'
  | 'plusDark'
  | 'plusGrey'
  | 'quote'
  | 'reddit'
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
  | 'twitter'
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
  'facebook',
  'heart',
  'home',
  'hotTopics',
  'image',
  'info',
  'italic',
  'link',
  'media',
  'menu',
  'moreDark',
  'moreGrey',
  'notifications',
  'payment',
  'person',
  'pin',
  'plusDark',
  'quote',
  'reddit',
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
  'twitter',
  'underline',
  'upload',
  'wallet',
];

export interface IconProps extends CommonInterface<any> {
  color?: string;
  className?: string;
  type: IconType | string;
  clickable?: boolean;
  default?: boolean;
  size?: 'sm' | 'md' | 'lg';
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
    ${props => {
      if (props.size) {
        switch (props.size) {
          case 'sm':
            return css`
              width: 1.5em;
              height: 1.5em;
            `;
          case 'md':
            return css`
              width: 2em;
              height: 2em;
            `;
          case 'lg':
            return css`
              width: 2.5em;
              height: 2.5em;
            `;
          default:
            return css`
              width: 1.5em;
              height: 1.5em;
            `;
        }
      }
      return;
    }}
`;

export { Icon };
