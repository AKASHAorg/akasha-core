import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

type ProfileHeaderLoadingProps = {
  plain?: boolean;
};
const ProfileHeaderLoading: React.FC<ProfileHeaderLoadingProps> = props => {
  const { plain } = props;
  return (
    <div>
      <Card
        elevation={plain ? 'none' : '1'}
        radius={{ top: 20 }}
        background={{ light: 'grey6', dark: 'grey5' }}
        customStyle="h-32"
      ></Card>
      <Card
        elevation={plain ? 'none' : '1'}
        radius={plain ? '' : { bottom: 20 }}
        padding="px-[0.5rem] pb-[1rem] pt-0"
      >
        <Stack padding="pl-2" fullWidth>
          <Stack direction="row" spacing="gap-x-2" customStyle="-ml-2">
            <Stack customStyle="relative w-20 h-[3.5rem] shrink-0">
              <CircularPlaceholder customStyle="absolute -top-6" />
            </Stack>
            <Stack spacing="gap-y-1.5" customStyle="mt-1">
              <TextLine width="w-36" animated />
              <TextLine width="w-28" animated />
            </Stack>
            <Stack direction="row" align="center" spacing="gap-x-2" customStyle="ml-auto">
              <CircularPlaceholder height="h-8" width="w-8" customStyle="shrink-0" animated />
              <CircularPlaceholder height="h-8" width="w-8" customStyle=" shrink-0" animated />
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
};

export default ProfileHeaderLoading;
