import React from 'react';
import { tw } from '@twind/core';

import Card from '../../Card';
import Divider from '../../Divider';
import Stack from '../../Stack';
import TextLine from '../../TextLine';
import { CircularPlaceholder } from '../../CircularPlaceholder';

const ProfileLoading = () => {
  return (
    <Stack direction="column" spacing="gap-y-4">
      <div>
        <Card
          elevation="1"
          radius={{ top: 20 }}
          background={{ light: 'grey6', dark: 'grey5' }}
          customStyle="h-32"
        ></Card>
        <Card elevation="1" radius={{ bottom: 20 }} padding="px-[0.5rem] pb-[1rem] pt-0">
          <Stack direction="column" customStyle="pl-2" fullWidth>
            <Stack spacing="gap-x-2" customStyle="-ml-2">
              <div className={tw('relative w-20 h-[3.5rem] shrink-0')}>
                <CircularPlaceholder customStyle="absolute -top-6" />
              </div>
              <Stack direction="column" spacing="gap-y-1.5" customStyle="mt-1">
                <TextLine width="w-36" animated />
                <TextLine width="w-28" animated />
              </Stack>
              <CircularPlaceholder
                height="h-8"
                width="w-8"
                customStyle="ml-auto shrink-0"
                animated
              />
            </Stack>
            <Stack direction="column" spacing="gap-y-4">
              <Stack direction="column" spacing="gap-y-1.5">
                <TextLine width="w-40" animated />
                <TextLine animated />
              </Stack>
              <Divider />
              <Stack direction="column" spacing="gap-y-1.5">
                <TextLine width="w-24" animated />
                <TextLine width="w-72" animated />
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </div>
      <Card elevation="1" radius={20} padding={16}>
        <Stack direction="column" spacing="gap-2">
          <TextLine width="w-24" animated />
          <Stack direction="column" spacing="gap-1">
            <TextLine width="w-full" animated />
            <TextLine width="w-full" animated />
            <TextLine width="w-full" animated />
          </Stack>
        </Stack>
      </Card>
      <Card elevation="1" radius={20} padding={16}>
        <Stack direction="column" spacing="gap-4" fullWidth>
          <TextLine width="w-20" animated />
          <Stack justify="between">
            <Stack direction="column" spacing="gap-2">
              <CircularPlaceholder height="h-12" width="w-12" customStyle="shrink-0" animated />
              <Stack direction="column" spacing="gap-1">
                <TextLine width="w-11" animated />
                <TextLine width="w-11" animated />
              </Stack>
            </Stack>
            <Stack direction="column" spacing="gap-2">
              <CircularPlaceholder height="h-12" width="w-12" customStyle="shrink-0" />
              <Stack direction="column" spacing="gap-1">
                <TextLine width="w-11" animated />
                <TextLine width="w-11" animated />
              </Stack>
            </Stack>
            <Stack direction="column" spacing="gap-2">
              <CircularPlaceholder height="h-12" width="w-12" customStyle="shrink-0" animated />
              <Stack direction="column" spacing="gap-1">
                <TextLine width="w-11" animated />
                <TextLine width="w-11" animated />
              </Stack>
            </Stack>
            <Stack direction="column" spacing="gap-2" customStyle="w-fit">
              <CircularPlaceholder height="h-12" width="w-12" customStyle="shrink-0" animated />
              <Stack direction="column" spacing="gap-1">
                <TextLine width="w-11" animated />
                <TextLine width="w-11" animated />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Card>
      <Card elevation="1" radius={20} padding={16}>
        <Stack direction="column" spacing="gap-2">
          <TextLine width="w-24" animated />
          <TextLine width="w-full" animated />
        </Stack>
      </Card>
    </Stack>
  );
};

export default ProfileLoading;
