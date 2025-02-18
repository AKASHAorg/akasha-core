import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import { cn } from '@akashaorg/ui/lib/library/utils';

type ProfileHeaderLoadingProps = {
  plain?: boolean;
};
const ProfileHeaderLoading: React.FC<ProfileHeaderLoadingProps> = props => {
  const { plain } = props;
  return (
    <div>
      <Card className="h-32 rounded-b-none border-b-0"></Card>
      <Card
        className={cn(
          'px-[0.5rem] pb-[1rem] pt-0 rounded-t-none border-t-0 overflow-visible',
          plain && 'rounded-b-none border-b-0',
        )}
      >
        <Stack padding="pl-2" fullWidth>
          <Stack direction="row" spacing="gap-x-2" customStyle="-ml-2">
            <Stack customStyle="relative w-20 h-[3.5rem] shrink-0">
              <TextLine
                round="rounded-full"
                height="h-20"
                width="w-20"
                customStyle="shrink-0 absolute -top-6"
              />
            </Stack>
            <Stack spacing="gap-y-1.5" customStyle="mt-1">
              <TextLine width="w-36" animated />
              <TextLine width="w-28" animated />
              <TextLine width="w-28" animated />
            </Stack>
            <Stack direction="row" align="center" spacing="gap-x-2" customStyle="ml-auto">
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
