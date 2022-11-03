import classNames from 'classnames';
import React from 'react';
import styled, { css } from 'styled-components';
import CommonInterface from '../../interfaces/common.interface';
import * as icons from './new-icons';

// maintain alphabetical order for icon names
export type IconType =
  | 'appCenter'
  | 'appAkasha'
  | 'appEns'
  | 'appFeed'
  | 'appIpfs'
  | 'appModeration'
  | 'appSocial'
  | 'activity'
  | 'akasha'
  | 'alert'
  | 'addAppGrey'
  | 'addCard'
  | 'alignCenter'
  | 'alignJustify'
  | 'alignLeft'
  | 'alignRight'
  | 'announcement'
  | 'app'
  | 'arrowDown'
  | 'arrowUp'
  | 'arrowLeft'
  | 'arrowRight'
  | 'article'
  | 'available'
  | 'bold'
  | 'boldAlt'
  | 'block'
  | 'book'
  | 'bookmark'
  | 'calendar'
  | 'comments'
  | 'close'
  | 'closedEye'
  | 'code'
  | 'coinbase'
  | 'coins'
  | 'copy'
  | 'check'
  | 'checkSimple'
  | 'checkDouble'
  | 'chevronRight'
  | 'chevronLeft'
  | 'dapper'
  | 'dashboard'
  | 'discord'
  | 'document'
  | 'dropdown'
  | 'editSimple'
  | 'edit'
  | 'email'
  | 'emoji'
  | 'explore'
  | 'eye'
  | 'ethereum'
  | 'ethereumWorldLogo'
  | 'error'
  | 'facebook'
  | 'feedback'
  | 'follower'
  | 'following'
  | 'github'
  | 'hashtag'
  | 'hashtagGray'
  | 'heart'
  | 'home'
  | 'hotTopics'
  | 'image'
  | 'imtoken'
  | 'italic'
  | 'key'
  | 'info'
  | 'legal'
  | 'licensewtfpl'
  | 'licenseAllRights'
  | 'licenseAttribution'
  | 'licenseNoDerivatives'
  | 'licenseNoRights'
  | 'licenseNonCommercial'
  | 'licenseShareAlike'
  | 'licenseSomeRights'
  | 'link'
  | 'listBulleted'
  | 'listNumbered'
  | 'loading'
  | 'login'
  | 'media'
  | 'menuCollapsed'
  | 'menu'
  | 'menuPyramid'
  | 'metamask'
  | 'moreDark'
  | 'moreGrey'
  | 'notifications'
  | 'integrationAppLarge'
  | 'integrationAppSmall'
  | 'integrationAppSmallFill'
  | 'integrationWidgetLarge'
  | 'integrationWidgetSmall'
  | 'integrationAppCTA'
  | 'opera'
  | 'payment'
  | 'person'
  | 'pin'
  | 'pinAlt'
  | 'plusDark'
  | 'plusGrey'
  | 'questionMark'
  | 'quote'
  | 'reddit'
  | 'reload'
  | 'reply'
  | 'report'
  | 'safe'
  | 'search'
  | 'send'
  | 'settings'
  | 'settingsAlt'
  | 'share'
  | 'signOut'
  | 'status'
  | 'subscribe'
  | 'telegram'
  | 'stopwatch'
  | 'strikethrough'
  | 'subscribe'
  | 'shareSmallBlue'
  | 'shareSmallDark'
  | 'shareSmallGrey'
  | 'textcase'
  | 'textcaseLower'
  | 'textcaseUpper'
  | 'textcaseSentence'
  | 'thumbsDownGrey'
  | 'thumbsDownWhite'
  | 'thumbsUpGrey'
  | 'thumbsUpWhite'
  | 'transfer'
  | 'trash'
  | 'trendingApps'
  | 'trust'
  | 'twitter'
  | 'underline'
  | 'unpinAlt'
  | 'upload'
  | 'video'
  | 'wallet'
  | 'walletconnect'
  | 'web3'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomInAlt'
  | 'zoomOutAlt';

export const iconTypes: IconType[] = [
  'appAkasha',
  'appCenter',
  'appEns',
  'appFeed',
  'appIpfs',
  'appModeration',
  'appSocial',
  'activity',
  'addAppGrey',
  'akasha',
  'alert',
  'addCard',
  'alignCenter',
  'alignJustify',
  'alignLeft',
  'alignRight',
  'announcement',
  'app',
  'arrowDown',
  'arrowUp',
  'arrowLeft',
  'arrowRight',
  'article',
  'available',
  'bold',
  'boldAlt',
  'block',
  'book',
  'bookmark',
  'calendar',
  'comments',
  'close',
  'closedEye',
  'code',
  'coinbase',
  'copy',
  'check',
  'checkSimple',
  'checkDouble',
  'chevronRight',
  'chevronLeft',
  'coins',
  'dapper',
  'dashboard',
  'discord',
  'document',
  'dropdown',
  'editSimple',
  'edit',
  'email',
  'emoji',
  'explore',
  'eye',
  'ethereum',
  'ethereumWorldLogo',
  'error',
  'facebook',
  'feedback',
  'follower',
  'following',
  'github',
  'hashtag',
  'hashtagGray',
  'heart',
  'home',
  'hotTopics',
  'image',
  'imtoken',
  'info',
  'italic',
  'key',
  'legal',
  'licensewtfpl',
  'licenseAllRights',
  'licenseAttribution',
  'licenseNoDerivatives',
  'licenseNoRights',
  'licenseNonCommercial',
  'licenseShareAlike',
  'licenseSomeRights',
  'link',
  'listBulleted',
  'listNumbered',
  'loading',
  'login',
  'media',
  'menuCollapsed',
  'menu',
  'menuPyramid',
  'metamask',
  'moreDark',
  'moreGrey',
  'notifications',
  'integrationAppLarge',
  'integrationAppSmall',
  'integrationAppSmallFill',
  'integrationWidgetLarge',
  'integrationWidgetSmall',
  'integrationAppCTA',
  'opera',
  'payment',
  'person',
  'pin',
  'pinAlt',
  'plusDark',
  'questionMark',
  'quote',
  'reddit',
  'reload',
  'reply',
  'report',
  'safe',
  'search',
  'send',
  'settings',
  'settingsAlt',
  'signOut',
  'status',
  'share',
  'subscribe',
  'telegram',
  'stopwatch',
  'strikethrough',
  'subscribe',
  'shareSmallBlue',
  'shareSmallDark',
  'shareSmallGrey',
  'textcase',
  'textcaseLower',
  'textcaseUpper',
  'textcaseSentence',
  'thumbsDownGrey',
  'thumbsDownWhite',
  'thumbsUpGrey',
  'thumbsUpWhite',
  'transfer',
  'trash',
  'trendingApps',
  'trust',
  'twitter',
  'underline',
  'unpinAlt',
  'upload',
  'video',
  'wallet',
  'walletconnect',
  'web3',
  'zoomIn',
  'zoomOut',
  'zoomInAlt',
  'zoomOutAlt',
];

export interface IconProps extends CommonInterface<any> {
  color?: string;
  fill?: string;
  strokeWidth?: number;
  ref?: React.Ref<HTMLDivElement>;
  type: IconType | string;
  clickable?: boolean;
  clickableRed?: boolean;
  accentColor?: boolean;
  plain?: boolean;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  disabled?: boolean;
  wrapperStyle?: React.CSSProperties;
  testId?: string;
  themeColor?: string;
}

const StyledRefDiv = styled.div<Partial<IconProps>>`
  display: flex;
  align-items: center;
  user-select: none;
  ${props =>
    !props.plain &&
    `
    & * {
      stroke: ${props.theme.colors.primaryText};
    }`};
  ${props =>
    props.color &&
    `
      & * {
        stroke: ${props.color};
      }`};
  ${props =>
    props.accentColor &&
    `
      & * {
        stroke: ${props.theme.colors.accent};
      }`};
  ${props =>
    props.themeColor &&
    `
      & * {
        stroke: ${props.theme.colors[props.themeColor]};
      }`};
  ${props =>
    props.clickable &&
    !props.disabled &&
    `
      cursor: pointer;
      &: hover {
        & * {
          stroke: ${props.theme.colors.accent};
        }
      }
    `};
  ${props =>
    props.clickableRed &&
    `
        cursor: pointer;
        &: hover {
          & * {
            stroke: ${props.theme.colors.red};
          }
        }
      `};
`;

const StyledFillRefDiv = styled.div<Partial<IconProps>>`
  display: flex;
  align-items: center;
  user-select: none;
  ${props =>
    !props.plain &&
    `
    & * {
      fill: ${props.theme.colors.primaryText};
    }`};
  ${props =>
    props.color &&
    `
      & * {
        fill: ${props.color};
      }`};
  ${props =>
    props.accentColor &&
    `
      & * {
        fill: ${props.theme.colors.accent};
      }`};
  ${props =>
    props.themeColor &&
    `
      & * {
        fill: ${props.theme.colors[props.themeColor]};
      }`};
  ${props =>
    props.clickable &&
    !props.disabled &&
    `
      cursor: pointer;
      &: hover {
        & * {
          fill: ${props.theme.colors.accent};
        }
      }
    `};
  ${props =>
    props.clickableRed &&
    `
        cursor: pointer;
        &: hover {
          & * {
            fill: ${props.theme.colors.red};
          }
        }
      `};
`;

const fillIcons: IconType[] = [
  'akasha',
  'integrationAppSmall',
  'integrationAppSmallFill',
  'integrationWidgetSmall',
  'appModeration',
  'explore',
  'legal',
  'dashboard',
];
const IconBase: React.FC<IconProps> = React.forwardRef((props, ref) => {
  const Component = (icons as any)[props.type];
  // here we destructure some props we don't want applied to DOM elements
  const {
    plain,
    accentColor,
    clickable,
    clickableRed,
    color,
    disabled,
    testId,
    wrapperStyle,
    themeColor,
    ...other
  } = props;
  if (!Component) {
    // tslint:disable-next-line no-console
    console.error('There is no such icon', props.type);
    return null;
  }
  const iconClass = classNames('icon', props.className);
  if (fillIcons.includes(props.type as IconType)) {
    return (
      <StyledFillRefDiv
        ref={ref}
        style={wrapperStyle}
        plain={plain}
        accentColor={accentColor}
        clickable={clickable}
        clickableRed={clickableRed}
        color={color}
        disabled={disabled}
        themeColor={themeColor}
      >
        <Component className={iconClass} data-testid={testId} {...other} />
      </StyledFillRefDiv>
    );
  }
  return (
    <StyledRefDiv
      ref={ref}
      style={wrapperStyle}
      plain={plain}
      accentColor={accentColor}
      clickable={clickable}
      clickableRed={clickableRed}
      color={color}
      disabled={disabled}
      themeColor={themeColor}
    >
      <Component className={iconClass} data-testid={testId} {...other} />
    </StyledRefDiv>
  );
});

const Icon: React.FC<IconProps> = styled(IconBase)`
  ${props => {
    if (props.size) {
      switch (props.size) {
        case 'xxs':
          return css`
            width: 0.75rem;
            height: 0.75rem;
          `;
        case 'xs':
          return css`
            width: 1rem;
            height: 1rem;
          `;
        case 'sm':
          return css`
            width: 1.25rem;
            height: 1.25rem;
          `;
        case 'md':
          return css`
            width: 1.5rem;
            height: 1.5rem;
          `;
        case 'lg':
          return css`
            width: 2rem;
            height: 2rem;
          `;
        case 'xl':
          return css`
            width: 2.5rem;
            height: 2.5rem;
          `;
        case 'xxl':
          return css`
            width: 6.5rem;
            height: 6.5rem;
          `;
        default:
          return css`
            width: 1.5rem;
            height: 1.5rem;
          `;
      }
    }
    return;
  }};
`;

export default Icon;
