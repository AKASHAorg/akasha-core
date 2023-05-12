import { IconType } from '@akashaorg/typings/ui';

import akasha from './akasha';
import discord from './discord';
import faq from './faq';
import github from './github';
import shield from './shield';
import telegram from './telegram';
import twitter from './twitter';
import widget from './widget';

/**
 * maintain alphabetical order for custom icon names
 */
export type CustomIconTypes = Extract<
  IconType,
  'akasha' | 'discord' | 'faq' | 'github' | 'shield' | 'telegram' | 'twitter' | 'widget'
>;

export { akasha, discord, faq, github, shield, telegram, twitter, widget };
