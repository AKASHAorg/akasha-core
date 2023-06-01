import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import CopyToClipboard from '@akashaorg/design-system-core/lib/components/CopyToClipboard';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import { getIconFromLink } from '../../../utils/get-icon-from-link';
import { Link } from '../../types/common.types';

export interface LinksProps {
  title: string;
  links: Link[];
  copyLabel?: string;
  copiedLabel?: string;
}

const Links: React.FC<LinksProps> = ({ title, links }) => {
  return (
    <Card elevation="1" radius={20} padding={16}>
      <Stack direction="column" spacing="gap-y-2.5">
        <Text variant="label">{title}</Text>
        {links.map((link, index) => (
          <CopyToClipboard key={link.label + index} value={link.href}>
            <Stack align="center" spacing="gap-x-2">
              <AppIcon placeholderIconType={getIconFromLink(link.href)} size="xs" accentColor />
              <Text
                variant="body2"
                color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                breakWord
              >
                {link.href}
              </Text>
            </Stack>
          </CopyToClipboard>
        ))}
      </Stack>
    </Card>
  );
};

export default Links;
