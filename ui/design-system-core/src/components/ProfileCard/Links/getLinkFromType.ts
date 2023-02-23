import { Link } from '.';
import { EnsTxtPresets } from '../../types/common.types';

export const getLinkFromType = (link: Link, includeProtocol = false) => {
  const protocol = includeProtocol ? 'https://' : '';
  switch (link.type) {
    case EnsTxtPresets.GITHUB:
      return `${protocol}github.com/${link.value}`;
    case EnsTxtPresets.REDDIT:
      return `${protocol}reddit.com/user/${link.value}`;
    case EnsTxtPresets.TWITTER:
      return `${protocol}twitter.com/${link.value}`;
    case EnsTxtPresets.TELEGRAM:
      return `${protocol}t.me/${link.value}`;
    default:
      return (link.value || '').replace(protocol, '');
  }
};
