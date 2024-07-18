import { IconType } from '@akashaorg/typings/lib/ui';

export const getIconFromLink = (href: string): IconType | null => {
  const host = new URL(href).host;
  if (checkHostMatchesDomain(host, 'github.com')) return 'Github';
  if (checkHostMatchesDomain(host, 'twitter.com') || checkHostMatchesDomain(host, 'x.com'))
    return 'Twitter';
  if (checkHostMatchesDomain(host, 'discordapp.com')) return 'Discord';
  if (checkHostMatchesDomain(host, 't.me') || checkHostMatchesDomain(host, 'telegram.me'))
    return 'Telegram';
  return 'LinkIcon';
};

function checkHostMatchesDomain(host: string, domain: string) {
  const regex = new RegExp(`^((https?://)?(www.)?)${domain}(?:\\/.*)?`);
  return regex.test(host);
}
