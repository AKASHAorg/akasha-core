import * as React from 'react';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Extension from '@akashaorg/design-system-components/lib/components/Extension';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Dropdown from '@akashaorg/design-system-core/lib/components/Dropdown';
import { useBlocksPublishing } from './use-blocks-publishing';
import { EditorBlockInterface } from '@akashaorg/typings/ui/editor-blocks';

export const BeamEditor: React.FC = () => {
  const { getEditorBlocksPlugin, uiEvents } = useRootComponentProps();
  const availableBlocks = getEditorBlocksPlugin().getAll();
  const { publishBeam, isPublishing, setIsPublishing, blocksInUse, setBlocksInUse } =
    useBlocksPublishing({ uiEvents, availableBlocks });

  const insertBlockAfter = (idx: number, block: EditorBlockInterface) => {
    setBlocksInUse(prev => [...prev.slice(0, idx), block, ...prev.slice(idx)]);
  };

  const onBlockSelectAfter = (after: number) => newSelection => {
    if (!newSelection.id) {
      return;
    }
    const block = availableBlocks.find(bl => bl.name === newSelection.id);
    if (!block) {
      return;
    }
    insertBlockAfter(after, block);
  };

  const handleBeamPublish = () => {
    publishBeam();
  };

  return (
    <div>
      {blocksInUse.map((block, idx) => (
        <div key={`${block.name}-${idx}`}>
          <Extension
            name={`${block.name}_${idx}`}
            data={{ readOnly: false, action: 'post' }}
            uiEvents={uiEvents}
          />
          <Dropdown
            placeholderLabel={'Add block'}
            menuItems={availableBlocks.map(eb => ({
              id: eb.name,
              iconName: eb.icon,
              title: eb.displayName,
            }))}
            setSelected={onBlockSelectAfter(idx)}
          />
        </div>
      ))}
      <div>
        <Button label={'Publish'} onClick={handleBeamPublish} />
      </div>
    </div>
  );
};
