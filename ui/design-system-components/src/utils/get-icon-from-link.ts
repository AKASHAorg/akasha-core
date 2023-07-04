import { IconType } from '@akashaorg/typings/ui';

export const getIconFromLink = (href: string): IconType => {
  const host = new URL(href).host;
  if ('github.com'.includes(host)) return 'github';
  if ('twitter.com'.includes(host)) return 'twitter';
  if ('discordapp.com'.includes(host)) return 'discord';
  if ('telegram.me'.includes(host) || 't.me'.includes(host)) return 'telegram';
  return 'LinkIcon';
};
