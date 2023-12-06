import React from 'react';

import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import CopyToClipboard from '@akashaorg/design-system-core/lib/components/CopyToClipboard';
import { LinkIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import {
  Discord,
  Github,
  Telegram,
  Twitter,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { getIconFromLink } from '../../../utils/get-icon-from-link';
import { AkashaProfileLinkSource } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type LinksProps = {
  title: string;
  links: AkashaProfileLinkSource[];
  copyLabel?: string;
  copiedLabel?: string;
};

const Links: React.FC<LinksProps> = ({ title, links }) => {
  const iconsMap: Record<string, { icon: React.ReactElement; solid: boolean }> = {
    github: { icon: <Github />, solid: false },
    twitter: { icon: <Twitter />, solid: true },
    discord: { icon: <Discord />, solid: true },
    telegram: { icon: <Telegram />, solid: true },
    LinkIcon: { icon: <LinkIcon />, solid: false },
  };

  return (
    <Card elevation="1" radius={20} padding={'p-4'}>
      <Stack direction="column" spacing="gap-y-2.5">
        <Text variant="label">{title}</Text>
        {links.map((link, index) => {
          const iconType = getIconFromLink(link.href);
          const { icon, solid } = iconsMap[iconType]
            ? iconsMap[iconType]
            : { icon: <LinkIcon />, solid: false };

          return (
            <CopyToClipboard key={`${link.href}${index}`} value={link.href}>
              <Stack direction="row" align="center" spacing="gap-x-2">
                <AppIcon placeholderIcon={icon} solid={solid} size="xs" accentColor />
                <Text
                  variant="body2"
                  color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                  breakWord
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
