import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import { cn } from '@akashaorg/ui/lib/library/utils';

type ProfileHeaderLoadingProps = {
  plain?: boolean;
};
const ProfileHeaderLoading: React.FC<ProfileHeaderLoadingProps> = props => {
  const { plain } = props;
  return (
    <div>
      <Card className={cn('h-32 rounded-b-none', plain ? 'border-none' : 'border-b-0')}></Card>
      <Card
        className={cn(
          'px-[0.5rem] pb-[1rem] pt-0 rounded-t-none border-t-0 overflow-visible',
          plain && 'rounded-b-none border-none',
        )}
      >
        <Stack className="pl-2 w-full">
          <Stack direction="row" spacing={2} className="-ml-2">
            <Stack className="relative w-20 h-[3.5rem] shrink-0">
              <TextLine
                round="rounded-full"
                height="h-20"
                width="w-20"
                customStyle="shrink-0 absolute -top-6"
              />
            </Stack>
            <Stack spacing={1} className="mt-1">
              <TextLine width="w-36" animated />
              <TextLine width="w-28" animated />
              <TextLine width="w-28" animated />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2} className="ml-auto">
              <TextLine
                round="rounded-full"
                height="h-8"
                width="w-8"
                customStyle="shrink-0"
                animated={true}
              />
              <TextLine
                round="rounded-full"
                height="h-8"
                width="w-8"
                customStyle=" shrink-0"
                animated={true}
              />
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
};

export default ProfileHeaderLoading;
