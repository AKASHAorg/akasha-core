import { IconType } from '@akashaorg/typings/ui';

import akasha from './akasha';
import discord from './discord';
import faq from './faq';
import github from './github';
import shield from './shield';
import telegram from './telegram';
import twitter from './twitter';
import widget from './widget';
import metamask from './metamask';
import walletconnect from './walletconnect';

/**
 * maintain alphabetical order for custom icon names
 */
export type CustomIconTypes = Extract<
  IconType,
  | 'akasha'
  | 'discord'
  | 'faq'
  | 'github'
  | 'metamask'
  | 'shield'
  | 'telegram'
  | 'twitter'
  | 'walletconnect'
  | 'widget'
>;

export { akasha, discord, faq, github, metamask, shield, telegram, twitter, walletconnect, widget };
