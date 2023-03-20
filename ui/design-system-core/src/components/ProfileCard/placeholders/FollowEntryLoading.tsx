import React from 'react';
import { getColorClasses } from '../../../utils/getColorClasses';
import { CircularPlaceholder } from '../../CircularPlaceholder';
import Stack from '../../Stack';
import TextLine from '../../TextLine';

const FollowEntryLoading = () => {
  const borderBottomStyle = `border-b ${getColorClasses({
    light: 'border-grey8',
    dark: 'border-grey5',
  })}`;

  return (
    <Stack align="center" justify="between" spacing={`pb-3 gap-y-2 ${borderBottomStyle}`}>
      <Stack spacing="gap-x-1">
        <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
        <Stack direction="column" justify="center" spacing="gap-y-1">
          <TextLine width="w-24" height="h-4" animated />
          <TextLine width="w-24" height="h-4" animated />
        </Stack>
      </Stack>
      <TextLine width="w-24" animated />
    </Stack>
  );
};

export default FollowEntryLoading;
