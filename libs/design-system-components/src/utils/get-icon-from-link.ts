import { IconType } from '@akashaorg/typings/lib/ui';

export const getIconFromLink = (href: string): IconType => {
  const host = new URL(href).host;
  if ('github.com'.includes(host)) return 'Github';
  if ('twitter.com'.includes(host)) return 'Twitter';
  if ('discordapp.com'.includes(host)) return 'Discord';
  if ('telegram.me'.includes(host) || 't.me'.includes(host)) return 'Telegram';
  return 'LinkIcon';
};
