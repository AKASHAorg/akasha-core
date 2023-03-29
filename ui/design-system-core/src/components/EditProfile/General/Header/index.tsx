import React from 'react';
import Avatar, { IAvatarProps } from '../../../Avatar';
import Button from '../../../Button';
import Card from '../../../Card';
import Stack from '../../../Stack';
import Text from '../../../Text';
import { ImageSrc } from '../../../types/common.types';
import { tw } from '@twind/core';
import { getColorClasses } from '../../../../utils/getColorClasses';

export type HeaderProps = {
  coverImage: ImageSrc;
  avatar: IAvatarProps['src'];
  ethAddress: IAvatarProps['ethAddress'];
  label: string;
};

export const Header: React.FC<HeaderProps> = ({ label, coverImage, ethAddress, avatar }) => {
  return (
    <Stack direction="column" spacing="gap-y-2">
      <Text variant="h6">{label}</Text>
      <div className={tw('relative mb-8')}>
        <Card
          radius={20}
          background={{ light: 'bg-grey6', dark: 'bg-grey5' }}
          customStyle={`flex p-4 h-28 w-full bg-center bg-[url(${
            coverImage?.url || coverImage?.fallbackUrl || '/images/cover-image.webp'
          })]`}
        >
          <Stack customStyle="mt-auto ml-auto">
            <Button icon="PencilSquareIcon" size="sm" variant="primary" greyBg iconOnly />
          </Stack>
        </Card>
        <Stack align="center" justify="center" customStyle="absolute left-6 -bottom-8">
          <Avatar
            ethAddress={ethAddress}
            size="lg"
            src={avatar}
            customStyle={`border-2 ${getColorClasses(
              {
                light: 'white',
                dark: 'grey2',
              },
              'border',
            )}`}
          />
          <Button
            icon="PencilSquareIcon"
            size="sm"
            variant="primary"
            customStyle="absolute"
            greyBg
            iconOnly
          />
        </Stack>
      </div>
    </Stack>
  );
};
