import React from 'react';
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
          background={{ light: 'bg-grey6', dark: 'bg-grey5' }}
          className="h-32"
        ></Card>
        <Card elevation="1" radius={{ bottom: 20 }} padding="px-[0.5rem] pb-[1rem] pt-0">
          <Stack direction="column" className="pl-2">
            <Stack spacing="gap-x-2 -ml-2">
              <div className="relative w-20 h-[3.5rem] shrink-0">
                <CircularPlaceholder className="absolute -top-6" />
              </div>
              <Stack direction="column" spacing="gap-y-1.5" className="mt-1">
                <TextLine width="w-36" animated />
                <TextLine width="w-28" animated />
              </Stack>
              <CircularPlaceholder height="h-8" width="w-8" className="ml-auto shrink-0" animated />
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
        <Stack direction="column" spacing="gap-2">
          <TextLine width="w-24" animated />
          <TextLine width="w-full" animated />
        </Stack>
      </Card>
      <Card elevation="1" radius={20} padding={16} className="hidden sm:block">
        <Stack direction="column" spacing="gap-4">
          <TextLine width="w-20" animated />
          <Stack justify="between">
            <Stack direction="column" spacing="gap-2">
              <CircularPlaceholder height="h-12" width="w-12" className="shrink-0" animated />
              <Stack direction="column" spacing="gap-1">
                <TextLine width="w-11" animated />
                <TextLine width="w-11" animated />
              </Stack>
            </Stack>
            <Stack direction="column" spacing="gap-2">
              <CircularPlaceholder height="h-12" width="w-12" className="shrink-0" />
              <Stack direction="column" spacing="gap-1">
                <TextLine width="w-11" animated />
                <TextLine width="w-11" animated />
              </Stack>
            </Stack>
            <Stack direction="column" spacing="gap-2">
              <CircularPlaceholder height="h-12" width="w-12" className="shrink-0" animated />
              <Stack direction="column" spacing="gap-1">
                <TextLine width="w-11" animated />
                <TextLine width="w-11" animated />
              </Stack>
            </Stack>
            <Stack direction="column" spacing="gap-2" className="w-fit">
              <CircularPlaceholder height="h-12" width="w-12" className="shrink-0" animated />
              <Stack direction="column" spacing="gap-1">
                <TextLine width="w-11" animated />
                <TextLine width="w-11" animated />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};

export default ProfileLoading;
