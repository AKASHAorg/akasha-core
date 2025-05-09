import React from 'react';
import { Trash2Icon } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';

export type DuplexAppButtonProps = {
  onUninstall: () => void;
};

export const DuplexAppButton: React.FC<DuplexAppButtonProps> = ({ onUninstall }) => {
  return (
    <button onClick={onUninstall}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        className="bg-grey8 dark:bg-grey3 rounded-full w-8 h-8"
      >
        <Trash2Icon className="h-4 w-4 [&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
      </Stack>
    </button>
  );
};
