import { IconType } from '@akashaorg/typings/ui';
import akasha from './akasha';
import discord from './discord';
import github from './github';
import telegram from './telegram';
import twitter from './twitter';
import widget from './widget';

/**
 * maintain alphabetical order for custom icon names
 */
export type CustomIconTypes = Extract<
  IconType,
  'akasha' | 'discord' | 'github' | 'telegram' | 'twitter' | 'widget'
>;

export { akasha, discord, github, telegram, twitter, widget };
