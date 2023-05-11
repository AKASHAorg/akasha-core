import { IconType } from '@akashaorg/typings/ui';
import { EnsTxtPresets } from '@akashaorg/design-system-core/lib/components/types/common.types';

export const getIconFromType = (type: string): IconType => {
  switch (type) {
    case EnsTxtPresets.GITHUB:
      return 'github';
    case EnsTxtPresets.TWITTER:
      return 'twitter';
    case EnsTxtPresets.DISCORD:
      return 'discord';
    case EnsTxtPresets.TELEGRAM:
      return 'telegram';
    default:
      return 'LinkIcon';
  }
};
