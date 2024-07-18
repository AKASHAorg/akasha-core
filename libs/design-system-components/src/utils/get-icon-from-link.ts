import { IconType } from '@akashaorg/typings/lib/ui';
import isUrl from 'is-url';

export const getIconFromLink = (href: string): IconType | null => {
  if (!isUrl(href)) return null;
  const host = new URL(href).host;
  if (host.includes('github.com')) return 'Github';
  if (host.includes('twitter.com') || host.includes('x.com')) return 'Twitter';
  if (host.includes('discordapp.com')) return 'Discord';
  if (host.includes('t.me') || host.includes('telegram.me')) return 'Telegram';
  return 'LinkIcon';
};
