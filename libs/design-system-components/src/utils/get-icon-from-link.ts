import { IconType } from '@akashaorg/typings/lib/ui';
import isUrl from 'is-url';

export const getIconFromLink = (href: string): IconType | null => {
  if (!isUrl(href)) return null;
  const host = new URL(href).host;
  if (host.endsWith('github.com')) return 'Github';
  if (host.endsWith('twitter.com') || host.endsWith('x.com')) return 'Twitter';
  if (host.endsWith('discordapp.com')) return 'Discord';
  if (host.endsWith('t.me') || host.endsWith('telegram.me')) return 'Telegram';
  return 'LinkIcon';
};
