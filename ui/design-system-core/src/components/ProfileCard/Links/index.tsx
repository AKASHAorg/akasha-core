import { apply, tw } from '@twind/core';
import React from 'react';
import Icon from '../../Icon';
import Stack from '../../Stack';
import Text from '../../Text';
import Card from '../../Card';
import { getIconFromType } from './getIconFromType';
import { getLinkFromType } from './getLinkFromType';
import CopyToClipboard from '../../CopyToClipboard';

export type Link = {
  type: string;
  value: string;
};

export interface LinksProps {
  title: string;
  links: Link[];
  copyLabel?: string;
  copiedLabel?: string;
}

const Links: React.FC<LinksProps> = ({ title, links }) => {
  const iconContainerStyle = tw(apply`h-5 w-5 rounded-full bg-grey9 dark:grey3`);
  const iconStyle = tw(apply`h-3 [&>*]:stroke-secondary-light dark:[&>*]:stroke-secondary-dark`);

  return (
    <Card elevation="1" radius={20} padding={16}>
      <Stack direction="column" spacing="gap-y-2.5">
        <Text variant="label">{title}</Text>
        {links.map((link, index) => (
          <CopyToClipboard key={link.type + index} value={getLinkFromType(link, true)}>
            <Stack spacing="gap-x-2">
              <Stack align="center" justify="center" className={iconContainerStyle}>
                <Icon type={getIconFromType(link.type)} styling={iconStyle} />
              </Stack>
              <Text
                variant="body2"
                color={{ light: 'text-secondary-light', dark: 'text-secondary-dark' }}
              >
                {getLinkFromType(link)}
              </Text>
            </Stack>
          </CopyToClipboard>
        ))}
      </Stack>
    </Card>
  );
};

export default Links;
