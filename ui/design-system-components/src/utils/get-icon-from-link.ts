import { IconType } from '@akashaorg/typings/ui';

export const getIconFromLink = (href: string): IconType => {
  /*@TODO revisit the following logic 
      if (href.includes('github.com')) return 'github';
      if (href.includes('twitter.com')) return 'twitter';
      if (href.includes('discordapp.com')) return 'discord';
      if (href.includes('telegram.me') || href.includes('t.me')) return 'telegram';
  */
  return 'LinkIcon';
};
