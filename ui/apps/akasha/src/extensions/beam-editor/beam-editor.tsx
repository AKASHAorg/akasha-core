import * as React from 'react';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Extension from '@akashaorg/design-system-components/lib/components/Extension';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Dropdown from '@akashaorg/design-system-core/lib/components/Dropdown';
import { useBlocksPublishing } from './use-blocks-publishing';
import { EditorBlockInterface } from '@akashaorg/typings/ui/editor-blocks';
import { useCreateBeamMutation } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { AkashaBeamInput } from '@akashaorg/typings/sdk/graphql-types-new';

export const BeamEditor: React.FC = () => {
  const { getEditorBlocksPlugin, uiEvents } = useRootComponentProps();
  const createBeam = useCreateBeamMutation();
  const availableBlocks = getEditorBlocksPlugin().getAll();

  const { createContentBlocks, isPublishing, setIsPublishing, blocksInUse, addBlockToList } =
    useBlocksPublishing({
      uiEvents,
      availableBlocks,
      onBeamPublish: async blockResponseData => {
        const beamContent: AkashaBeamInput = {
          active: true,
          content: blockResponseData.map(blockData => ({
            blockID: blockData.response.blockID,
            order: blockData.block.idx,
          })),
          createdAt: new Date().toISOString(),
        };
        try {
          const resp = await createBeam.mutateAsync({
            i: {
              content: beamContent,
            },
          });
          console.log(resp, '<<< beam publish result!');
          return;
        } catch (err) {
          console.error(err, '<<< err in beam publishing');
          return;
        }
      },
    });

  const onBlockSelectAfter = (after: number) => newSelection => {
    if (!newSelection.id) {
      return;
    }
    const block = availableBlocks.find(bl => bl.name === newSelection.id);
    if (!block) {
      return;
    }
    addBlockToList(block, after);
  };

  const handleBeamPublish = () => {
    createContentBlocks();
  };

  return (
    <div>
      {blocksInUse.map((block, idx) => (
        <div key={`${block.name}-${idx}`}>
          <Extension
            name={`${block.name}_${idx}`}
            data={{ readOnly: false, action: 'post', block }}
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
