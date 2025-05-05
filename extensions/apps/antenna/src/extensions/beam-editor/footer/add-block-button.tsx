import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { PlusIcon } from 'lucide-react';

export type AddBlockButtonProps = {
  disabled?: boolean;
  addBlockLabel?: string;
  handleClickAddBlock?: () => void;
};

export const AddBlock: React.FC<AddBlockButtonProps> = props => {
  const { disabled = false, addBlockLabel, handleClickAddBlock } = props;
  return (
    <Button variant="link" disabled={disabled} onClick={handleClickAddBlock}>
      <PlusIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
      {addBlockLabel}
    </Button>
  );
};
