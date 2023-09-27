import * as React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Dropdown from '@akashaorg/design-system-core/lib/components/Dropdown';
import { useBlocksPublishing } from './use-blocks-publishing';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { ContentBlockExtension } from '@akashaorg/ui-lib-extensions/lib/react/content-block';
import { ContentBlockModes } from '@akashaorg/typings/lib/ui';

export const BeamEditor: React.FC = () => {
  const { availableBlocks, createContentBlocks, isPublishing, blocksInUse, addBlockToList } =
    useBlocksPublishing();

  const onBlockSelectAfter = (after: number) => newSelection => {
    if (!newSelection.id) {
      return;
    }
    addBlockToList({ id: newSelection.id, appName: newSelection.appName }, after);
  };

  const handleBeamPublish = () => {
    createContentBlocks();
  };

  return (
    <Card>
      {blocksInUse.map((block, idx) => (
        <div key={`${block.propertyType}-${idx}`}>
          <ContentBlockExtension
            editMode={{
              appName: block.appName,
              propertyType: block.propertyType,
            }}
            mode={ContentBlockModes.EDIT}
            blockRef={block.blockRef}
          />
          <Dropdown
            placeholderLabel={'Add Block'}
            menuItems={availableBlocks.map(eb => ({
              id: eb.propertyType,
              iconName: eb.icon,
              title: eb.displayName,
              appName: eb.appName,
            }))}
            setSelected={onBlockSelectAfter(idx)}
          />
        </div>
      ))}
      <Stack justify={'end'}>
        <Button disabled={isPublishing} label={'Publish'} onClick={handleBeamPublish} />
      </Stack>
    </Card>
  );
};
