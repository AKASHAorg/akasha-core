import React from 'react';

import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { CopyToClipboard } from '@akashaorg/ui/lib/akasha-components/copy-to-clipboard';
import { LinkIcon } from 'lucide-react';
import {
  Discord,
  Github,
  Telegram,
  Twitter,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';

import { getIconFromLink } from '@akashaorg/design-system-components/lib/utils/get-icon-from-link';
import { ProfileLinkSource } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type LinksProps = {
  title: string;
  links: ProfileLinkSource[];
  copyLabel?: string;
  copiedLabel?: string;
};

const Links: React.FC<LinksProps> = ({ title, links }) => {
  const outlineStyle = 'h-3 w-3 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark';
  const solidStyle = 'h-3 w-3 [&>*]:fill-secondaryLight dark:[&>*]:fill-secondaryDark';

  const iconsMap: Record<string, { icon: React.ReactElement; solid: boolean }> = {
    Github: { icon: <Github className={outlineStyle} />, solid: false },
    Twitter: { icon: <Twitter className={solidStyle} />, solid: true },
    Discord: { icon: <Discord className={solidStyle} />, solid: true },
    Telegram: { icon: <Telegram className={solidStyle} />, solid: true },
    LinkIcon: { icon: <LinkIcon className={outlineStyle} />, solid: false },
  };

  return (
    <Card className="p-4">
      <Stack direction="column" spacing={2} className="w-fit">
        <Typography variant="p">{title}</Typography>
        {links.map((link, index) => {
          const iconType = getIconFromLink(link.href);
          const { icon, solid } = iconsMap[iconType]
            ? iconsMap[iconType]
            : { icon: <LinkIcon />, solid: false };

          return (
            <CopyToClipboard key={`${link.href}${index}`} textToCopy={link.href}>
              <Stack direction="row" alignItems="center" spacing={2} className="w-fit">
                <AppIcon placeholderIcon={icon} solid={solid} size="xs" accentColor />
                <Typography variant="p" className="w-fit text-primary">
                  {link.href}
                </Typography>
              </Stack>
            </CopyToClipboard>
          );
        })}
      </Stack>
    </Card>
  );
};

export default Links;
