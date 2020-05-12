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
  | 'available'
  | 'bold'
  | 'bookmark'
  | 'calendar'
  | 'comments'
  | 'close'
  | 'code'
  | 'coins'
  | 'copy'
  | 'check'
  | 'document'
  | 'editSimple'
  | 'edit'
  | 'emoji'
  | 'eye'
  | 'ethereumWorldLogo'
  | 'error'
  | 'facebook'
  | 'heart'
  | 'home'
  | 'hotTopics'
  | 'image'
  | 'italic'
  | 'info'
  | 'link'
  | 'loading'
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
  | 'trash'
  | 'trendingApps'
  | 'twitter'
  | 'underline'
  | 'upload'
  | 'wallet'
  | 'iconGeneralFeed';

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
  'available',
  'bold',
  'bookmark',
  'calendar',
  'comments',
  'close',
  'code',
  'copy',
  'check',
  'coins',
  'document',
  'editSimple',
  'edit',
  'emoji',
  'eye',
  'ethereumWorldLogo',
  'error',
  'facebook',
  'heart',
  'home',
  'hotTopics',
  'image',
  'info',
  'italic',
  'link',
  'loading',
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
  'trash',
  'trendingApps',
  'twitter',
  'underline',
  'upload',
  'wallet',
  'iconGeneralFeed',
];

export interface IconProps extends CommonInterface<any> {
  color?: string;
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
  type: IconType | string;
  clickable?: boolean;
  primaryColor?: boolean;
  accentColor?: boolean;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
}

const StyledRefDiv = styled.div`
  display: flex;
  align-items: center;
`;

const IconBase: React.FC<IconProps> = React.forwardRef(
  ({ color, size, clickable, type, primaryColor, accentColor, ...props }, ref) => {
    const Component = (icons as any)[type];
    if (!Component) {
      console.error('There is no such in icon', type);
      return null;
    }
    const iconClass = classNames('icon', props.className);
    return (
      <StyledRefDiv ref={ref}>
        <Component className={iconClass} {...props} />
      </StyledRefDiv>
    );
  },
);

const Icon: React.FC<IconProps> = styled(IconBase)`
  ${props =>
    props.color &&
    `
      & * {
        stroke: ${props.color};
      }`}
  ${props =>
    props.primaryColor &&
    `
      & * {
        stroke: ${props.theme.colors.primaryText};
      }`}
      ${props =>
        props.accentColor &&
        `
          & * {
            stroke: ${props.theme.colors.accent};
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
          case 'xxs':
            return css`
              width: 0.75em;
              height: 0.75em;
            `;
          case 'xs':
            return css`
              width: 1em;
              height: 1em;
            `;
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
