import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import CommonInterface from '../../interfaces/common.interface';
import * as icons from './new-icons';

// type IconType =
//   | 'activity'
//   | 'akasha'
//   | 'akashaWelcome'
//   | 'arrowDown'
//   | 'arrowDropdownClose'
//   | 'arrowDropdownOpen'
//   | 'arrowLeft'
//   | 'arrowRight'
//   | 'arrowsUpDown'
//   | 'arrowUp'
//   | 'back'
//   | 'bold'
//   | 'bookmark'
//   | 'chat'
//   | 'check'
//   | 'close'
//   | 'closeEntryOption'
//   | 'comment'
//   | 'commentLarge'
//   | 'community'
//   | 'dashboard'
//   | 'discord'
//   | 'draft'
//   | 'edit'
//   | 'emojiHug'
//   | 'entries'
//   | 'entry'
//   | 'essence'
//   | 'facebook'
//   | 'followers'
//   | 'following'
//   | 'forward'
//   | 'geth'
//   | 'gethGreen'
//   | 'gethOrange'
//   | 'gethRed'
//   | 'github'
//   | 'heart'
//   | 'highlight'
//   | 'importIcon'
//   | 'ipfs'
//   | 'ipfsGreen'
//   | 'ipfsOrange'
//   | 'ipfsRed'
//   | 'italic'
//   | 'karma'
//   | 'link'
//   | 'linkEntry'
//   | 'lists'
//   | 'lock'
//   | 'mana'
//   | 'mediaEntry'
//   | 'menu'
//   | 'more'
//   | 'newEntry'
//   | 'notifications'
//   | 'notificationsOn'
//   | 'openEntryOptions'
//   | 'photoImage'
//   | 'plus'
//   | 'profileOverview'
//   | 'question'
//   | 'questionCircle'
//   | 'quote'
//   | 'reddit'
//   | 'refresh'
//   | 'reload'
//   | 'reply'
//   | 'search'
//   | 'settings'
//   | 'share'
//   | 'shareLarge'
//   | 'stats'
//   | 'tag'
//   | 'textEntry'
//   | 'timer'
//   | 'trash'
//   | 'twitter'
//   | 'underline'
//   | 'user'
//   | 'video'
//   | 'wallet'
//   | 'zipFile'

export interface IconProps extends CommonInterface<any> {
  color?: string;
  className?: string;
  type: string;
}

const IconBase: React.FC<IconProps> = ({ color, className, type, ...props }) => {
  const Component = (icons as any)[type];
  const iconClass = classNames('icon', className);
  return <Component className={iconClass} {...props} />;
};

const Icon: React.FC<IconProps> = styled(IconBase)`
  stroke: ${props => props.color || props.theme.colors.darkBackground};
`;

export default Icon;
