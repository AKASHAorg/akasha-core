import React from 'react';

import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { CopyToClipboard } from '@akashaorg/ui/lib/akasha-components/copy-to-clipboard';
import { LinkIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import {
  Discord,
  Github,
  Telegram,
  Twitter,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { getIconFromLink } from '../../../utils/get-icon-from-link';
import { ProfileLinkSource } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type LinksProps = {
  title: string;
  links: ProfileLinkSource[];
  copyLabel?: string;
  copiedLabel?: string;
};

const Links: React.FC<LinksProps> = ({ title, links }) => {
  const iconsMap: Record<string, { icon: React.ReactElement; solid: boolean }> = {
    Github: { icon: <Github />, solid: false },
    Twitter: { icon: <Twitter />, solid: true },
    Discord: { icon: <Discord />, solid: true },
    Telegram: { icon: <Telegram />, solid: true },
    LinkIcon: { icon: <LinkIcon />, solid: false },
  };

  return (
    <Card className="p-4">
      <Stack direction="column" spacing={2} className="w-fit">
        <Text variant="label">{title}</Text>
        {links.map((link, index) => {
          const iconType = getIconFromLink(link.href);
          const { icon, solid } = iconsMap[iconType]
            ? iconsMap[iconType]
            : { icon: <LinkIcon />, solid: false };

          return (
            <CopyToClipboard key={`${link.href}${index}`} textToCopy={link.href}>
              <Stack direction="row" alignItems="center" spacing={2} className="w-fit">
                <AppIcon placeholderIcon={icon} solid={solid} size="xs" accentColor />
                <Text
                  variant="body2"
                  color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                  breakWord
                  className="w-fit"
                >
                  {link.href}
                </Text>
              </Stack>
            </CopyToClipboard>
          );
        })}
      </Stack>
    </Card>
  );
};

export default Links;
